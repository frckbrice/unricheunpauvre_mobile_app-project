import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
// Account Identification Screen
const AccountIdentificationScreen: React.FC = () => {
    return (
        <SafeAreaView className="flex-1 bg-gray-900 p-4">
            <View className="flex-row items-center mb-6">
                <TouchableOpacity>
                    <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
                <Text className="text-white text-xl font-bold ml-4">Idenfication de compte</Text>
            </View>
            <Text className="text-white text-lg mb-6">Choisissez une option et identifiez-vous</Text>
            <TouchableOpacity className="bg-gray-800 rounded-lg p-4 mb-4">
                <Text className="text-white text-lg">Piéce Nationale D'identité</Text>
            </TouchableOpacity>
            <TouchableOpacity className="bg-gray-800 rounded-lg p-4">
                <Text className="text-white text-lg">Passeport</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

export default AccountIdentificationScreen;
