const tachesModel = require("../models/taches.model.js");
const utilisateurModel = require("../models/utilisateur.model.js")
const soustacheModel = require("../models/soustache.model.js")
// Route 1: Afficher la liste de toutes les tâches de l'usager.
// Par défaut, seulement les tâches incomplètes seront affichées, mais on doit pouvoir permettre l'option de les afficher toutes.
exports.AfficherListe = async (req, res) => {
    
        const cleApi = req.headers.authorization.split(' ')[0];
        let id = -1;
        await utilisateurModel.trouverUtilisateur(cleApi)
            .then((utilisateur) =>{
                id = utilisateur[0].id;
            })
        
        let complete = 0;
        if (req.query.complete) {
            complete = req.query.complete;
        }
        tachesModel.AfficherListe(complete, id)
            .then((latache) => {
                if (!latache[0]) {
                    res.status(404);
                    res.send({
                        message: `Aucune tâches ne vous est associés.`
                    });
                    return;
                }
                res.send({
                    message: "Voici la liste de vos tâches.",
                    tache: latache
                });
            })
            .catch((erreur) => {
                console.log('Erreur : ', erreur);
                res.status(500)
                res.send({
                    message: "Erreur lors de la récupération des tâches."
                });
            });
    
    // catch (erreur) {
    //     console.log('Il y a eu une erreur lors du traitement des données:');
    // }
};


//AfficherDetailTaches
// Áffiche le titre de la tache, sa description, ,sa date de début et d'échéance et la liste de ses sous-taches ainsi qu'un indiquant si la sous taches est terminé.
exports.AfficherDetailTache = (req, res) => {
    tachesModel.AfficherDetailTache(req.params.id)
        .then((latache) => {
            if (!latache[0]) {
                res.status(404);
                res.send({
                    message: `Il ne semble pas y avoir de tâches correspondantes.`
                });
                return;
            }
            soustacheModel.SoustacheTache(req.params.id)
                .then((lessoustaches) => {
                    res.send({
                        message: "Voici les informations sur la tâche avec l'identifiant " + req.params.id + ".",
                        tache: {
                            detail:latache,
                            soustaches: lessoustaches
                        }

                    });
                })

        })
        .catch((erreur) => {
            console.log('Erreur : ', erreur);
            res.status(500)
            res.send({
                message: "Erreur lors de la récupération de la tâche."
            });
        });
};

// Ajouter une tâche
exports.AjouterTache = async (req, res) => {
    if (!req.body.titre || !req.body.description || !req.body.datedebut || !req.body.dateecheance) {
        res.status(420)
        res.send({
            message: "Il y a des paramètres manquant. Pour connaitre les paramètres nécéssaires, référer vous à l'url /api/docs pour la documentation."
        })
    }
    const cleApi = req.headers.authorization.split(' ')[0];
    let id = -1;
    await utilisateurModel.trouverUtilisateur(cleApi)
        .then((utilisateur) =>{
            id = utilisateur[0].id;
        })

    tachesModel.AjouterTache(id, req.body.titre, req.body.description, req.body.datedebut, req.body.dateecheance)
        .then((latache) => {
            res.send({
                message: "La tâche " + req.body.titre + " a été ajouté avec succès",
                tache: {
                    titre: req.body.stitre,
                    description: req.body.description,
                    datedebut: req.body.datedebut,
                    dateecheance: req.body.dateecheance
                }

            });

        })
        .catch((erreur) => {
            console.log('Erreur : ', erreur);
            res.status(500)
            res.send({
                message: "Erreur lors de la création d'une nouvelle tâche. "
            });
        });

};


exports.ModifierTache = (req, res) => {
    //Vérification de la présence de tous les paramètres.
    if (!req.params.id) {
        res.status(421)
        res.send({
            message: "Il faut spécifier quelle tâche est à modifier avec son identifiant."
        })
    }
    if (!req.body.titre || !req.body.description || !req.body.datedebut || !req.body.dateecheance) {
        res.status(420)
        res.send({
            message: "Il y a des paramètres manquant. Pour connaitre les paramètres nécéssaires, référer vous à l'url /api/docs pour la documentation."
        })
    }

    //Vérification de l'existence de la tâche.
    tachesModel.AfficherDetailTache(req.params.id)
        .then((latache) => {
            if (!latache[0]) {
                res.status(404);
                res.send({
                    message: `Il ne semble pas y avoir de tâches correspondantes.`
                });
                return;
            }
            tachesModel.ModifierTache(req.params.id, req.body.titre, req.body.description, req.body.datedebut, req.body.dateecheance)
                .then((tachechanger) => {
                    res.send({
                        message: "La tâche" + req.params.id + " a été modifié avec succès",
                    });

                })
                .catch((erreur) => {
                    console.log('Erreur : ', erreur);
                    res.status(500)
                    res.send({
                        message: "Erreur lors de la modification de la tâche. "
                    });
                });
        }
        )
        .catch((erreur) => {
            console.log('Erreur : ', erreur);
            res.status(500)
            res.send({
                message: "Erreur lors de la récupération de la tâche à modifier. "
            });
        });
}




