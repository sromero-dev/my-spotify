import { User } from "../models/user.model.js";

export const authCallback = async (req, res) => {
  try {
    console.log("Auth callback recibido:", req.body);

    const { id, firstName, lastName, imageUrl } = req.body;

    if (!id) {
      return res.status(400).json({ message: "Missing user ID" });
    }

    const user = await User.findOne({ clerkId: id });
    console.log("Usuario encontrado en DB:", user);

    if (!user) {
      console.log("Creando nuevo usuario...");
      const newUser = await User.create({
        username: `${firstName || ""} ${lastName || ""}`.trim() || "Usuario",
        profileImage: imageUrl || "",
        clerkId: id,
      });
      console.log("Usuario creado:", newUser);
    }

    res.status(200).json({
      success: true,
      message: "User synchronized successfully",
    });
  } catch (error) {
    console.error("Error en auth callback:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
