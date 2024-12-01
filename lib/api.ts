
// import lib

// import the client library
import { AppError } from '@/utils/error-class';
// import { tokenCache } from '@/store/persist-token-cache';
import axios from 'axios';
import { Jaime, Post, Publication, User } from '@/lib/types';
import { Platform } from 'react-native';
import * as FileSystem from 'expo-file-system';
// appWrite config

import {
    Account,
    Avatars,
    Client,
    Databases,
    ID,
    ImageGravity,
    Query,
    Storage
} from 'react-native-appwrite';
// import { supabase } from '@/utils/supabase';



export const config = {
    endpoint: "https://cloud.appwrite.io/v1",
    platform: "com.avom.AvomReactNativeApp",
    projectId: "66c879ad0013609a2ce8",
    databaseId: '66c87bd900181248590c',
    userCollectionId: '66c87c0100368abc794f',
    videoCollectionId: '66c87c2f002c00ff4ab8',
    storageId: '6717f18b0023c23a8416'
}


// Init your React Native SDK
const client = new Client();

const API_URL = "https://rhysapi.iptvstreamerspro.com/api";

client
    .setEndpoint(config.endpoint) // Your Appwrite Endpoint
    .setProject(config.projectId) // Your project ID
    .setPlatform(config.platform) // Your application ID or bundle ID.
    ;

// Init account instance
const account = new Account(client);
// Init avatar
const avatars = new Avatars(client);
// create instance of DB
const databases = new Databases(client);
// storage
const storage = new Storage(client);

// getthe current user
export const getCurrentUser = async () => {
    try {
        // const currentAccount = await account.get();

        // if (!currentAccount) new AppError("\n\nNo account found");

        const currentUser = await databases.listDocuments(
            config.databaseId,
            config.userCollectionId,
            [Query.equal('accountId', "66d6e445001e3ab12932")],
        );
        console.log("current user appwrite account: ", currentUser)
        if (!currentUser) new AppError("\n\nerror getting current user");
        return currentUser.documents[0];

    } catch (error: any) {
        console.log(`error getting current user`, error);
        throw new Error(error);
    }
}


// returns the url of the file from the bucket
export const getFilePreview = async (fileId: string, type: string) => {
    let fileUrl;
    console.log("fileId: ", fileId);
    try {
        if (type === 'video' || type === 'pdf') {
            fileUrl = storage.getFileView(config.storageId, fileId);
        }
        else if (type === 'image')
            fileUrl = storage.getFilePreview(config.storageId, fileId, 2000, 2000, 'top' as ImageGravity, 100);
        else
            throw new AppError('File type not supported');

        if (!fileUrl) throw new AppError('File not found');
        // return the file url
        return fileUrl;
    } catch (error: any) {
        console.log(` error getting file ${error}`);
        throw new AppError(`Error getting ${error.message}`);
    }
}

// store the file and get the url from the bucket.
export const uploadFile = async (file: any, type: string) => {
    if (!file) return;

    const asset = {
        name: file.fileName,
        type: file.mimeType,
        size: file.fileSize,
        uri: file.uri ?? await FileSystem.readAsStringAsync(file.uri, { encoding: FileSystem.EncodingType.Base64 }),
    }; // to format it in a format understood by appwrite

    try {
        // ID.unique() assigns a unique Id to this file
        const uploadedFile = await storage.createFile(config.storageId, ID.unique(), asset);
        console.log(` uploadedFile file : ${uploadedFile}`);
        const fileUrl = await getFilePreview(uploadedFile?.$id, type);// getFilePreview is a bit different from audio and video.
        return fileUrl;
    } catch (error: any) {
        console.log(` error uploading file ${error?.stack}`);
        throw new AppError(`Error uploading ${error.message}`);
    }
}

// upload video
export const getFileUrlFromProvider = async (asset: {
    name: string,
    type: string,
    size: number,
    uri: string,
}) => {

    // store the files and get the urls.
    try {
        const thumbnailUrl = await uploadFile(asset, 'image');

        return thumbnailUrl;
    } catch (e: any) {
        console.log(`error creating file url link `, e);
        throw new AppError(e.message);
    }
}


// supabase method

// export const uploadFileToSupabase = async (file: any) => {
//     if (!file) return;

//     try {
//         // Log the file details
//         console.log('Uploading file:', file);
//         // Read the file from the local filesystem (fetch it as binary)
//         const response = await fetch(file.uri);
//         const fileBlob = await response.blob(); // Convert the file to a Blob
//         console.log('File Blob:', fileBlob);
//         // Upload the file to a Supabase storage bucket (create the bucket in Supabase first)
//         const { data, error } = await supabase.storage
//             .from('1riche1pauvre') // Replace 'your-bucket-name' with your actual Supabase storage bucket name
//             .upload(`public/${file.name}`, fileBlob, {
//                 contentType: file.type, // Set the content type (e.g., 'application/pdf')
//             });

//         if (error) throw new Error(`File upload failed: ${error.message}`);
//         console.log('Uploaded file:', data);


//         // Get the public URL of the uploaded file
//         const { data: publicURL } = supabase.storage
//             .from('1riche1pauvre')
//             .getPublicUrl(`public/${file.name}`);

//         if (!data) throw new Error(`Error getting file URL`);

//         // Return the public URL for storing in the database
//         return publicURL;
//     } catch (error) {
//         console.log('Error uploading file to Supabase:', error);
//         throw new Error('File upload failed');
//     }
// };


