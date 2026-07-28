import express from "express"
import todoRoutes from "./routes/article.routes"
import { errorHandler } from "./middleware/error.middleware"

const app= express()
app.use(express.json())

app.use("/",todoRoutes)
app.use(errorHandler)
export default app
