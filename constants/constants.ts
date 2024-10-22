import { Post } from "@/lib/types";

export const TOKEN_KEY = process.env.EXPO_PUBLIC_SECRET_KEY;

export const API_URL = process.env.EXPO_PUBLIC_PROD_API_URL;


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