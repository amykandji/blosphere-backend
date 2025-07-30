const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  console.log("✅ Token reçu :", token);


  if (!token) {
    return res.status(401).json({ error: 'Accès refusé. Token manquant.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("👤 Utilisateur décodé :", decoded);
    req.user = decoded; // Tu peux maintenant accéder à userId et role via req.user
    next();
  } catch (error) {
    res.status(401).json({ error: 'Token invalide.' });
  }



};
