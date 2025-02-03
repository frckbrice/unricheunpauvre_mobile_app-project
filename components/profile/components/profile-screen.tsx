import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, Text, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { getAllResourcesByTarget } from '@/lib/api';
import { Jaime, Publication } from '@/lib/types';
import useUserGlobal from '@/hooks/use-user-hook';
import { Colors } from '@/constants';
import { ProfileClickArea, ProfileModal } from './profile-details';

type TProfileScreen = {
    postsNumber: number;
    likesNumber: number;
    islikeLoading?: boolean;
    isPostsLoading?: boolean
}

const ProfileScreen: React.FC<TProfileScreen> = ({
    likesNumber,
    postsNumber,
    isPostsLoading,
    islikeLoading
}) => {

    const { currentUser, currentUserObj } = useUserGlobal();

    const router = useRouter();
    const [likes, setLikes] = useState(0);
    // const [islikeLoading, setIsLikeLoading] = useState(false);
    const [posts, setPosts] = useState(0);
    // const [isPostsLoading, setIsPostsLoading] = useState(false);

    const [isProfileModalVisible, setIsProfileModalVisible] = useState(false);


    // const getAllLikes = useCallback(async () => {
    //     setIsLikeLoading(true);
    //     try {
    //         const allLikes = await getAllResourcesByTarget(
    //             'likes', currentUser?.userId || currentUserObj?.id, 'idUser');
    //         console.log("all likes: ", allLikes?.data);
    //         setLikes(allLikes?.data.length);
    //     } catch (error) {
    //         console.error('Failed to get all likes:', error);
    //     } finally {
    //         setIsLikeLoading(false);
    //     }
    // }, [getAllResourcesByTarget, setLikes, setIsLikeLoading]);

    // const getAllUserPublications = useCallback(async () => {
    //     setIsPostsLoading(true);
    //     try {
    //         const posts = await getAllResourcesByTarget(
    //             'publications', currentUser?.userId || currentUserObj?.id, 'idUser');
    //         console.log("all posts: ", posts.data);
    //         setPosts(posts?.data.length);
    //     } catch (error) {
    //         console.error('Failed to get all posts:', error);
    //     } finally {
    //         setIsPostsLoading(false);
    //     }
    // }, [getAllResourcesByTarget, setPosts, setIsPostsLoading])

    // useEffect(() => {
    //     console.log("\n\n from profile screen file currentUser: ", currentUser)
    //     getAllLikes();
    //     getAllUserPublications();
    // }, []);

    console.log("\n\n from profile file:  the likes are: ", likes)


    return (
        <>
            <View className="bg-gray-900 ">
                <View className="flex-row items-center mb-2 px-4 bg-gray-800 p-2 rounded-tl-xl rounded-tr-xl">
                    <Image source={{ uri: currentUserObj?.photoUser ?? 'https://unsplash.com/photos/-F9NSTwlnjo/download?ixid=M3wxMjA3fDB8MXxzZWFyY2h8MTl8fGNoYXJpdHl8ZW58MHx8fHwxNzI4MzIxOTIxfDA&force=true' }} className="w-12 h-12 rounded-full mr-4" />
                    <View>
                        <Text className="text-white text-[14.5px] font-bold">{currentUser?.nomUser ?? "Anonymous"} </Text>
                        <Text className="text-gray-400">{currentUserObj?.localisation ?? "ville inconnue"}</Text>
                    </View>
                </View>

                {/* <View className="flex-row items-center mb-1 bg-gray-800 p-2 rounded-tl-xl rounded-tr-xl before:absolute before:top-0 before:left-0 before:w-full before:h-1 before:bg-gray-700">

                    <ProfileClickArea
                        user={currentUserObj as any}
                        onPress={() => setIsProfileModalVisible(true)}
                    />

                    <ProfileModal
                        isVisible={isProfileModalVisible}
                        onClose={() => setIsProfileModalVisible(false)}
                        user={currentUserObj as any}
                    />
                </View> */}

                <View className="flex-row justify-around mb-4">
                    <View>
                        <Text className="text-white text-center font-bold">
                            {/* {isPostsLoading
                                ? <ActivityIndicator size="large" color={Colors.primary} />
                                : posts || 0} */}
                            {isPostsLoading
                                ? <ActivityIndicator size="large" color={Colors.primary} />
                                : postsNumber || 0}
                        </Text>
                        <Text className="text-gray-400">Rêves</Text>
                    </View>
                    <View>
                        <Text className="text-white text-center font-bold">
                            {/* {islikeLoading ? (
                                <ActivityIndicator size="large" color={Colors.primary} />
                            ) : likes ?? 0} */}
                            {islikeLoading ? (
                                <ActivityIndicator size="large" color={Colors.primary} />
                            ) : likesNumber ?? 0}
                        </Text>
                        <Text className="text-gray-400">J'aime</Text>
                    </View>
                </View>
                <TouchableOpacity
                    className="bg-blue-500 p-2 ml-4 rounded-xl mb-1 w-[90%]"
                    onPress={() => router.push("/(settings)/edit-profile")}
                >
                    <Text className="text-white text-center">Éditer profil</Text>
                </TouchableOpacity>
            </View>
        </>
    );
};

