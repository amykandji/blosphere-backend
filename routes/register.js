const User = require("../models/Users");

module.exports = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: "Email déjà utilisé" });
    }

    // Création de l'utilisateur avec les champs exacts
    const user = new User({
      name,
      email,
      password,
      role,
    });

    await user.save();

    res.status(201).json({ message: "Utilisateur créé avec succès" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
