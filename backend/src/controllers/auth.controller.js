import { User } from "../models/user.model.js";

export const authCallback = async (req, res) => {
  try {
    const { id, firstName, lastName, imageUrl } = req.body; //Clerk data

    // Checks if user already exists
    const user = await User.findOne({ clerkId: id });
    if (!user) {
      // Creates user
      await User.create({
        username: firstName + " " + lastName,
        profileImage: imageUrl,
        clerkId: id,
      });
    }

    res
      .status(200)
      .json("User signed in: " + { id, firstName, lastName, imageUrl });
  } catch (error) {
    res.status(500).json("Internal server error: " + error);
    console.error("Error: " + error);
  }
};
