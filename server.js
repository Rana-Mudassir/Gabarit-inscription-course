// Chargement du fichier de configuration
import 'dotenv/config';

// Importations de modules
import express, { json } from 'express';
import { create } from 'express-handlebars'
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import session from 'express-session';
import memorystore from 'memorystore';
import passport from 'passport';
import middlewareSse from './middleware-sse.js';
import https from 'https';
import { readFile } from 'fs/promises';
import { addCours, addInscription, getCours, getCoursAvecInscription, getCoursParUtilisateur, removeCours, removeInscription } from './model/cours.js'
import { isDateValide, isIDValide, isQuantiteValide, isTexteValide }
from './validation.js';
import { addUtilisateur } from './model/utilisateur.js';
import './authentification.js';


// Initialisation de handlebars
const handlebars = create({
    helpers: {
        date: (timestamp) => new Date(timestamp).toLocaleDateString(),
        time: (timestamp) => new Date(timestamp).toLocaleTimeString()
    }
});

// Création de la base de données de session
const MemoryStore = memorystore(session);

// Création du serveur
let app = express();
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('views', './views');

// Ajout de middleware
app.use(helmet());
app.use(cors());
app.use(helmet());
app.use(compression());
app.use(json());

app.use(session({
    cookie: { maxAge: 1800000 },
    name: process.env.npm_package_name,
    store: new MemoryStore({ checkPeriod: 1800000 }),
    resave: false,
    saveUninitialized: false,
    secret: process.env.SESSION_SECRET
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(middlewareSse());
app.use(express.static('public'));

// Programmation de routes
// Page pour s'inscrire aux différents cours
app.get('/connexion', (request, response) => {
    response.render('login', {
        titre: 'Connexion',
        scripts: ['/js/login.js'],
        user: request.user!=undefined,
        acceptCookie: request.session.accept,
    });
});
//route pour s'enregistrer
app.get('/register', (request, response) => {
    response.render('register', {
        titre: 'Register',
        scripts: ['/js/register.js'],
        user: request.user!=undefined,
        acceptCookie: request.session.accept,
    });
});

app.get('/', async (request, response) => {
    if(request.user && (request.user.id_type_utilisateur == 1|| request.user.id_type_utilisateur == 2 )) {
        response.render('inscription', {
            titre: 'Cours',
            bouton: 'S\'inscrire',
            scripts: ['/js/inscription.js'],
            user: request.user!=undefined,
            cours: await getCoursAvecInscription(request.user.id_utilisateur),
        });
    }
    else {
        response.redirect('/connexion');
    }
});

// Page du compte pour voir les cours auquel on est inscrit
app.get('/compte', async (request, response) => {
    if(request.user && request.user.id_type_utilisateur == 1) {
        response.render('compte', {
            titre: 'Compte',
            cours: await getCoursParUtilisateur(request.user.id_utilisateur),
            bouton: 'Désinscrire',
            user: request.user!=undefined,
            scripts: ['/js/compte.js']
        })
    }
        else {
        response.redirect('/connexion');
    }
});

// Page administrateur pour visualiser, ajouter et supprimer des cours
app.get('/admin', async (request, response) => {
    if(request.user && request.user.id_type_utilisateur == 2) {
        response.render('admin', {
            titre: 'Admin',
            cours: await getCours(),
            bouton: 'Supprimer',
            user: request.user!=undefined,
            scripts: ['/js/admin.js']
        })
    }
    else {
        response.redirect('/connexion');
    }
});

// Route pour s'inscrire à un cours
app.post('/inscription', async (request, response) => {
    if(isIDValide(request.body.id_cours)){
        let success = await addInscription(request.body.id_cours, request.user.id_utilisateur);
        if(success) {
            response.status(200).end();
        }
        else {
            response.status(409).end();
        }
    }
    else {
        response.status(400).end();
    }
});

// Route pour se désinscrire d'un cours
app.delete('/inscription', async (request, response) => {
    if(isIDValide(request.body.id_cours)){
        await removeInscription(request.body.id_cours, request.user.id_utilisateur);
        response.status(200).end();
    }
    else {
        response.status(400).end();
    }
});

// Route pour ajouter un cours
app.post('/cours', async (request, response) => {
    if(isTexteValide(request.body.nom) && 
       isTexteValide(request.body.description) &&
       isDateValide(request.body.dateDebut) &&
       isQuantiteValide(request.body.nbCours) &&
       isQuantiteValide(request.body.capacite)){
        await addCours(
            request.body.nom, 
            request.body.description, 
            request.body.dateDebut, 
            request.body.nbCours, 
            request.body.capacite
        );
        response.status(200).end();
    }
    else {
        response.status(400).end();
    }
});

// Route pour supprimer un cours
app.delete('/cours', async (request, response) => { 
    if(isIDValide(request.body.id_cours)){
        await removeCours(request.body.id_cours);
        response.status(200).end();
    }
    else {
        response.status(400).end();
    }
});

app.post('/connexion', (request, response, next) => {
    // Mettre validation des champs venant du client
    if(true) {
        passport.authenticate('local', (error, utilisateur, info) => {
            if(error) {
                next(error);
            }
            else if(!utilisateur) {
                response.status(401).json(info);
            }
            else {
                let user = utilisateur;
                request.logIn(utilisateur, (error) => {
                    if(error) {
                        next(error);
                    }
                    else {
                        response.json({
                            userType: user.id_type_utilisateur
                        });
                        response.status(200).end()
                    }
                })
            }
        })(request, response, next);
    }
    else {
        response.status(400).end();
    }
});
//deconnexion de l'utilisateurs
app.get('/deconnexion', (request, response, next) => {
    request.logOut((error) => {
        if(error) {
            next(error);
        }
        else {
            response.redirect('/connexion');
        }
    })
});

app.post('/register', async (request, response, next) => {
    // Mettre validation des champs venant du client
    if(true) {
        try {
            await addUtilisateur(1 , request.body.courriel, request.body.motDePasse, request.body.preNom, request.body.nom);
            response.status(200).end(); 
        }
        catch(error) {
            if(error.code === 'SQLITE_CONSTRAINT') {
                response.status(409).end();
            }
            else {
                next(error);
            }
        }
    }
    else {
        response.status(400).end();
    }
});

// Démarrage du serveur
if(process.env.NODE_ENV === 'production') {
    app.listen(process.env.PORT);
    console.log('Serveur démarré: http://localhost:' + process.env.PORT);
}
else {
    const credentials = {
        key: await readFile('./security/localhost.key'),
        cert: await readFile('./security/localhost.cert')
    };

    https.createServer(credentials, app).listen(process.env.PORT);
    console.log('Serveur démarré: https://localhost:' + process.env.PORT);
}
