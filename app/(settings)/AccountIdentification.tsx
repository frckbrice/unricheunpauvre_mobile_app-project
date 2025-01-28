import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { User } from '@/lib/types';
import { getCurrentUser, getFileUrlFromProvider, patchResource, updateResource } from '@/lib/api';
import useUserGlobal from '@/hooks/use-user-hook';
import { API_URL } from '@/constants/constants';

interface UploadedFile {
    uri?: string;
    //   type: string;
    //   name: string;
    editProfile?: boolean;
    classname?: string;
    getIdData: (data: any, fileType: "idFront" | "idBack" | "passport") => void
}

const AccountIdentificationScreen: React.FC<UploadedFile> = ({ editProfile,
    getIdData
}) => {
    const router = useRouter();
    const [showIdOptions, setShowIdOptions] = useState(false);
    const [files, setFiles] = useState<{
        idFront?: any;
        idBack?: any;
        passport?: any;
    }>({});

    const [isUploading, setUploading] = useState(false);
    const [idF, setIdf] = useState("");
    const [idB, setIdB] = useState("");

    const { currentUser } = useUserGlobal();

    const pickImage = async (fileType: 'idFront' | 'idBack' | 'passport') => {
        // Request permissions
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (permissionResult.granted === false) {
            Alert.alert('Permission requise', 'Vous devez allouer des droits d\'access a votre camera.');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: false,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setFiles(prev => ({
                ...prev,
                [fileType]: result.assets[0],
            }));

        }
    };

    const handleSubmit = async () => {
        setUploading(true)
        try {
            // Create FormData instance
            const formData = new FormData();
            let userData: any = {};
            let idFrontUrl, idBackUrl, passportUrl;
            if (files.idFront && files.idBack) {
                // get the url link from appWrite
                const [idFront, idBack] = await Promise.all([
                    getFileUrlFromProvider(files.idFront),
                    getFileUrlFromProvider(files.idBack),
                ])
                idFrontUrl = idFront || "";
                idBackUrl = idBack || "";
            }

            if (files?.passport)
                passportUrl = await getFileUrlFromProvider(files.passport)

            if (files.idFront && files.idBack)
                userData = {
                    idUser: currentUser?.userId,
                    idFront: idFrontUrl,
                    idBack: idBackUrl,
                }
            else if (files.passport)
                userData = {
                    idUser: currentUser?.userId,
                    passport: passportUrl,
                    idBack: null
                }
            else return;

            const dataObj = {
                // nomUser: name ?? currentUser?.name,
                // username: username ?? currentUser?.username,
                // localisation: city,
                pieceIdf: !(files.idFront && files.idBack) ? passportUrl : idFrontUrl || idF,
                pieceIdb: files.idBack ? idBackUrl : idB,
                // etatUser: etatuser || false,
                // dateNaiss: dateNaiss,
                // photoUser: userImg,
                // mdpUser: motPwd,
                // dateCrea: new Date(Date.now()).toISOString(),
            };

            console.log("\n\n object to load: ", dataObj);

            if ((!dataObj.pieceIdb && !dataObj.pieceIdf) || currentUser?.userId)
                return console.error(`no ${dataObj.pieceIdf} or ${currentUser?.userId} found`);


            const result = await patchResource(
                'users',
                currentUser?.IdUser,
                dataObj,
            );
            Alert.alert('Success', 'Profile mis a jour avec succes!');
            router.push('/(tabulate)/profile');
        } catch (err) {
            console.error(JSON.stringify(err, null, 2));
        } finally {
            setUploading(false);
        }
    };

    const renderFilePreview = (file?: UploadedFile) => {
        if (!file) return null;
        return (
            <Image
                source={{ uri: file.uri }}
                className="w-20 h-20 rounded-lg mt-2"
                resizeMode="cover"
            />
        );
    };

    return (
        <SafeAreaView className="flex-1 bg-gray-900 p-4">
            <ScrollView>
                {!editProfile ? <View className="flex-row items-center mb-6">
                    <TouchableOpacity onPress={() => router.replace('/(settings)/parameters')}>
                        <Ionicons name="arrow-back" size={24} color="white" />
                    </TouchableOpacity>
                    <Text className="text-white text-xl font-bold ml-4">Identification de compte</Text>
                </View> : null}

                <Text className={editProfile ? "text-white text-[12px] mb-4" : "text-white text-lg mb-6"}>Choisissez une option et identifiez-vous</Text>

                <TouchableOpacity
                    className="bg-gray-800 rounded-lg p-4 mb-4"
                    onPress={() => setShowIdOptions(!showIdOptions)}
                >
                    <Text className={editProfile ? "text-white text-[12px] text-center w-full" : "text-white text-lg"}>Pièce Nationale D'identité</Text>
                    {showIdOptions && (
                        <View className="mt-4">
                            <TouchableOpacity
                                className="bg-gray-700 p-3 rounded-lg mb-2"
                                onPress={() => pickImage('idFront')}
                            >
                                <Text className="text-white">Recto de la carte</Text>
                                {renderFilePreview(files.idFront)}
                            </TouchableOpacity>

                            <TouchableOpacity
                                className="bg-gray-700 p-3 rounded-lg"
                                onPress={() => pickImage('idBack')}
                            >
                                <Text className="text-white">Verso de la carte</Text>
                                {renderFilePreview(files.idBack)}
                            </TouchableOpacity>
                        </View>
                    )}
                </TouchableOpacity>

                {!showIdOptions && <TouchableOpacity
                    className={`bg-gray-800 rounded-lg p-4 mb-6 ${editProfile ? "p-2 flex justify-center items-center text-[12px]" : ""}`}
                    onPress={() => pickImage('passport')}
                >
                    <Text className={editProfile ? "text-white text-sm w-full" : "text-white text-lg"}>Passeport</Text>
                    {renderFilePreview(files.passport)}
                </TouchableOpacity>}


                {(files.passport || (files.idFront && files.idBack)) && (
                    <TouchableOpacity
                        className="bg-blue-500 rounded-lg p-4"
                        onPress={handleSubmit}
                    >
                        {isUploading ? <ActivityIndicator size="small" color="white" /> : <Text className="text-white text-lg text-center">Soumettre</Text>}
                    </TouchableOpacity>
                )}
            </ScrollView>
        </SafeAreaView>
    );
};

export default AccountIdentificationScreen;