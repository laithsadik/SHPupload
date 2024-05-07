import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "./routes/user.route.js";
import authRouter from "./routes/auth.route.js";
import listingRouter from "./routes/listing.route.js";
import vehicleRouter from "./routes/vehicle.route.js";
import petRouter from "./routes/pet.route.js";
import cookieParser from "cookie-parser";
import secondhandRouter from "./routes/secondhand.route.js";
import path from "path";
import { fileURLToPath } from "url";
import contactRouter from "./routes/contact.routes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
const app = express();

app.use(express.json());
app.use(cookieParser());

mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log("connect succes to DB");
    app.listen(5000, () => {
      console.log("Server is running on port 5000");
    });
  })
  .catch((err) => {
    console.log("connect not success " + err);
  });

app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/listing", listingRouter);
app.use("/api/vehicle", vehicleRouter);
app.use("/api/pet", petRouter);
app.use("/api/secondhand", secondhandRouter);
app.use("/api/contact", contactRouter);


app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server error";
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

//use client app
app.use(express.static(path.join(__dirname, "/client/build")));
app.get('*', (req, res) => {res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))})