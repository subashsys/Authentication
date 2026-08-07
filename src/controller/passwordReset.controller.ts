import { Request, Response, NextFunction } from "express";
import { createResetPasswordOTP } from "../services/passwordReset.service";
 
export const forgotPassword = async (req: Request,res: Response,next: NextFunction) => {
  try {
    const { email } = req.body;

    const result = await createResetPasswordOTP(email);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};