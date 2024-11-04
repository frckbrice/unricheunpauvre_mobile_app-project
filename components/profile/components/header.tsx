
import React from 'react';
import { View, Text, Image, } from 'react-native';



const Header = () => (
    <View className="flex-row 
    justify-between items-center px-10 py-4 pt-2 bg-gray-900">
        <Text className="text-white text-xs">Donner pour aider</Text>
        <Image source={require('../../../assets/images/adaptive-icon.png')} className="w-8 h-8" />
        <Text className="text-white text-xs">Recevoir pour rêver</Text>
    </View>
);

export default Header;
