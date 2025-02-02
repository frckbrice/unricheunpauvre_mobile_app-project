
import React from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
const NotificationsScreen: React.FC = () => {
    const notifications = [
        { id: '1', icon: 'person-outline', type: 'welcome', message: 'Bienvenue sur Un riche un pauvre', time: 'il y a un mois' },
        { id: '2', icon: 'chatbox-ellipses', type: 'comment', message: 'Nouveau commentaire', time: 'il y a un mois' },
        { id: '3', icon: 'thumbs-up-sharp', type: 'like', message: 'Vous avez reçu un nouveau like', time: 'il y a 2 mois' },
        { id: '4', icon: 'cash-outline', type: 'payment', message: 'Nouvelle méthode de paiement ajouté', time: 'il y a 2 mois' },
    ];

    return (
        <ScrollView className="flex-1 bg-gray-900 p-4">
            <View className="p-4 my-10">


                {notifications.map((notification) => (
                    <View key={notification.id} className="bg-gray-800 p-4 rounded mb-2 flex-row items-center gap-5">
                        <View>
                            <Ionicons name={notification.icon as any} size={24} color="white" />
                        </View>
                        <View>
                            <Text className="text-white font-bold">{notification.message}</Text>
                            <Text className="text-gray-400">{notification.time}</Text>
                        </View>

                    </View>
                ))}
            </View>
        </ScrollView>
    );
};

export default NotificationsScreen;
