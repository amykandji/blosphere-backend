const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // ou 'bcrypt' si tu préfères

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['admin', 'author', 'reader'],
    default: 'reader',
  }
});

// 🔐 Hachage du mot de passe avant enregistrement
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});



module.exports = mongoose.model('User', userSchema);
