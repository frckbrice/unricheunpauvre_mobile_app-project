import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';


// Profile Edit Screen
const ProfileEditScreen: React.FC = () => {
    const [username, setUsername] = useState('firstname');
    const [lastname, setLastname] = useState('lastname');
    const [city, setCity] = useState('Paris');
    const [street, setStreet] = useState('Roisi');
    const [description, setDescription] = useState('See the impact of your donations. Our app provides transparency into how your contributions are used, so you can feel confident in your support.');

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
                            value={username}
                            onChangeText={setUsername}
                        />
                    </View>
                </View>
                <View className="mb-4">
                    <Text className="text-white mb-2">Nom d'utilisateur</Text>
                    <View className="bg-gray-800 rounded-lg p-3 flex-row items-center">
                        <Ionicons name="person-outline" size={24} color="gray" />
                        <TextInput
                            className="flex-1 ml-2 text-white"
                            value={lastname}
                            onChangeText={setLastname}
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
                            onChangeText={setCity}
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
                            onChangeText={setStreet}
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
                        onChangeText={setDescription}
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