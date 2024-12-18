export type Post = {
    id: number;
    author: string;
    location: string;
    content: string;
    imageUrl: string;
    likes?: number;
    comments: Comment[];
    timeAgo: string;
    idUser: number | undefined;
    statePub: boolean;
    category: string;
};

export interface IUser {
    id?: number;
    nomUser: string;
    mdpUser: string;
    username: string;
    etatUser: boolean;
    localisation: string;
    docUser?: string;
    photoUser?: string;
    pieceIdf?: string;
    pieceIdb?: string;
    dateCrea?: string;
    dateNaiss?: string
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
    idCat: number;
    idUser: number;
    typeCat: number;
    nullable: boolean;
    nomCat: string;
}

export type Publication = {
    idPub?: number
    idUser: number | undefined;
    idCat: number | undefined;
    libelePub: string;
    imagePub: string | any;
    datePub: string;
    favories: boolean;
    etat: boolean;
    videoPub?: string | any;
    montantEstime: number | string;
    documentUrl: string | any;
}


export type Jaime = {
    idJaime?: number,
    idPub: number,
    idUser: number,
    libleJaime: string,
    dateJaime: string
}

export interface Comment {
    idCom: number;
    idPub: number;
    idUser: number;
    idParent?: number | null;  // Add this for nested replies
    dateCom: string;
    etatCom: boolean;
    libeleCom: string;
    userName?: string;
    userAvatar?: string;
    replies?: Comment[];

    replyToUser?: string;
    likes?: number; // the number of likes of this message
}

/**
 *   const handleLike = () => {
        setIsLiked(!isLiked);
        Animated.sequence([
            Animated.spring(scaleAnim, {
                toValue: 1.2,
                useNativeDriver: true,
            }),
            Animated.spring(scaleAnim, {
                toValue: 1,
                useNativeDriver: true,
            }),
        ]).start();
        onLike(comment?.idCom);
    }
 */

export type User = {
    idUser?: number;
    nomUser: string;
    mdpUser: string;
    username: string;
    etatUser: boolean;
    localisation: string;
    docUser?: string;
    photoUser?: string;
    pieceIdf?: string;
    pieceIdb?: string;
    dateCrea?: string;
    dateNaiss?: string
}


export type Don = {
    idDons: number;
    idPub: number;
    idUser: number;
    nomDons: string;
    montantDons: number;
    dateDons: string;
}

export type DonationResponse = {
    id: string;
    status: string;
    amount: {
        value: string;
        currency_code: string;
    };
};
