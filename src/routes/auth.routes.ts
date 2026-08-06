import { Router } from "express";
import { validate } from "../middleware/validate.middleware";
import { changePasswordSchema, loginSchema, registerSchema } from "../validations/auth.validation";
import { loginUser, registerUser, refreshToken, changePassword  } from "../controller/auth.controller";
import { authenticate } from "../middleware/auth.middleware";
 const router = Router()

 router.post("/register",validate(registerSchema),registerUser)

 router.post("/login",validate(loginSchema),loginUser)

 router.post("/refresh",refreshToken);

 router.post("/changepass",authenticate,validate(changePasswordSchema),changePassword)

 export default router;