const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

// Répertoire de base pour les fichiers statiques
const STATIC_DIR = __dirname;

app.use(express.json()); // Pour le parsing des requêtes JSON
app.use(express.static(STATIC_DIR)); // Servir les fichiers statiques

const PORT = 3000;
const SCORES_FILE = path.join(STATIC_DIR, 'data', 'scores.json'); // Chemin vers scores.json

// Lire les scores
app.get('/api/scores', (req, res) => {
  fs.readFile(SCORES_FILE, 'utf8', (err, data) => {
    if (err) {
      res.status(500).send('Erreur lors de la lecture du fichier');
      return;
    }
    res.json(JSON.parse(data));
  });
});

// Mettre à jour les scores
app.post('/api/scores', (req, res) => {
  const newScore = req.body;
  
  fs.readFile(SCORES_FILE, 'utf8', (err, data) => {
    if (err) {
      res.status(500).send('Erreur lors de la lecture du fichier pour mise à jour');
      return;
    }

    const scores = JSON.parse(data);
    scores.push(newScore);

    fs.writeFile(SCORES_FILE, JSON.stringify(scores, null, 2), 'utf8', (err) => {
      if (err) {
        res.status(500).send('Erreur lors de la mise à jour du fichier');
        return;
      }
      res.send('Score ajouté avec succès');
    });
  });
});

app.listen(PORT, () => {
  console.log(`Serveur lancé sur le port ${PORT}`);
});
