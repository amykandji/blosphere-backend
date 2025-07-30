const express = require('express');
const User = require('../models/Users');
const Post = require('../models/Post');
const authMiddleware = require('../middleware/authmiddleware');


const router = express.Router();

// Route pour créer un utilisateur
router.post('/users', async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: 'Erreur création user' });
  }
});

// Route pour créer un post
router.post('/posts', authMiddleware, async (req, res) => {
  try {
    const post = await Post.create({
  ...req.body,
  author: req.user._id // 🟢 On relie le post au user connecté
});

    res.status(201).json(post);
  } catch (error) {
    res.status(400).json({ error: 'Erreur création post' });
  }
});


// Route pour voir tous les posts
router.get('/posts', async (req, res) => {
  try {
    const posts = await Post.find().populate('author', 'name email');
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: 'Erreur récupération posts' });
  }
});



router.get('/profile',  authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});



module.exports = router;
