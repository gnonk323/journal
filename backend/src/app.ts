import express from "express";
import cors from "cors";
import itemRoutes from "./routes/entry.routes";
import { apiKeyMiddleware } from "./middleware/apiKey";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  console.log(req.method, req.path, req.ip)
  res.send("API is running");
});

app.use("/api", apiKeyMiddleware);

app.use("/api/entries", itemRoutes);

export default app;
