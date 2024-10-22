import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import useApiOps from '@/hooks/use-api';
import { Category, Publication } from '@/lib/types';
import { getAllCategories, uploadResourceData, } from '@/lib/api';
import { SelectItem } from '@/components/picker';
import * as ImagePicker from "expo-image-picker";
import { useForm, Controller } from 'react-hook-form';
import { Video, ResizeMode } from "expo-av";
import { icons } from '@/constants';
import * as DocumentPicker from 'expo-document-picker';


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

    const {
        data: categories,
        refetch: refetchCategories,
        isLoading
    } = useApiOps<Category[]>(getAllCategories);

    useEffect(() => {
        if (!categories?.length)
            refetchCategories();
    }, []);

    const onSubmit = async (data: Publication) => {
        const formData = {
            ...form,
            idCat: Number(currentCat?.id),
        }
        console.log("from data: ", formData);
        const result = await uploadResourceData(formData, "Publication",);
        console.log("from poster file result: ", result);
    };

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
            const base64 = `data:image/png;base64,${result.assets[0].base64}`;
            if (selectType === "image") {
                setForm({ ...form, imagePub: base64 });
            }
            if (selectType === "video") {
                setForm({ ...form, videoPub: result.assets[0].uri });
            }
        }
    };

    const handleDocumentUpload = async () => {
        const result = await DocumentPicker.getDocumentAsync({ type: 'application/pdf' });

        if (!result.canceled) {
            setForm(prev => ({ ...prev, documentUrl: result.assets[0].uri }));
        }
    };


    return (
        <ScrollView className="flex-1 bg-gray-900 p-4">
            {/* <Text className="text-white text-xl font-bold mb-4">Créer une publication</Text> */}
            <View className="flex-row items-center mb-4">
                <Image source={{ uri: 'https://unsplash.com/photos/-F9NSTwlnjo/download?ixid=M3wxMjA3fDB8MXxzZWFyY2h8MTl8fGNoYXJpdHl8ZW58MHx8fHwxNzI4MzIxOTIxfDA&force=true' }} className="w-10 h-10 rounded-full mr-2" />
                <Text className="text-white">un riche un pauvre</Text>
            </View>
            <TouchableOpacity className="bg-gray-800 p-2 rounded mb-4 w-fit">
                <Text className="text-white">Publique ▼</Text>
            </TouchableOpacity>
            <SelectItem options={categories} setCurrentCat={setCurrentCat} />
            {/* <TouchableOpacity className="bg-gray-800 p-2 rounded mb-4">
                <Text className="text-white">Choisir une catégorie ▼</Text>
            </TouchableOpacity> */}
            <TextInput
                placeholder="Décrivez votre souhait..."
                placeholderTextColor="gray"
                className="bg-gray-800 p-2 rounded text-white mb-4"
                multiline
                value={form.libelePub}
                onChangeText={(text) => setForm({ ...form, libelePub: text })}
            />
            <View className="flex  mb-4 gap-2">
                <Text className="text-white mr-2">Estimation</Text>
                <TextInput
                    placeholder="Exemple: 150 €"
                    placeholderTextColor="gray"
                    className="bg-gray-800 p-2 rounded text-white flex-1"
                    keyboardType="numeric"
                    value={form.montantEstime?.toString()}
                    onChangeText={(text) => setForm({ ...form, montantEstime: parseInt(text) })}
                />
                {/* <Text className="text-white ml-2">€</Text> */}
            </View>
            <View className="flex-row mb-4 gap-3">
                {/* <TouchableOpacity className="bg-gray-900 px-4 py-1 rounded-3xl border-blue-400 border-2">
                    <Text className="text-white">Images</Text>
                </TouchableOpacity> */}
                <TouchableOpacity onPress={() => onPicker("image")} className="bg-gray-900 px-4 py-1 rounded-3xl border-blue-400 border-2">
                    {form.imagePub ? (
                        <Image
                            source={{ uri: form.imagePub.uri }} // uri is used for non local images.
                            className="w-full h-full rounded-xl mt-3"
                            resizeMode="cover"
                        />
                    ) : (
                        <View className="w-full h-16 px-4 bg-black-100/60 rounded-2xl justify-center items-center border-2 border-black-200 flex-row space-x-2">
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
                {/* <TouchableOpacity className="bg-gray-900 px-4 py-1 rounded-3xl border-blue-400 border-2">
                    <Text className="text-white">Vidéos</Text>
                </TouchableOpacity> */}
                <TouchableOpacity onPress={() => onPicker("video")} className="bg-gray-900 px-4 py-1 rounded-3xl border-blue-400 border-2">
                    {form.videoPub ? (
                        <Video
                            source={{ uri: form.videoPub.uri }}
                            className="w-full h-64 rounded-2xl"
                            useNativeControls
                            resizeMode={ResizeMode.COVER}
                        // isLooping
                        />
                    ) : (
                        <View className="w-full h-40 px-4 bg-black-100/60 rounded-2xl justify-center items-center ">
                            <View className="w-14 h-14 border border-secondary-100  justify-center items-center ">
                                <Image
                                    source={icons.upload}
                                    resizeMode="contain"
                                    className="w-1/2 h-1/2"
                                />
                            </View>
                        </View>
                    )}
                    <Text className="text-white">Vidéos</Text>
                </TouchableOpacity>
            </View>
            <TouchableOpacity className="bg-gray-800 p-2 rounded mb-4 flex-row gap-2 items-center " onPress={handleDocumentUpload} >

                <Ionicons name="add-circle-outline" size={30} color="white" />
                <Text className="text-white" > Insérer un document</Text>
            </TouchableOpacity>
            {form.documentUrl && <Text className="text-green-600">Report uploaded</Text>}
            <TouchableOpacity
                className="bg-blue-500 p-3 rounded"
                onPress={handleSubmit(onSubmit)}
            >
                <Text className="text-white text-center font-bold">PUBLIER</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

export default CreatePostScreen;
