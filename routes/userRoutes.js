const express = require("express");
const router = express.Router();
const auth = require("../middleware/authmiddleware");
const User = require("../models/Users");


router.get("/profile", auth, async (req, res) => {
  try {
    
    const userId = req.user.id
    
    console.log("UserId:", userId);

    const user = await User.findById(userId).select("-password -__V");

    if (!user) return res.status(404).json({ msg: "Utilisateur non trouvé" });

    res.status(200).json({ msg: "Profil trouvé ✅", user });
  } catch (error) {
    console.error("Erreur dans /profile:", error);
    res.status(500).json({ msg: "Erreur serveur" });
  }
});

// ✏️ Modifier son profil (nom, email, etc.)
router.put("/profile", auth, async (req, res) => {
  try {
    const userId = req.user.userId || req.user.id; // gère les deux cas
    console.log("🔄 Mise à jour pour userId :", userId);

    const { name, email, password } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ msg: "Utilisateur non trouvé" });

    // Mise à jour des champs
    if (name) user.name = name;
    if (email) user.email = email;
    if (password) {
      const bcrypt = require("bcryptjs");
      user.password = await bcrypt.hash(password, 10);
    }

    const updated = await user.save();

    res.status(200).json({
      msg: "✅ Profil mis à jour avec succès",
      user: {
        id: updated._id,
        name: updated.name,
        email: updated.email
      }
    });
  } catch (error) {
    console.error("❌ Erreur update profile :", error);
    res.status(500).json({ msg: "Erreur serveur" });
  }
});


// Route de déconnexion
router.post("/logout", auth, (req, res) => {
  res.status(200).json({ msg: "Déconnecté avec succès ✅" });
});



module.exports = router;
