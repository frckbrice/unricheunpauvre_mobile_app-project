// import React, { memo, useState, useCallback, useRef } from 'react';
// import {
//     View,
//     Text,
//     TouchableOpacity,
//     TextInput,
//     Animated,
//     KeyboardAvoidingView,
//     Platform,
//     Alert,
//     ActivityIndicator,
// } from 'react-native';
// import { Image } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import { Comment, User } from '@/lib/types';
// import { Colors } from '@/constants';
// import { EncodingKey, JWTBody, JWTDefaultBody } from 'expo-jwt/dist/types/jwt';
// import useApiOps from '@/hooks/use-api';
// import { getCurrentUser, getResourceByItsId } from '@/lib/api';


// // Comment Item Component
// const CommentItem = memo(({ comment, currentUser, onReply, onLike }: {
//     comment: Comment;
//     currentUser: User;
//     onReply: (commentId: number) => void;
//     onLike: (commentId: number) => void;
// }) => {
//     const [isLiked, setIsLiked] = useState(false);
//     const scaleAnim = useRef(new Animated.Value(1)).current;

//     const handleLike = () => {
//         setIsLiked(!isLiked);
//         Animated.sequence([
//             Animated.spring(scaleAnim, {
//                 toValue: 1.2,
//                 useNativeDriver: true,
//             }),
//             Animated.spring(scaleAnim, {
//                 toValue: 1,
//                 useNativeDriver: true,
//             }),
//         ]).start();
//         onLike(comment?.idCom);
//     };

//     return (
//         <View className="flex-row mb-3 px-2">
//             <Image
//                 source={{ uri: currentUser?.userAvatar || 'https://via.placeholder.com/40' }}
//                 className="w-8 h-8 rounded-full mr-2"
//             />
//             <View className="flex-1">
//                 <View className="bg-gray-700 rounded-2xl px-3 py-2">
//                     <Text className="text-white font-medium text-sm">
//                         {currentUser?.nomUser || 'User'}
//                     </Text>
//                     <Text className="text-white text-sm mt-1">{comment?.libeleCom}</Text>
//                 </View>
//                 <View className="flex-row items-center mt-1 ml-2 space-x-4">
//                     <TouchableOpacity onPress={handleLike}>
//                         <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
//                             <Text className={`text-xs ${isLiked ? 'text-blue-400' : 'text-gray-400'}`}>
//                                 Like
//                             </Text>
//                         </Animated.View>
//                     </TouchableOpacity>
//                     <TouchableOpacity onPress={() => onReply(comment?.idCom)}>
//                         <Text className="text-xs text-gray-400">Reply</Text>
//                     </TouchableOpacity>
//                     <Text className="text-xs text-gray-500">
//                         {new Date(comment?.dateCom).toLocaleDateString()}
//                     </Text>
//                 </View>
//             </View>
//         </View>
//     );
// });

// // Enhanced Comment Input Component
// const EnhancedCommentInput = memo(({
//     onSubmit,
//     isLoading,
//     placeholder = "Write a comment?..."
// }: {
//     onSubmit: (text: string) => void;
//     isLoading?: boolean;
//     placeholder?: string;
// }) => {
//     const [comment, setComment] = useState('');
//     const inputRef = useRef<TextInput>(null);

//     const handleSubmit = () => {
//         if (!comment?.trim()) return;
//         onSubmit(comment);
//         setComment('');
//     };

//     return (
//         <KeyboardAvoidingView
//             behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//             className="px-2 py-2 bg-gray-800 border-t border-gray-700"
//         >
//             <View className="flex-row items-center bg-gray-700 rounded-full px-4 py-2">
//                 <TextInput
//                     ref={inputRef}
//                     value={comment}
//                     onChangeText={setComment}
//                     placeholder={placeholder}
//                     placeholderTextColor="#9CA3AF"
//                     multiline
//                     className="flex-1 text-white text-sm mr-2"
//                 />
//                 {isLoading ? (
//                     <ActivityIndicator size="small" color={Colors.primary} />
//                 ) : (
//                     <TouchableOpacity
//                         onPress={handleSubmit}
//                         disabled={!comment?.trim()}
//                     >
//                         <Ionicons
//                             name="send"
//                             size={24}
//                             color={comment?.trim() ? Colors.primary : '#6B7280'}
//                         />
//                     </TouchableOpacity>
//                 )}
//             </View>
//         </KeyboardAvoidingView>
//     );
// });

