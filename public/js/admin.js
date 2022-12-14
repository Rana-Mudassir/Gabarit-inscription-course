// Variables représentant les éléments de la page HTML
let buttons = document.querySelectorAll('.liste-cours button');
let form = document.getElementById('form-ajouter');
let inputNom = document.getElementById('input-nom');
let inputDescription = document.getElementById('input-description');
let inputDate = document.getElementById('input-date');
let inputHeure = document.getElementById('input-heure');
let inputNombre = document.getElementById('input-nombre');
let inputCapacite = document.getElementById('input-capacite');
let erreurNom = document.getElementById('erreur-nom');
let erreurDescription = document.getElementById('erreur-description');
let erreurDate = document.getElementById('erreur-date');
let erreurHeure = document.getElementById('erreur-heure');
let erreurNombre = document.getElementById('erreur-nombre');
let erreurCapacite = document.getElementById('erreur-capacite');

/**
 * Supprime un cours sur le serveur.
 * @param {Event} event Objet d'information de l'événement.
 */
const removeCoursServeur = async (event) => {
    let button = event.currentTarget;
    let data = {
        id_cours: Number(button.dataset.idCours)
    };

    let response = await fetch('/cours', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });

    if(response.ok) {
        // On supprime le <li> si la suppression fonctionne sur le serveur
        button.parentNode.remove();
    }
}

/**
 * Ajoute un cours sur le serveur.
 * @param {Event} event Objet d'information de l'événement.
 */
const addCoursServeur = async (event) => {
    event.preventDefault();

    // Tester si toutes les données entrées sont valide
    if(!form.checkValidity()) {
        return;
    }

    let data = {
        nom: inputNom.value,
        description: inputDescription.value,
        dateDebut: new Date(inputDate.value + ' ' + inputHeure.value).getTime(),
        nbCours: Number(inputNombre.value),
        capacite: Number(inputCapacite.value),
    };

    let response = await fetch('/cours', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });

    if(response.ok) {
        // On rafraîchit la page si l'ajout a fonctionné
        // Il serait plus performant d'ajouter manuellement le <li> dans le 
        // HTML, mais pour simplifier le code, j'utilise le rafraîchissement
        window.location.reload();
    }
}

/**
 * Valide le champ du nom.
 */
const validateNom = () => {
    if(inputNom.validity.valid) {
        erreurNom.classList.add('hidden');
    }
    else {
        erreurNom.innerText = 'Le nom du cours est requis.';
        erreurNom.classList.remove('hidden');
    }
}

/**
 * Valide le champ de la description.
 */
const validateDescription = () => {
    if(inputDescription.validity.valid) {
        erreurDescription.classList.add('hidden');
    }
    else {
        erreurDescription.innerText = 'La description du cours est requise.';
        erreurDescription.classList.remove('hidden');
    }
}

/**
 * Valide le champ de la date.
 */
const validateDate = () => {
    if(inputDate.validity.valid) {
        erreurDate.classList.add('hidden');
    }
    else {
        erreurDate.innerText = 'La date de début du cours est requise.';
        erreurDate.classList.remove('hidden');
    }
}

/**
 * Valide le champ de l'heure.
 */
const validateHeure = () => {
    if(inputHeure.validity.valid) {
        erreurHeure.classList.add('hidden');
    }
    else {
        erreurHeure.innerText = 'L\'heure du cours est requise.';
        erreurHeure.classList.remove('hidden');
    }
}

/**
 * Valide le champ du nombre de cours.
 */
const validateNombre = () => {
    if(inputNombre.validity.valid) {
        erreurNombre.classList.add('hidden');
    }
    else {
        if(inputNombre.validity.valueMissing) {
            erreurNombre.innerText = 'Le nombre de cours est requis.';
        }
        else if(inputNombre.validity.rangeUnderflow) {
            erreurNombre.innerText = 'Le nombre de cours doit être supérieur à zéro.';
        }

        erreurNombre.classList.remove('hidden');
    }
}

/**
 * Valide le champ de la capacité.
 */
const validateCapacite = () => {
    if(inputCapacite.validity.valid) {
        erreurCapacite.classList.add('hidden');
    }
    else {
        if(inputCapacite.validity.valueMissing) {
            erreurCapacite.innerText = 'Le nombre de cours est requis.';
        }
        else if(inputCapacite.validity.rangeUnderflow) {
            erreurCapacite.innerText = 'Le nombre de cours doit être supérieur à zéro.';
        }

        erreurCapacite.classList.remove('hidden');
    }
}

// Ajoute la suppression du cours au clic de tous les boutons dans la liste 
// de cours
for(let button of buttons) {
    button.addEventListener('click', removeCoursServeur);
}

// Ajoute la validation à la soumission du formulaire
form.addEventListener('submit', validateNom);
form.addEventListener('submit', validateDescription);
form.addEventListener('submit', validateDate);
form.addEventListener('submit', validateHeure);
form.addEventListener('submit', validateNombre);
form.addEventListener('submit', validateCapacite);

// Ajoute l'ajout du cours à la soumission du formulaire
form.addEventListener('submit', addCoursServeur);
