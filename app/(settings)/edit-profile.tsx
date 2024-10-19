import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth, useUser } from '@clerk/clerk-expo';
import * as ImagePicker from 'expo-image-picker';


// Profile Edit Screen
const ProfileEditScreen: React.FC = () => {
    const { user } = useUser();
    const [fullName, setFullName] = useState(user?.fullName);
    const [username, setUsername] = useState(user?.username);
    const [city, setCity] = useState('Paris');
    const [street, setStreet] = useState('Roisi');
    const [description, setDescription] = useState('See the impact of your donations. Our app provides transparency into how your contributions are used, so you can feel confident in your support.');

    const [edit, setEdit] = useState(false);
    // save user
    const onSaveUser = async () => {
        try {
            await user?.update({ firstName: fullName!, username: username! });
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

            user?.setProfileImage({
                file: base64,
            });
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-gray-900 p-4">
            <View className="flex-row items-center mb-6">
                <TouchableOpacity>
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
                            value={username as string}
                            onChangeText={(text) => setUsername(text)}
                        />
                    </View>
                </View>
                <View className="mb-4">
                    <Text className="text-white mb-2">Nom d'utilisateur</Text>
                    <View className="bg-gray-800 rounded-lg p-3 flex-row items-center">
                        <Ionicons name="person-outline" size={24} color="gray" />
                        <TextInput
                            className="flex-1 ml-2 text-white"
                            value={fullName as string}
                            onChangeText={(text) => setFullName(text)}
                        />
                    </View>
                </View>
                <View className="mb-4">
                    <Text className="text-white mb-2">Ville</Text>
                    <View className="bg-gray-800 rounded-lg p-3 flex-row items-center">
                        <Ionicons name="location-outline" size={24} color="gray" />
                        <TextInput
                            className="flex-1 ml-2 text-white"
                            value={city}
                            onChangeText={(text) => setCity(text)}
                        />
                    </View>
                </View>
                <View className="mb-4">
                    <Text className="text-white mb-2">Rue</Text>
                    <View className="bg-gray-800 rounded-lg p-3 flex-row items-center">
                        <Ionicons name="location-outline" size={24} color="gray" />
                        <TextInput
                            className="flex-1 ml-2 text-white"
                            value={street}
                            onChangeText={(text) => setStreet(text)}
                        />
                    </View>
                </View>
                <View className="mb-4">
                    <Text className="text-white mb-2">Description</Text>
                    <TextInput

                        className="bg-gray-800 rounded-lg p-3 text-white"
                        multiline
                        numberOfLines={6}
                        value={description}
                        onChangeText={(text) => setDescription(text)}
                    />
                </View>
            </ScrollView>
            <TouchableOpacity className="bg-blue-600 rounded-lg p-3 mt-4">
                <Text className="text-white text-center font-bold">ENRÉGISTRER</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

export default ProfileEditScreen;