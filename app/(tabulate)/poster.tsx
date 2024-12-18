import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, TextInput, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import useApiOps from '@/hooks/use-api';
import { Category, Publication } from '@/lib/types';
import { getAllCategories, getCurrentUser, getFileUrlFromProvider, uploadResourceData, } from '@/lib/api';
import { SelectItem } from '@/components/picker';
import * as ImagePicker from "expo-image-picker";
import { useForm } from 'react-hook-form';
// import { Video, ResizeMode } from "expo-av";
import { icons } from '@/constants';
import * as DocumentPicker from 'expo-document-picker';
import useUserGlobal from '@/hooks/use-user-hook';
import Constants from "expo-constants";


const initialFormState: Publication = {
    datePub: new Date().toISOString(),
    etat: false, // null works for iOS, undefined  work for Android.
    favories: false,
    idCat: undefined,
    idUser: undefined,
    imagePub: '',
    libelePub: '',
    videoPub: undefined,
    montantEstime: 0,
    documentUrl: '',
};

const CreatePostScreen: React.FC = () => {

    const [form, setForm] = useState(initialFormState);
    const [currentCat, setCurrentCat] = useState<Category>();
    const { control, handleSubmit } = useForm<Publication>();
    const { currentUser } = useUserGlobal()
    const [uploading, setUploading] = useState(false);
    const mounted = useRef(false)
    const {
        data: categories,
        refetch: refetchCategories,
        isLoading
    } = useApiOps<Category[]>(() => {
        if (mounted.current)
            return getAllCategories()
        return Promise.resolve([]);
    });


    useEffect(() => {
        mounted.current = true;
        if (!categories?.length)
            refetchCategories();

        (async () => {
            if (Constants.platform && Constants.platform.ios) {
                const cameraRollStatus =
                    await ImagePicker.requestMediaLibraryPermissionsAsync();
                const cameraStatus = await ImagePicker.requestCameraPermissionsAsync();
                if (
                    cameraRollStatus.status !== "granted" ||
                    cameraStatus.status !== "granted"
                ) {
                    alert("Sorry, we need these permissions to make this work!");
                }
            }
            await getCurrentUser()
        })();


    }, []);

    console.log("\n\n current cat: ", currentCat);

    const onSubmit = async (data: Publication) => {
        setUploading(true);
        const imgUrl = await getFileUrlFromProvider(form?.imagePub);
        console.log("imgUrl uploaded: ", imgUrl,)
        const { videoPub, documentUrl, ...res } = form;
        // const docUrl = await uploadFileToSupabase(form?.documentUrl);
        const formData = {
            // ...res,
            idUser: Number(currentUser?.IdUser),
            idCat: currentCat?.id,
            imagePub: imgUrl,
            datePub: new Date().toISOString(),
            libelePub: res.libelePub,
            etat: false,

        }

        console.log("object to be uploaded: ", formData,)
        // try {
        //     console.log("form data: ", formData);
        //     const result = await uploadResourceData(formData, "Publication");
        //     if (typeof result != 'undefined')
        //         console.log("from poster file result: ", result);
        // } catch (error) {
        //     console.error("upload publication  error: ", error);
        // } finally {
        //     setUploading(false);
        // }
        const result = await uploadResourceData(formData, "Publication");

        Alert.alert('Success', `publication creee avec success!`);
        setUploading(false);
    };
    0
    const onPicker = async (selectType: string) => {
        // you can select multiple images and videos
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes:
                selectType === "image"
                    ? ImagePicker.MediaTypeOptions.Images
                    : ImagePicker.MediaTypeOptions.Videos,
            allowsEditing: true, // now allow editing file.
            aspect: [4, 3],
            quality: 1,
            base64: true,
        });

        if (!result.canceled) {
            console.log("image uploaded: ", result.assets[0])
            const base64 = `data:image/png;base64,${result.assets[0].base64}`;
            if (selectType === "image") {
                setForm({ ...form, imagePub: result.assets[0] });
            }
            // if (selectType === "video") {
            //     setForm({ ...form, videoPub: result.assets[0].uri });
            // }
        }
    };

    const handleDocumentUpload = async () => {
        const result = await DocumentPicker.getDocumentAsync({
            type: 'application/pdf'
        });

        if (!result.canceled) {
            const file = {
                uri: result.assets[0].uri,
                name: result.assets[0].name,
                type: result.assets[0].mimeType || 'application/pdf',
            };
            console.log("document uploaded: ", file)
            setForm(prev => ({ ...prev, documentUrl: file }));
        }
    };

    return (
        < >
            <ScrollView className=" flex-1 bg-gray-900 px-4 py-2">
                <Text className="text-white text-xl font-bold mb-4">Créer une publication</Text>

                <View className='mb-20'>


                    <View className="flex-row items-center mb-4">
                        <Image source={{ uri: 'https://unsplash.com/photos/-F9NSTwlnjo/download?ixid=M3wxMjA3fDB8MXxzZWFyY2h8MTl8fGNoYXJpdHl8ZW58MHx8fHwxNzI4MzIxOTIxfDA&force=true' }} className="w-10 h-10 rounded-full mr-2" />
                        <Text className="text-white">{currentUser?.name}</Text>
                    </View>
                    <TouchableOpacity className="bg-gray-800 p-2 rounded mb-4 w-fit">
                        <Text className="text-white">Publique ▼</Text>
                    </TouchableOpacity>
                    <SelectItem options={categories} setCurrentCat={setCurrentCat} />

                    <TextInput
                        placeholder="Décrivez votre souhait..."
                        placeholderTextColor="gray"
                        className="bg-gray-800 p-2 rounded text-white mb-4"
                        multiline
                        value={form.libelePub}
                        onChangeText={(text) => setForm({ ...form, libelePub: text })}
                    />

                    <Text className="text-white mr-2">Estimation (cout)</Text>
                    <View className='flex-row w-full rounded
                justify-between items-center
                 bg-gray-800 pr-2 my-2 '>
                        <TextInput
                            placeholder="estimation..."
                            placeholderTextColor="#f1f1f1"
                            className="bg-transparent
                     p-2 rounded w-[80%]
                      text-white 
                     h-100"
                            keyboardType="numeric"
                            value={form.montantEstime as string}
                            onChangeText={(text) => setForm({ ...form, montantEstime: parseInt(text) })}
                        />
                        <Text className="text-white ml-2">€</Text>
                    </View>

                    <View className="flex mb-4 gap-3">

                        <TouchableOpacity
                            onPress={() => onPicker("image")}
                            className="bg-gray-900 p-4 
                        rounded-xl border-blue-400 border-0.5"
                        >
                            {form.imagePub ? (
                                // <></>
                                <Image
                                    source={{ uri: form.imagePub.uri }} // uri is used for non local images.
                                    className="w-full h-36 rounded-xl mt-3"
                                    resizeMode="cover"
                                />
                            ) : (
                                <View className="w-full h-16 p-4 bg-black-100/60 
                            rounded-lg justify-center items-center
                             border-2 border-black-200 flex-row space-x-2"
                                >
                                    <Image
                                        source={icons.upload}
                                        resizeMode="contain"
                                        className="w-5 h-5"
                                    />
                                    <Text className="text-sm text-gray-100 font-pmedium">
                                        Choose a file
                                    </Text>
                                </View>
                            )}
                            <Text className="text-white">Images</Text>
                        </TouchableOpacity>

                    </View>
                    {/* <TouchableOpacity className="bg-gray-800 p-2 rounded mb-4 flex-row gap-2 items-center "
                        onPress={handleDocumentUpload} >

                        <Ionicons name="add-circle-outline" size={30} color="white" />
                        <Text className="text-white/70" > Insérer un document</Text>
                    </TouchableOpacity> */}
                    {form.documentUrl && (
                        <View className='flex-row items-center gap-1 my-2'>
                            <Text className="text-white/70 text-sm mb-1">
                                Document uploaded

                            </Text>
                            <Ionicons name='document' size={20} color='white' />
                        </View>
                    )}
                    <TouchableOpacity
                        className="bg-blue-500 p-3 rounded"
                        onPress={handleSubmit(onSubmit)}
                    >
                        {uploading ? <ActivityIndicator size="small" color="white" /> : <Text className="text-white text-center font-bold">PUBLIER</Text>}
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </>

    );
};
export default CreatePostScreen;
// frckbrice@484?