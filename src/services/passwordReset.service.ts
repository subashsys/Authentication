import {prisma} from "../config/prisma"
import { sendOTPEmail } from "../config/mail";
import crypto from "crypto"
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt"

export const createResetPasswordOTP = async (email:string)=>{
    const user= await prisma.user.findUnique({
        where:{
            email
        },
        select:{
            id:true
        }
    })
    if (!user){
        throw{
            statusCode:400,
            message:"User do not exist"
        }
    }
    
    const otp = crypto.randomInt(100000,1000000).toString();

    const otpHash= await bcrypt.hash(otp,10);

    const expiresAt= new Date();

    expiresAt.setMinutes(expiresAt.getMinutes()+7)

    await prisma.passwordResetOTP.create({
        data:{
         userId:user.id,
         otpHash,
         expiresAt,
        }
    })
    await sendOTPEmail(email, otp);

  return {
    message: "OTP sent successfully",
  };
}

const PASSWORD_RESET_SECRET = process.env.PASSWORD_RESET_SECRET;

if (!PASSWORD_RESET_SECRET) {
  throw new Error("PASSWORD_RESET_SECRET is not defined.");
}

export const verifyPasswordResetOTP = async (
  email: string,
  otp: string
) => {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
    select: {
      id: true,
      email: true,
    },
  });

  if (!user) {
    throw {
      statusCode: 401,
      message: "Invalid OTP",
    };
  }

  const resetOTP = await prisma.passwordResetOTP.findFirst({
    where: {
      userId: user.id,
      used: false,
      expiresAt: {
        gt: new Date(),
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  if (!resetOTP) {
    throw {
      statusCode: 401,
      message: "Invalid or expired OTP",
    };
  }

  if (resetOTP.attempts >= 5) {
    throw {
      statusCode: 429,
      message: "Too many OTP attempts",
    };
  }

  const isOTPValid = await bcrypt.compare(
    otp,
    resetOTP.otpHash
  );

  if (!isOTPValid) {
    await prisma.passwordResetOTP.update({
      where: {
        id: resetOTP.id,
      },
      data: {
        attempts: {
          increment: 1,
        },
      },
    });

    throw {
      statusCode: 401,
      message: "Invalid OTP",
    };
  }

  await prisma.passwordResetOTP.update({
    where: {
      id: resetOTP.id,
    },
    data: {
      used: true,
    },
  });

  const resetToken = jwt.sign(
    {
      userId: user.id,
      purpose: "password-reset",
    },
    PASSWORD_RESET_SECRET,
    {
      expiresIn: "10m",
    }
  );

  return {
    resetToken,
  };
};

export const resetPassword = async (
  resetToken: string,
  newPassword: string
) => {
  let decoded: {
    userId: number;
    purpose: string;
  };

  try {
    decoded = jwt.verify(
      resetToken,
      PASSWORD_RESET_SECRET
    ) as {
      userId: number;
      purpose: string;
    };
  } catch {
    throw {
      statusCode: 401,
      message: "Invalid or expired reset token",
    };
  }

  if (decoded.purpose !== "password-reset") {
    throw {
      statusCode: 401,
      message: "Invalid reset token",
    };
  }

  const hashedPassword = await bcrypt.hash(
    newPassword,
    10
  );

  await prisma.user.update({
    where: {
      id: decoded.userId,
    },
    data: {
      password: hashedPassword,
    },
  });

  // Invalidate all refresh tokens after password reset
  await prisma.refreshToken.deleteMany({
    where: {
      userId: decoded.userId,
    },
  });

  return {
    message: "Password reset successfully",
  };
};