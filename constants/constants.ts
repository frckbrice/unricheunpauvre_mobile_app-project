import Constants from "expo-constants";
const { manifest } = Constants;

// get the local IP address at run time.
const uri =
    Constants.expoConfig?.hostUri?.split(':').shift()?.concat(':5000') ??
    'yourapi.com';

// export const API_URL = `http://${uri}/api`;
export const TOKEN_KEY = process.env.EXPO_PUBLIC_JWT_SECRET_KEY;


export const API_URL = process.env.EXPO_PUBLIC_PROD_API_URL;

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

}]