//libraries
import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";
import React, { useState } from "react";

//constants
import { Colors, icons } from "../constants";
import { Ionicons } from "@expo/vector-icons";

type FProps = {
  title: string,
  value: string,
  placeholder: string,
  handleChangeText: (str: string) => void,
  inputStyle: string,
};

const FormField = ({
  title,
  value,
  placeholder,
  handleChangeText,
  inputStyle,
}: FProps) => {
  const [showPasswd, setShowpwd] = useState(false);

  return (
    <View className="space-y-2">
      {/* <Text className="text-base  font-semibold">{title}</Text> */}

      <View className="flex-row items-center border border-gray-300 rounded-lg p-2">
        {title === 'email' ? (
          <Ionicons name="mail" size={24} color="gray" />
        ) : title === "Password" ? (
          <Ionicons name="lock-closed" size={24} color="#2563eb" />
        ) : null}

        <TextInput
          placeholder={placeholder}
          value={value}
          onChangeText={handleChangeText}
          placeholderTextColor={"#404757"}
          secureTextEntry={title === "Password" && !showPasswd}
          className={`flex-1 ml-2 placeholder:text-gray-200`}
        />
        {title === "Password" && (
          <TouchableOpacity
            // name={showPasswd ? "eye-off" : "eye"}
            // size={18}
            // color="#7b7b8b"
            onPress={() => setShowpwd((value) => !value)}
          >
            <Image
              source={!showPasswd ? icons.eye : icons.eyeHide}
              className="w-6 h-6"
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default FormField;
