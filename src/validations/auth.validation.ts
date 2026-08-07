import {z} from "zod"

export const registerSchema=z.object({
    body:z.object({
        name:z.string().trim().min(3,"Minimum 3 digit is required").max(20, "Maximum number exceeds"),
        email:z.string().trim().toLowerCase().email("Email required"),
        password:z.string().min(1,"Password requierd").max(20,"Maximum 20 digit")
    })
})

export const loginSchema=z.object({
    body:z.object({
        email:z.email("Email is required").trim().min(1,"Enter email").max(50,"Invalid email"),
        password: z.string().min(1,"Passowrd is required").max(21,"Password is too long")
    })
})

export const changePasswordSchema= z.object({
    body:z.object({
        currentPassword:z.string(),
        changePassword:z.string()
    })
})

export const forgotPasswordSchema= z.object({
    body:z.object({
        email:z.string().trim().toLowerCase().email("Invalid email"),
    })
})