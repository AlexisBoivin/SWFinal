const utilisateurModel = require("../models/utilisateur.model.js")

exports.AjouterUtilisateur = (req, res) => {
    if (!req.body.courriel || !req.body.password) {
        res.status(420)
        res.send({
            message: "Il y a des paramètres manquant. Pour connaitre les paramètres nécéssaires, référer vous à l'url /api/docs pour la documentation."
        })
    }

    utilisateurModel.AjouterUtilisateur(req.body.courriel, req.body.password, req.body.prenom, req.body.nom)
        .then((utilisateur) => {
            res.send({
                message: "L'utilisateur a été ajouté avec succès avec la clé d'API " + utilisateur.cle_api,

                Utilisateur: {
                    id: utilisateur.id,
                    nom: utilisateur.nom,
                    prenom: utilisateur.prenom,
                    courriel: utilisateur.courriel,
                    cle_api: utilisateur.cle_api,
                    password: utilisateur.password
                }

            });

        })
        .catch((erreur) => {
            console.log('Erreur : ', erreur);
            res.status(500)
            res.send({
                message: "Erreur lors de la création d'un nouveau Pokémon. "
            });
        });
};


exports.NouvelleCleUtilisateur = (req, res) => {
    if (!req.params.courriel || !req.params.password) {
        res.status(420)
        res.send({
            message: "Il y a des paramètres manquant. Pour connaitre les paramètres nécéssaires, référer vous à l'url /api/docs pour la documentation."
        })
    }
    utilisateurModel.NouvelleCleUtilisateur(req.params.courriel, req.params.password)
    .then((utilisateur) =>{
        if(!utilsiateur[0])
        {
            res.send({
                message: "Il n'existe pas d'utilisateur avec ces identifiants."
            })
        }
        else
        {
            res.send({
                message: "Voici votre nouvelle clé d'API " + utilisateur.cle_api,
    
                Utilisateur: {
                    id: utilisateur.id,
                    nom: utilisateur.nom,
                    prenom: utilisateur.prenom,
                    courriel: utilisateur.courriel,
                    cle_api: utilisateur.cle_api,
                    password: utilisateur.password
                }
    
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