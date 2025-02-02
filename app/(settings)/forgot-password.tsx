import React, { useCallback, useEffect, useState } from 'react';

import { View, Text, TextInput, TouchableOpacity, Image, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ActivityIndicator } from 'react-native';
import { Colors } from '@/constants';
import useUserGlobal from '@/hooks/use-user-hook';
import { Alert } from 'react-native';
import { patchResource, updatedUserPwd, updateResource } from '@/lib/api';
import FormField from '@/components/form-field';

// Profile Edit Screen
const ForgotPassword: React.FC = () => {
  const [password, setPassword] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);


  const { currentUser } = useUserGlobal();

  const router = useRouter();


  console.log("credentials: ", {
    password, confirmPwd
  })
  const onSignInPress = React.useCallback(async () => {

    console.log("password correspondance:", password.includes(confirmPwd))

    // Check if passwords match
    if (!password.includes(confirmPwd)) {
      return Alert.alert('Erreur', 'Pas de correspondance entre mots de passes');
    }

    setIsSubmitting(true);
    try {
      const dataObj = {
        mdpUser: password,
      };

      console.log("\n\n object to upload: ", dataObj);

      if (!dataObj.mdpUser || currentUser?.userId)
        return console.error(`no ${dataObj.mdpUser} or ${currentUser?.userId} found`);

      await patchResource(
        'users',
        currentUser?.userId,
        dataObj,
      );
      Alert.alert('Reussi', 'Profile mis a jour avec success!');
      router.push('/login');
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2));
    } finally {
      setIsSubmitting(false);
    }
  }, [password]);

  return (
    <SafeAreaView className="flex-1 bg-gray-900 p-4 pt-5">
      <View className="flex-row items-center mb-6 gap-4">

        <View className=' flex justify-center items-center gap-2 mb-2'>
          <Text className="text-white text-xl font-bold ml-4">
            mot de passe oublié
          </Text>

        </View>
      </View>
      <ScrollView>
        <View className="mb-4">
          <Text className="mb-2 text-gray-300">Entrer le nouveau mot de passe</Text>
          <FormField
            title={"Mot de passe"}
            value={password}
            placeholder="Entrer votre mot de pass..."
            handleChangeText={(text) => setPassword(text)}
            inputStyle="text-white"
          />
        </View>


        <View className="mb-4">
          <Text className="mb-2 text-gray-300">Confirmer le mot de passe</Text>
          <FormField
            title={"Confirmer Mot de passe"}
            value={confirmPwd}
            placeholder="Entrer votre mot de pass..."
            handleChangeText={(text) => setConfirmPwd(text)}
            inputStyle=" text-white"
          />
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

export default ForgotPassword;

// https://play.google.com/store/apps/details?id=com.senima.senwisetool