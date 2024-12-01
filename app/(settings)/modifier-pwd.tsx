import React, { useState } from 'react';

import { View, Text, TextInput, TouchableOpacity, Image, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ActivityIndicator } from 'react-native';
import { Colors } from '@/constants';
import useUserGlobal from '@/hooks/use-user-hook';
import { Alert } from 'react-native';
import { updatedUserPwd } from '@/lib/api';

// Profile Edit Screen
const ProfileAdressEditScreen: React.FC = () => {
  const [password, setPassword] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const { currentUser } = useUserGlobal();

  const router = useRouter();

  console.log({
    password, confirmPwd
  })

  const onSignInPress = React.useCallback(async () => {
    setIsSubmitting(true);
    try {
      const newUser = await updatedUserPwd(password, currentUser?.IdUser);
      if (typeof newUser != 'undefined') {
        Alert.alert('Success', `${newUser?.message}`);
      }
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2));
    } finally {
      setIsSubmitting(false);
    }
  }, [password]);

  return (
    <SafeAreaView className="flex-1 bg-gray-900 p-4 pt-5">
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
      <TouchableOpacity
        onPress={onSignInPress}
        className="bg-blue-600 rounded-lg p-3 mt-4"
      >

        {isSubmitting ?
          <ActivityIndicator size="large" color={Colors.primary} /> :

          <Text className="text-white text-center font-bold">Modifier</Text>}
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default ProfileAdressEditScreen;
