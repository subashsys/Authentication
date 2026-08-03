import express from "express"
import articleRoutes from "./routes/article.routes"
import authRoutes from "./routes/auth.routes"
import { errorHandler } from "./middleware/error.middleware"

const app= express()
app.use(express.json())

app.use("/",articleRoutes)
app.use("/",authRoutes)
app.use(errorHandler)
export default app
