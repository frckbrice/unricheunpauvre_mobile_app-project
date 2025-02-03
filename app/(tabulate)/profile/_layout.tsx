import React, { Profiler, useCallback, useEffect, useState } from 'react';
import {
    createMaterialTopTabNavigator,
    MaterialTopTabNavigationOptions,
    MaterialTopTabNavigationEventMap
} from "@react-navigation/material-top-tabs";

import { ParamListBase, TabNavigationState } from "@react-navigation/native";
import { withLayoutContext } from "expo-router";
import { Header, ProfileScreen } from '@/components/profile';
import useUserGlobal from '@/hooks/use-user-hook';
import { getAllResourcesByTarget } from '@/lib/api';


const { Navigator } = createMaterialTopTabNavigator();

export const MaterialTopTabs = withLayoutContext<
    MaterialTopTabNavigationOptions,
    typeof Navigator,
    TabNavigationState<ParamListBase>,
    MaterialTopTabNavigationEventMap
>(Navigator);

export default function TrainingLayout() {


    const { currentUser, currentUserObj } = useUserGlobal();

    const [likes, setLikes] = useState(0);
    const [islikeLoading, setIsLikeLoading] = useState(false);
    const [posts, setPosts] = useState(0);
    const [isPostsLoading, setIsPostsLoading] = useState(false);
    const getAllLikes = useCallback(async () => {
        setIsLikeLoading(true);
        try {
            const allLikes = await getAllResourcesByTarget(
                'likes', currentUser?.userId || currentUserObj?.id, 'idUser');
            console.log("all likes: ", allLikes?.data);
            setLikes(allLikes?.data.length);
        } catch (error) {
            console.error('Failed to get all likes:', error);
        } finally {
            setIsLikeLoading(false);
        }
    }, [getAllResourcesByTarget, setLikes, setIsLikeLoading]);

    const getAllUserPublications = useCallback(async () => {
        setIsPostsLoading(true);
        try {
            const posts = await getAllResourcesByTarget(
                'publications', currentUser?.userId || currentUserObj?.id, 'idUser');
            console.log("all posts: ", posts.data);
            setPosts(posts?.data.length);
        } catch (error) {
            console.error('Failed to get all posts:', error);
        } finally {
            setIsPostsLoading(false);
        }
    }, [getAllResourcesByTarget, setPosts, setIsPostsLoading]);

    useEffect(() => {
        console.log("\n\n from profile screen file currentUser: ", currentUser)

        setTimeout(async () => {
            getAllLikes();
            getAllUserPublications();
        }, 2000)
    }, []);


    return (
        <>
            <Header />
            <ProfileScreen
                likesNumber={likes}
                postsNumber={posts}
                isPostsLoading={isPostsLoading}
                islikeLoading={islikeLoading}
            />
            <MaterialTopTabs
                screenOptions={{
                    tabBarActiveTintColor: '#fff',
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
                        height: 47,
                        marginBottom: 0,
                        // borderTopRightRadius: 20,
                        // borderTopLeftRadius: 20,
                        // marginTop: 2
                    }

                }}
            >
                <MaterialTopTabs.Screen name="index" options={{ title: 'Rêves' }} />
                <MaterialTopTabs.Screen name="about" options={{ title: 'A propos ' }} />
                <MaterialTopTabs.Screen name="favorites" options={{ title: 'Favoris' }} />
            </MaterialTopTabs>
        </>

    )
} 
