import express from "express"
import articleRoutes from "./routes/article.routes"
import authRoutes from "./routes/auth.routes"
import cookieParser from "cookie-parser";
import { errorHandler } from "./middleware/error.middleware"

const app= express()

app.use(express.json())
app.use(cookieParser());

app.use("/",articleRoutes)
app.use("/",authRoutes)

app.use(errorHandler)

export default app
