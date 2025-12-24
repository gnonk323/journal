import { authenticate } from './middleware/authenticate'
import express from "express"
import cors from "cors"
import entryRoutes from "./routes/entry.routes"
import authRoutes from "./routes/auth.routes"
import { apiKeyMiddleware } from "./middleware/apiKey"
import cookieParser from 'cookie-parser'

const app = express()

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}))
app.use(express.json())
app.use(cookieParser())

app.get("/", (req, res) => {
  console.log(req.method, req.path, req.ip)
  res.send("API is running")
})

app.use("/api/auth", authRoutes)

app.use("/api/entries", [apiKeyMiddleware, authenticate], entryRoutes)

export default app
