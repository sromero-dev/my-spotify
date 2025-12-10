import { clerkClient } from "@clerk/express";

export const protectRoute = async (req, res, next) => {
  if (!req.auth.userId) {
    // Check if user is authenticated. Read clerk documentation for more info
    res.status(401).json({ message: "Unauthorized" });
  }
  next();
};

export const requireAdmin = async (req, res, next) => {
  try {
    // Checks if user is admin. For more info check clerk documentation (https://clerk.com/docs/reference/backend/types/auth-object)
    const currentUser = await clerkClient.users.getUser(req.auth.userId);
    const isAdmin =
      process.env.ADMIN_EMAIL === currentUser.primaryEmailAddress?.emailAddress;

    if (!isAdmin) {
      return res
        .status(403)
        .json({ message: "Forbidden - You must be an admin" });
    }

    next();
  } catch (error) {
    res.status(500).json({ message: "Internal server error: " + error });
    next(error);
  }
};
