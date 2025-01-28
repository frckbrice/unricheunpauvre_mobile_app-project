import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import useUserGlobal from '@/hooks/use-user-hook';

interface UploadedFile {
    uri?: string;
    //   type: string;
    //   name: string;
    editProfile?: boolean;
    classname?: string;
    getIdData: (data: any, fileType: "idFront" | "idBack" | "passport") => void
}


const AddIdAccount: React.FC<UploadedFile> = ({ editProfile,
    getIdData
}) => {
    const router = useRouter();
    const [showIdOptions, setShowIdOptions] = useState(false);
    const [files, setFiles] = useState<{
        idFront?: any;
        idBack?: any;
        passport?: any;
    }>({});


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
            setFiles(prev => ({
                ...prev,
                [fileType]: result.assets[0],
            }));

            getIdData(result.assets[0], fileType);


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
        <SafeAreaView className=" bg-gray-900 ">

            <Text className={"text-white text-[12px] mb-2"}>Choisissez une option et identifiez-vous</Text>

            <TouchableOpacity
                className="bg-gray-800 rounded-lg p-4 mb-4"
                onPress={() => setShowIdOptions(!showIdOptions)}
            >
                <Text className={editProfile ? "text-white text-[12px] text-center w-full" : "text-white text-sm"}>Pièce Nationale D'identité</Text>
                {showIdOptions && (
                    <View className="mt-4">
                        <TouchableOpacity
                            className="bg-gray-700 p-3 rounded-lg mb-2"
                            onPress={() => pickImage('idFront')}
                        >
                            <Text className="text-white text-sm">Recto de la carte</Text>
                            {renderFilePreview(files.idFront)}
                        </TouchableOpacity>

                        <TouchableOpacity
                            className="bg-gray-700 p-3 rounded-lg"
                            onPress={() => pickImage('idBack')}
                        >
                            <Text className="text-white text-sm">Verso de la carte</Text>
                            {renderFilePreview(files.idBack)}
                        </TouchableOpacity>
                    </View>
                )}
            </TouchableOpacity>

            {!showIdOptions ? <TouchableOpacity
                className={`bg-gray-800 rounded-lg p-4 mb-6`}
                onPress={() => pickImage('passport')}
            >
                <Text className={editProfile ? "text-white text-sm w-full" : "text-white text-sm"}>Passeport</Text>
                {renderFilePreview(files.passport)}
            </TouchableOpacity> : null}
        </SafeAreaView>
    );
};

export default AddIdAccount;