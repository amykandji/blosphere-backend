const express = require("express");
const router = express.Router();
const auth = require("../middleware/authmiddleware");
const Comment = require("../models/comment");

// ➕ Ajouter un commentaire à un article
router.post("/:articleId", auth, async (req, res) => {
  try {
    const comment = await Comment.create({
      content: req.body.content,
      author: req.user.id,
      article: req.params.articleId,
    });

    res.status(201).json(comment);
  } catch (error) {
    res.status(400).json({ error: "Erreur lors de l’ajout du commentaire" });
  }
});

// 🔍 Obtenir les commentaires d’un article
router.get("/:articleId", async (req, res) => {
  try {
    const comments = await Comment.find({ article: req.params.articleId }).populate("author", "name");
    res.json(comments);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la récupération des commentaires" });
  }
});

module.exports = router;
