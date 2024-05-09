const sql = require("../config/db.js");
// const { utilisateur_id } = require("./taches.model.js");
const bcrypt = require('bcrypt');
const {v4: uuidv4} = require('uuid');

const Utilisateur = (utilisateur) => {
    this.id = utilisateur.id;
    this.nom = utilisateur.nom;
    this.prenom = utilisateur.prenom;
    this.courriel = utilisateur.courriel;
    this.cleapi = utilisateur.cleapi;
    this.password = utilisateur.password;
};


Utilisateur.trouverUtilisateur = (cleApi) => {
    return new Promise((resolve, reject) => {
        const requete = `SELECT * FROM utilisateur WHERE cle_api = ?`;
        const params = [cleApi];

        sql.query(requete, params, (erreur, resultat) => {
            if (erreur) {
                // S'il y a une erreur, je la retourne avec reject()
                reject(erreur);
            }
            // Sinon je retourne le résultat sans faire de validation, c'est possible que le résultat soit vide
            console.log(resultat[0].id);
            resolve(resultat);
        });
    });
}



//Extrait de code tiré des notes de cours.
Utilisateur.validationCle = (cleApi) => {
    return new Promise((resolve, reject) => {
        const requete = 'SELECT COUNT(*) AS nbUsager FROM utilisateur u WHERE cle_api = ?; ';
        const parametres = [cleApi];

        sql.query(requete, parametres, (erreur, resultat) => {
            if (erreur) {
                console.log(`Erreur sqlState ${erreur.sqlState} : ${erreur.sqlMessage}`);
                reject(erreur);
            }
            console.log(resultat);
            resolve(resultat[0].nbUsager > 0);   
        });
    });
}


Utilisateur.AjouterUtilisateur = (courriel, password, prenom, nom) => {
    return new Promise ((resolve, reject) => {
        const costFactor = 10;
        const cle_api = uuidv4();
        const requete = 'INSERT INTO utilisateur (nom, prenom, courriel, cle_api, password) VALUES (?, ?, ?, ?, ?);';
        bcrypt.hash(password, costFactor)
        .then(safe => {
            const params = [nom, prenom, courriel, cle_api, safe];
            sql.query(requete, params, (erreur, resultat) => {
                if (erreur) {
                    reject(erreur);
                }
                resolve(cle_api);
            })
        })
        .catch(err => console.error(err.message))
        
    })
}

Utilisateur.NouvelleCleApi = async (courriel, password) => {
    return new Promise((resolve, reject) => {
        const requete = `UPDATE utilisateur SET cle_api = ? WHERE courriel = ? and password = ?`;
        const cle_api = uuidv4();
        const params = [cle_api, courriel, password]
        sql.query(requete, params, (erreur, resultat) => {
            if (erreur) {
                reject(erreur);
            }
            resolve(cle_api);
        });
    })
}


Utilisateur.TrouverHash = (courriel) => {
    return new Promise((resolve, reject) => {
        const requete = `SELECT password FROM utilisateur WHERE courriel = ?`;
        const params = [courriel];
        sql.query(requete, params, (erreur, resultat) => {
            if (erreur) {
                reject(erreur);
            }
            resolve(resultat[0])
        })
    })
}

module.exports = Utilisateur;