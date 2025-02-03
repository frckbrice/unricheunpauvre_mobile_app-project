import {
    View, Text,
    TouchableOpacity, ScrollView, Alert,

} from 'react-native'
import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import { Jaime, Post, User } from '@/lib/types';
import { Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { deleteResourceData, deleteResourceWithUserAndPub, getAllResourcesByTarget, getSingleResource, updateResource, uploadResourceData } from '@/lib/api';
import useApiOps from '@/hooks/use-api';
import useUserGlobal from '@/hooks/use-user-hook';

import { useRouter } from 'expo-router';

import * as SecureStore from 'expo-secure-store'

import { EnhancedCommentSection, ExtendedComment } from './custom-comment-components';

import Share from 'react-native-share';
import { ProfileClickArea, ProfileModal } from './profile/components/profile-details';
import { MenuOverlay } from './publication/menu-overlay';
import PostImage from './post-image-viewing';

type TPost = {
    post: Post;
    postAuthor?: User | null;
    isPostDetail?: boolean;
}

const PublicationPost = ({ post, isPostDetail }: TPost) => {

    const mounted = useRef(false);
    const [isMenuVisible, setIsMenuVisible] = useState(false);

    // const {
    //     data: postAuthor,
    //     isLoading: isLoadingPostAuthor,
    //     refetch: refetchPostAuthor
    // } = useApiOps<User>(() => {
    //     return getSingleResource('users', post?.idUser as string);
    // });

    const [isFavorite, setIsFavorite] = useState(false);
    const [isliked, setIsliked] = useState(false);
    const [likes, setLikes] = useState(() => post?.likes?.length || 0);
    const [commentCount, setCommentCount] = useState(post?.comments?.length || 0);
    const [comments, setComments] = useState(post?.comments || []);
    const [startComment, setStartComment] = useState<boolean>(false);
    const [isProfileModalVisible, setIsProfileModalVisible] = useState(false);
    const [hasLiked, setHasLiked] = useState(false);

    const { currentUser } = useUserGlobal();
    const router = useRouter();


    // Modify your existing useEffect to use this function
    useEffect(() => {

        // Store the current post to local store
        SecureStore.setItemAsync('post', JSON.stringify(post?.author));
    }, [post]);


    // write a logic to like a post
    const likePost = useCallback(async () => {
        if (!post?.id || !currentUser?.userId) {
            return console.error("Post must exist for a like action", { postID: post?.id, isliked, currentUser });
        }

        try {
            // Create like object
            const likeObj = {
                idPub: post.id,
                idUser: currentUser.userId,
                dateJaime: new Date().toISOString(),
            };

            console.log("Like object:", likeObj);

            if (!hasLiked) {
                // Optimistically update UI
                setLikes(prev => prev + 1);
                setHasLiked(true);

                // Send API request to like the post
                const newLike = await uploadResourceData<Jaime>(likeObj, "likes");

                if (!newLike) {
                    throw new Error("Failed to like post");
                }

                console.log("✅ Post liked successfully");
            } else {
                // Optimistically update UI
                setLikes(prev => prev - 1);
                setHasLiked(false);

                // API request to unlike the post
                const unlikeResponse = await deleteResourceWithUserAndPub("likes", post.id, currentUser.userId);

                if (!unlikeResponse) {
                    throw new Error("Failed to unlike post");
                }

                console.log("❌ Post unliked successfully");
            }
        } catch (error) {
            console.error("Error liking/unliking post:", error);

            // Rollback UI state if the request fails
            setLikes(prev => (hasLiked ? prev + 1 : prev - 1));
            setHasLiked(!hasLiked);
        }
    }, [uploadResourceData, deleteResourceData, post?.id, hasLiked, currentUser]);


    // set ths pub as favorite
    const favoritePost = useCallback(async () => {
        // no post, no like
        setIsFavorite(prev => !prev);
        if (!post?.id || !currentUser?.userId) {
            return console.error("Post and current user must exist.");
        }

        const pubObj = {
            idPub: post.id,
            idUser: currentUser.userId,
        };

        console.log("\n\nFavorite object: ", pubObj);

        try {
            if (isFavorite) {
                // Unfavorite the post (DELETE request)
                setIsFavorite(false); // Optimistic UI update

                const response = await deleteResourceWithUserAndPub('favorites', post.id, currentUser.userId);
                if (!response) {
                    throw new Error("Failed to unfavorite post.");
                }
                console.log("\n\nPost unfavorited: ", response);
            } else {
                // Favorite the post (POST request)
                setIsFavorite(true); // Optimistic UI update

                const newFavorite = await uploadResourceData(pubObj, 'favorites');
                if (!newFavorite) {
                    throw new Error("Failed to favorite post.");
                }
                console.log("\n\nPost set as favorite: ", newFavorite);
            }
        } catch (error) {
            console.error("Error favoriting/unfavoriting post: ", error);
            // Revert UI change if request fails
            setIsFavorite(prev => !prev);
        }
    }, [updateResource, post, isFavorite, currentUser]
    );

    // contribute to a post, open a paypal payment SDK
    const contributeToPub = async () => {
        // no post , no comment
        if (!post.id)
            return Alert.alert("there is no pub for this contribution.");
        return router.push(`/contribute/${post?.id}`)
    }

    // Add menu toggle function
    const toggleMenu = () => {
        setIsMenuVisible(!isMenuVisible);
    };

    // enable comment list
    const toggleComment = () => {
        setStartComment(!startComment)
    };

    // handle share function
    const handleShare = async () => {
        const shareOptions = {
            title: 'Partager ce reve',
            message: `${post?.author?.nomUser} a partagé: ${post.content.substring(0, 50)}...`,
            url: post.imageUrl,
            type: 'image/*'
        };

        try {
            const result = await Share.open(shareOptions);
            console.log("\n\n result: " + result);
        } catch (error) {
            console.error('Error sharing:', error);
        } finally {
            setIsMenuVisible(false); // Close menu after sharing
        }
    };

    // console.log("\n\n post", post)

    return (
        <ScrollView className={'m-3'}>
            <View className="flex-row items-center mb-1 bg-gray-800 p-2 rounded-tl-xl rounded-tr-xl">

                <ProfileClickArea
                    user={post?.author as any}
                    onPress={() => setIsProfileModalVisible(true)}
                    postDate={post?.timeAgo}
                />

                <View className="ml-auto mr-2 relative">
                    <TouchableOpacity
                        onPress={toggleMenu}
                        className="p-2"
                    >
                        <Ionicons name="ellipsis-vertical" size={24} color="white" />
                    </TouchableOpacity>

                    <MenuOverlay
                        isVisible={isMenuVisible}
                        onClose={() => setIsMenuVisible(false)}
                        onShare={handleShare}
                        onViewDetails={() => router.push(`/post/${post.id}`)}
                        post={post}
                        isPostDetail={isPostDetail}
                    />
                </View>

                <ProfileModal
                    isVisible={isProfileModalVisible}
                    onClose={() => setIsProfileModalVisible(false)}
                    user={post?.author as any}
                />
            </View>
            <View className="bg-gray-800 rounded-lg rounded-tl-none  rounded-tr-none p-4 mb-4">

                <Text className=" mb-2 text-[13px] text-base text-slate-100 text-justify leading-5" onPress={() => router.push(`/post/${post.id}`)}>
                    {isPostDetail ? post?.content : post?.content.substring(0, 100) + '...'}
                </Text>
                <Text className=" mb-2 text-[13px] text-blue-400">
                    Montant du projet: {post?.montant} &euro;
                </Text>
                {/* <View>
                    <TouchableOpacity onPress={() => router.push(`/post/${post.id}`)}>
                        <Text className="text-white text-[12px]">lire le document complet</Text>
                    </TouchableOpacity>
                </View> */}
                {/* <Image source={post.imageUrl ? { uri: post?.imageUrl } : require('../assets/images/appdonateimg.jpg')} className="w-full h-48 rounded-lg mb-2" /> */}
                <PostImage imageUrl={post?.imageUrl} />
                <View className="flex-row justify-end">

                    <TouchableOpacity
                        className="bg-gray-900 px-4 py-1 rounded-3xl
                         border-blue-400 border-2"
                        onPress={contributeToPub}
                    >
                        <Text className="text-white text-[12px]">Contribuer</Text>
                    </TouchableOpacity>
                </View>
                <View className="flex-row items-center mt-2 px-2 py-1 bg-white rounded-2xl justify-between">
                    <View className="flex-row items-center gap-2">
                        <TouchableOpacity
                            onPress={toggleComment}
                            className="flex flex-row items-center
                             bg-gray-300 p-2 py-1 rounded-full justify-center"
                        >
                            <Ionicons name="chatbox-ellipses" size={25} color="gray" />
                            <Text className="text-black ml-1 mr-4">{commentCount ? commentCount : 0}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={likePost}
                            className="flex flex-row items-center bg-gray-300 p-2 py-0.5 rounded-full justify-center"
                        >
                            <Image source={require('../assets/images/heart.png')} className="w-8 h-8" />
                            <Text className="text-black ml-0.5">{likes ? likes : 0}</Text>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity
                        className="flex bg-blue-300 rounded-full p-1 justify-center items-center"
                        onPress={favoritePost}
                    >
                        {!isFavorite ?
                            <Ionicons name="heart" size={22} color="white" />
                            : <Image source={require('../assets/images/heart.png')} className="w-7 h-7" />
                        }
                    </TouchableOpacity>
                </View>
                {!!startComment && (
                    <EnhancedCommentSection
                        post={post}
                        currentUser={currentUser}
                        onAddComment={async (newComment) => {
                            try {
                                const result = await uploadResourceData(newComment, 'commentaires');
                                if (result) {
                                    setCommentCount(prev => prev + 1);
                                    return {
                                        idCom: result?.id as string,
                                        idPub: result?.idPub as string,
                                        idUser: result?.idUser as string,
                                        dateCom: result?.createdAt as string,
                                        etatCom: result?.etatCom as boolean,
                                        libeleCom: result?.libeleCom as string,
                                    };
                                }
                                return null;
                            } catch (error) {
                                console.error('Error adding comment:', error);
                                throw error;
                            }
                        }}
                        onAddReply={async (parentId, text) => {
                            try {
                                const replyData = {
                                    idPub: post.id,
                                    idUser: currentUser?.IdUser,
                                    idParent: parentId,
                                    libeleCom: text,
                                    dateCom: new Date().toISOString(),
                                    etatCom: false,
                                    isReplied: true
                                };
                                const result = await uploadResourceData(replyData, 'commentaires');

                                // Update comments locally if reply is successful
                                if (result) {
                                    const updatedComments = comments.map(comment => {
                                        if (comment.id === parentId) {
                                            return {
                                                ...comment,
                                                replies: [
                                                    ...(comment.replies || []),
                                                    result as ExtendedComment
                                                ]
                                            };
                                        }
                                        return comment;
                                    });

                                    // Update local storage for this specific publication
                                    await SecureStore.setItemAsync(`comments-${post.id}`, JSON.stringify(updatedComments));

                                    setComments(updatedComments);
                                }

                                return result;
                            } catch (error) {
                                console.error('Error adding reply:', error);
                                throw error;
                            }
                        }}
                        initialComments={comments}
                    />
                )}
            </View>
        </ScrollView>

    )
}

export default memo(PublicationPost);
