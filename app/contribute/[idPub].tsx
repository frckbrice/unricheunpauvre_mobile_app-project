// import React, { useEffect, useState } from 'react';
// import {
//     View, Text, Image,
//     TouchableOpacity,
//     Alert,
// } from 'react-native';

// import { Category, Don, } from '@/lib/types';
// import { uploadResourceData, } from '@/lib/api';

// import { useForm, } from 'react-hook-form';

// import { SafeAreaView } from 'react-native-safe-area-context';
// import { useLocalSearchParams, useRouter } from 'expo-router';
// import useUserGlobal from '@/hooks/use-user-hook';
// import { Ionicons } from '@expo/vector-icons';
// import useAuthorAndPubGlobal from '@/hooks/current-post-author';
// import { DonationForm } from '@/components/don/components/donation-form';



// const Contribute: React.FC = () => {

//     const [form, setForm] = useState<{ nomDons: string, montantDons: number }>({
//         nomDons: '',
//         montantDons: 0
//     });

//     const { control, handleSubmit } = useForm<Don>();
//     const { currentUser } = useUserGlobal();


//     const { idPub } = useLocalSearchParams();
//     const router = useRouter();

//     // get current post author and curretn post.
//     const { postAuthor, currentPub, refetch } = useAuthorAndPubGlobal();
//     useEffect(() => {
//         if (!postAuthor)
//             refetch();
//     }, [postAuthor]);

//     const onSubmit = async (data: Don) => {
//         const formData = {
//             ...form,
//             idPub: Number(idPub),
//             IdUser: currentUser?.IdUser,
//             dateDons: new Date().toISOString(),
//         }
//         console.log("don to send: ", formData)
//         try {
//             console.log("from data: ", formData);
//             const result = await uploadResourceData(formData, "Don",);
//             if (typeof result != 'undefined' && result) {
//                 Alert.alert('Success', 'Donation created successfully');
//                 router.push('/accueil')
//             }

//             else {
//                 console.error("fail to create donation.");
//                 Alert.alert('Error', 'Failed to contribute.');
//             }
//         } catch (error) {
//             console.error(`Error creating a donation: ${error}, Please try again`);
//         }
//     };
//     console.log("postAuthor: ", postAuthor);

//     return (
//         <SafeAreaView className="flex-1 bg-gray-900 ">
//             <View className="p-4 justify-center ">
//                 <View className='flex-row items-center my-5'>
//                     <TouchableOpacity onPress={() => router.push('/accueil')} className='mr-2 p-2 rounded-full bg-slate-300 mb-2'>
//                         <Ionicons name="arrow-back" size={24} color="white" />
//                     </TouchableOpacity>
//                     <Text className="text-white text-xl font-bold mb-4">Contribuer a la publication </Text>
//                 </View>
//                 <Text className="text-white text-sm  mb-4 ">
//                     Auteur: {postAuthor?.nomUser ?? "Admin platform"}</Text>
//                 <Text className="text-white text-sm  mb-4 ">
//                     Poste le {new Date(currentPub?.timeAgo as string).toDateString()} a {new Date(currentPub?.timeAgo as string).toLocaleTimeString()}</Text>
//                 <View className="flex-row items-center mb-4">
//                     <Image source={{ uri: 'https://unsplash.com/photos/-F9NSTwlnjo/download?ixid=M3wxMjA3fDB8MXxzZWFyY2h8MTl8fGNoYXJpdHl8ZW58MHx8fHwxNzI4MzIxOTIxfDA&force=true' }} className="w-10 h-10 rounded-full mr-2" />
//                     <Text className="text-white">un riche un pauvre</Text>
//                 </View>
//             </View>

//             <View className=" justify-center ">
//                 <DonationForm />
//             </View >
//         </SafeAreaView >

//     );
// };

// export default Contribute;

import React from "react";
import { View, StyleSheet } from "react-native";
import { WebView } from "react-native-webview";

export default function PayPalDonation() {
    const paypalDonationURL = "https://www.paypal.com/donate?hosted_button_id=" + process.env.EXPO_PUBLIC_PAYPAL_DONNATION_BUTTON_ID;

    return (
        <View style={styles.container}>
            <WebView
                source={{ uri: paypalDonationURL }}
                style={styles.webview}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                startInLoadingState={true}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 20
    },
    webview: {
        flex: 1,
    },
});
