let formAuth = document.getElementById('form-auth');
let inputCourriel = document.getElementById('input-courriel');
let inputNom = document.getElementById('input-name');
let inputPreNom = document.getElementById('input-pre-name');
let inputMotDePasse = document.getElementById('input-mot-de-passe');

formAuth.addEventListener('submit', async (event) => {
    event.preventDefault();

    let data = {
        courriel: inputCourriel.value,
        motDePasse: inputMotDePasse.value,
        nom: inputNom.value,
        preNom: inputPreNom.value
    }

    let response = await fetch('/register', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    });

    if(response.ok) {
        window.location.replace('/')
    }
    else if(response.status === 401) {
        // Afficher erreur dans l'interface
        let info = await response.json();
        if(info.erreur === 'erreur_nom_utilisateur') {
            console.log('Le nom d\'utilisateur n\'existe pas');
        }
        else if(info.erreur === 'erreur_mot_de_passe') {
            console.log('Le mot de passe est incorrect');
        }
    }
});