const express = require('express');
const router = express.Router(); 



const tachesController = require("../controllers/taches.controller.js");

// Afficher la liste de toutes les tâches de l'usager.
// Par défaut seulement les tâches incomplètes seront affichées, mais doit pouvoir permettre l'option de toutes les afficher.
// Minimalement, on doit afficher le id et le titre de la tâche.
router.get('/liste', (req, res) => {
    tachesController.AfficherListe(req,res);
});

//AfficherDetailTaches
// Áffiche le titre de la tache, sa description, ,sa date de début et d'échéance et la liste de ses sous-taches ainsi qu'un indiquant si la sous taches est terminé.
router.get('/:id', (req, res) => {
    tachesController.AfficherDetailTache(req,res);
});



// Ajouter une tache.
router.post('',  (req, res) => {
    tachesController.AjouterTache(req,res);
});

// Modifier le statut d'une tache.
router.put('/statut/:id', (req, res) => {
    tachesController.ModifierStatutTache(req,res);
});

// Modifier une tache.
router.put('/:id', (req, res) => {
    tachesController.ModifierTache(req,res);
});

// Supprimer une tache.
router.delete('/:id', (req, res) => {
    tachesController.SupprimerTache(req,res);
});




//Ajouter une sous taches.
router.post('/soustache', (req,res) => {
    tachesController.AjouterSousTache(req,res);
});

//modifier le statut d'une sous taches (le id de la soustache.).
router.put('/soustache/statut/:id', (req,res) => {
    tachesController.ModifierStatutSousTache(req,res);
});

//modifier une sous taches (le id de la soustache.).
router.put('/soustache/:id', (req,res) => {
    tachesController.ModifierSousTache(req,res);
});


//supprimer une sous taches (le id de la soustache.).
router.delete('/soustache/:id', (req,res) => {
    tachesController.SupprimerSousTache(req,res);
});

module.exports = router;