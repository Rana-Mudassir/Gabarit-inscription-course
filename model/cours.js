import connectionPromise from "./connexion.js";

/**
 * Retourne tous les cours dans la base de données avec leurs informations.
 * @returns Une liste de tous les cours avec leurs informations.
 */
export const getCours = async () => {
    try {
        let connection = await connectionPromise;

        let results = await connection.all(
            `SELECT 
                c.id_cours, 
                c.nom, 
                c.description, 
                c.date_debut, 
                c.nb_cours, 
                c.capacite, 
                COUNT(cu.id_cours) AS inscriptions 
            FROM cours c 
            LEFT JOIN cours_utilisateur cu ON c.id_cours = cu.id_cours 
            GROUP BY c.id_cours`, 
        );

        return results;
    }
    catch(error) {
        console.log(error);
    }
}

/**
 * Retourne tous les cours dans la base de données avec leurs informations et 
 * un champ indiquant si l'utilisateur y est déjà inscrit ou non.
 * @param {number} id_utilisateur Le ID de l'utilisateur courant.
 * @returns Une liste de tous les cours avec leurs informations.
 */
export const getCoursAvecInscription = async (id_utilisateur) => {
    try {
        let connection = await connectionPromise;

        let results=  await connection.all(
            `SELECT 
                c.id_cours, 
                c.nom, 
                c.description, 
                c.date_debut, 
                c.nb_cours, 
                c.capacite, 
                COUNT(cu.id_cours) AS inscriptions, 
                c.id_cours IN (
                    SELECT id_cours 
                    FROM cours_utilisateur 
                    WHERE id_utilisateur = ?
                ) AS estInscrit
            FROM cours c
            LEFT JOIN cours_utilisateur cu ON c.id_cours = cu.id_cours
            GROUP BY c.id_cours`, 
            [id_utilisateur]
        );

        return results;
    }
    catch(error) {
        console.log(error)
    }
}

/**
 * Retourne tous les cours dans la base de données auquel l'utilisateur est 
 * inscrit avec leurs informations.
 * @param {number} id_utilisateur Le ID de l'utilisateur courant.
 * @returns Une liste de tous les cours auquel l'utilisateur est inscrit avec leurs informations.
 */
export const getCoursParUtilisateur = async (id_utilisateur) => {
    try {
        let connection = await connectionPromise;

        let results = await connection.all(
            `SELECT 
                c.id_cours, 
                c.nom, 
                c.description, 
                c.date_debut, 
                c.nb_cours,
                c.capacite,
                COUNT(cu.id_cours) AS inscriptions
            FROM cours c 
            LEFT JOIN cours_utilisateur cu ON c.id_cours = cu.id_cours 
            GROUP BY c.id_cours
            HAVING cu.id_utilisateur = ?`, 
            [id_utilisateur]
        );

        return results;
    }
    catch(error) {
        console.log(error);
    }
}

/**
 * Inscrit un utilisateur à un cours dans la base de données.
 * @param {number} id_cours Le ID du cours où l'utilisateur sera inscrit.
 * @param {number} id_utilisateur Le ID de l'utilisateur à inscrire.
 * @returns Une valeur indiquant si l'inscription à réussi ou non.
 */
export const addInscription = async (id_cours, id_utilisateur) => {
    try {
        let connection = await connectionPromise;

        await connection.run(
            `INSERT INTO cours_utilisateur (id_cours, id_utilisateur)
            VALUES (?, ?);`,
            [id_cours, id_utilisateur]
        );

        return true;
    }
    catch(error) {
        // Si on détecte une erreur de conflit, on retourne false pour 
        // retourner une erreur 409 
        if(error.code === 'SQLITE_CONSTRAINT') {
            return false;
        }
        else {
            console.log(error);
        }
    }
}

/**
 * Désinscrit un utilisateur à un cours dans la base de données.
 * @param {number} id_cours Le ID du cours où l'utilisateur sera désinscrit.
 * @param {number} id_utilisateur Le ID de l'utilisateur à désinscrire.
 */
export const removeInscription = async (id_cours, id_utilisateur) => {
    try {
        let connection = await connectionPromise;

        await connection.run(
            `DELETE FROM cours_utilisateur
            WHERE id_cours = ? AND id_utilisateur = ?;`,
            [id_cours, id_utilisateur]
        );
    }
    catch(error) {
        console.log(error);
    }
}

/**
 * Ajoute un nouveau cours dans la base de données.
 * @param {string} nom Le nom du cours à ajouter.
 * @param {string} description La description du cours à ajouter.
 * @param {number} dateDebut La date de début du cours à ajouter.
 * @param {number} nbCours Le nombre de cours du cours à ajouter.
 * @param {number} capacite La capacité du cours à ajouter.
 */
export const addCours = async (nom, description, dateDebut, nbCours, capacite) => {
    try {
        let connection = await connectionPromise;
        
        await connection.run(
            `INSERT INTO cours (nom, description, date_debut, nb_cours, capacite)
            VALUES (?, ?, ?, ?, ?);`,
            [nom, description, dateDebut, nbCours, capacite]
        );
    }
    catch(error) {
        console.log(error);
    }
}

/**
 * Supprime un cours dans la base de données.
 * @param {number} id_cours Le ID du cours à supprimer.
 */
export const removeCours = async (id_cours) => {
    try {
        let connection = await connectionPromise;

        await connection.run(
            `DELETE FROM cours
            WHERE id_cours = ?;`,
            [id_cours]
        );
    }
    catch(error) {
        console.log(error);
    }
}
