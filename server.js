const express = require('express');
const cors = require('cors');
require('dotenv').config();
const blogRoutes = require('./routes/blogRoutes');
const connectedDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const articleRoutes = require("./routes/articleRoutes");



const app = express();


connectedDB();

app.use(cors());
app.use(express.json());


app.use("/api/articles", articleRoutes);
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api', blogRoutes);

app.get('/', (req, res) => {
  res.send('Bienvenue sur BlogSphere 🚀');
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("Server demarre sur port" + " " + PORT);
})