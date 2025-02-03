
// import React, { useState } from 'react';
// import { View, Text, TextInput, TouchableOpacity, Image, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { Ionicons } from '@expo/vector-icons';
// import { useRouter } from 'expo-router';
// import FormField from '@/components/form-field';
// import { createUserAccount } from '@/lib/api';
// import { tokenCache } from '@/store/persist-token-cache';
// import { ActivityIndicator } from 'react-native';
// import { Colors } from '@/constants';

// // Login Screen
// const LoginScreen: React.FC = () => {
//     const router = useRouter()

//     // const [username, setUsername] = React.useState('')
//     const [nomUser, setNomUser] = React.useState('')
//     const [mdpUser, setMdpUser] = React.useState('')
//     const [username, setUsername] = React.useState('')
//     const [isSubmitting, setIsSubmitting] = React.useState(false)

//     const onSignUpPress = async () => {
//         setIsSubmitting(true);
//         console.log(
//             "nomUser", nomUser,
//             "mdpUser", mdpUser,
//             "isSubmitting", isSubmitting
//         )
//         try {

//             const res = await fetch(`https://rhysapi.iptvstreamerspro.com/api/User`, {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({
//                     mdpUser,
//                     username,
//                     nomUser,
//                 }),
//             });
//             const newUser = await res.json();

//             if (typeof newUser != 'undefined') {
//                 Alert.alert('Success', 'compte créé avec succès. Veuillez vous connecter');

//                 // console.log("from register: ", newUser)
//                 setTimeout(() => {
//                     router.replace('/login');
//                 }, 1000);
//             }
//         } catch (err: any) {
//             console.error(JSON.stringify(err, null, 2))
//             Alert.alert("Echec de connection", "veuillez reessayer avec les bons indentifiants");
//         } finally {
//             setIsSubmitting(false);
//         }
//     }
//     return (
//         <KeyboardAvoidingView
//             behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//             style={{ flex: 1 }}
//         >
//             <SafeAreaView className="h-full">
//                 <ScrollView contentContainerStyle={{ flexGrow: 1, marginTop: 20 }}>
//                     <View className="px-4 justify-center flex-1">
//                         <View className="items-center mb-5 ">
//                             <Image
//                                 source={require('../../assets/images/favicon.png')}
//                                 resizeMode='contain'
//                                 className="w-24 h-24 mb-4"
//                             />
//                             <Text className="text-3xl font-bold text-blue-600">S'inscrire</Text>
//                         </View>
//                         <Text className="text-center mb-8 text-gray-600">
//                             Veuillez entrer vos indentifiants de compte
//                         </Text>
//                         <View className="mb-2">
//                             <Text className=" text-gray-700">Nom complet</Text>
//                             <View className="flex-row items-center border border-gray-300 rounded-lg p-2">
//                                 <Ionicons name="person" size={24} color="#2563eb" />
//                                 <TextInput
//                                     className="flex-1 ml-2 placeholder:text-gray-200 text-black-200"
//                                     placeholder="Entrer votre nom"
//                                     value={nomUser}
//                                     onChangeText={(text: string) => setNomUser(text)}
//                                     keyboardType="email-address"
//                                 />

//                             </View>
//                         </View>
//                         <View className="mb-4">
//                             <Text className="mb-2 text-gray-700">Nom d'utilisateur</Text>
//                             <View className="flex-row items-center border border-gray-300 rounded-lg p-2">
//                                 <Ionicons name="mail" size={24} color="#2563eb" />
//                                 <TextInput
//                                     className="flex-1 ml-2 placeholder:text-gray-200 text-black-200"
//                                     placeholder="Entrer votre adresse username"
//                                     value={username}
//                                     onChangeText={(text: string) => setUsername(text)}
//                                     keyboardType="email-address"
//                                 />
//                             </View>
//                         </View>
//                         <View className="mb-4">
//                             <Text className="mb-2 text-gray-700">Mot de passe</Text>
//                             <FormField
//                                 title={"Mot de passe"}
//                                 value={mdpUser}
//                                 placeholder="Entrez votre mot de passe"
//                                 handleChangeText={(e: string) => setMdpUser(e)}
//                                 inputStyle="placeholder:text-gray-200 text-black-200"
//                             />
//                         </View>

