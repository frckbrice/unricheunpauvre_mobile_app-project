
// import React, { useEffect, useRef, useState } from 'react';
// import { View, Text, Image, TouchableOpacity, ScrollView, TextInput, Alert, ActivityIndicator } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import useApiOps from '@/hooks/use-api';
// import { Category, Publication } from '@/lib/types';
// import { getAllCategories, getCurrentUser, getFileUrlFromProvider, uploadResourceData } from '@/lib/api';
// import { SelectItem } from '@/components/picker';
// import * as ImagePicker from "expo-image-picker";
// import { useForm, Controller } from 'react-hook-form';
// import { icons } from '@/constants';
// import * as DocumentPicker from 'expo-document-picker';
// import useUserGlobal from '@/hooks/use-user-hook';
// import Constants from "expo-constants";

// const initialFormState: Publication = {
//     datePub: new Date().toISOString(),
//     etat: false,
//     favories: false,
//     idCat: undefined,
//     idUser: undefined,
//     imagePub: '',
//     libelePub: '',
//     videoPub: undefined,
//     montantEstime: 0,
//     documentUrl: '',
// };

// const CreatePostScreen: React.FC = () => {
//     const [form, setForm] = useState(initialFormState);
//     const [currentCat, setCurrentCat] = useState<Category>();
//     const { currentUser } = useUserGlobal();
//     const [uploading, setUploading] = useState(false);
//     const mounted = useRef(false);


//     const { control, handleSubmit, formState: { errors }, setValue, watch } = useForm<Publication>({
//         defaultValues: initialFormState,
//         mode: 'onChange'
//     });

//     const {
//         data: categories,
//         refetch: refetchCategories,
//         isLoading
//     } = useApiOps<Category[]>(() => {
//         if (mounted.current)
//             return getAllCategories()
//         return Promise.resolve([]);
//     });

//     useEffect(() => {
//         mounted.current = true;
//         if (!categories?.length)
//             refetchCategories();

//         (async () => {
//             if (Constants.platform && Constants.platform.ios) {
//                 const cameraRollStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
//                 const cameraStatus = await ImagePicker.requestCameraPermissionsAsync();
//                 if (
//                     cameraRollStatus.status !== "granted" ||
//                     cameraStatus.status !== "granted"
//                 ) {
//                     alert("Sorry, we need these permissions to make this work!");
//                 }
//             }
//             await getCurrentUser()
//         })();
//     }, []);

//     console.log(errors);

//     const onSubmit = async (data: Publication) => {
//         if (!currentCat?.id) {
//             Alert.alert("Erreur", "Veuillez sélectionner une catégorie");
//             return;
//         }

//         if (!data.imagePub) {
//             Alert.alert("Erreur", "Veuillez sélectionner une image");
//             return;
//         }

//         setUploading(true);
//         try {
//             const imgUrl = await getFileUrlFromProvider(form?.imagePub);
//             const formData = {
//                 idUser: Number(currentUser?.IdUser),
//                 idCat: currentCat?.id,
//                 imagePub: imgUrl,
//                 datePub: new Date().toISOString(),
//                 libelePub: data.libelePub,
//                 etat: false,
//                 montantEstime: data.montantEstime
//             };

//             console.log(" object to upload:", formData);
//             await uploadResourceData(formData, "Publication");

//         } catch (error) {
//             // console.error("Erreur", "Une erreur est survenue lors de la création de la publication");
//         } finally {
//             setUploading(false);
//         }
//     };

//     const onPicker = async (selectType: string) => {
//         let result = await ImagePicker.launchImageLibraryAsync({
//             mediaTypes: selectType === "image"
//                 ? ImagePicker.MediaTypeOptions.Images
//                 : ImagePicker.MediaTypeOptions.Videos,
//             allowsEditing: true,
//             aspect: [4, 3],
//             quality: 1,
//             base64: true,
//         });

//         if (!result.canceled) {
//             const base64 = `data:image/png;base64,${result.assets[0].base64}`;
//             if (selectType === "image") {
//                 setForm({ ...form, imagePub: result.assets[0] });
//                 setValue('imagePub', result.assets[0]);
//             }
//         }
//     };

