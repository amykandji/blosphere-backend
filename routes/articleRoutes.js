const express = require("express");
const router = express.Router();
const auth = require("../middleware/authmiddleware");
const Article = require("../models/article");

// 🔍 Get all articles
router.get("/", async (req, res) => {
  const articles = await Article.find().populate("author", "name");
  res.json(articles);
});

// 🧾 Get one article
router.get("/:id", async (req, res) => {
  const article = await Article.findById(req.params.id).populate("author", "name");
  if (!article) return res.status(404).json({ msg: "Article non trouvé" });
  res.json(article);
});

// ✍️ Create article (auth required)

router.post("/", auth, async (req, res) => {
  try {
    console.log("✅ Utilisateur connecté :", req.user); // debug

    if (!req.user || !req.user.id) {
      return res.status(400).json({ msg: "Auteur manquant dans le token" });
    }

    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content,
      author: req.user.id // ✅ automatiquement ajouté depuis le token
    });

    const saved = await newArticle.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error("❌ Erreur création article :", err);
    res.status(400).json({ msg: "Erreur lors de la création", error: err.message });
  }
});




// ✏️ Update article
router.put("/:id", auth, async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) return res.status(404).json({ msg: "Article non trouvé" });

    if (!article.author) {
      return res.status(400).json({ msg: "Auteur manquant dans l’article" });
    }

    if (article.author.toString() !== req.user.id) {
      return res.status(403).json({ msg: "Non autorisé à modifier cet article" });
    }

    article.title = req.body.title || article.title;
    article.content = req.body.content || article.content;

    const updated = await article.save();
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ msg: "Erreur serveur lors de la modification", error: err.message });
  }
});

// ❌ Delete article (avec vérification solide)
router.delete("/:id", auth, async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) return res.status(404).json({ msg: "Article non trouvé" });

    if (!article.author) {
      return res.status(400).json({ msg: "Auteur manquant dans cet article" });
    }

    if (article.author.toString() !== req.user.id) {
      return res.status(403).json({ msg: "Non autorisé à supprimer cet article" });
    }

    await article.deleteOne();
    res.status(200).json({ msg: "Article supprimé avec succès" });
  } catch (err) {
    console.error("Erreur DELETE /articles/:id", err);
    res.status(500).json({ msg: "Erreur serveur", error: err.message });
  }
});


module.exports = router;