console.log("\n\ndata object: ", {
    API_URL
},)

type TConnect = User;

// getthe current user
export const createUserAccount = async (
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
            username,
            password: mdpUser,
        }
    }
    resouce = endPoint;
    console.log("\n\ndata object: ", {
        dataObj, API_URL: `${API_URL}/${resouce}`
    },
        "resource: ", resouce
    )
    try {

        const options = {
            method: 'POST',
            // url: `${API_URL}/${resouce}`,
            headers: {
                'Content-Type': 'application/json',
            },
            data: dataObj
        }

        // const response = await axios.request(options);
        const data = await fetch(`${API_URL}/${resouce}`, options);
        const response = await data.json();
        console.log("\n\nfrom api file connect fct", response?.data);
        return response?.data
    } catch (error: any) {
        console.error("Failed to connect to app : ", error);
        throw new Error(error);
    }
}


export const updatedUserPwd = async (
    newPassw: string,
    idUser: number
) => {

    const dataObj = {
        mdpUser: newPassw,
    };

    console.log(`${API_URL}/User/${idUser}`);

    try {

        const options = {
            method: 'PUT',
            url: `${API_URL}/User/${idUser}`,
            headers: {
                // 'Authorization': `Bearer ${token ?? ""}`,
                'Content-Type': 'application/json',

            },
            data: JSON.stringify(dataObj)
        }

        // const response = await axios.request(options);
        // console.log("\n\nfrom api file connect fct", response?.data);
        const data = await fetch(`${API_URL}/User/${idUser}`, options);
        const response = await data.json();
        return response
    } catch (error: any) {
        console.error("Failed to connect to app : ", error);
        throw new Error(error);
    }
}

export const getAllResourcesByTarget = async <T>(
    resource: string,
    id?: number,
    target1?: string,
    target2?: string,
    value?: boolean | number
): Promise<T[]> => {
    try {

        const options = {
            method: 'GET',
            // url: `${API_URL}/${resource}?${target1}=${id}&${target2}=${value}`,
            headers: {
                // 'Authorization': `Bearer ${token ?? ""}`,
                'Content-Type': 'application/json',
                Accept: 'application/json'
            },
        }

        // const response = await axios.request(options);
        // console.log("\n\nfrom api file getAllResourcesByTarget fct", response?.data);
        const data = await fetch(`${API_URL}/${resource}?${target1}=${id}&${target2}=${value}`, options);
        const response = await data.json();
        return response;

    } catch (error: any) {
        console.error(`from api file getAllResourcesByTarget fct. Error fetching all resources "${resource}" by id ${id} : ${error}`);
        throw new Error(error);
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
        throw new Error(error);
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
            },
            data: value
        }

        const response = await axios.request(options);
        return response?.data
    } catch (error: any) {
        console.error(`inside updateResource fct on api file. Error updating resource ${resource} with id ${id} : ${error}`);
        throw new Error(error);
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
            idUser: response?.data.idUser,
            idCat: response?.data.idCat,
            statePub: response?.data.etat
        };
        else if (resource.toLocaleLowerCase().includes('categorie'))
            return response.data.map((cat: any) => ({
                id: cat?.idCat,
                idUser: cat?.idUser,
                name: cat?.nomCat,
                type: cat?.typeCat,
            }))
        else return response?.data;

    } catch (error: any) {
        console.error(`inside getSingleResource failed fetching resouce ${resource} with id: ${id} : ${error}`);
        throw new Error(error);
    }
}

// logout

export const getAllCategories = async () => {


    // const token = await tokenCache.getToken("token");
    try {

        const options = {
            method: 'GET',
            // url: `${API_URL}/Categorie`,
            headers: {
                // 'Authorization': `Bearer ${token ?? ""}`,
                'Content-Type': 'application/json',
                Accept: 'application/json'
            },
        }

        // const response = await axios.request(options);
        // console.log("\n\nfrom api file getAllCategories fct", response?.data);
        const data = await fetch(`${API_URL}/Categorie`, options);
        const response = await data.json();

        return response?.map((cat: any) => ({
            id: cat?.idCat,
            idUser: cat?.idUser,
            name: cat?.nomCat,
            type: cat?.typeCat,
        }))

    } catch (error: any) {
        console.error(`from api file getAllCategories ftc. Error fetching Publication data : ${error}`);
        throw new Error(error);
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
        if (response.data)
            return response.data;
        return null;

    } catch (error: any) {
        console.error(`from api file uploadPubData fct. failed creating resource ${resource} : ${error}`);
        throw Error(error);
    }
}

// get a resource by its id
export const getResourceByItsId = async (res_id: number, resource: string) => {

    try {

        const options = {
            method: 'GET',
            url: `${API_URL}/${resource}/${res_id}`,
            headers: {
                // 'Authorization': `Bearer ${token ?? ""}`,
                'Content-Type': 'application/json',
                Accept: 'application/json'
            },

        }

        const response = await axios.request(options);
        console.log("\n\nfrom api file getResourceByItsId fct", response?.data);
        return response.data;

    } catch (error: any) {
        console.error(`from api file getResourceByItsId fct. failed to fetch a resource ${resource} by its id ${res_id} : ${error}`);
        throw Error(error);
    }
}
/**
 * cm3om1qc10003c82uh2tbwuqd
 */