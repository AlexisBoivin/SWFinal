const sql = require("../config/db.js");

const Tache = (tache) => {
    this.id = tache.id;
    this.utilisateur_id = tache.utilisateur_id;
    this.titre = tache.titre;
    this.description = tache.description;
    this.datedebut = tache.datedebut;
    this.dateecheance = tache.dateecheance;
    this.complete = tache.complete;
};


Tache.AfficherListe = (complete, id) => {
    return new Promise((resolve, reject) => {
        const requete = `SELECT * FROM taches WHERE complete = ? and utilisateur_id = ?`;
        const params = [complete, id];

        sql.query(requete, params, (erreur, resultat) => {
            if (erreur) {
                // S'il y a une erreur, je la retourne avec reject()
                reject(erreur);
            }
            // Sinon je retourne le résultat sans faire de validation, c'est possible que le résultat soit vide
            resolve(resultat);
        });
    });
}

Tache.AfficherDetailTache = (id) => {
    return new Promise((resolve, reject) => {
        const requete = `SELECT t.titre, t.descrption, t.date_debut, t.date_echeance FROM taches t WHERE id = ?`;
        const params = [id];

        sql.query(requete, params, (erreur, resultat) => {
            if (erreur) {
                // S'il y a une erreur, je la retourne avec reject()
                reject(erreur);
            }
            // Sinon je retourne le résultat sans faire de validation, c'est possible que le résultat soit vide
            resolve(resultat);
        });
    });
}

Tache.AjouterTache = (id, titre, description, datedebut, dateecheance) => {
    return new Promise((resolve, reject) => {
        const requete = `INSERT INTO taches (utilisateur_id, titre, description, date_debut, date_echeance, complete) VALUES (?, ?, ?, ?, ?, ?)`;
        const params = [id, titre, description, datedebut, dateecheance, 0];

        sql.query(requete, params, (erreur, resultat) => {
            if (erreur){
                reject(erreur);
            }
            resolve(resultat);
        })
    })
}

Tache.ModifierTache = (id, titre, description, datedebut, dateecheance) => {
    return new Promise((resolve, reject) => {
        const requete = `UPDATE taches SET titre = ?, description = ?, date_debut = ?, date_echeance = ? WHERE id = ?`;
        const params = [titre, description, datedebut, dateecheance, id]
        sql.query(requete, params, (erreur, resultat) => {
            if (erreur) {
                reject(erreur);
            }
            resolve(resultat);
        });
    })
}

Tache.ModifierStatutTache = (id, complete) => {
    return new Promise((resolve, reject) => {
        const requete = `UPDATE taches SET complete = ? WHERE id = ?`;
        const params = [complete, id]
        sql.query(requete, params, (erreur, resultat) => {
            if (erreur) {
                reject(erreur);
            }
            resolve(resultat);
        });
    })
}


module.exports = Tache;