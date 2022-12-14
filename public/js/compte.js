/**
 * Tableau contenant tous les boutons dans la page.
 */
let buttons = document.querySelectorAll('button');

/**
 * Désinscrit l'utilisateur courant d'un cours sur le serveur.
 * @param {Event} event Objet d'information de l'événement.
 */
const removeInscriptionServeur = async (event) => {
    let button = event.currentTarget;
    let data = {
        id_cours: Number(button.dataset.idCours)
    };

    let response = await fetch('/inscription', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });

    if(response.ok) {
        // On supprime le <li> si la désinscription fonctionne sur le serveur
        button.parentNode.remove();
    }
}

// Ajoute la désinscription de l'utilisateur au clic de tous les boutons dans 
// la liste de cours
for(let button of buttons) {
    button.addEventListener('click', removeInscriptionServeur);
}
