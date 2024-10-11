import React, { useState } from 'react';

import { View, Text, TextInput, TouchableOpacity, Image, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { icons } from '@/constants';
import { useRouter } from 'expo-router';

// Profile Edit Screen
const ProfileAdressEditScreen: React.FC = () => {
  const [password, setPassword] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const router = useRouter()

  return (
    <SafeAreaView className="flex-1 bg-gray-900 p-4">
      <View className="flex-row items-center mb-6">
        <TouchableOpacity onPress={() => router.push("/parameters")}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <View className=' flex justify-center items-center gap-2'>
          <Text className="text-white text-xl font-bold ml-4">Modification Mot de passe</Text>
          <Text className="text-gray-400 text-[14px] font-bold ml-4">Veuillez saisir votre nouveau mot de pass et confirmer</Text>
        </View>
      </View>
      <ScrollView>
        <View className="mb-4">
          <Text className="text-white mb-2">Nouveau mot de passe</Text>
          <View className="bg-gray-800 rounded-lg p-3 flex-row items-center">
            <TextInput
              className="flex-1 ml-2 text-white placeholder:text-white"
              value={password}
              onChangeText={setPassword}
              placeholder='Nouveau mot de passe'
            />
            <Ionicons name={'eye'} size={24} color="gray" />
          </View>
        </View>
        <View className="mb-4">
          <Text className="text-white mb-2">Confirmer Mot de passe</Text>
          <View className="bg-gray-800 rounded-lg p-3 flex-row items-center">

            <TextInput
              className="flex-1 ml-2 text-white placeholder:text-white"
              value={confirmPwd}
              onChangeText={setConfirmPwd}
              placeholder='Confirmer mot de passe'
            />
            <Ionicons name={'eye'} size={24} color="gray" />
          </View>
        </View>

      </ScrollView>
      <TouchableOpacity className="bg-blue-600 rounded-lg p-3 mt-4">
        <Text className="text-white text-center font-bold">Modifier</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default ProfileAdressEditScreen;
