const mongoose = require("mongoose");


const articleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
   // 🆕 Champ likes
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  // 🆕 Nouveau champ : nombre de vues
  views: { type: Number, default: 0 },

  
  // ✅ Catégorie
  category: {
    type: String,
    required: true,
    enum: ["Tech", "Santé", "Éducation", "Art", "Autres"],
    default: "Autres"
  },

  // ✅ Brouillon ou publié
  isDraft: {
    type: Boolean,
    default: false
  }

}, { timestamps: true });




module.exports = mongoose.model("Article", articleSchema);