exports.ModifierStatutTache = (req, res) => {
    //Vérification de la présence de tous les paramètres.
    if (!req.params.id) {
        res.status(421)
        res.send({
            message: "Il faut spécifier quelle tâche est à modifier avec son identifiant."
        })
    }
    if (!req.body.complete) {
        res.status(420)
        res.send({
            message: "Vous devez spécifier le nouveau statut dans le corps de la requête."
        })
    }

    //Vérification de l'existence de la tâche.
    tachesModel.AfficherDetailTache(req.params.id)
        .then((latache) => {
            if (!latache[0]) {
                res.status(404);
                res.send({
                    message: `Il ne semble pas y avoir de tâches correspondantes.`
                });
                return;
            }
            tachesModel.ModifierStatutTache(req.params.id, req.body.complete)

                .then((tachechanger) => {
                    res.send({
                        message: "Le statut de la tâche" + req.params.id + " a été modifié avec succès",

                        tache: {
                            id: req.params.id,
                            titre: tachechanger.titre,
                            description: tachechanger.description,
                            datedebut: tachechanger.datedebut,
                            dateecheance: tachechanger.dateecheance,
                            complete: tachechanger.complete
                        }

                    });

                })
                .catch((erreur) => {
                    console.log('Erreur : ', erreur);
                    res.status(500)
                    res.send({
                        message: "Erreur lors de la modification du statut de la tâche. "
                    });
                });
        }
        )
        .catch((erreur) => {
            console.log('Erreur : ', erreur);
            res.status(500)
            res.send({
                message: "Erreur lors de la récupération de la tâche à modifier. "
            });
        });
}




exports.SupprimerTache = (req, res) => {
    //Vérification de la présence de tous les paramètres.
    if (!req.params.id) {
        res.status(421)
        res.send({
            message: "Il faut spécifier quelle tâche est à supprimer avec son identifiant."
        })
    }
    //Vérification de l'existence de la tâche.
    tachesModel.AfficherDetailTache(req.params.id)
        .then((latache) => {
            if (!latache[0]) {
                res.status(404);
                res.send({
                    message: `Il ne semble pas y avoir de tâches correspondantes.`
                });
                return;
            }
            tachesModel.SupprimerTache(req.params.id)

                .then((tachesupprimer) => {

                    res.send({
                        message: "La tâche " + req.params.id + " a été supprimé avec succès"
                    });
                })

                .catch((erreur) => {
                    console.log('Erreur : ', erreur);
                    res.status(500)
                    res.send({
                        message: "Erreur lors de la suppression de la tâche "
                    });
                });
        }
        )
        .catch((erreur) => {
            console.log('Erreur : ', erreur);
            res.status(500)
            res.send({
                message: "Erreur lors de la récupération de la tâche à supprimer. "
            });
        });
}


