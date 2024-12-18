
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
} from 'react-native';
import { Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Comment, User } from '@/lib/types';
import { EncodingKey, JWTBody, JWTDefaultBody } from 'expo-jwt/dist/types/jwt';
import useApiOps from '@/hooks/use-api';
import { getResourceByItsId } from '@/lib/api';
import * as SecureStore from 'expo-secure-store'

// Extended Comment type to handle replies
export interface ExtendedComment extends Comment {
    replies?: ExtendedComment[];
    idParent?: number | null;
    userName?: string;
    photoUser?: string;
    replyToUser?: string;
    likes?: number;
    isReplied?: boolean;
    dateCom: string;
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
    currentUser: JWTBody<JWTDefaultBody> | null;
    onReply: (comment: ExtendedComment) => void;
    onLike: (commentId: number) => void;
    onAddReply: (idParent: number, text: string) => Promise<{ idPub: number; idUser: any; idParent: number; libeleCom: string; dateCom: string; etatCom: boolean; } | null>;
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
                source={{ uri: currentUser?.photoUser || 'https://via.placeholder.com/40' }}
                className="w-8 h-8 rounded-full mr-2"
            />
            {/* comment input */}
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

                {/* comment section icons: like and rely */}
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

                {/* Reply and send Input and button */}
                {isReplying && (
                    <View className="mt-2">
                        <View className="flex-row items-center bg-gray-600 rounded-full px-3 py-1">
                            <TextInput
                                value={replyText}
                                onChangeText={setReplyText}
                                placeholder={`Repondre a ${comment?.userName}...`}
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
// const EnhancedCommentSection = memo(({
//     post,
//     currentUser,
//     onAddComment,
//     onAddReply
// }: {
//     post: any;
//     currentUser: JWTBody<JWTDefaultBody> | null;
//     onAddComment: (comment: Partial<ExtendedComment>) => Promise<Partial<ExtendedComment> | null>;
//     onAddReply: (idParent: number, text: string) => Promise<{ idPub: number; idUser: any; idParent: number; libeleCom: string; dateCom: string; etatCom: boolean; } | null>;
// }) => {
//     const [comments, setComments] = useState<ExtendedComment[] | []>([]);
//     const [isLoading, setIsLoading] = useState(false);
//     const [replyingTo, setReplyingTo] = useState<ExtendedComment | null>(null);
//     const [commentText, setCommentText] = useState('');
//     const [isSubmitting, setIsSubmitting] = useState(false);
//     const [commentDone, setCommentDone] = useState<Partial<ExtendedComment> | null>(null);

//     const {
//         data: user,
//         refetch
//     } = useApiOps(() => getResourceByItsId(currentUser?.IdUser as number, "User"));

//     useEffect(() => {
//         const loadComments = async () => {
//             setIsLoading(true);
//             try {

//                 // Retrieve comments specifically for this publication from local storage
//                 const storedComments = await SecureStore.getItemAsync(`comments-${post.id}`);
//                 if (storedComments) {
//                     const parsedComments = JSON.parse(storedComments);
//                     setComments(parsedComments);
//                 }
//             } catch (error) {
//                 console.error('Error loading comments:', error);
//             } finally {
//                 setIsLoading(false);
//             }
//         };

//         loadComments();
//     }, [post]);

//     const handleAddComment = useCallback(async () => {
//         if (!commentText.trim() || isSubmitting) return;

//         setIsSubmitting(true);
//         const newComment: Partial<ExtendedComment> = {
//             idPub: post?.id,
//             idUser: currentUser?.IdUser as number,
//             etatCom: false,
//             libeleCom: commentText,
//             dateCom: new Date(Date.now()).toISOString(),
//             idParent: replyingTo?.idCom || null,
//             isReplied: !!replyingTo
//         };

//         try {
//             const comment = await onAddComment(newComment);

//             if (comment) {
//                 // If it's a reply
//                 if (replyingTo) {
//                     const updatedComments = comments.map(rootComment => {
//                         if (rootComment.idCom === replyingTo.idCom) {
//                             return {
//                                 ...rootComment,
//                                 replies: [
//                                     ...(rootComment.replies || []),
//                                     comment as ExtendedComment
//                                 ]
//                             };
//                         }
//                         return rootComment;
//                     });

//                     setComments(updatedComments);
//                 } else {
//                     // If it's a new root comment
//                     const updatedComments = [comment as ExtendedComment, ...comments];
//                     setComments(updatedComments);
//                 }

//                 // Update local storage with publication-specific comments
//                 await SecureStore.setItemAsync(`comments-${post.id}`, JSON.stringify(comments));
//             }

//             setCommentText('');
//             setReplyingTo(null);
//         } catch (error) {
//             Alert.alert('Error', 'Failed to add comment');
//         } finally {
//             setIsSubmitting(false);
//         }
//     }, [commentText, post?.id, currentUser, replyingTo, comments]);

//     const handleReply = useCallback((comment: ExtendedComment) => {
//         setReplyingTo(comment);
//     }, []);

//     const handleLike = useCallback((commentId: number) => {
//         const updatedComments = comments.map(comment => {
//             if (comment.idCom === commentId) {
//                 return {
//                     ...comment,
//                     likes: (comment.likes || 0) + 1
//                 };
//             }
//             return comment;
//         });

//         setComments(updatedComments);
//         // Optionally update local storage
//         SecureStore.setItemAsync(`comments-${post.id}`, JSON.stringify(updatedComments));
//     }, [comments, post.id]);


//     return (
//         <View className="bg-gray-800 rounded-lg p-2">
//             {/* Main Comment Input */}
//             <KeyboardAvoidingView
//                 behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//                 className="mb-4"
//             >
//                 <View className="flex-row items-center bg-gray-700 rounded-full px-4 py-2">
//                     <Image
//                         source={{ uri: user?.avatarUrl || 'https://via.placeholder.com/40' }}
//                         className="w-8 h-8 rounded-full mr-2"
//                     />
//                     <TextInput
//                         value={commentText}
//                         onChangeText={setCommentText}
//                         placeholder={replyingTo ? `Repondre au commentaire...` : "ecrire un commentaire..."}
//                         placeholderTextColor="#9CA3AF"
//                         multiline
//                         className="flex-1 text-white text-sm mr-2"
//                     />
//                     {isSubmitting ? (
//                         <ActivityIndicator size="small" color="#60A5FA" />
//                     ) : (
//                         <TouchableOpacity
//                             onPress={handleAddComment}
//                             disabled={!commentText?.trim() || isSubmitting}
//                         >
//                             <Ionicons
//                                 name="send"
//                                 size={24}
//                                 color={commentText?.trim() && !isSubmitting ? '#60A5FA' : '#6B7280'}
//                             />
//                         </TouchableOpacity>
//                     )}
//                 </View>
//             </KeyboardAvoidingView>

//             {/* Comments List */}

//             {isLoading ? (
//                 <ActivityIndicator size="large" color="blue" />
//             ) : (
//                 comments.map((comment) => (
//                     <CommentItem
//                         key={comment.idCom}
//                         comment={comment}
//                         currentUser={currentUser}
//                         onReply={handleReply}
//                         onLike={handleLike}
//                         onAddReply={onAddReply}
//                         commentDone={commentDone}
//                     />
//                 ))
//             )}
//         </View>
//     );
// });


const EnhancedCommentSection = memo(({
    post,
    currentUser,
    onAddComment,
    onAddReply,
    initialComments = []
}: {
    post: any;
    currentUser: JWTBody<JWTDefaultBody> | null;
    onAddComment: (comment: Partial<ExtendedComment>) => Promise<Partial<ExtendedComment> | null>;
    onAddReply: (idParent: number, text: string) => Promise<{ idPub: number; idUser: any; idParent: number; libeleCom: string; dateCom: string; etatCom: boolean; } | null>;
    initialComments?: ExtendedComment[];
}) => {
    const [comments, setComments] = useState<ExtendedComment[]>(initialComments);
    const [isLoading, setIsLoading] = useState(true);
    const [replyingTo, setReplyingTo] = useState<ExtendedComment | null>(null);
    const [commentText, setCommentText] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        data: user,
        refetch
    } = useApiOps(() => getResourceByItsId(currentUser?.IdUser as number, "User"));

    useEffect(() => {
        const loadComments = async () => {
            setIsLoading(true);
            try {
                // Retrieve comments specifically for this publication from local storage
                const storedComments = await SecureStore.getItemAsync(`comments-${post.id}`);
                if (storedComments) {
                    const parsedComments = JSON.parse(storedComments);
                    setComments(parsedComments);
                }
            } catch (error) {
                console.error('Error loading comments:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadComments();
    }, [post.id]);

    const handleAddComment = useCallback(async () => {
        if (!commentText.trim() || isSubmitting) return;

        setIsSubmitting(true);
        const newComment: Partial<ExtendedComment> = {
            idPub: post?.id,
            idUser: currentUser?.IdUser as number,
            etatCom: false,
            libeleCom: commentText,
            dateCom: new Date(Date.now()).toISOString(),
            idParent: replyingTo?.idCom || null,
            isReplied: !!replyingTo
        };

        try {
            const comment = await onAddComment(newComment);

            if (comment) {
                // If it's a reply
                if (replyingTo) {
                    const updatedComments = comments.map(rootComment => {
                        if (rootComment.idCom === replyingTo.idCom) {
                            return {
                                ...rootComment,
                                replies: [
                                    ...(rootComment.replies || []),
                                    comment as ExtendedComment
                                ]
                            };
                        }
                        return rootComment;
                    });

                    setComments(updatedComments);
                } else {
                    // If it's a new root comment
                    const updatedComments = [comment as ExtendedComment, ...comments];
                    setComments(updatedComments);
                }

                // Update local storage with publication-specific comments
                await SecureStore.setItemAsync(`comments-${post.id}`, JSON.stringify(comments));
            }

            setCommentText('');
            setReplyingTo(null);
        } catch (error) {
            Alert.alert('Error', 'Failed to add comment');
        } finally {
            setIsSubmitting(false);
        }
    }, [commentText, post?.id, currentUser, replyingTo, comments]);

    const handleReply = useCallback((comment: ExtendedComment) => {
        setReplyingTo(comment);
    }, []);

    const handleLike = useCallback((commentId: number) => {
        const updatedComments = comments.map(comment => {
            if (comment.idCom === commentId) {
                return {
                    ...comment,
                    likes: (comment.likes || 0) + 1
                };
            }
            return comment;
        });

        setComments(updatedComments);
        // Optionally update local storage
        SecureStore.setItemAsync(`comments-${post.id}`, JSON.stringify(updatedComments));
    }, [comments, post.id]);

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
                        placeholder={replyingTo ? `Reply to ${replyingTo.userName || 'comment'}...` : "Write a comment..."}
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
            {isLoading ? (
                <ActivityIndicator size="large" color="blue" />
            ) : comments.length === 0 ? (
                <View className="items-center justify-center py-4">
                    <Text className="text-gray-400 text-center">
                        No comments yet. Be the first to comment!
                    </Text>
                </View>
            ) : (
                comments.map((comment) => (
                    <CommentItem
                        key={comment.idCom}
                        comment={comment}
                        currentUser={currentUser}
                        onReply={handleReply}
                        onLike={handleLike}
                        onAddReply={onAddReply}
                        depth={0}
                        maxDepth={3}
                    />
                ))
            )}
        </View>
    );
});


export { EnhancedCommentSection };