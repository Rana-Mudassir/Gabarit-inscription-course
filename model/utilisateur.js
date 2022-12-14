import connectionPromise from './connexion.js';
import { hash } from 'bcrypt';

export const addUtilisateur = async (type_id, courriel, motDePasse, prenom, nom) => {
    let connexion =  await connectionPromise;

    let motDePasseHash = await hash(motDePasse, 10);

    await connexion.run(
        `INSERT INTO utilisateur (id_type_utilisateur, courriel, mot_passe, prenom, nom)
        VALUES (?, ?, ?, ?, ?)`,
        [type_id, courriel, motDePasseHash, prenom, nom]
    )
}

export const getUtilisateurByNom = async (courriel) => {
    let connexion = await connectionPromise;

    let utilisateur = await connexion.get(
        `SELECT id_utilisateur, id_type_utilisateur, courriel, mot_passe, prenom, nom
        FROM utilisateur
        WHERE courriel = ?`,
        [courriel]
    )

    return utilisateur;
}