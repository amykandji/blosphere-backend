const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ error: 'Token manquant.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ On stocke l'ID avec une clé `id` (minuscule)
    req.user = {
      id: decoded.userId || decoded._id || decoded.id,
      email: decoded.email,
    };

    // ✅ On vérifie correctement
    if (!req.user.id) {
      return res.status(400).json({ error: 'ID utilisateur manquant dans le token.' });
    }

    next();
  } catch (error) {
    console.error("Erreur dans authmiddleware:", error.message);
    res.status(401).json({ error: 'Token invalide.' });
  }
};
