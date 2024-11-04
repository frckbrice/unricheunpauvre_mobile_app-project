import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import useUserGlobal from '@/hooks/use-user-hook';
import { icons } from '@/constants';
import { uploadResourceData } from '@/lib/api';


// Profile Edit Screen
const ProfileEditScreen: React.FC = () => {
    const [imagePub, setImagePub] = useState("");
    const [name, setName] = useState("");
    const [username, setUsername] = useState("");
    const [city, setCity] = useState('Paris');
    const [street, setStreet] = useState('Roisi');
    const [description, setDescription] = useState('See the impact of your donations. Our app provides transparency into how your contributions are used, so you can feel confident in your support.');

    const [edit, setEdit] = useState(false);
    const router = useRouter();

    const { currentUser } = useUserGlobal();
    // save user
    const onSaveUser = async () => {
        setEdit(true);
        const dataObj = {
            idUser: currentUser?.IdUser,
            name,
            username,
            location,
            description,
            imagePub,
        };

        try {
            await uploadResourceData(
                dataObj,
                'User'
            );
            setEdit(false);
        } catch (error) {
            console.error(error);
        } finally {
            setEdit(false);
        }
    };

    const onCaptureImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.75,
            base64: true, //<--- important
        });

        if (!result.canceled) {
            const base64 = `data:image/png;base64,${result.assets[0].base64}`;
            console.log(base64);
            setImagePub(base64);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-gray-900 p-4">
            <View className="flex-row items-center mb-6">
                <TouchableOpacity onPress={() => router.push('/(tabulate)/profile')}>
                    <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
                <Text className="text-white text-xl font-bold ml-4">Modification profil</Text>
            </View>
            <ScrollView>
                <View className="mb-4">
                    <Text className="text-white mb-2">Nom d'utilisateur</Text>
                    <View className="bg-gray-800 rounded-lg p-3 flex-row items-center">
                        <Ionicons name="person-outline" size={24} color="gray" />
                        <TextInput
                            className="flex-1 ml-2 text-white"
                            value={currentUser?.name ?? ""}
                            onChangeText={(text) => setUsername(text)}
                        />
                    </View>
                </View>
                <View className="mb-4">
                    <Text className="text-white mb-2">Username</Text>
                    <View className="bg-gray-800 rounded-lg p-3 flex-row items-center">
                        <Ionicons name="person-outline" size={24} color="gray" />
                        <TextInput
                            className="flex-1 ml-2 text-white"
                            value={currentUser?.username as string ?? ""}
                            onChangeText={(text) => setName(text)}
                        />
                    </View>
                </View>
                <View className="mb-4">
                    <Text className="text-white mb-2">Ville</Text>
                    <View className="bg-gray-800 rounded-lg p-3 flex-row items-center">
                        <Ionicons name="location-outline" size={24} color="gray" />
                        <TextInput
                            className="flex-1 ml-2 text-white"
                            value={currentUser?.location ?? ""}
                            onChangeText={(text) => setCity(text)}
                        />
                    </View>
                </View>

                {/* <View className="mb-4">
                    <Text className="text-white mb-2">Rue</Text>
                    <View className="bg-gray-800 rounded-lg p-3 flex-row items-center">
                        <Ionicons name="location-outline" size={24} color="gray" />
                        <TextInput
                            className="flex-1 ml-2 text-white"
                            value={street}
                            onChangeText={(text) => setStreet(text)}
                        />
                    </View>
                </View> */}
                <View className="mb-4">
                    <Text className="text-white mb-2">Description</Text>
                    <TextInput

                        className="bg-gray-800 rounded-lg p-3 text-white"
                        multiline
                        numberOfLines={6}
                        value={currentUser?.description ?? ""}
                        onChangeText={(text) => setDescription(text)}
                    />
                </View>
                <View className="flex mb-6 gap-3">

                    <TouchableOpacity
                        onPress={() => onCaptureImage()}
                        className="bg-gray-900 p-4 
                        rounded-xl border-blue-400 border-0.5"
                    >
                        {imagePub ? (
                            // <></>
                            <Image
                                source={{ uri: imagePub }} // uri is used for non local images.
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
                <TouchableOpacity
                    className="bg-blue-500 rounded-lg p-3 mt-3"
                    onPress={onSaveUser}
                >{edit ? (
                    <ActivityIndicator size="small" color="white" />
                ) :
                    <Text className="text-white text-[16px] text-center font-bold">
                        Enrgister
                    </Text>}
                </TouchableOpacity>
            </ScrollView>

        </SafeAreaView>
    );
};

export default ProfileEditScreen;