// // Enhanced Comment Section
// const EnhancedCommentSection = memo(({
//     post,
//     currentUser,
//     onAddComment
// }: {
//     post: any;
//     currentUser: JWTBody<JWTDefaultBody> | null;
//     onAddComment: (comment: Partial<Comment>) => Promise<Partial<Comment> | undefined>;
// }) => {
//     const [comments, setComments] = useState(post?.comments || []);
//     const [isLoading, setIsLoading] = useState(false);
//     const [replyingTo, setReplyingTo] = useState<number | null>(null);

//     const {
//         data: user,
//         refetch: refetchPostAuthor
//     } = useApiOps(() => getResourceByItsId(currentUser?.IdUser as string, "User"));

//     const handleAddComment = useCallback(async (text: string) => {
//         setIsLoading(true);

//         const newComment: Partial<Comment> = {
//             // idCom: Date.now(), // temporary ID
//             idPub: post?.id,
//             idUser: currentUser?.IdUser as number,
//             dateCom: new Date().toISOString(),
//             etatCom: true,
//             libeleCom: text,
//             //   replyTo: replyingTo,
//         };

//         // Optimistic update
//         setComments((prev: any) => [newComment as Comment, ...prev]);

//         try {
//             await onAddComment(newComment);
//             setReplyingTo(null);
//         } catch (error) {
//             // Revert optimistic update on error
//             setComments((prev: any) => prev.filter((comment: Comment) => comment?.idCom !== newComment?.idCom));
//             Alert.alert('Error', 'Failed to add comment?. Please try again.');
//         } finally {
//             setIsLoading(false);
//         }
//     }, [post?.id, currentUser, replyingTo, onAddComment]);

//     const handleLike = useCallback((commentId: number) => {
//         // Implement like functionality
//         console.log('Like comment:', commentId);
//     }, []);

//     const handleReply = useCallback((commentId: number) => {
//         setReplyingTo(commentId);
//     }, []);

//     return (
//         <View className="bg-gray-800 rounded-lg">
//             <EnhancedCommentInput
//                 onSubmit={handleAddComment}
//                 isLoading={isLoading}
//                 placeholder={replyingTo ? "Write a reply..." : "Write a comment?..."}
//             />

//             <View className="max-h-96">
//                 {comments.map((comment: Comment) => (
//                     <CommentItem
//                         key={comment?.idCom}
//                         comment={comment}
//                         currentUser={user}
//                         onReply={handleReply}
//                         onLike={handleLike}
//                     />
//                 ))}
//             </View>
//         </View>
//     );
// });

// export { EnhancedCommentSection, CommentItem, EnhancedCommentInput };

import React, { memo, useState, useCallback, useRef, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
    Animated,
    KeyboardAvoidingView,
    Platform,
    Alert,
    ActivityIndicator,
    Pressable,
} from 'react-native';
import { Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Comment, User } from '@/lib/types';
import { EncodingKey, JWTBody, JWTDefaultBody } from 'expo-jwt/dist/types/jwt';
import useApiOps from '@/hooks/use-api';
import { getResourceByItsId } from '@/lib/api';
import * as SecureStore from 'expo-secure-store'

// Extended Comment type to handle replies
interface ExtendedComment extends Comment {
    replies?: ExtendedComment[];
    parentId?: number | null;
    userName?: string;
    userAvatar?: string;
    replyToUser?: string;
    likes?: number;
}

