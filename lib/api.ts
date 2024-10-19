
// import lib
// import { useSignIn } from '@clerk/clerk-expo';

// import the client library
import { AppError } from '@/utils/error-class';
import { API_URL } from '@/constants/mock-data';
// import { tokenCache } from '@/store/persist-token-cache';
import axios from 'axios';
import { Post, Publication } from '@/lib/types';
import { useSignIn } from '@clerk/clerk-expo';





// getthe current user
export const getCurrentUser = async () => {
    try {

        return null

    } catch (error: any) {

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
        console.log("\n\nfrom api file getAllPublication fct", response?.data);
        return response.data.map((resp: any) => ({
            id: resp.id,
            author: resp.user.username,
            location: resp.data.user.location ?? "",
            content: resp.libelePub ?? "",
            imageUrl: resp.data.imagePub ?? "",
            likes: resp.favories ?? "",
            comments: resp.commentaires ?? "",
            timeAgo: resp.datePub ?? "",
        }))

    } catch (error: any) {
        console.error(`from api file. Error fetching Publication data : ${error}`);
        throw new AppError(error.message);
    }
}

// pull latest videos
export const getSinglePub = async (pub_id: string) => {

    console.log("inside getProjectById fct", pub_id);

    // const token = await tokenCache.getToken("token");
    console.log("from api file API_URL: ", `${API_URL}/projects/${pub_id}`);
    try {

        const options = {
            method: 'GET',
            url: `${API_URL}/projects/${pub_id}`,
            headers: {
                // 'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                Accept: 'application/json'
            },
        }

        const response = await axios.request(options);
        console.log("form api file getProjectById fct:", response?.data);

        return {
            id: response?.data.id,
            author: response?.data.user.username,
            location: response?.data.data.user.location ?? "",
            content: response?.data.libelePub ?? "",
            imageUrl: response?.data.data.imagePub ?? "",
            likes: response?.data.favories ?? "",
            comments: response?.data.commentaires ?? "",
            timeAgo: response?.data.datePub ?? "",
        };
    } catch (error: any) {
        console.error(`from api file. Error fetching project data : ${error}`);
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
            id: cat.idCat,
            author: cat.nomCat,
            type: cat.typeCat,
        }))

    } catch (error: any) {
        console.error(`from api file. Error fetching Publication data : ${error}`);
        throw new AppError(error.message);
    }
}

// store the file and get the url from the bucket.
export const uploadPubData = async (dataValues: Publication) => {

    // const token = await tokenCache.getToken("token");

    try {

        const options = {
            method: 'POST',
            url: `${API_URL}/Categorie`,
            headers: {
                // 'Authorization': `Bearer ${token ?? ""}`,
                'Content-Type': 'application/json',
                Accept: 'application/json'
            },
            data: JSON.stringify(dataValues)
        }

        const response = await axios.request(options);
        console.log("\n\nfrom api file uploadPubData fct", response?.data);
        return response.data.data;

    } catch (error: any) {
        console.error(`from api file. Error creating Publication data : ${error}`);
        throw new AppError(error.message);
    }
}

