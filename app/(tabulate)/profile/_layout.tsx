import React, { Profiler } from 'react';
import {
    createMaterialTopTabNavigator,
    MaterialTopTabNavigationOptions,
    MaterialTopTabNavigationEventMap
} from "@react-navigation/material-top-tabs";

import { ParamListBase, TabNavigationState } from "@react-navigation/native";
import { withLayoutContext } from "expo-router";
import { Header, ProfileScreen } from '@/components/profile';
import { ScrollView } from 'react-native';

const { Navigator } = createMaterialTopTabNavigator();

export const MaterialTopTabs = withLayoutContext<
    MaterialTopTabNavigationOptions,
    typeof Navigator,
    TabNavigationState<ParamListBase>,
    MaterialTopTabNavigationEventMap
>(Navigator);

export default function TrainingLayout() {
    return (
        <>
            <Header />
            <ProfileScreen />
            <MaterialTopTabs
                screenOptions={{
                    tabBarActiveTintColor: '#3b82f6',
                    tabBarInactiveTintColor: 'gray',
                    tabBarLabelStyle: {
                        fontSize: 15,
                        fontWeight: 'bold',
                        textTransform: 'capitalize',
                        padding: 0,
                    },
                    tabBarStyle: {
                        width: "100%",
                        backgroundColor: '#111827',
                        height: 45,
                        marginBottom: 0,
                    }

                }}
            >
                <MaterialTopTabs.Screen name="index" options={{ title: 'Publications' }} />
                <MaterialTopTabs.Screen name="about" options={{ title: 'A propos' }} />
                <MaterialTopTabs.Screen name="favorites" options={{ title: 'Favories' }} />
            </MaterialTopTabs>
        </>

    )
} 