// Single Comment Component with Replies
const CommentItem = memo(({
    comment,
    currentUser,
    onReply,
    onLike,
    onAddReply,
    depth = 0,
    maxDepth = 3,
    commentDone
}: {
    comment: ExtendedComment;
    currentUser: User;
    onReply: (comment: ExtendedComment) => void;
    onLike: (commentId: number) => void;
    onAddReply: (parentId: number, text: string) => Promise<{ idPub: number; idUser: any; parentId: number; libeleCom: string; dateCom: string; etatCom: boolean; } | null>;
    depth?: number;
    maxDepth?: number;
    commentDone?: Partial<ExtendedComment> | null
}) => {
    const [isLiked, setIsLiked] = useState(false);
    const [showReplies, setShowReplies] = useState(false);
    const [isReplying, setIsReplying] = useState(false);
    const [replyText, setReplyText] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const [commentAuthor, setCommentAuthor] = useState<User | null>(null)

    const { // fetch the author of parent comment.
        data: commentDoneUser
    } = useApiOps(() => getResourceByItsId(commentDone?.idUser as number, "User"));

    useEffect(() => {
        if (commentDoneUser) {
            setCommentAuthor(commentDoneUser)
        }
    }, [commentDone])

    const handleLike = () => {
        setIsLiked(!isLiked);
        Animated.sequence([
            Animated.spring(scaleAnim, {
                toValue: 1.2,
                useNativeDriver: true,
            }),
            Animated.spring(scaleAnim, {
                toValue: 1,
                useNativeDriver: true,
            }),
        ]).start();
        onLike(comment?.idCom);
    };

    const handleReplyPress = () => {
        setIsReplying(true);
        onReply(comment);
    };

    const handleSubmitReply = async () => {
        if (!replyText.trim() || isSubmitting) return;

        setIsSubmitting(true);
        try {
            await onAddReply(comment?.idCom, replyText);
            setReplyText('');
            setIsReplying(false);
            setShowReplies(true);
        } catch (error) {
            Alert.alert('Error', 'Failed to add reply');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <View className={`flex-row mb-2 ${depth > 0 ? 'ml-8' : ''}`}>
            <Image
                source={{ uri: currentUser?.userAvatar || 'https://via.placeholder.com/40' }}
                className="w-8 h-8 rounded-full mr-2"
            />
            <View className="flex-1">
                <View className="bg-gray-700 rounded-2xl px-3 py-2">
                    <Text className="text-white font-medium text-sm">
                        {currentUser?.nomUser || 'User'}
                    </Text>
                    {comment?.replyToUser && (
                        <Text className="text-blue-400 text-xs mb-1">
                            Replying to @{commentAuthor?.nomUser ?? 'comment-author'}
                        </Text>
                    )}
                    <Text className="text-white text-sm mt-1">{comment?.libeleCom}</Text>
                </View>

                <View className="flex-row items-center mt-1 ml-2 space-x-4">
                    <TouchableOpacity
                        onPress={handleLike}
                        className="flex-row items-center space-x-1"
                    >
                        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                            <Ionicons
                                name={isLiked ? "heart" : "heart-outline"}
                                size={16}
                                color={isLiked ? "#EF4444" : "#9CA3AF"}
                            />
                        </Animated.View>
                        <Text className={`text-xs ${isLiked ? 'text-red-500' : 'text-gray-400'}`}>
                            {(comment?.likes || 0) + (isLiked ? 1 : 0)}
                        </Text>
                    </TouchableOpacity>
                    {depth < maxDepth && (
                        <TouchableOpacity
                            onPress={handleReplyPress}
                            className="flex-row items-center space-x-1"
                        >
                            <Ionicons name="chatbubble-outline" size={16} color="#9CA3AF" />
                            <Text className="text-xs text-gray-400">Reply</Text>
                        </TouchableOpacity>
                    )}
                    <Text className="text-xs text-gray-500">
                        {new Date(comment?.dateCom).toLocaleDateString()}
                    </Text>
                </View>

                {/* Reply Input */}
                {isReplying && (
                    <View className="mt-2">
                        <View className="flex-row items-center bg-gray-600 rounded-full px-3 py-1">
                            <TextInput
                                value={replyText}
                                onChangeText={setReplyText}
                                placeholder={`Reply to ${comment?.userName}...`}
                                placeholderTextColor="#9CA3AF"
                                className="flex-1 text-white text-sm"
                            />
                            {isSubmitting ? (
                                <ActivityIndicator size="small" color="#60A5FA" className="ml-2" />
                            ) : (
                                <TouchableOpacity
                                    onPress={handleSubmitReply}
                                    disabled={!replyText?.trim() || isSubmitting}
                                    className="ml-2"
                                >
                                    <Ionicons
                                        name="send"
                                        size={20}
                                        color={replyText?.trim() && !isSubmitting ? '#60A5FA' : '#6B7280'}
                                    />
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>
                )}

                {/* Nested Replies */}
                {comment?.replies && comment?.replies.length > 0 && (
                    <View className="mt-2">
                        {!showReplies ? (
                            <TouchableOpacity
                                onPress={() => setShowReplies(true)}
                                className="flex-row items-center"
                            >
                                <View className="w-8 h-0.5 bg-gray-600" />
                                <Text className="text-blue-400 text-sm ml-2">
                                    View {comment?.replies?.length} replies
                                </Text>
                            </TouchableOpacity>
                        ) : (
                            <View>
                                {comment?.replies.map((reply) => (
                                    <CommentItem
                                        key={reply.idCom}
                                        comment={reply}
                                        currentUser={currentUser}
                                        onReply={onReply}
                                        onLike={onLike}
                                        onAddReply={onAddReply}
                                        depth={depth + 1}
                                        maxDepth={maxDepth}
                                    />
                                ))}
                                {comment?.replies.length > 0 && (
                                    <TouchableOpacity
                                        onPress={() => setShowReplies(false)}
                                        className="mt-1"
                                    >
                                        <Text className="text-blue-400 text-sm">Hide replies</Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                        )}
                    </View>
                )}
            </View>
        </View>
    );
});

// Enhanced Comment Section with Nested Replies
const EnhancedCommentSection = memo(({
    post,
    currentUser,
    onAddComment,
    onAddReply
}: {
    post: any;
    currentUser: JWTBody<JWTDefaultBody> | null;
    onAddComment: (comment: Partial<ExtendedComment>) => Promise<Partial<ExtendedComment> | null>;
    onAddReply: (parentId: number, text: string) => Promise<{ idPub: number; idUser: any; parentId: number; libeleCom: string; dateCom: string; etatCom: boolean; } | null>;
}) => {
    const [comments, setComments] = useState<ExtendedComment[] | []>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [replyingTo, setReplyingTo] = useState<ExtendedComment | null>(null);
    const [commentText, setCommentText] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [commentDone, setCommentDone] = useState<Partial<ExtendedComment> | null>(null);

    const {
        data: user,
        refetch
    } = useApiOps(() => getResourceByItsId(currentUser?.IdUser as number, "User"));

    useEffect(() => {
        (
            async () => {
                await SecureStore.getItemAsync('comments')
                    .then(comments => {
                        setComments(comments ? JSON.parse(comments) : []);
                    })
            }
        )()
    }, [post]);

    const handleAddComment = useCallback(async () => {
        if (!commentText.trim() || isSubmitting) return;

        setIsSubmitting(true);
        const newComment: Partial<ExtendedComment> = {
            // idCom: Date.now(),
            idPub: post?.id,
            idUser: currentUser?.IdUser as number,
            dateCom: new Date().toISOString(),
            etatCom: false,
            libeleCom: commentText,
            // userName: user?.nomUser,
            // userAvatar: user?.avatarUrl,
            // replies: [],
            // parentId: replyingTo?.idCom || null,
            // replyToUser: replyingTo?.userName,
            // likes: 0
        };

        try {
            const comment = await onAddComment(newComment);

            setCommentDone(comment)
            if (replyingTo) {
                setComments((prevComments: ExtendedComment[]) => {
                    return prevComments.map(comment => {
                        if (comment?.idCom === replyingTo?.idCom) {
                            return {
                                ...comment,
                                replies: [...(comment?.replies || []), newComment as ExtendedComment]
                            };
                        }
                        return comment;
                    });
                });
                // we save the new comment in the list
                SecureStore.setItemAsync('comments', JSON.stringify(newComment));
            } else {
                setComments((prev: ExtendedComment[]) => [newComment as ExtendedComment, ...prev]);
            }
            setCommentText('');
            setReplyingTo(null);
        } catch (error) {
            Alert.alert('Error', 'Failed to add comment');
        } finally {
            setIsSubmitting(false);
        }
    }, [commentText, post?.id, currentUser, replyingTo, isSubmitting]);

    const handleReply = useCallback((comment: ExtendedComment) => {
        setReplyingTo(comment);
    }, []);

    const handleLike = useCallback((commentId: number) => {
        setComments((prevComments: ExtendedComment[]) => {
            return prevComments.map(comment => {
                if (comment.idCom === commentId) {
                    return {
                        ...comment,
                        likes: (comment.likes || 0) + 1
                    };
                }
                return comment;
            });
        });
    }, []);

    return (
        <View className="bg-gray-800 rounded-lg p-2">
            {/* Main Comment Input */}
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="mb-4"
            >
                <View className="flex-row items-center bg-gray-700 rounded-full px-4 py-2">
                    <Image
                        source={{ uri: user?.avatarUrl || 'https://via.placeholder.com/40' }}
                        className="w-8 h-8 rounded-full mr-2"
                    />
                    <TextInput
                        value={commentText}
                        onChangeText={setCommentText}
                        placeholder={replyingTo ? `Reply to comment...` : "Write a comment..."}
                        placeholderTextColor="#9CA3AF"
                        multiline
                        className="flex-1 text-white text-sm mr-2"
                    />
                    {isSubmitting ? (
                        <ActivityIndicator size="small" color="#60A5FA" />
                    ) : (
                        <TouchableOpacity
                            onPress={handleAddComment}
                            disabled={!commentText?.trim() || isSubmitting}
                        >
                            <Ionicons
                                name="send"
                                size={24}
                                color={commentText?.trim() && !isSubmitting ? '#60A5FA' : '#6B7280'}
                            />
                        </TouchableOpacity>
                    )}
                </View>
            </KeyboardAvoidingView>

            {/* Comments List */}
            {comments?.map((comment: ExtendedComment) => (
                <CommentItem
                    key={comment?.idCom}
                    comment={comment}
                    currentUser={user}
                    onReply={handleReply}
                    onLike={handleLike}
                    onAddReply={onAddReply}
                    commentDone={commentDone}
                />
            ))}
        </View>
    );
});

export { EnhancedCommentSection };