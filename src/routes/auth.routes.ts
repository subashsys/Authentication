import { Router } from "express";
import { validate } from "../middleware/validate.middleware";
import { changePasswordSchema, forgotPasswordSchema, loginSchema, registerSchema, resetPasswordSchema, verifyOTPSchema } from "../validations/auth.validation";
import { loginUser, registerUser, refreshToken, changePassword  } from "../controller/auth.controller";
import { authenticate } from "../middleware/auth.middleware";
import { forgotPassword,verifyOTP,resetUserPassword } from "../controller/passwordReset.controller";
 const router = Router()

 router.post("/register",validate(registerSchema),registerUser)

 router.post("/login",validate(loginSchema),loginUser)

 router.post("/refresh",refreshToken);

 router.post("/changepass",authenticate,validate(changePasswordSchema),changePassword)

 router.post("/forgotpass",validate(forgotPasswordSchema),forgotPassword)

 router.post("/verify-otp",validate(verifyOTPSchema),verifyOTP);

 router.post("/reset-password",validate(resetPasswordSchema),resetUserPassword);

 export default router;