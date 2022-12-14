// Ensemble de connexions
let connexions = new Set();

// Identifiant courant des messages
let currentId = 0;

export default function middlewareSse() {
    return (request, response, next) => {
        /**
         * Initialiser la connexion avec le client
         */
        response.initStream = () => {
            // Retourner le stream au client
            response.writeHead(200, {
                'Cache-Control': 'no-cache',
                'Content-Type': 'text/event-stream',
                'Connection': 'keep-alive'
            });

            // Ajouter la connexion à notre ensemble
            connexions.add(response);

            // Boucle pour garder la connexion en vie
            const intervalId = setInterval(() => {
                response.write(':\n\n');
                response.flush();
            }, 30000);

            // Arrêter la boucle si le client stop la connexion
            response.on('close', () => {
                connexions.delete(response);
                clearInterval(intervalId);
                response.end();
            });
        };

        /**
         * Envoyer des objets sous le format JSON à tous le clients
         */
        response.pushJson = (data, eventName) => {
            // Bâtir la chaîne de données
            let dataString = 
                `id: ${ currentId }\n` + 
                `data: ${ JSON.stringify(data) }\n` + 
                (eventName ? `event: ${ eventName }\n\n` : '\n');

            // Envoyer les données à toutes les connexions
            for(let connexion of connexions){
                connexion.write(dataString);
                connexion.flush();
            }

            currentId++;
        };

        // Passer au prochain middleware
        next();
    }
}