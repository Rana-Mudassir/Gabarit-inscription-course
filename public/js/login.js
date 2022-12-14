let formAuth = document.getElementById('form-auth');
let inputCourriel = document.getElementById('input-courriel');
let inputMotDePasse = document.getElementById('input-mot-de-passe');

formAuth.addEventListener('submit', async (event) => {
    event.preventDefault();

    let data = {
        courriel: inputCourriel.value,
        motDePasse: inputMotDePasse.value
    }

    let response = await fetch('/connexion', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    });

    if(response.ok) {
        let payload = await response.json();
        if (payload.userType==2){
            window.location.replace('/admin');
        } else {
            window.location.replace('/');
        }
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