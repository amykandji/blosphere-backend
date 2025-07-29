const jwt = require('jsonwebtoken');
const User = require('../models/Users');
const bcrypt = require('bcrypt');

module.exports = async (req, res) => {
 try {
    const { email, password } = req.body;

    // Vérifier si l'email est fourni
    if (!email || !password) {
      return res.status(400).json({ error: "Email et mot de passe requis" });
    }

    // Trouver l'utilisateur
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "Utilisateur non trouvé" });
    }

    // Vérifier le mot de passe
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Mot de passe incorrect" });
    }

    // Générer le token JWT
    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    // Nettoyer les données utilisateur avant renvoi
    const { password: pwd, __v, ...userData } = user._doc;

    res.json({
      message: "Connexion réussie",
      user: userData,
      token,
    });
  } catch (err) {
    console.error("Erreur login:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
};
