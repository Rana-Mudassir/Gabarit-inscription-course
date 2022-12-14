import { compare } from "bcrypt";
import passport from "passport";
import { Strategy } from "passport-local";
import { getUtilisateurByNom } from "./model/utilisateur.js";

let config = {
    usernameField: 'courriel',
    passwordField: 'motDePasse'
};

passport.use(new Strategy(config, async (courriel, motDePasse, done) => {
    try {
        let utilisateur = await getUtilisateurByNom(courriel);

        if(!utilisateur) {
            return done(null, false, { erreur: 'erreur_courriel' })
        }

        let valide = await compare(motDePasse, utilisateur.mot_passe);

        if(!valide) {
            return done(null, false, { erreur: 'erreur_mot_de_passe' })
        }

        return done(null, utilisateur);
    }
    catch(error) {
        return done(error);
    }
}));

passport.serializeUser((utilisateur, done) => {
    done(null, utilisateur.courriel)
});

passport.deserializeUser(async (courriel, done) => {
    try {
        let utilisateur = await getUtilisateurByNom(courriel);
        done(null, utilisateur);
    }
    catch(error) {
        done(error);
    }
});
