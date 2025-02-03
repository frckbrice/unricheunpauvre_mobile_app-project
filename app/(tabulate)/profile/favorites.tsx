import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import PostCard from '../../../components/profile/components/post-card';
import useApiOps from '@/hooks/use-api';
import useUserGlobal from '@/hooks/use-user-hook';
import { getAllResourcesByTarget, getResourceByItsId, getSingleResource } from '@/lib/api';
import { ActivityIndicator, FlatList, View, RefreshControl } from 'react-native';
import { Colors } from '@/constants';
import EmptyState from '@/components/empty-state';
import { usePathname } from 'expo-router';


const Favorites = () => {

    const { currentUser, currentUserObj } = useUserGlobal();
    // const { currentPub } = useAuthorAndPubGlobal();
    const [refreshing, setRefreshing] = React.useState(false);
    const pathname = usePathname();
    const [faPostWithAuthor, setFavPostWithAuthor] = React.useState<any[]>([]);
    const [isFavPostsLoading, setIsFavPostsLoading] = useState(false);
    const [favPosts, setFavPosts] = useState<any[]>([]);

    // const {
    //     data: favoritePosts, // get all the post for this current user, by its ID
    //     refetch: refetchfavoritePosts,
    //     isLoading: isLoadingfavritePosts
    // } = useApiOps(() => getAllResourcesByTarget(
    //     'favorites', currentUserObj?.id || currentUser?.userId, 'idUser'));

    // console.log("current user posts: ", favoritePosts?.data);

    // get all the favorites posts for this user
    const getAllFavoritesPubsForThisUser = async () => {

        setIsFavPostsLoading(true)
        try {
            const publications = await getAllResourcesByTarget(
                'favorites', currentUser?.userId, 'idUser'); // get the publications made by this user with id : idUser
            setFavPosts(publications?.data);
        } catch (error) {
            console.error('Failed to get all publications:', error);
            return [];
        } finally {
            setIsFavPostsLoading(false);
        }
    }

    useEffect(() => {
        // if (!favoritePosts?.data?.length)
        //     onRefresh();
        // else {
        //     (
        //         async () => {
        //             await getPubsAndAuthor();
        //         }
        //     )()
        // }
        getPubsAndAuthor();
    }, [favPosts]);

    useEffect(() => {
        if (pathname.toString().toLowerCase() === '/profile/favorite' && !favPosts?.length)
            setTimeout(() => {
                getAllFavoritesPubsForThisUser();
            }, 2000);
    }, [pathname]);

    const getPostAuthor = async (idUser: string) => {
        const author = await getResourceByItsId(idUser, "users", "useUserGlobal");
        console.log("\n\n from getPostAuthor author: ", author);
        return author;
    };

    const getPubsAndAuthor = async () => {
        const authors = await Promise.all(
            // favoritePosts?.data?.map(async (fav: any) => {
            favPosts?.map(async (fav: any) => {
                const author = await getPostAuthor(fav?.pub?.authorId as string)
                console.log("\n\n from getPubsAndAuthor,  author: ", author);
                // include author information inside the pub object from the favorite incoming data.
                return fav?.idPub === fav?.pub.id ? ({ ...fav, pub: { ...fav.pub, pubId: fav?.idPub, ...author } }) : fav;
            }));

        // console.log("\n\n from getPubsAndAuthor, new favorite posts author: ", authors);
        setFavPostWithAuthor(authors);
        return authors;
    };

    // const onRefresh = React.useCallback(() => {
    //     if (!isLoadingfavritePosts) {
    //         setRefreshing(true);
    //         refetchfavoritePosts().finally(() => setRefreshing(false));
    //     }
    // }, [setRefreshing, refetchfavoritePosts]);

    // if (isLoadingfavritePosts)
    //     return (
    //         <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginBottom: 40 }}>
    //             <ActivityIndicator size="small" color={Colors.primary} />
    //         </View>
    //     );

    const onRefresh = React.useCallback(() => {
        if (!isFavPostsLoading) {
            setRefreshing(true);
            getAllFavoritesPubsForThisUser().finally(() => setRefreshing(false));
        }
    }, [getAllFavoritesPubsForThisUser, isFavPostsLoading]);

    if (isFavPostsLoading)
        return (
            <View className='flex-1 justify-center items-center'>
                <ActivityIndicator size="small" color={'gray'} />
            </View>
        );

    return (
        <SafeAreaView className="flex-1 bg-gray-900 px-4 mb-6">
            <FlatList
                data={faPostWithAuthor?.length ? faPostWithAuthor : [] as any[]}
                keyExtractor={(post) => String(post?.id)}
                renderItem={({ item: post }) => {

                    return <PostCard
                        currentPost={post?.pub}
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

/***
 * this is the post card array 
 * [
    {
        "createdAt": "2025-02-03T05:21:32.283Z",
        "id": "cm6olsgor000dkas6hv1yc6f1",
        "idPub": "cm6o92cp50001kaianjte5jno",
        "idUser": "cm6gzoxh50000me2uurq70pz0",
        "pub": {
            "authorId": "cm6gzoxh50000me2uurq70pz0",
            "content": "Les enfants de la rue sont un phénomène qui requiert notre attention. Nous devons étudier les causes et penser aux solutions éventuelles afin de prévenir. Nous avons besoin d'un financement qui nous permettre de construire une école dans la ville de Yaoundé, précisément au lieu dit pont de la gare. Cette prendra en charge ces enfant qui voudront reprendre le chemin de l'école et nous pensons qu'avec de la sensibilisation nous arriverons a convaincre un grand nombre d'entre eux a re-croire a un avenir meilleur en suivant le chemin de l'école",
            "createdAt": "2025-01-28T21:28:32.042Z",
            "dateCrea": "2025-01-28T22:03:16.353Z",
            "dateNaiss": "2025-01-28T22:01:00.000Z",
            "datePub": "2025-02-02T23:25:17.233Z",
            "documentUrl": "file:///data/user/0/com.unricheunpauvre/cache/DocumentPicker/e8f9761e-e703-466a-982a-73b5b27b3f7c.pdf",
            "etat": false,
            "etatUser": false,
            "id": "cm6gzoxh50000me2uurq70pz0",
            "idCat": "cm6cxgwhk0001kajts2agiyl1",
            "idUser": "cm6gzoxh50000me2uurq70pz0",
            "imagePub": "file:///data/user/0/com.unricheunpauvre/cache/ImagePicker/a5c43194-1394-4c85-a323-b2d5afdcbcfd.jpeg",
            "libelePub": "Les enfants de la rue sont un phénomène qui requiert notre attention. Nous devons étudier les causes et penser aux solutions éventuelles afin de prévenir. Nous avons besoin d'un financement qui nous permettre de construire une école dans la ville de Yaoundé, précisément au lieu dit pont de la gare. Cette prendra en charge ces enfant qui voudront reprendre le chemin de l'école et nous pensons qu'avec de la sensibilisation nous arriverons a convaincre un grand nombre d'entre eux a re-croire a un avenir meilleur en suivant le chemin de l'école",
            "localisation": "Bafia",
            "mdpUser": "$2b$10$.gC3w.xdhSrUnIt/p/dCG.FIoe4o8toIE1GQR3atkpZ3IUzrOQY72",
            "montantEstime": 36490,
            "nomUser": "brice",
            "photoUser": "https://cloud.appwrite.io/v1/storage/buckets/6717f18b0023c23a8416/files/6799541e000e1d6329a8/preview?width=2000&height=2000&gravity=top&quality=100&project=66c879ad0013609a2ce8",
            "pieceIdb": null,
            "pieceIdf": "https://cloud.appwrite.io/v1/storage/buckets/6717f18b0023c23a8416/files/67995422002f10910d0b/preview?width=2000&height=2000&gravity=top&quality=100&project=66c879ad0013609a2ce8",
            "updatedAt": "2025-01-28T22:03:18.647Z",
            "username": "brice@gmail.com"
        },
        "updatedAt": "2025-02-03T05:21:32.283Z"
    }
]
 */