export default ProfileScreen;

// import React, { useCallback, useEffect, useMemo, useState } from 'react';
// import {
//     View, Text,
//     Image, TouchableOpacity, ActivityIndicator
// } from 'react-native';
// import { useRouter, } from 'expo-router';
// import { getAllResourcesByTarget } from '@/lib/api';
// import useUserGlobal from '@/hooks/use-user-hook';
// import { Colors } from '@/constants';
// import useApiOps from '@/hooks/use-api';

// const ProfileScreen = () => {
//     const { currentUser, currentUserObj } = useUserGlobal();
//     const router = useRouter();

//     const [likes, setLikes] = useState([]);
//     const [posts, setPosts] = useState([]);
//     const [isPostsLoading, setIsLoading] = useState(false);
//     const [isLikesLoading, setIsLikesLoading] = useState(false);

//     // const {
//     //     data,
//     //     refetch,
//     // } = useApiOps(() => getAllResourcesByTarget('likes', currentUser?.userId, 'idUser'));

//     // const {
//     //     data: dataPubs,
//     //     refetch: refetchPubs,
//     // } = useApiOps(() => getAllResourcesByTarget('publications', currentUser?.userId, 'idUser'));

//     // console.log("\n\n from profile screen file currentUser: ", data, dataPubs);


//     useEffect(() => {
//         const getCurrentPubLike = async () => {
//             const data = await getAllResourcesByTarget('likes', currentUser?.userId, 'idUser');
//             const dataPubs = await getAllResourcesByTarget('publications', currentUser?.userId, 'idUser');

//             console.log("\n\n from profile screen file currentUser: ", data, dataPubs);
//             setLikes(data?.data);
//             setPosts(dataPubs?.data);
//         }
//         getCurrentPubLike();
//     }, [])

//     const stats = useMemo(() => ({
//         likes: likes?.length || 0,
//         posts: posts?.length || 0
//     }), [likes, posts]);

//     const profileImage = useMemo(() => ({
//         uri: currentUserObj?.photoUser || 'https://unsplash.com/photos/-F9NSTwlnjo/download?ixid=M3wxMjA3fDB8MXxzZWFyY2h8MTl8fGNoYXJpdHl8ZW58MHx8fHwxNzI4MzIxOTIxfDA&force=true'
//     }), [currentUserObj?.photoUser]);

//     const StatBlock = ({ value, label }: {
//         value: number;
//         label: string;
//     }) => (
//         <View>
//             <Text className="text-white text-center font-bold">
//                 {value}
//             </Text>
//             <Text className="text-gray-400">{label}</Text>
//         </View>
//     );

//     return (
//         <View className="bg-gray-900">
//             <View className="flex-row items-center mb-2 px-4 bg-gray-800 p-2 rounded-tl-xl rounded-tr-xl">
//                 <Image source={{ uri: currentUserObj?.photoUser || 'https://unsplash.com/photos/-F9NSTwlnjo/download?ixid=M3wxMjA3fDB8MXxzZWFyY2h8MTl8fGNoYXJpdHl8ZW58MHx8fHwxNzI4MzIxOTIxfDA&force=true' }} className="w-12 h-12 rounded-full mr-4" />
//                 <View>
//                     <Text className="text-white text-[14.5px] font-bold">
//                         {currentUser?.nomUser ?? "Anonymous"}
//                     </Text>
//                     <Text className="text-gray-400">
//                         {currentUserObj?.localisation ?? "Anonymous"}
//                     </Text>
//                 </View>
//             </View>

//             <View className="flex-row justify-around mb-4">
//                 <StatBlock
//                     value={stats.posts}
//                     label="Rêves"
//                 />
//                 <StatBlock
//                     value={stats.likes}
//                     label="J'aime"
//                 />
//             </View>

//             <TouchableOpacity
//                 className="bg-blue-500 p-2 ml-4 rounded-xl mb-1 w-[90%]"
//                 onPress={() => router.push("/(settings)/edit-profile")}
//             >
//                 <Text className="text-white text-center">Éditer profil</Text>
//             </TouchableOpacity>
//         </View>
//     );
// };

// export default ProfileScreen;
