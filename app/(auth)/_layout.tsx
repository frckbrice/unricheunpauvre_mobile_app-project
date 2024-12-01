//libraries
import { Stack, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { Component } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";


export default function AuthLayout() {
    const router = useRouter();

    return (
        <>
            <Stack>
                <Stack.Screen
                    name="login"
                    options={{
                        headerShown: false,
                    }}
                />
                <Stack.Screen
                    name="register"
                    options={{
                        headerShown: false,
                    }}
                />

            </Stack>

            <StatusBar style="auto" />
        </>
    );
}