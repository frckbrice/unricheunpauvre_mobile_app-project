import React, { useCallback, useEffect, useState } from 'react';

import { View, Text, TextInput, TouchableOpacity, Image, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ActivityIndicator } from 'react-native';
import { Colors } from '@/constants';
import useUserGlobal from '@/hooks/use-user-hook';
import { Alert } from 'react-native';
import { updatedUserPwd, updateResource } from '@/lib/api';
import FormField from '@/components/form-field';

// Profile Edit Screen
const ProfileAdressEditScreen: React.FC = () => {
  const [password, setPassword] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [imagePub, setImagePub] = useState<any>();
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [city, setCity] = useState('Paris');
  const [ville, setVille] = useState('');

  // State for date picker
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [birthDate, setBirthDate] = useState('');
  const [mdpUser, setMdpUser] = useState();
  const [userImg, setUserImg] = useState("");

  const [dateNaiss, setDateNaiss] = useState("");
  const [etatuser, setEtatuser] = useState(false);


  const [idF, setIdf] = useState("");
  const [idB, setIdB] = useState("");

  const { currentUser } = useUserGlobal();

  const router = useRouter();

  const getTheCurrentUserData = useCallback(async (user_id: string) => {
    try {
      const user = await fetch(`https://rhysapi.iptvstreamerspro.com/api/User/${user_id}`, {
        headers: {
          "content-type": "application/json"
        },
      });
      if (!user.ok) {
        throw new Error('Failed to fetch user data');
      }
      const userData = await user.json();
      // console.log("\n\n curent user data: ", userData);
      setName(userData.nomUser);
      setUsername(userData.username);
      setCity(userData.localisation);
      setMdpUser(userData?.mdpUser);
      setUserImg(userData?.photoUser);

      setDateNaiss(userData?.dateNaiss);
      setEtatuser(userData?.etatUser);
      setIdf(userData?.pieceIdf);
      setIdB(userData?.pieceIdb);

      // Parse and set birth date if exists
      if (userData.dateNaiss) {
        const parsedDate = new Date(userData.dateNaiss);
        setDate(parsedDate);
        setBirthDate(formatDate(parsedDate));
      }

    } catch (error) {
      console.error(error);
    }
  }, [setImagePub, setBirthDate, setCity, setUsername, setName]);

  useEffect(() => {
    if (currentUser?.IdUser) {
      getTheCurrentUserData(currentUser?.IdUser)
    }
  }, [currentUser]);

  // Utility function to format date
  const formatDate = (date: Date): string => {
    // return date.toLocaleDateString('fr-FR', {
    //     day: '2-digit',
    //     month: '2-digit',
    //     year: 'numeric'
    // });
    return date.toISOString();
  };


  console.log("credentials: ", {
    password, confirmPwd
  })
  const onSignInPress = React.useCallback(async () => {

    console.log("password correspondance:", password.includes(confirmPwd))

    // Check if passwords are empty
    if (!password || !confirmPwd) {
      console.log("password or correspondance:", password.includes(confirmPwd))
      return Alert.alert('Error', 'Veuillez saisir tous les champs');
    }

    // Check if passwords match
    if (!password.includes(confirmPwd)) {
      return Alert.alert('Error', 'Pas de correspondance entre mots de passes');
    }

    setIsSubmitting(true);
    try {
      const dataObj = {
        idUser: currentUser?.IdUser,
        nomUser: name ?? currentUser?.name,
        username: username,
        localisation: city ?? ville,
        pieceIdf: idF,
        pieceIdb: idB,
        etatUser: etatuser || false,
        dateNaiss: birthDate ?? dateNaiss,
        photoUser: userImg,
        mdpUser: password ?? mdpUser,
        dateCrea: new Date(Date.now()).toISOString(),

      };

      console.log("\n\n object to upload: ", dataObj);

      await updateResource(
        'User',
        currentUser?.IdUser,
        dataObj,
      );
      Alert.alert('Success', 'Profile updated successfully');
      router.push('/(tabulate)/profile');
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2));
    } finally {
      setIsSubmitting(false);
    }
  }, [password]);

  return (
    <SafeAreaView className="flex-1 bg-gray-900 p-4 pt-5">
      <View className="flex-row items-center mb-6 gap-4">
        <TouchableOpacity onPress={() => router.push("/parameters")}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <View className=' flex justify-center items-center gap-2 mb-2'>
          <Text className="text-white text-xl font-bold ml-4">Modification Mot de passe</Text>
          {/* <Text className="text-gray-400 text-[14px] font-bold ml-4">saisir votre nouveau mot de pass et confirmer</Text> */}
        </View>
      </View>
      <ScrollView>
        <View className="mb-4">
          <Text className="mb-2 text-gray-300">Mot de passe</Text>
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

export default ProfileAdressEditScreen;
