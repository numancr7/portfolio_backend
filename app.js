import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import cors from "cors";
import db  from "./database/db.js";
import { errorMiddleware } from "./middlewares/error.js";
import userRoute from "./routes/userRoute.js";
import timelineRoute from "./routes/timelineRoute.js";
import messageRoute from "./routes/messageRoute.js";
import skillRoute from "./routes/skillRoute.js";
import softwareApplicationRoute from "./routes/softwareApplicationRoute.js";
import projectRoute from "./routes/projectRoute.js";

const app = express();
dotenv.config({ path: "./config/config.env" });

app.use(cors({
  origin: [
    "https://dashboard-sandy-tau-67.vercel.app", // dashboard dev
    "https://portfolio-backend-rho-three.vercel.app", // portfolio dev
    process.env.PORTFOLIO_URL, 
    process.env.DASHBOARD_URL
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  exposedHeaders: ["Set-Cookie"]
}));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

app.use("/api/v1/user", userRoute);
app.use("/api/v1/timeline", timelineRoute);
app.use("/api/v1/message", messageRoute);
app.use("/api/v1/skill", skillRoute);
app.use("/api/v1/softwareapplication", softwareApplicationRoute);
app.use("/api/v1/project", projectRoute);


app.use(errorMiddleware);

export default app;