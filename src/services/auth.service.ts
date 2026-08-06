import bcrypt from "bcrypt";
import crypto from "crypto"
import jwt from "jsonwebtoken";
import { prisma } from "../config/prisma";

type RegisterUserInput = {
  name: string;
  email: string;
  password: string;
};

type LoginUserInput = {
  email: string;
  password: string;
};

export const registerUser = async ({
  name,
  email,
  password,
}: RegisterUserInput) => {

  const existingUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (existingUser) {
    throw{
        statusCode:409,
        message:"User already exists"
        }
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
    },
  });

  return user;
};

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined.");
}
export const loginUser = async ({email,password}: LoginUserInput) => {

  
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
    select: {
      id: true,
      name: true,
      email: true,
      password: true,
    },
  });

  if (!user) {
    throw{
            statusCode:401,
            message:"Invalid input"
        }
    }
  const isPasswordCorrect = await bcrypt.compare(password, user.password);

  if (!isPasswordCorrect) {
    throw{
            statusCode:409,
            message:"Invalid input"
        }
  }
  const accessToken = jwt.sign(
    {
      id: user.id,
      email: user.email,
    },
    JWT_SECRET,
    {
      expiresIn: "1h",
    }
  );

  const refreshToken = crypto.randomBytes(64).toString("hex");

  const tokenHash = await bcrypt.hash(refreshToken, 10);

  const expiresAt = new Date();

  expiresAt.setDate(expiresAt.getDate() + 7);

  await prisma.refreshToken.create({
    data: {
      tokenHash,
      userId: user.id,
      expiresAt,
    },
  });

  return {
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
  };
};

export const refreshAccessToken = async (refreshToken: string) => {

  // all active refresh tokens
  const storedTokens = await prisma.refreshToken.findMany({
    where: {
      expiresAt: {
        gt: new Date(),
      },
    },
  });

  // token whose hash matches
  let matchedToken = null;

  for (const storedToken of storedTokens) {
    const isMatch = await bcrypt.compare(refreshToken,storedToken.tokenHash);

    if (isMatch) {
      matchedToken = storedToken;
      break;
    }
  }

  // Token doesn't exist or expired
  if (!matchedToken) {
    throw {
      statusCode: 401,
      message: "Invalid or expired refresh token",
    };
  }

  const user = await prisma.user.findUnique({
  where: {
    id: matchedToken.userId,
  },
  select: {
    id: true,
    email: true,
  },
});
if (!user) {
  throw {
    statusCode: 401,
    message: "User not found",
  };
}
 await prisma.refreshToken.delete({
    where: {
      id: matchedToken.id,
    },
  });
const accessToken = jwt.sign(
  {
    id: user.id,
    email: user.email,
  },
  JWT_SECRET,
  {
    expiresIn: "1h",
  }
);
const newRefreshToken = crypto.randomBytes(64).toString("hex");

const newTokenHash = await bcrypt.hash(newRefreshToken, 10);

const expiresAt = new Date();

expiresAt.setDate(expiresAt.getDate() + 7);

await prisma.refreshToken.create({
  data: {
    tokenHash: newTokenHash,
    userId: user.id,
    expiresAt,
  },
});
return {
  accessToken,
  refreshToken: newRefreshToken,

};
};
