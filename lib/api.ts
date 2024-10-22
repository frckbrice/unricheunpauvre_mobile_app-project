
// import lib
// import { useSignIn } from '@clerk/clerk-expo';

// import the client library
import { AppError } from '@/utils/error-class';
import { API_URL } from '@/constants/constants';
// import { tokenCache } from '@/store/persist-token-cache';
import axios from 'axios';
import { Jaime, Post, Publication, User } from '@/lib/types';


type TConnect = User;

// getthe current user
export const createUserAccount
    = async (
        mdpUser: string,
        username: string,
        endPoint: string,
        nomUser?: string) => {
        let dataObj, resouce;
        if (endPoint.includes('User')) {
            dataObj = {
                nomUser: nomUser,
                mdpUser: mdpUser,
                username: username,
                etatUser: false,
                docUser: '',
            } as TConnect;
        }
        else if (endPoint.includes('Auth/login')) {
            dataObj = {
                username: username,
                password: mdpUser,
            }
        }
        resouce = endPoint;
        console.log("\n\ndata object: ", dataObj, { username, mdpUser }, "resource: ", resouce)
        try {

            const options = {
                method: 'POST',
                url: `${API_URL}/${resouce}`,
                headers: {
                    // 'Authorization': `Bearer ${token ?? ""}`,
                    'Content-Type': 'application/json',
                    Accept: 'application/json'
                },
                data: JSON.stringify(dataObj)
            }

            const response = await axios.request(options);
            console.log("\n\nfrom api file connect fct", response?.data);
            return response?.data
        } catch (error: any) {
            console.error("Failed to connect to app : ", error);
            throw new AppError(error.message);
        }
    }



export const getAllResourcesById = async (resource: string, id: number): Promise<Jaime[]> => {
    try {

        const options = {
            method: 'GET',
            url: `${API_URL}/${resource}/${id}`,
            headers: {
                // 'Authorization': `Bearer ${token ?? ""}`,
                'Content-Type': 'application/json',
                Accept: 'application/json'
            },
        }

        const response = await axios.request(options);
        console.log("\n\nfrom api file getAllLikesForAPub fct", response?.data);
        return response?.data

    } catch (error: any) {
        console.error(`from api file. Error fetching all resources "${resource}" by id ${id} : ${error}`);
        throw new AppError(error.message);
    }
}

// pull all videos
export const getAllPublications = async (): Promise<Post[] | any> => {

    // const token = await tokenCache.getToken("token");
    try {

        const options = {
            method: 'GET',
            url: `${API_URL}/Publication`,
            headers: {
                // 'Authorization': `Bearer ${token ?? ""}`,
                'Content-Type': 'application/json',
                Accept: 'application/json'
            },
        }

        const response = await axios.request(options);
        return response?.data?.map((resp: any) => ({
            id: resp?.idPub,
            author: resp?.nomUser ?? "ANONYMOUS",
            location: resp?.location ?? "No Location",
            content: resp?.libelePub ?? "No Content Yet",
            imageUrl: resp?.imagePub,
            likes: resp?.favories ?? "",
            comments: resp?.commentaires ?? [],
            timeAgo: resp?.datePub ?? "",
            idUser: resp?.idUser,
            idCat: resp?.idCat,
            statePub: resp?.etat
        }))

    } catch (error: any) {
        console.error(`from api file. Error fetching Publication data : ${error}`);
        throw new AppError(error.message);
    }
}

// update pub
export const updateResource = async <T>(resource: string, id: number, value: Partial<T>): Promise<T> => {

    try {

        const options = {
            method: 'PUT',
            url: `${API_URL}/${resource}/${id}`,
            headers: {
                // 'Authorization': `Bearer ${token ?? ""}`,
                'Content-Type': 'application/json',
                Accept: 'application/json'
            },
            data: JSON.stringify(value)
        }

        const response = await axios.request(options);
        return response?.data
    } catch (error: any) {
        console.error(`inside updateResource fct on api file. Error updating resource ${resource} with id ${id} : ${error}`);
        throw new AppError(error.message);
    }
}

// pull latest videos
export const getSingleResource = async (resource: string, id: number) => {



    // const token = await tokenCache.getToken("token");
    console.log("from api file API_URL: ", `${API_URL}/${resource}/${id}`);
    try {

        const options = {
            method: 'GET',
            url: `${API_URL}/${resource}/${id}`,
            headers: {
                // 'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                Accept: 'application/json'
            },
        }

        const response = await axios.request(options);
        console.log("form api file getSingleResource fct:", response?.data);

        if (resource.toLocaleLowerCase().includes('publication')) return {
            id: response?.data.id,
            author: response?.data.user.username,
            location: response?.data.user.location ?? "",
            content: response?.data.libelePub ?? "",
            imageUrl: response?.data.imagePub ?? "",
            likes: response?.data.favories ?? "",
            comments: response?.data.commentaires ?? "",
            timeAgo: response?.data.datePub ?? "",
        };
        else if (resource.toLocaleLowerCase().includes('categorie'))
            return response.data.map((cat: any) => ({
                id: cat.idCat,
                author: cat.nomCat,
                type: cat.typeCat,
            }))
        else return response?.data;

    } catch (error: any) {
        console.error(`inside getSingleResource failed fetching resouce ${resource} with id: ${id} : ${error}`);
        throw new AppError(error.message);
    }
}

// logout

export const getAllCategories = async () => {


    // const token = await tokenCache.getToken("token");
    try {

        const options = {
            method: 'GET',
            url: `${API_URL}/Categorie`,
            headers: {
                // 'Authorization': `Bearer ${token ?? ""}`,
                'Content-Type': 'application/json',
                Accept: 'application/json'
            },
        }

        const response = await axios.request(options);
        console.log("\n\nfrom api file getAllCategories fct", response?.data);
        return response.data.map((cat: any) => ({
            id: cat?.idCat,
            idUser: cat?.idUser,
            name: cat?.nomCat,
            type: cat?.typeCat,
        }))

    } catch (error: any) {
        console.error(`from api file getAllCategories ftc. Error fetching Publication data : ${error}`);
        throw new AppError(error.message);
    }
}

// store the file and get the url from the bucket.
export const uploadResourceData = async <T>(
    dataValues: T, resource: string
): Promise<T | null> => {

    // const token = await tokenCache.getToken("token");

    try {

        const options = {
            method: 'POST',
            url: `${API_URL}/${resource}`,
            headers: {
                // 'Authorization': `Bearer ${token ?? ""}`,
                'Content-Type': 'application/json',
                Accept: 'application/json'
            },
            data: JSON.stringify(dataValues)
        }

        const response = await axios.request(options);
        console.log("\n\nfrom api file uploadPubData fct", response?.data);
        return response.data;

    } catch (error: any) {
        console.error(`from api file uploadPubData fct. failed creating resource ${resource} : ${error}`);
        throw new AppError(error.message);
    }
}

