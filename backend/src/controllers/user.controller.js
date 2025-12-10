import { User } from "../models/user.model.js";

export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({ clerkId: { $ne: req.auth.userId } });
    res.status(200).json("Users found: " + users);
  } catch (error) {
    next(error);
  }
};
