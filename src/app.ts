import { config } from "dotenv";
config();

import express from "express";
import cors from "cors";
import routes from "./routes";

export const buildServer = () => {
  const server = express();

  const configCors = {
    origin: [
      "http://localhost:3000",
      "https://restaurant-mqgq.vercel.app",
    ],
    credentials: true,
  };

  server.use(cors(configCors));

  // Middleware
  server.use(express.json());

  server.get("/", (req, res) => {
    res.status(200).send({
      message: "Hello World!",
    });
  });

  server.use("/api/v1", routes);

  return server;
};


