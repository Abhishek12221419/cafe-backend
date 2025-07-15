import userModel from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const SECRET = "something";

const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    const hashedpwd = await bcrypt.hash(password, 10);
    const user = {
      firstName,
      lastName,
      email,
      password: hashedpwd,
    };
    const result = await userModel.create(user);
    res.status(201).json(result);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      const isMatch = await bcrypt.compare(password, existingUser.password);
      if (isMatch) {
        const userObj = {
          name: `${existingUser.firstName} ${existingUser.lastName}`,
          email: existingUser.email,
          role: existingUser.role,
        };
        const token = jwt.sign(userObj, SECRET, { expiresIn: "1h" });
        res.status(200).json({ user: userObj, token });
      } else {
        res.status(400).json({ message: "Invalid Password" });
      }
    } else {
      res.status(400).json({ message: "User not found" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

const showUsers = async (req, res) => {
  try {
    const { page, limit, search = "" } = req.query;
    const skip = (page - 1) * limit;
    const count = await userModel.countDocuments({ firstName: { $regex: search, $options: "i" } });
    const total = Math.ceil(count / limit);
    const users = await userModel
      .find({ firstName: { $regex: search, $options: "i" } })
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ updateAt: -1 })
    // const result = await userModel.find().skip(page-1).limit(limit);
    res.status(200).json({ users, total });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

const profile = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await userModel.findById(id);
    res.status(200).json(result);
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "Something went wrong" });
  }
};

const deleteUser = async (req, res) => {
  try {
    const id = req.params.id;
    console.log("DELETE USER with ID:", id);
    const result = await userModel.findByIdAndDelete(id);
    res.status(200).json(result);
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "Something went wrong" });
  }
};

const addUsers = async (req, res) => {
  try {
    const body = req.body;
    const hashedpwd = await bcrypt.hash(body.password, 10);
    body.password = hashedpwd;
    const result = await userModel.create(body);
    res.status(200).json(result);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

const updateUser = async (req, res) => {
  try {
    const id = req.params.id;
    const { password, ...rest } = req.body; // Ignore password in direct update
    const result = await userModel.findByIdAndUpdate(id, rest, { new: true });
    res.status(200).json(result);
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "Something went wrong" });
  }
};

const updateProfile = async (req, res) => {
  try {
    const id = req.params.id;
    const { firstName, lastName, email } = req.body;
    const userObj = {
      firstName,
      lastName,
      email
    }
    const result = await userModel.findByIdAndUpdate(id, userObj)
    res.status(200).json(result);
  }
  catch (err) {
    console.log(err);
    res.status(500).json({ message: "something went wrong" });
  }
}

export { register, login, showUsers, deleteUser, addUsers, updateUser, profile, updateProfile };
