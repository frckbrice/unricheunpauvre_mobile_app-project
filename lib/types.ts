export type Post = {
    id: number;
    author: string;
    location: string;
    content: string;
    imageUrl: string;
    likes: number;
    comments: number;
    timeAgo: string;
};

export interface IUser {
    id?: number;
    nomUser: string;
    mdpUser: string;
    username: string;
    etatUser: boolean;
    docUser: string;
}

export interface TUser {
    username: string;
    password: string;
    role?: string;
}

export interface TokenCache {
    getToken: (key: string) => Promise<string | undefined | null>
    saveToken: (key: string, token: string) => Promise<void>
    clearToken?: (key: string) => void
}


export type Category = {
    id: number;
    name: string;
    type: string;
}

export type Publication = {
    idPub?: number | undefined;
    idUser: number | undefined;
    idCat: number | undefined;
    libelePub: string;
    imagePub: string | any;
    datePub: string;
    favories: boolean;
    etat: boolean;
    videoPub?: string | any;
    montantEstime: number;
    documentUrl: string | any;
}
