import Constants from "expo-constants";
const { manifest } = Constants;

// get the local IP address at run time.
const uri =
    Constants.expoConfig?.hostUri?.split(':').shift()?.concat(':5000') ??
    'yourapi.com';

export const API_URL = `http://${uri}/api`;
export const TOKEN_KEY = process.env.EXPO_PUBLIC_JWT_SECRET_KEY;


// export const API_URL = process.env.EXPO_PUBLIC_PROD_API_URL;

// console.log("\n\n from constant: API_URL", API_URL);
// console.log("\n\n from constant: TOKEN_KEY", TOKEN_KEY);

export const PAYPAL_CLIENT_ID = process.env.EXPO_PUBLIC_PAYPAL_CLIENT_ID
export const PAYPAL_SECRET = process.env.EXPO_PUBLIC_PAYPAL_SECRET;

// console.log("PAYPAL_SECRET: ", PAYPAL_SECRET);
// console.log("PAYPAL_CLIENT_ID: ", PAYPAL_CLIENT_ID);

export const comments = [{
    idCom: 5,
    idPub: 2,
    idUser: 8,
    etatCom: false,
    libeleCom: "le mont cameroun",
    dateCom: new Date().toLocaleDateString(),
}, {

    idCom: 100,
    idPub: 2,
    idUser: 6,
    etatCom: false,
    libeleCom: "le mont esso",
    dateCom: new Date().toLocaleDateString(),

}, {
    idCom: 9,
    idPub: 2,
    idUser: 7,
    etatCom: false,
    libeleCom: "le mont manegouba",
    dateCom: new Date().toLocaleDateString(),
}, {

    idCom: 8,
    idPub: 2,
    idUser: 8,
    etatCom: false,
    libeleCom: "le mont essama",
    dateCom: new Date().toLocaleDateString(),

},
{
    idCom: 95,
    idPub: 2,
    idUser: 12,
    etatCom: false,
    libeleCom: "le mont manegouba",
    dateCom: new Date().toLocaleDateString(),
}, {

    idCom: 99,
    idPub: 2,
    idUser: 3,
    etatCom: false,
    libeleCom: "le mont essama",
    dateCom: new Date().toLocaleDateString(),

}];

export const MESSAGES = {
    emptyQuery: {
        en: "Please enter a search query",
        fr: "Veuillez saisir une recherche",
    },
    searchError: {
        en: "Failed to perform search",
        fr: "Échec de la recherche",
    },
    Mauvais_mot_de_passe: {
        en: "Please enter a right pass word",
        fr: "Veuillez saisir un mot de passe correct",
    },
    Non_Correspondance_de_mots_de_passes: {
        en: "Failed to correspond the passwords",
        fr: "les mots de passe ne correspondent pas",
    },
    error_de_modification_de_mot_de_passe: {
        en: "Failed to update the password",
        fr: "Echec de la modification du mots de passe",
    },
    success_de_modification_de_mot_de_passe: {
        en: "successfully updated the password",
        fr: "success de la modification du mots de passe",
    },
    No_Current_user_ID: {
        en: "No current user Id found",
        fr: "Pas d'identifiant pour l'utilisateur courant",
    }
};
