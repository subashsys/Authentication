import {prisma} from "../config/prisma"
import { sendOTPEmail } from "../config/mail";
import bcrypt from "bcrypt"
import crypto from "crypto"

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