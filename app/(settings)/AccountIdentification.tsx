import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { User } from '@/lib/types';
import { getCurrentUser, getFileUrlFromProvider, updateResource } from '@/lib/api';
import useUserGlobal from '@/hooks/use-user-hook';

interface UploadedFile {
    uri: string;
    //   type: string;
    //   name: string;
}

const AccountIdentificationScreen: React.FC = () => {
    const router = useRouter();
    const [showIdOptions, setShowIdOptions] = useState(false);
    const [files, setFiles] = useState<{
        idFront?: any;
        idBack?: any;
        passport?: any;
    }>({});

    const { currentUser } = useUserGlobal()

    useEffect(() => {
        (
            async () => {
                return await getCurrentUser();
            }
        )();
    }, [])

    const pickImage = async (fileType: 'idFront' | 'idBack' | 'passport') => {
        // Request permissions
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (permissionResult.granted === false) {
            Alert.alert('Permission Required', 'You need to enable permission to access your photos');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: false,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            const newFile = {
                uri: result.assets[0].uri,
                // type: 'image/jpeg',
                // name: `${fileType}_${Date.now()}.jpg`,
            };

            setFiles(prev => ({
                ...prev,
                [fileType]: result.assets[0],
            }));
        }
    };

    const handleSubmit = async () => {
        // Create FormData instance
        const formData = new FormData();
        let userData: any = {};

        // get the url link from appWrite
        const [idFrontUrl, idBackUrl, passportUrl] = await Promise.all([
            getFileUrlFromProvider(files.idFront),
            getFileUrlFromProvider(files.idBack),
            getFileUrlFromProvider(files.passport)
        ])

        if (files.idFront && files.idBack)
            userData = {
                idUser: Number(currentUser?.IdUser),
                idFront: idFrontUrl,
                idBack: idBackUrl,
            }
        else if (files.passport)
            userData = {
                idUser: Number(currentUser?.IdUser),
                passport: passportUrl,
            }
        else return;

        try {
            // Replace with your API endpoint
            const response = await updateResource('User', currentUser?.IdUser, userData);

            if (typeof response != 'undefined' && response) {
                Alert.alert('Success', 'user identity updated successfully');
                router.push('/(tabulate)/profile');
            } else {
                Alert.alert('Error', 'Failed to update user identity');
            }
        } catch (error) {
            Alert.alert('Error', 'An error occurred while uploading files');
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
                <View className="flex-row items-center mb-6">
                    <TouchableOpacity onPress={() => router.replace('/(settings)/parameters')}>
                        <Ionicons name="arrow-back" size={24} color="white" />
                    </TouchableOpacity>
                    <Text className="text-white text-xl font-bold ml-4">Identification de compte</Text>
                </View>

                <Text className="text-white text-lg mb-6">Choisissez une option et identifiez-vous</Text>

                <TouchableOpacity
                    className="bg-gray-800 rounded-lg p-4 mb-4"
                    onPress={() => setShowIdOptions(!showIdOptions)}
                >
                    <Text className="text-white text-lg">Pièce Nationale D'identité</Text>
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

                <TouchableOpacity
                    className="bg-gray-800 rounded-lg p-4 mb-6"
                    onPress={() => pickImage('passport')}
                >
                    <Text className="text-white text-lg">Passeport</Text>
                    {renderFilePreview(files.passport)}
                </TouchableOpacity>

                {(files.passport || (files.idFront && files.idBack)) && (
                    <TouchableOpacity
                        className="bg-blue-500 rounded-lg p-4"
                        onPress={handleSubmit}
                    >
                        <Text className="text-white text-lg text-center">Soumettre</Text>
                    </TouchableOpacity>
                )}
            </ScrollView>
        </SafeAreaView>
    );
};

export default AccountIdentificationScreen;