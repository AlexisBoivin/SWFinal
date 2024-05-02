const express = require('express');
const router = express.Router(); 

const utilisateurController = require("../controllers/utilisateur.controller.js");

// Ajouter un utilisateur.
router.post('/ajouter', (req, res) => {
    utilisateurController.AjouterUtilisateur(req,res);
});

// Nouvelle Clé d'utilisateur.
router.put('/cle', (req, res) => {
    utilisateurController.NouvelleCleUtilisateur(req,res);
});

module.exports = router;