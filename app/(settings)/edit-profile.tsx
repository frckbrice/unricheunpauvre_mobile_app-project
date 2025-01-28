import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView, ActivityIndicator, Alert, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import useUserGlobal from '@/hooks/use-user-hook';
import { icons } from '@/constants';
import { getFileUrlFromProvider, getSingleResource, updateResource, uploadResourceData } from '@/lib/api';
import DateTimePicker from '@react-native-community/datetimepicker';
import AddIdAccount from '../../components/profile/components/identification';
import { API_URL } from '@/constants/constants';

// Define User interface to match the backend model
// Profile Edit Screen
const ProfileEditScreen: React.FC = () => {
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
    const [motPwd, setMotPwd] = useState("");
    const [dateNaiss, setDateNaiss] = useState("");
    const [etatuser, setEtatuser] = useState(false);


    const [registering, setRegistering] = useState(false);
    const router = useRouter();
    const [idF, setIdf] = useState("");
    const [idB, setIdB] = useState("");

    // state of the id card
    const [pieceIdf, setPieceIdf] = useState<any>();
    const [pieceIdb, setPieceIdb] = useState<any>();
    const [passport, setPassport] = useState<any>();

    const { currentUser } = useUserGlobal();

    const getTheCurrentUserData = useCallback(async (user_id: string) => {
        try {
            const userData = await getSingleResource("users", user_id);
            console.log("\n\n curent user data: ", userData);
            setName(userData?.data.nomUser);
            setUsername(userData?.data.username);
            setCity(userData?.data.localisation);
            setMdpUser(userData?.data.mdpUser);
            setUserImg(userData?.data.photoUser);
            setMotPwd(userData?.data.mdpUser);
            setDateNaiss(userData?.data.dateNaiss);
            setEtatuser(userData?.data.etatUser);
            setIdf(userData?.data.pieceIdf);
            setIdB(userData?.data.pieceIdb);

            // Parse and set birth date if exists
            if (userData?.data.dateNaiss) {
                const parsedDate = new Date(userData?.data.dateNaiss);
                setDate(parsedDate);
                setBirthDate(formatDate(parsedDate));
            }

        } catch (error) {
            console.error(error);
        }
    }, [setImagePub, setBirthDate, setCity, setUsername, setName]);

    // get date from child component.
    const getIdData = (data: any, fileType: 'idFront' | 'idBack' | 'passport') => {

        console.log("\n\n getIdData fct: ", data, fileType)
        if (fileType === "idFront")
            setPieceIdf(data);
        else if (fileType === "idBack")
            setPieceIdb(data);
        else setPassport(data);
    }

    useEffect(() => {
        if (currentUser?.userId) {
            getTheCurrentUserData(currentUser?.userId)
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

    // Handle date change
    const onDateChange = (event: any, selectedDate?: Date) => {
        const currentDate = selectedDate || date;

        // Hide picker on both platforms
        setShowDatePicker(Platform.OS === 'ios');

        // Update date state
        setDate(currentDate);

        // Format and set birth date
        setBirthDate(formatDate(currentDate));
    };

    // Open date picker
    const showDatepicker = () => {
        setShowDatePicker(true);
    };

    // save user
    const onSaveUser = async () => {
        setRegistering(true);
        console.log("\n\n imagePub : ", imagePub);
        let pieceIdfUrl, pieceIdbUrl, passportUrl;

        try {
            const imgUrl = await getFileUrlFromProvider(imagePub);
            if (pieceIdf?.uri)
                pieceIdfUrl = await getFileUrlFromProvider(pieceIdf) as URL;
            if (pieceIdb?.uri)
                pieceIdbUrl = await getFileUrlFromProvider(pieceIdf) as URL;
            if (passport && !(pieceIdf?.uri && pieceIdb?.uri))
                passportUrl = await getFileUrlFromProvider(passport) as URL;


            const dataObj = {
                nomUser: name ?? currentUser?.nomUser,
                username: username,
                localisation: city ?? ville,
                pieceIdf: !(pieceIdf?.uri && pieceIdb?.uri) ? passportUrl : pieceIdf?.uri ? pieceIdfUrl : idF,
                pieceIdb: pieceIdb?.uri ? pieceIdbUrl : idB,
                etatUser: etatuser || false,
                dateNaiss: birthDate ?? dateNaiss,
                photoUser: imgUrl ?? userImg,
                mdpUser: mdpUser ?? motPwd,
                dateCrea: new Date(Date.now()).toISOString(),

            };

            console.log("\n\n object to upload: ", dataObj);


            const result = await updateResource(
                'users',
                currentUser?.userId,
                dataObj,
            );
            Alert.alert('Success', 'Profile updated successfully');
            router.push('/(tabulate)/profile');

        } catch (error) {
            console.error(error);
        } finally {
            setRegistering(false);
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
            // const base64 = `data:image/png;base64,${result.assets[0].base64}`;
            setImagePub(result.assets[0]);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-gray-900 p-4">
            <View className="flex-row items-center mb-6">
                <TouchableOpacity onPress={() => router.push('/(tabulate)/profile')}>
                    <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
                <Text className="text-white text-xl font-bold ml-4">Modifier votre profil</Text>
            </View>
            <ScrollView>
                <View className="mb-4">
                    <Text className="text-white mb-2">Nom d'utilisateur</Text>
                    <View className="bg-gray-800 rounded-lg p-3 flex-row items-center">
                        <Ionicons name="person-outline" size={24} color="gray" />
                        <TextInput
                            className="flex-1 ml-2 text-white"
                            value={currentUser?.nomUser as string}
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
                            value={username as string}
                            onChangeText={(text) => setUsername(text)}
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
                    <Text className="text-white mb-2">Date de naissance</Text>
                    <TouchableOpacity
                        onPress={showDatepicker}
                        className="bg-gray-800 rounded-lg p-3 flex-row items-center"
                    >
                        <Ionicons name="calendar-outline" size={24} color="gray" />
                        <Text className="flex-1 ml-2 text-white">
                            {birthDate || 'Sélectionner une date'}
                        </Text>
                    </TouchableOpacity>

                    {/* Date Picker */}
                    {showDatePicker && (
                        <DateTimePicker
                            testID="dateTimePicker"
                            value={date}
                            mode="date"
                            is24Hour={true}
                            display="default"
                            onChange={onDateChange}
                            maximumDate={new Date()} // Prevent future dates
                        />
                    )}
                </View>

                <View className="flex mb-2 gap-3">

                    <TouchableOpacity
                        onPress={() => onCaptureImage()}
                        className="bg-gray-900 p-4 
                        rounded-xl border-blue-400 border-0.5"
                    >
                        {(imagePub || userImg) ? (
                            <Image
                                source={{ uri: imagePub?.uri ?? userImg }} // uri is used for non local images.
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
                        <Text className="text-white">Photo de profile</Text>
                    </TouchableOpacity>
                </View>

                <AddIdAccount getIdData={getIdData} />
                <TouchableOpacity
                    className="bg-blue-500 rounded-lg p-3 my-3"
                    onPress={onSaveUser}
                >{registering ? (
                    <ActivityIndicator size="small" color="white" />
                ) :
                    <Text className="text-white text-[16px] text-center font-bold">
                        Cliquer pour modifier
                    </Text>}
                </TouchableOpacity>
            </ScrollView>

        </SafeAreaView>
    );
};

export default ProfileEditScreen;