//                     </View>
//                     <View className='w-full h-80 rounded-tr-[40px] rounded-tl-[40px]'>
//                         <View
//                             className='bg-transparent justify-center'
//                         >
//                             <TouchableOpacity
//                                 className="bg-blue-600 rounded-lg p-3 my-4 mx-5"
//                                 onPress={onSignUpPress}
//                             >
//                                 {isSubmitting ? <ActivityIndicator size="large" color={Colors.primary} /> : <Text className="text-white text-center font-bold">S'INSCRIRE</Text>}
//                             </TouchableOpacity>
//                             <View className="flex-row justify-center items-center mt-2">
//                                 <Text className=" text-gray-400 font-extrabold">
//                                     Avez-vous un compte ?
//                                 </Text>
//                                 <TouchableOpacity onPress={() => router.replace('/login')}>
//                                     <Text className="text-lg text-blue-600 font-extrabold ml-2">Se connecter</Text>
//                                 </TouchableOpacity>
//                             </View>
//                         </View>
//                     </View>

//                 </ScrollView>
//             </SafeAreaView>
//         </KeyboardAvoidingView>
//     );
// };

// export default LoginScreen;


// import React, { useState } from 'react';
// import { View, Text, TextInput, TouchableOpacity, Image, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { Ionicons } from '@expo/vector-icons';
// import { useRouter } from 'expo-router';
// import FormField from '@/components/form-field';

// import { ActivityIndicator } from 'react-native';
// import { Colors } from '@/constants';
// import { API_URL } from '@/constants/constants';

// // Login Screen
// const LoginScreen: React.FC = () => {
//     const router = useRouter()

//     const [nomUser, setNomUser] = React.useState('')
//     const [mdpUser, setMdpUser] = React.useState('')
//     const [username, setUsername] = React.useState('')
//     const [isSubmitting, setIsSubmitting] = React.useState(false)
//     const [errors, setErrors] = React.useState({
//         username: '',
//         password: '',
//         nomUser: ''
//     })

//     const validateForm = (): boolean => {
//         let isValid = true
//         const newErrors = {
//             username: '',
//             password: '',
//             nomUser: ''
//         }

//         // Username validation
//         if (!username.trim()) {
//             newErrors.username = "L\'identifiant d'utilisateur est obligatoire"
//             isValid = false
//         }

//         // nom user validation
//         if (!nomUser.trim()) {
//             newErrors.username = "Le nom d'utilisateur est obligatoire"
//             isValid = false
//         }

//         // Password validation
//         if (!mdpUser.trim()) {
//             newErrors.password = 'Le mot de passe est obligatoire'
//             isValid = false
//         }

//         setErrors(newErrors)
//         return isValid
//     }

//     const onSignUpPress = async () => {
//         if (!validateForm()) {
//             Alert.alert('Erreur de validation', 'Veuillez remplir tous les champs obligatoires')
//             return
//         }

//         setIsSubmitting(true);
//         console.log(
//             "nomUser", nomUser,
//             "mdpUser", mdpUser,
//             "isSubmitting", isSubmitting
//         )
//         try {
//             const res = await fetch(`${API_URL}/users/signup`, {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({
//                     mdpUser,
//                     username,
//                     nomUser,
//                 }),
//             });
//             const newUser = await res.json();

//             if (typeof newUser != 'undefined') {
//                 Alert.alert('Success', 'compte créé avec succès. Veuillez vous connecter');

