import { Request, Response, NextFunction } from "express";
import {createResetPasswordOTP,verifyPasswordResetOTP,resetPassword} from "../services/passwordReset.service";
 
export const forgotPassword = async (req: Request,res: Response,next: NextFunction) => {
  try {
    const { email } = req.body;

    const result = await createResetPasswordOTP(email);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const verifyOTP = async (req: Request,res: Response,next: NextFunction) => {
  try {
    const { email, otp } = req.body;

    const result = await verifyPasswordResetOTP(
      email,
      otp
    );

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const resetUserPassword = async (req: Request,res: Response,next: NextFunction
) => {
  try {
    const { resetToken, newPassword } = req.body;

    const result = await resetPassword(
      resetToken,
      newPassword
    );

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};