const utilisateurModel = require("../models/utilisateur.model.js")

exports.AjouterUtilisateur = (req, res) => {
    if (!req.body.courriel || !req.body.password) {
        res.status(420)
        res.send({
            message: "Il y a des paramètres manquant. Pour connaitre les paramètres nécéssaires, référer vous à l'url /api/docs pour la documentation."
        })
    }
    if(!req.body.nom){
        req.body.nom = "";
    }
    if(!req.body.prenom){
        req.body.prenom = "";
    }


    utilisateurModel.AjouterUtilisateur(req.body.courriel, req.body.password, req.body.prenom, req.body.nom)
        .then((cleapi) => {
            res.send({
                message: "L'utilisateur a été ajouté avec succès avec la clé d'API " + cleapi,
                cleapi:cleapi
            });

        })
        .catch((erreur) => {
            console.log('Erreur : ', erreur);
            res.status(500)
            res.send({
                message: "Erreur lors de la création d'un nouvel utilisateur. "
            });
        });
};


exports.NouvelleCleUtilisateur = async (req, res) => {
    if (!req.body.courriel || !req.body.password) {
        res.status(420)
        res.send({
            message: "Il y a des paramètres manquant. Pour connaitre les paramètres nécéssaires, référer vous à l'url /api/docs pour la documentation."
        })
    }
    const hash = await utilisateurModel.TrouverHash(req.body.courriel);

    utilisateurModel.NouvelleCleApi(req.body.courriel, hash.password)
    .then((cleapi) =>{
        if(!cleapi[0])
        {
            res.send({
                message: "Il n'existe pas d'utilisateur avec ces identifiants."
            })
        }
        else
        {
            res.send({
                message: "Voici votre nouvelle clé d'API " + cleapi,
                cleapi:cleapi
            });
        }
    })
    .catch((erreur) => {
        console.log('Erreur : ', erreur);
        res.status(500)
        res.send({
            message: "Erreur lors de la création d'un nouveau Pokémon. "
        });
    });
}