//                 setTimeout(() => {
//                     router.replace('/login');
//                 }, 1000);
//             }
//         } catch (err: any) {
//             console.error(JSON.stringify(err, null, 2))
//             Alert.alert("Echec de connection", "veuillez reessayer avec les bons indentifiants");
//         } finally {
//             setIsSubmitting(false);
//         }
//     }
//     return (
//         <KeyboardAvoidingView
//             behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//             style={{ flex: 1 }}
//         >
//             <SafeAreaView className="h-full">
//                 <ScrollView contentContainerStyle={{ flexGrow: 1, marginTop: 20 }}>
//                     <View className="px-4 justify-center flex-1">
//                         <View className="items-center mb-5 ">
//                             <Image
//                                 source={require('../../assets/images/favicon.png')}
//                                 resizeMode='contain'
//                                 className="w-24 h-24 mb-4"
//                             />
//                             <Text className="text-3xl font-bold text-blue-600">S'inscrire</Text>
//                         </View>
//                         <Text className="text-center mb-8 text-gray-600">
//                             Veuillez entrer vos indentifiants de compte
//                         </Text>
//                         <View className="mb-2">
//                             <Text className=" text-gray-700">
//                                 Nom complet
//                                 <Text className='text-red-500'>*</Text>
//                             </Text>
//                             <View className="flex-row items-center border border-gray-300 rounded-lg p-2">
//                                 <Ionicons name="person" size={24} color="#2563eb" />
//                                 <TextInput
//                                     className="flex-1 ml-2 placeholder:text-gray-200 text-black-200"
//                                     placeholder="Entrer votre nom"
//                                     value={nomUser}
//                                     onChangeText={(text: string) => setNomUser(text)}
//                                     keyboardType="email-address"
//                                 />
//                             </View>
//                             {errors.username ? (
//                                 <Text className="text-red-500 text-sm mt-1">{errors.nomUser}</Text>
//                             ) : null}
//                         </View>
//                         <View className="mb-4">
//                             <Text className="mb-2 text-gray-700">
//                                 Nom d'utilisateur
//                                 <Text className='text-red-500'>*</Text>
//                             </Text>
//                             <View className="flex-row items-center border border-gray-300 rounded-lg p-2">
//                                 <Ionicons name="mail" size={24} color="#2563eb" />
//                                 <TextInput
//                                     className="flex-1 ml-2 placeholder:text-gray-200 text-black-200"
//                                     placeholder="Entrer votre adresse username"
//                                     value={username}
//                                     onChangeText={(text: string) => {
//                                         setUsername(text)
//                                         setErrors(prev => ({ ...prev, username: '' }))
//                                     }}
//                                     keyboardType="email-address"
//                                 />
//                             </View>
//                             {errors.username ? (
//                                 <Text className="text-red-500 text-sm mt-1">{errors.username}</Text>
//                             ) : null}
//                         </View>
//                         <View className="mb-4">
//                             <Text className="mb-2 text-gray-700">
//                                 Mot de passe
//                                 <Text className='text-red-500'>*</Text>
//                             </Text>
//                             <FormField
//                                 title={"Mot de passe"}
//                                 value={mdpUser}
//                                 placeholder="Entrez votre mot de passe"
//                                 handleChangeText={(e: string) => {
//                                     setMdpUser(e)
//                                     setErrors(prev => ({ ...prev, password: '' }))
//                                 }}
//                                 inputStyle="placeholder:text-gray-200 text-black-200"
//                             />
//                             {errors.password ? (
//                                 <Text className="text-red-500 text-sm mt-1">{errors.password}</Text>
//                             ) : null}
//                         </View>
//                     </View>
//                     <View className='w-full h-80 rounded-tr-[40px] rounded-tl-[40px]'>
//                         <View className='bg-transparent justify-center'>
//                             <TouchableOpacity
//                                 className="bg-blue-600 rounded-lg p-3 my-4 mx-5"
//                                 onPress={onSignUpPress}
//                             >
//                                 {isSubmitting ?
//                                     <ActivityIndicator size="large" color={Colors.primary} /> :
//                                     <Text className="text-white text-center font-bold">S'INSCRIRE</Text>
//                                 }
//                             </TouchableOpacity>
//                             <View className="flex-row justify-center items-center mt-2">
//                                 <Text className=" text-gray-400 font-extrabold">
//                                     Avez-vous un compte ?
//                                 </Text>
//                                 <TouchableOpacity onPress={() => router.replace('/login')}>
//                                     <Text className="text-lg text-blue-600 font-extrabold ml-2">Se connecter</Text>
//                                 </TouchableOpacity>
//                             </View>
//                         </View>
//                     </View>
//                 </ScrollView>
//             </SafeAreaView>
//         </KeyboardAvoidingView>
//     );
// };

// export default LoginScreen;

