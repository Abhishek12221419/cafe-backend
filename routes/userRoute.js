import express from "express";
import { authenticate, authorize } from "../middlewares/auth.js";
const Router = express.Router();
import {
  register,
  login,
  profile,
  updateUser,
  deleteUser,
  showUsers,
  updateProfile,
  addUsers
} from "../controllers/userController.js";
Router.post("/register", register);
Router.post("/login", login);
Router.get("/showUsers", showUsers);
Router.patch("/:id", updateUser);
Router.delete("/:id",deleteUser);
Router.post("/addUsers", addUsers);
Router.get("/:id/profile", authenticate, profile);
Router.patch("/api/users/:id/profile",authenticate,updateProfile);
export default Router;