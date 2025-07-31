const express = require("express");
const router = express.Router();
const auth = require("../middleware/authmiddleware");
const User = require("../models/Users");


router.get("/profile", auth, async (req, res) => {
  try {
    
    const userId = req.user.userId
    
    console.log("UserId:", userId);

    const user = await User.findById(userId).select("-password -__V");

    if (!user) return res.status(404).json({ msg: "Utilisateur non trouvé" });

    res.status(200).json({ msg: "Profil trouvé ✅", user });
  } catch (error) {
    console.error("Erreur dans /profile:", error);
    res.status(500).json({ msg: "Erreur serveur" });
  }
});

// Route de déconnexion
router.post("/logout", auth, (req, res) => {
  res.status(200).json({ msg: "Déconnecté avec succès ✅" });
});



module.exports = router;
