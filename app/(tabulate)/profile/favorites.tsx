import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import PostCard from '../../../components/profile/components/post-card';
import useApiOps from '@/hooks/use-api';
import useUserGlobal from '@/hooks/use-user-hook';
import { getAllResourcesByTarget } from '@/lib/api';
import { ActivityIndicator, FlatList, View, RefreshControl } from 'react-native';
import { Colors } from '@/constants';
import EmptyState from '@/components/empty-state';


const Favorites = () => {

    const { currentUser, currentUserObj } = useUserGlobal();
    // const { currentPub } = useAuthorAndPubGlobal();
    const [refreshing, setRefreshing] = React.useState(false);

    const {
        data: favoritePosts, // get all the post for this current user, by its ID
        refetch: refetchfavoritePosts,
        isLoading: isLoadingfavritePosts
    } = useApiOps(() => getAllResourcesByTarget(
        'favorites', currentUser?.userId, 'idUser'));

    console.log("current user posts: ", favoritePosts);


    const onRefresh = React.useCallback(() => {
        if (!isLoadingfavritePosts) {
            setRefreshing(true);
            refetchfavoritePosts().finally(() => setRefreshing(false));
        }
    }, [setRefreshing, refetchfavoritePosts]);

    if (isLoadingfavritePosts)
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginBottom: 40 }}>
                <ActivityIndicator size="small" color={Colors.primary} />
            </View>
        );

    return (
        <SafeAreaView className="flex-1 bg-gray-900 px-4 mb-6">
            <FlatList
                data={favoritePosts?.length > 0 ? favoritePosts : [] as any[]}
                keyExtractor={(post) => String(post?.id)}
                renderItem={({ item: post }) => {

                    return <PostCard
                        currentPost={post}
                        currentUser={currentUserObj}
                    />
                }}
                // this property displays in case the list of data above is empty. it behave like a fallback.
                ListEmptyComponent={() => (
                    <EmptyState
                        title="Pas de publications favories..."
                        subtitle="Vous devez ajouter au moins un rêve a vos favoris."
                        label="Revenir a l'accueil"
                        subtitleStyle="text-[14px] text-center text-white"
                        route={'/accueil'}
                        titleStyle='text-[17px] font-bold text-center text-white'
                    />
                )}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }
            />
        </SafeAreaView>
    );
};

export default Favorites;