// Ajouter une soustâche
exports.AjouterSousTache = (req, res) => {
    if (!req.body.tacheid || !req.body.titre) {
        res.status(420)
        res.send({
            message: "Il y a des paramètres manquant. Pour connaitre les paramètres nécéssaires, référer vous à l'url /api/docs pour la documentation."
        })
    }
    soustacheModel.AjouterSousTache(req.body.tacheid, req.body.titre)
        .then((lasoustache) => {
            res.send({
                message: "La tâche " + req.body.titre + " a été ajouté avec succès",

                soustache: {
                    id:lasoustache.insertId,
                    tache_id: req.body.tache_id,
                    titre: req.body.titre,
                    complete: 0 
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



exports.ModifierSousTache = (req, res) => {
    //Vérification de la présence de tous les paramètres.
    if (!req.params.id) {
        res.status(421)
        res.send({
            message: "Il faut spécifier quelle soustâche est à modifier avec son identifiant."
        })
    }
    if (!req.body.tacheid || !req.body.titre) {
        res.status(420)
        res.send({
            message: "Il y a des paramètres manquant. Pour connaitre les paramètres nécéssaires, référer vous à l'url /api/docs pour la documentation."
        })
    }

    //Vérification de l'existence de la tâche.
    soustacheModel.TrouverSousTache(req.params.id)
        .then((lasoustache) => {
            if (!lasoustache[0]) {
                res.status(404);
                res.send({
                    message: `Il ne semble pas y avoir de sous-tâches correspondantes.`
                });
                return;
            }
            soustacheModel.ModifierSousTache(req.params.id, req.body.tacheid, req.body.titre)

                .then((soustachechanger) => {
                    res.send({
                        message: "La sous-tâche" + req.params.id + " a été modifié avec succès",

                        soustache: {
                            id: req.params.id,
                            tacheid: req.body.tacheid,
                            titre: req.body.titre
                        }

                    });

                })
                .catch((erreur) => {
                    console.log('Erreur : ', erreur);
                    res.status(500)
                    res.send({
                        message: "Erreur lors de la modification de la sous-tâche. "
                    });
                });
        }
        )
        .catch((erreur) => {
            console.log('Erreur : ', erreur);
            res.status(500)
            res.send({
                message: "Erreur lors de la récupération de la sous-tâche à modifier. "
            });
        });
}



exports.ModifierStatutSousTache = (req, res) => {
    //Vérification de la présence de tous les paramètres.
    if (!req.params.id) {
        res.status(421)
        res.send({
            message: "Il faut spécifier quelle sous-tâche est à modifier avec son identifiant."
        })
    }
    if (!req.body.complete) {
        res.status(420)
        res.send({
            message: "Vous devez spécifier le nouveau statut dans le corps de la requête."
        })
    }

    //Vérification de l'existence de la tâche.
    soustacheModel.TrouverSousTache(req.params.id)
        .then((lasoustache) => {
            if (!lasoustache[0]) {
                res.status(404);
                res.send({
                    message: `Il ne semble pas y avoir de sous-tâche correspondante.`
                });
                return;
            }
            soustacheModel.ModifierStatutSousTache(req.params.id, req.body.complete)

                .then((soustachechanger) => {
                    res.send({
                        message: "Le statut de la sous-tâche" + req.params.id + " a été modifié avec succès.",
                        soustache:{
                            id:req.params.id,
                            complete:req.body.complete
                        }
                    });

                })
                .catch((erreur) => {
                    console.log('Erreur : ', erreur);
                    res.status(500)
                    res.send({
                        message: "Erreur lors de la modification du statut de la sous-tâche. "
                    });
                });
        }
        )
        .catch((erreur) => {
            console.log('Erreur : ', erreur);
            res.status(500)
            res.send({
                message: "Erreur lors de la récupération de la sous-tâche à modifier. "
            });
        });
}

exports.SupprimerSousTache = (req, res) => {
    //Vérification de la présence de tous les paramètres.
    if (!req.params.id) {
        res.status(421)
        res.send({
            message: "Il faut spécifier quelle tâche est à supprimer avec son identifiant."
        })
    }
    //Vérification de l'existence de la sous-tâche.
    soustacheModel.TrouverSousTache(req.params.id)
        .then((lasoustache) => {
            if (!lasoustache[0]) {
                res.status(404);
                res.send({
                    message: `Il ne semble pas y avoir de tâches correspondantes.`
                });
                return;
            }
            soustacheModel.SupprimerSousTache(req.params.id)

                .then((soustachesupprimer) => {

                    res.send({
                        message: "La sous-tâche " + req.params.id + " a été supprimé avec succès",

                        soustache: {
                            id: req.params.id,
                            tacheid: soustachesupprimer.tacheid,
                            titre: soustachesupprimer.titre,
                            complete: soustachesupprimer.complete
                        }

                    });

                })

                .catch((erreur) => {
                    console.log('Erreur : ', erreur);
                    res.status(500)
                    res.send({
                        message: "Erreur lors de la suppression de la sous-tâche "
                    });
                });
        }
        )
        .catch((erreur) => {
            console.log('Erreur : ', erreur);
            res.status(500)
            res.send({
                message: "Erreur lors de la récupération de la sous-tâche à supprimer. "
            });
        });
}