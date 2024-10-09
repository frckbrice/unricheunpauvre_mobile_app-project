import React from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const CreatePostScreen: React.FC = () => {
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
            <TouchableOpacity className="bg-gray-800 p-2 rounded mb-4">
                <Text className="text-white">Choisir une catégorie ▼</Text>
            </TouchableOpacity>
            <TextInput
                placeholder="Décrivez votre souhait..."
                placeholderTextColor="gray"
                className="bg-gray-800 p-2 rounded text-white mb-4"
                multiline
            />
            <View className="flex  mb-4 gap-2">
                <Text className="text-white mr-2">Estimation</Text>
                <TextInput
                    placeholder="Exemple: 150 €"
                    placeholderTextColor="gray"
                    className="bg-gray-800 p-2 rounded text-white flex-1"
                    keyboardType="numeric"
                />
                {/* <Text className="text-white ml-2">€</Text> */}
            </View>
            <View className="flex-row mb-4 gap-3">
                <TouchableOpacity className="bg-gray-900 px-4 py-1 rounded-3xl border-blue-400 border-2">
                    <Text className="text-white">Images</Text>
                </TouchableOpacity>
                <TouchableOpacity className="bg-gray-900 px-4 py-1 rounded-3xl border-blue-400 border-2">
                    <Text className="text-white">Vidéos</Text>
                </TouchableOpacity>
            </View>
            <TouchableOpacity className="bg-gray-800 p-2 rounded mb-4 flex-row gap-2 items-center ">

                <Ionicons name="add-circle-outline" size={30} color="white" />
                <Text className="text-white" > Insérer un document</Text>
            </TouchableOpacity>
            <TouchableOpacity className="bg-blue-500 p-3 rounded">
                <Text className="text-white text-center font-bold">PUBLIER</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

export default CreatePostScreen;
