const mongoose = require('mongoose');

const connectedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        console.log('✅ Connecté à MongoDB  oui !');
    } catch (err) {
        console.log('Erreur MongoDB :', err);
        process.exit(1)
    }
}

module.exports = connectedDB;