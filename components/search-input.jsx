//libraries
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { router, usePathname } from "expo-router";

//constants
import { icons } from "../constants";

const SearchInput = ({ placeholder }) => {
  // const pathName = usePathname();
  const [query, setQuery] = useState("");

  const handleRouting = () => {
    if (!query) {
      return Alert.alert("Missing query", "Please enter a search query");
    }
    router.push(`/(tabulate)/${query}`);
  };

  return (
    <View className="border-2 border-black-200 rounded-2xl w-full px-4 h-16 focus:border-secondary items-center bg-black-100 flex-row justify-between space-x-4">
      <TextInput
        placeholder={placeholder}
        className="font-pregular text-white mt-0.5 flex-1 font-psemibold text-base "
        value={query}
        onChangeText={(text) => setQuery(text)}
        placeholderTextColor={"#CDCDE0"} // make it pop just a bit.
      />
      <TouchableOpacity onPress={handleRouting}>
        <Image source={icons.search} className="w-5 h-5" resizeMode="contain" />
      </TouchableOpacity>
    </View>
  );
};

export default SearchInput;
