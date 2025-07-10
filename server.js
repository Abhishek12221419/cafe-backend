import express from "express";
import mongoose from "mongoose";
import userRouter from "./routes/userRoute.js";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

import {authenticate, authorize} from "./middlewares/auth.js";

const app = express();
app.use(cors())
app.use(express.json());
const dbuser = encodeURIComponent(process.env.DBUSER)
const dbpass = encodeURIComponent(process.env.DBPASS)

mongoose.connect(`mongodb://localhost:27017/mern-cafe`).then(() => {
  app.listen(8000, () => {
    console.log("Server started");
  });
});

// mongoose.connect(`mongodb+srv://${dbuser}:${dbpass}@cluster0.d3eh4gl.mongodb.net/mern-cafe?retryWrites=true&w=majority&appName=cluster0`).then(() => {
//   app.listen(8000, () => {
//     console.log("Server started");
//   });
// });
app.use("/api/users", userRouter);