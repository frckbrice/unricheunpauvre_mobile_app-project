// import React from 'react';
// import { View, Text, Image, TouchableOpacity, ScrollView, TextInput } from 'react-native';


const ProfileScreen: React.FC = () => {

  const { user } = useUser()

  const router = useRouter()
  return (
    <View className="">
      <View className="px-4">
        <View className="flex-row items-center mb-4">
          <Image source={{ uri: 'https://unsplash.com/photos/-F9NSTwlnjo/download?ixid=M3wxMjA3fDB8MXxzZWFyY2h8MTl8fGNoYXJpdHl8ZW58MHx8fHwxNzI4MzIxOTIxfDA&force=true' }} className="w-20 h-20 rounded-full mr-4" />
          <View>
            <Text className="text-white text-xl font-bold">{user?.username ?? user?.fullName ? user?.fullName : "NO NAME"} </Text>
            <Text className="text-gray-400">{user?.emailAddresses[0].emailAddress ?? "NO EMAIL"}</Text>
          </View>
        </View>
        <View className="flex-row justify-around mb-4">
          <View>
            <Text className="text-white text-center font-bold">2</Text>
            <Text className="text-gray-400">Publications</Text>
          </View>
          <View>
            <Text className="text-white text-center font-bold">1</Text>
            <Text className="text-gray-400">J'aime</Text>
          </View>
        </View>
        <TouchableOpacity
          className="bg-gray-800 p-2 rounded mb-4"
          onPress={() => router.push("/(settings)/edit-profile")}
        >
          <Text className="text-white text-center">Éditer profil</Text>
        </TouchableOpacity>
        <View className="flex-row justify-around mb-4">
          <TouchableOpacity className="border-b-2 border-blue-500 pb-2" >
            <Text className="text-white">Publication</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push("/(settings)/edit-profile")}>
            <Text className="text-gray-400">A propos de moi</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text className="text-gray-400">Favoris</Text>
          </TouchableOpacity>
        </View>
        {/* Add profile posts here, similar to HomeScreen */}
      </View>
    </View>
  );
};

import React from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useUser } from '@clerk/clerk-expo';

const Header = () => (
  <View className="flex-row justify-between items-center px-4 py-2 bg-gray-900">
    <Text className="text-white text-sm">Donner pour aider</Text>
    <Image source={require('../../assets/images/adaptive-icon.png')} className="w-8 h-8" />
    <Text className="text-white text-sm">Recevoir pour rêver</Text>
  </View>
);

const PostCard = ({
  name,
  location,
  time,
  content,
  imageUrl }: { name: string; location: string; time: string; content: string; imageUrl: string; }) => (

  <View className="bg-gray-800 rounded-lg p-4 mb-4">
    <View className="flex-row items-center mb-2">
      <Image source={
        { uri: 'https://unsplash.com/photos/-F9NSTwlnjo/download?ixid=M3wxMjA3fDB8MXxzZWFyY2h8MTl8fGNoYXJpdHl8ZW58MHx8fHwxNzI4MzIxOTIxfDA&force=true' }}
        className="w-10 h-10 rounded-full mr-2" />
      <View>
        <Text className="text-white font-medium">{name}</Text>
        <Text className="text-gray-400 text-sm">{location}</Text>
      </View>
      <Text className="text-gray-400 text-sm ml-auto">{time}</Text>
    </View>
    <Text className="text-white mb-2">{content}</Text>
    <Image source={{ uri: imageUrl }} className="w-full h-48 rounded-lg mb-2" />

  </View>
);

const BottomTab = () => (
  <View className="flex-row justify-between items-center px-4 py-2 bg-gray-900">
    <Ionicons name="home-outline" size={24} color="white" />
    <Ionicons name="search-outline" size={24} color="white" />
    <Ionicons name="add-circle-outline" size={24} color="white" />
    <Ionicons name="notifications-outline" size={24} color="white" />
    <Ionicons name="person-outline" size={24} color="white" />
  </View>
);

const SocialFeedScreen = () => {
  return (
    <SafeAreaView className="flex-1 bg-gray-900 p-4">
      <Header />
      <ProfileScreen />
      <ScrollView>
        <PostCard
          name="un riche un pauvre"
          location="Paris Charles de Gaules"
          time="il y a un mois"
          content="See the impact of your donations. Our app provides transparency into how your contributions are used, so you can feel confident in your support."
          imageUrl='https://media.istockphoto.com/id/1162529718/photo/fealing-generous-becous-of-helping-to-other.jpg?s=612x612&w=0&k=20&c=Rq9YrcVlT13KsKolfG-fWjlx3mJVCWhIt1a2AB2m1CU='

        />

      </ScrollView>
      {/* <BottomTab /> */}
    </SafeAreaView>
  );
};

export default SocialFeedScreen;


/**
 * import React from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const Header = () => (
  <View className="flex-row justify-between items-center px-4 py-2 bg-gray-900">
    <Text className="text-white text-sm">Donner pour aider</Text>
    <Image source={require('./assets/logo.png')} className="w-8 h-8" />
    <Text className="text-white text-sm">Recevoir pour rêver</Text>
  </View>
);

const PostCard = ({ name, location, time, content, imageUrl }) => (
  <View className="bg-gray-800 rounded-lg m-2 p-4">
    <View className="flex-row items-center mb-2">
      <Image source={{ uri: 'https://placeholder.com/30' }} className="w-10 h-10 rounded-full mr-2" />
      <View>
        <Text className="text-white font-bold">{name}</Text>
        <Text className="text-gray-400 text-xs">{location} • {time}</Text>
      </View>
    </View>
    <Text className="text-white mb-2">{content}</Text>
    <Image source={{ uri: imageUrl }} className="w-full h-48 rounded-lg mb-2" />
    <View className="flex-row justify-between">
      <TouchableOpacity className="bg-blue-500 px-4 py-2 rounded-full">
        <Text className="text-white">Réaliser</Text>
      </TouchableOpacity>
      <TouchableOpacity className="bg-blue-500 px-4 py-2 rounded-full">
        <Text className="text-white">Contribuer</Text>
      </TouchableOpacity>
    </View>
    <View className="flex-row items-center mt-2">
      <Ionicons name="chatbubble-outline" size={20} color="white" />
      <Text className="text-white ml-1 mr-4">4</Text>
      <Ionicons name="heart-outline" size={20} color="white" />
      <Text className="text-white ml-1">1</Text>
    </View>
  </View>
);

const BottomTab = () => (
  <View className="flex-row justify-between items-center px-4 py-2 bg-gray-900">
    <Ionicons name="home-outline" size={24} color="white" />
    <Ionicons name="search-outline" size={24} color="white" />
    <Ionicons name="add-circle-outline" size={24} color="white" />
    <Ionicons name="notifications-outline" size={24} color="white" />
    <Ionicons name="person-outline" size={24} color="white" />
  </View>
);

const SocialFeedScreen = () => {
  return (
    <SafeAreaView className="flex-1 bg-black">
      <Header />
      <ScrollView>
        <PostCard
          name="Raphael Hiol"
          location="Cameroun, Douala"
          time="il y a un mois"
          content="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut..."
          imageUrl="https://example.com/image.jpg"
        />
      
        </ScrollView>
        <BottomTab />
      </SafeAreaView>
    );
  };
  
  export default SocialFeedScreen;
 */