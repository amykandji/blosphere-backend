const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ error: 'Token manquant.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = {
      id: decoded.userId || decoded.id || decoded._id, // 👈 ID de l’utilisateur
      email: decoded.email
    };

    if (!req.user.id) {
      return res.status(400).json({ error: 'ID utilisateur manquant dans le token.' });
    }

    next();
  } catch (error) {
    res.status(401).json({ error: 'Token invalide.' });
  }
};
