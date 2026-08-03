import { Router } from "express";
import { validate } from "../middleware/validate.middleware";
import { loginSchema, registerSchema } from "../validations/auth.validation";
import { loginUser, registerUser } from "../controller/auth.controller";
 const router = Router()

 router.post("/register",validate(registerSchema),registerUser)

 router.post(("/login"),validate(loginSchema),loginUser)

 export default router;