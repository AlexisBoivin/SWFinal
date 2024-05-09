const sql = require("../config/db.js");
// const { utilisateur_id } = require("./taches.model.js");

const Soustache = (soustache) => {
    this.id = soustache.id;
    this.tacheid = soustache.tacheid;
    this.titre = soustache.titre;
    this.complete = soustache.complete;
};



Soustache.AjouterSousTache = (id, titre) => {
    return new Promise((resolve, reject) => {
        const requete = `INSERT INTO sous_taches (tache_id, titre, complete) VALUES (?, ?, ?)`;
        const params = [id, titre, 0];

        sql.query(requete, params, (erreur, resultat) => {
            if (erreur){
                reject(erreur);
            }
            resolve(resultat);
        })
    })
}



Soustache.ModifierSousTache = (id, tacheid, titre) => {
    return new Promise((resolve, reject) => {
        const requete = `UPDATE sous_taches SET tache_id = ?, titre = ? WHERE id = ?`;
        const params = [tacheid, titre, id]
        sql.query(requete, params, (erreur, resultat) => {
            if (erreur) {
                reject(erreur);
            }
            resolve(resultat);
        });
    })
}

Soustache.ModifierStatutSousTache = (id, complete) => {
    return new Promise((resolve, reject) => {
        const requete = `UPDATE sous_taches SET complete = ? WHERE id = ?`;
        const params = [complete, id]
        sql.query(requete, params, (erreur, resultat) => {
            if (erreur) {
                reject(erreur);
            }
            resolve(resultat);
        });
    })
}



Soustache.TrouverSousTache = (id) => {
    return new Promise((resolve, reject) => {
        const requete = `SELECT * FROM sous_taches WHERE id = ?`;
        const params = [id]
        sql.query(requete, params, (erreur, resultat) => {
            if (erreur) {
                reject(erreur);
            }
            resolve(resultat);
        });
    })
}

Soustache.SupprimerSousTache = (id) => {
    return new Promise((resolve, reject) => {
        const requete = `DELETE FROM sous_taches WHERE id = ?`;
        const params = [id]
        sql.query(requete, params, (erreur, resultat) => {
            if (erreur) {
                
                reject(erreur);
            }
            resolve(resultat);
        });
    })

}

Soustache.SoustacheTache = (tache_id) => {
    return new Promise((resolve, reject) => {
        const requete =  `SELECT * FROM sous_taches WHERE tache_id = ?`;
        const params = [tache_id]
        sql.query(requete, params, (erreur, resultat) => {
            if (erreur) {
                reject(erreur);
            }
            resolve(resultat);
        })
    })
}


module.exports = Soustache;