import React, { useState } from 'react';
import {
    View, Text, TextInput, TouchableOpacity,
    Image, Alert, KeyboardAvoidingView,
    Platform, ScrollView, Linking
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import FormField from '@/components/form-field';
import { ActivityIndicator } from 'react-native';
import { Colors } from '@/constants';
import { API_URL } from '@/constants/constants';
import Checkbox from 'expo-checkbox';
import OnboardingScreen from './onboarding';

const Register: React.FC = () => {
    const router = useRouter()

    const [nomUser, setNomUser] = React.useState('')
    const [mdpUser, setMdpUser] = React.useState('')
    const [username, setUsername] = React.useState('')
    const [isSubmitting, setIsSubmitting] = React.useState(false)
    const [acceptPrivacy, setAcceptPrivacy] = React.useState(false)
    const [errors, setErrors] = React.useState({
        username: '',
        password: '',
        nomUser: '',
        privacy: ''
    })

    const validateForm = (): boolean => {
        let isValid = true
        const newErrors = {
            username: '',
            password: '',
            nomUser: '',
            privacy: ''
        }

        // Username validation
        if (!username.trim()) {
            newErrors.username = "L'identifiant d'utilisateur est obligatoire"
            isValid = false
        }

        // nom user validation
        if (!nomUser.trim()) {
            newErrors.nomUser = "Le nom d'utilisateur est obligatoire"
            isValid = false
        }

        // Password validation
        if (!mdpUser.trim()) {
            newErrors.password = 'Le mot de passe est obligatoire'
            isValid = false
        }

        // Privacy policy validation
        if (!acceptPrivacy) {
            newErrors.privacy = 'Vous devez accepter les conditions d\'utilisation'
            isValid = false
        }

        setErrors(newErrors)
        return isValid
    }

    const handlePrivacyPolicyPress = async () => {
        // Replace this URL with your actual privacy policy URL
        const privacyPolicyUrl = '/politique-confidentialite';
        // try {
        //     const supported = await Linking.canOpenURL(privacyPolicyUrl);
        //     if (supported) {
        //         await Linking.openURL(privacyPolicyUrl);
        //     } else {
        //         Alert.alert("Erreur", "Impossible d'ouvrir le lien de la politique de confidentialité");
        //     }
        // } catch (error) {
        //     console.error(error);
        //     Alert.alert("Erreur", "Une erreur s'est produite lors de l'ouverture du lien");
        // }
        router.replace(privacyPolicyUrl);
    };

    const onSignUpPress = async () => {
        if (!validateForm()) {
            // Alert.alert('Erreur de validation', 'Veuillez remplir tous les champs obligatoires et accepter les conditions d\'utilisation')
            return
        }

        setIsSubmitting(true);
        try {
            const res = await fetch(`https://unrichunpauvre-rest-api.onrender.com/api/users/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    mdpUser,
                    username,
                    nomUser,
                }),
            });
            const newUser = await res.json();

            if (typeof newUser != 'undefined') {
                Alert.alert('Success', 'compte créé avec succès. Veuillez vous connecter');

                setTimeout(() => {
                    router.replace('/login');
                }, 1000);
            }
        } catch (err: any) {
            console.error(JSON.stringify(err, null, 2))
            Alert.alert("Echec de connection", "veuillez reessayer avec les bons indentifiants");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}
        >
            <SafeAreaView className="h-full">
                <ScrollView contentContainerStyle={{ flexGrow: 1, marginTop: 20 }}>
                    <View className="px-4 justify-center flex-1">
                        <View className="items-center mb-5 ">
                            <Image
                                source={require('../../assets/images/favicon.png')}
                                resizeMode='contain'
                                className="w-24 h-24 mb-4"
                            />
                            <Text className="text-3xl font-bold text-blue-600">S'inscrire</Text>
                        </View>
                        <Text className="text-center mb-8 text-gray-600">
                            Veuillez entrer vos identifiants de compte
                        </Text>
                        <View className="mb-2">
                            <Text className=" text-gray-700">
                                Pseudo
                                <Text className='text-red-500'>*</Text>
                            </Text>
                            <View className="flex-row items-center border border-gray-300 rounded-lg p-2">
                                <Ionicons name="person" size={24} color="#2563eb" />
                                <TextInput
                                    className="flex-1 ml-2 placeholder:text-gray-200 text-black-200"
                                    placeholder="Entrer votre nom"
                                    value={nomUser}
                                    onChangeText={(text: string) => setNomUser(text)}
                                    keyboardType="email-address"
                                />
                            </View>
                            {errors.nomUser ? (
                                <Text className="text-red-500 text-sm mt-1">{errors.nomUser}</Text>
                            ) : null}
                        </View>
                        <View className="mb-4">
                            <Text className="mb-2 text-gray-700">
                                email
                                <Text className='text-red-500'>*</Text>
                            </Text>
                            <View className="flex-row items-center border border-gray-300 rounded-lg p-2">
                                <Ionicons name="mail" size={24} color="#2563eb" />
                                <TextInput
                                    className="flex-1 ml-2 placeholder:text-gray-200 text-black-200"
                                    placeholder="Entrer votre adresse username"
                                    value={username}
                                    onChangeText={(text: string) => {
                                        setUsername(text)
                                        setErrors(prev => ({ ...prev, username: '' }))
                                    }}
                                    keyboardType="email-address"
                                />
                            </View>
                            {errors.username ? (
                                <Text className="text-red-500 text-sm mt-1">{errors.username}</Text>
                            ) : null}
                        </View>
                        <View className="mb-4">
                            <Text className="mb-2 text-gray-700">
                                Mot de passe
                                <Text className='text-red-500'>*</Text>
                            </Text>
                            <FormField
                                title={"Mot de passe"}
                                value={mdpUser}
                                placeholder="Entrez votre mot de passe"
                                handleChangeText={(e: string) => {
                                    setMdpUser(e)
                                    setErrors(prev => ({ ...prev, password: '' }))
                                }}
                                inputStyle="placeholder:text-gray-200 text-black-200"
                            />
                            {errors.password ? (
                                <Text className="text-red-500 text-sm mt-1">{errors.password}</Text>
                            ) : null}
                        </View>

                        {/* Privacy Policy Checkbox */}
                        {/* <View className="mb-4 flex-row items-center">
                            <Checkbox
                                value={acceptPrivacy}
                                onValueChange={(value) => {
                                    setAcceptPrivacy(value)
                                    setErrors(prev => ({ ...prev, privacy: '' }))
                                }}
                                color={acceptPrivacy ? '#2563eb' : undefined}
                                className="mr-2"
                            />
                            <Text className="flex-1 text-gray-700">
                                J'accepte les conditions d'utilisation et la politique de confidentialité
                                <Text className='text-red-500'>*</Text>
                            </Text>
                        </View>
                        {errors.privacy ? (
                            <Text className="text-red-500 text-sm mt-1 mb-2">{errors.privacy}</Text>
                        ) : null} */}

                        <View className="mb-4">
                            <View className="flex-row items-start">
                                <Checkbox
                                    value={acceptPrivacy}
                                    onValueChange={(value) => {
                                        setAcceptPrivacy(value)
                                        setErrors(prev => ({ ...prev, privacy: '' }))
                                    }}
                                    color={acceptPrivacy ? '#2563eb' : undefined}
                                    className="mr-2 mt-1"
                                />
                                <View className="flex-1">
                                    <Text className="text-gray-700">
                                        <Text> J'accepte les</Text>
                                        <Text
                                            className="text-blue-600 underline"
                                            onPress={handlePrivacyPolicyPress}
                                        >
                                            conditions d'utilisation et la politique de confidentialité
                                        </Text>
                                        <Text className='text-red-500'>*</Text>
                                    </Text>
                                </View>
                            </View>
                            {errors.privacy ? (
                                <Text className="text-red-500 text-sm mt-1 mb-2">{errors.privacy}</Text>
                            ) : null}
                        </View>
                    </View>
                    <View className='w-full h-80 rounded-tr-[40px] rounded-tl-[40px]'>
                        <View className='bg-transparent justify-center'>
                            <TouchableOpacity
                                className="bg-blue-600 rounded-lg p-3 my-4 mx-5"
                                onPress={onSignUpPress}
                            >
                                {isSubmitting ?
                                    <ActivityIndicator size="large" color={Colors.primary} /> :
                                    <Text className="text-white text-center font-bold">S'INSCRIRE</Text>
                                }
                            </TouchableOpacity>
                            <View className="flex-row justify-center items-center mt-2">
                                <Text className=" text-gray-400 font-extrabold">
                                    Avez-vous un compte ?
                                </Text>
                                <TouchableOpacity onPress={() => router.replace('/login')}>
                                    <Text className="text-lg text-blue-600 font-extrabold ml-2">Se connecter</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </KeyboardAvoidingView>
    );
};

export default Register;