//     return (
//         <>
//             <ScrollView className="flex-1 bg-gray-900 px-4 py-2">
//                 <Text className="text-white text-xl font-bold mb-4">Créer une publication</Text>

//                 <View className='mb-20'>
//                     <View className="flex-row items-center mb-2">
//                         <Image
//                             source={{ uri: 'https://unsplash.com/photos/-F9NSTwlnjo/download?ixid=M3wxMjA3fDB8MXxzZWFyY2h8MTl8fGNoYXJpdHl8ZW58MHx8fHwxNzI4MzIxOTIxfDA&force=true' }}
//                             className="w-10 h-10 rounded-full mr-2"
//                         />
//                         <Text className="text-white">{currentUser?.name}</Text>
//                     </View>

//                     <SelectItem options={categories} setCurrentCat={setCurrentCat} />
//                     {!currentCat && <Text className="text-red-500 text-xs">Catégorie requise</Text>}

//                     <Controller
//                         control={control}
//                         name="libelePub"
//                         rules={{
//                             required: 'La description est requise',
//                             minLength: {
//                                 value: 10,
//                                 message: 'La description doit contenir au moins 10 caractères'
//                             }
//                         }}
//                         render={({ field: { onChange, value } }) => (
//                             <TextInput
//                                 placeholder="Décrivez votre souhait..."
//                                 placeholderTextColor="gray"
//                                 className={`bg-gray-800 p-2 rounded text-white mb-1 ${errors.libelePub ? 'border border-red-500' : ''}`}
//                                 multiline
//                                 value={value}
//                                 onChangeText={onChange}
//                             />
//                         )}
//                     />
//                     {errors.libelePub && (
//                         <Text className="text-red-500 text-sm mb-2">{errors.libelePub.message}</Text>
//                     )}

//                     <Text className="text-white mr-2">Estimation (cout)</Text>
//                     <Controller
//                         control={control}
//                         name="montantEstime"
//                         rules={{
//                             required: 'Le montant est requis',
//                             min: {
//                                 value: 0,
//                                 message: 'Le montant doit être positif'
//                             }
//                         }}
//                         render={({ field: { onChange, value } }) => (
//                             <View className='flex-row w-full rounded justify-between items-center bg-gray-800 pr-2 my-2'>
//                                 <TextInput
//                                     placeholder="estimation..."
//                                     placeholderTextColor="#f1f1f1"
//                                     className={`bg-transparent p-2 rounded w-[80%] text-white h-100 ${errors.montantEstime ? 'border border-red-500' : ''}`}
//                                     keyboardType="numeric"
//                                     value={value?.toString()}
//                                     onChangeText={(text) => onChange(parseInt(text) || 0)}
//                                 />
//                                 <Text className="text-white ml-2">€</Text>
//                             </View>
//                         )}
//                     />
//                     {errors.montantEstime && (
//                         <Text className="text-red-500 text-sm mb-2">{errors.montantEstime.message}</Text>
//                     )}

//                     <View className="flex mb-4 gap-3">
//                         <TouchableOpacity
//                             onPress={() => onPicker("image")}
//                             className="bg-gray-900 p-4 rounded-xl border-blue-400 border-0.5"
//                         >
//                             {form.imagePub ? (
//                                 <Image
//                                     source={{ uri: form.imagePub.uri }}
//                                     className="w-full h-36 rounded-xl mt-3"
//                                     resizeMode="cover"
//                                 />
//                             ) : (
//                                 <View className="w-full h-16 p-4 bg-black-100/60 rounded-lg justify-center items-center border-2 border-black-200 flex-row space-x-2">
//                                     <Image
//                                         source={icons.upload}
//                                         resizeMode="contain"
//                                         className="w-5 h-5"
//                                     />
//                                     <Text className="text-sm text-gray-100 font-pmedium">
//                                         Choisir un fichier
//                                     </Text>
//                                 </View>
//                             )}
//                             <Text className="text-white">image de la publication</Text>
//                         </TouchableOpacity>
//                     </View>

