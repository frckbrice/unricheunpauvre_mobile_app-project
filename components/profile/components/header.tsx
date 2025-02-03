
import React from 'react';
import { View, Text, Image, } from 'react-native';



const Header = () => (
    <View className="flex-row 
    justify-evenly items-center px-10 py-4 pt-2 bg-gray-900 gap-6">
        <Text className="text-white text-sm">Donner pour aider</Text>
        <Image source={require('../../../assets/images/adaptive-icon.png')} className="w-14 h-14" />
        <Text className="text-white text-sm">Recevoir pour rêver</Text>
    </View>
);

export default Header;