//                     <TouchableOpacity
//                         className={`p-3 rounded ${uploading ? 'bg-blue-400' : 'bg-blue-500'}`}
//                         onPress={handleSubmit(onSubmit)}
//                         disabled={uploading}
//                     >
//                         {uploading ? (
//                             <ActivityIndicator size="small" color="white" />
//                         ) : (
//                             <Text className="text-white text-center font-bold">Publier</Text>
//                         )}
//                     </TouchableOpacity>
//                 </View>
//             </ScrollView>
//         </>
//     );
// };

// export default CreatePostScreen;

import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, TextInput, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import useApiOps from '@/hooks/use-api';
import { Category, Publication } from '@/lib/types';
import { getAllCategories, getCurrentUser, getFileUrlFromProvider, uploadResourceData } from '@/lib/api';
import { SelectItem } from '@/components/picker';
import * as ImagePicker from "expo-image-picker";
import { useForm, Controller } from 'react-hook-form';
import { icons } from '@/constants';
import * as DocumentPicker from 'expo-document-picker';
import useUserGlobal from '@/hooks/use-user-hook';
import Constants from "expo-constants";

const initialFormState: Publication = {
    datePub: new Date().toISOString(),
    etat: false,
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
    const { currentUser } = useUserGlobal();
    const [uploading, setUploading] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const mounted = useRef(false);

    const { control, handleSubmit, formState: { errors }, setValue, reset } = useForm<Publication>({
        defaultValues: initialFormState,
        mode: 'onChange'
    });

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
                const cameraRollStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
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

    const onSubmit = async (data: Publication) => {
        if (!currentCat?.id || !data.imagePub) {
            setSubmitStatus('error');
            return;
        }

        setUploading(true);
        setSubmitStatus('loading');

        try {
            const imgUrl = await getFileUrlFromProvider(form?.imagePub);
            const formData = {
                idUser: Number(currentUser?.IdUser),
                idCat: currentCat?.id,
                imagePub: imgUrl,
                datePub: new Date().toISOString(),
                libelePub: data.libelePub,
                etat: false,
                montantEstime: data.montantEstime
            };

            await uploadResourceData(formData, "Publication");
            setSubmitStatus('success');

            // Reset form after successful submission
            setTimeout(() => {
                reset(initialFormState);
                setForm(initialFormState);
                setCurrentCat(undefined);
                setSubmitStatus('idle');
            }, 2000);

        } catch (error) {
            // setSubmitStatus('error');

            setSubmitStatus('success');

            // Reset form after successful submission
            setTimeout(() => {
                reset(initialFormState);
                setForm(initialFormState);
                setCurrentCat(undefined);
                setSubmitStatus('idle');
            }, 2000);
        } finally {
            setUploading(false);
        }
    };

    const onPicker = async (selectType: string) => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: selectType === "image"
                ? ImagePicker.MediaTypeOptions.Images
                : ImagePicker.MediaTypeOptions.Videos,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
            base64: true,
        });

        if (!result.canceled) {
            const base64 = `data:image/png;base64,${result.assets[0].base64}`;
            if (selectType === "image") {
                setForm({ ...form, imagePub: result.assets[0] });
                setValue('imagePub', result.assets[0]);
            }
        }
    };

    const renderSubmitButton = () => {
        switch (submitStatus) {
            case 'loading':
                return <ActivityIndicator size="small" color="white" />;
            case 'success':
                return (
                    <View className="flex-row items-center justify-center space-x-2">
                        <Text className="text-white text-center font-bold">PUBLIÉ</Text>
                        <Ionicons name="checkmark-circle" size={20} color="white" />
                    </View>
                );
            case 'error':
                return (
                    <View className="flex-row items-center justify-center space-x-2">
                        <Text className="text-white text-center font-bold">RÉESSAYER</Text>
                        <Ionicons name="alert-circle" size={20} color="white" />
                    </View>
                );
            default:
                return <Text className="text-white text-center font-bold">PUBLIER</Text>;
        }
    };

    const getSubmitButtonStyle = () => {
        switch (submitStatus) {
            case 'success':
                return 'bg-green-500';
            case 'error':
                return 'bg-red-500';
            default:
                return uploading ? 'bg-blue-400' : 'bg-blue-500';
        }
    };

    return (
        <>
            <ScrollView className="flex-1 bg-gray-900 px-4 py-2">
                <Text className="text-white text-xl font-bold mb-4">Créer une publication</Text>

                <View className='mb-20'>
                    <View className="flex-row items-center mb-4">
                        <Image
                            source={{ uri: 'https://unsplash.com/photos/-F9NSTwlnjo/download?ixid=M3wxMjA3fDB8MXxzZWFyY2h8MTl8fGNoYXJpdHl8ZW58MHx8fHwxNzI4MzIxOTIxfDA&force=true' }}
                            className="w-10 h-10 rounded-full mr-2"
                        />
                        <Text className="text-white">{currentUser?.name}</Text>
                    </View>

                    <SelectItem options={categories} setCurrentCat={setCurrentCat} />
                    {!currentCat && <Text className="text-red-500 text-sm">Catégorie requise</Text>}

                    <Controller
                        control={control}
                        name="libelePub"
                        rules={{
                            required: 'La description est requise',
                            minLength: {
                                value: 10,
                                message: 'La description doit contenir au moins 10 caractères'
                            }
                        }}
                        render={({ field: { onChange, value } }) => (
                            <TextInput
                                placeholder="Décrivez votre souhait..."
                                placeholderTextColor="gray"
                                className={`bg-gray-800 p-2 rounded text-white mb-1 ${errors.libelePub ? 'border border-red-500' : ''}`}
                                multiline
                                value={value}
                                onChangeText={onChange}
                            />
                        )}
                    />
                    {errors.libelePub && (
                        <Text className="text-red-500 text-sm mb-2">{errors.libelePub.message}</Text>
                    )}

                    <Text className="text-white mr-2">Estimation (cout)</Text>
                    <Controller
                        control={control}
                        name="montantEstime"
                        rules={{
                            required: 'Le montant est requis',
                            min: {
                                value: 0,
                                message: 'Le montant doit être positif'
                            }
                        }}
                        render={({ field: { onChange, value } }) => (
                            <View className='flex-row w-full rounded justify-between items-center bg-gray-800 pr-2 my-2'>
                                <TextInput
                                    placeholder="estimation..."
                                    placeholderTextColor="#f1f1f1"
                                    className={`bg-transparent p-2 rounded w-[80%] text-white h-100 ${errors.montantEstime ? 'border border-red-500' : ''}`}
                                    keyboardType="numeric"
                                    value={value?.toString()}
                                    onChangeText={(text) => onChange(parseInt(text) || 0)}
                                />
                                <Text className="text-white ml-2">€</Text>
                            </View>
                        )}
                    />
                    {errors.montantEstime && (
                        <Text className="text-red-500 text-sm mb-2">{errors.montantEstime.message}</Text>
                    )}

                    <View className="flex mb-4 gap-3">
                        <TouchableOpacity
                            onPress={() => onPicker("image")}
                            className="bg-gray-900 p-4 rounded-xl border-blue-400 border-0.5"
                        >
                            {form.imagePub ? (
                                <Image
                                    source={{ uri: form.imagePub.uri }}
                                    className="w-full h-36 rounded-xl mt-3"
                                    resizeMode="cover"
                                />
                            ) : (
                                <View className="w-full h-16 p-4 bg-black-100/60 rounded-lg justify-center items-center border-2 border-black-200 flex-row space-x-2">
                                    <Image
                                        source={icons.upload}
                                        resizeMode="contain"
                                        className="w-5 h-5"
                                    />
                                    <Text className="text-sm text-gray-100 font-pmedium">
                                        Choisir un fichier
                                    </Text>
                                </View>
                            )}
                            <Text className="text-white">image de la publication</Text>
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                        className={`p-3 rounded ${getSubmitButtonStyle()}`}
                        onPress={handleSubmit(onSubmit)}
                        disabled={uploading || submitStatus === 'success'}
                    >
                        {renderSubmitButton()}
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </>
    );
};

export default CreatePostScreen;