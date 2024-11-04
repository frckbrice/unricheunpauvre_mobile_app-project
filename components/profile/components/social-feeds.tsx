// import React, { useEffect } from 'react';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import Header from './header';
// import ProfileScreen from './profile-screen';
// import PostCard from './post-card';
// import useApiOps from '@/hooks/use-api';
// import { Post, Publication } from '@/lib/types';
// import useUserGlobal from '@/hooks/use-user-hook';
// import { getAllResourcesByTarget } from '@/lib/api';
// import { FlatList } from 'react-native';
// import TrainingLayout from '../../../app/(tabulate)/(profile)/_layout';


// const SocialFeedScreen = () => {

//     const { currentUser } = useUserGlobal();

//     const {
//         data: posts, // get all the post for this current user, by its ID
//         refetch,
//         isLoading
//     } = useApiOps<Post[]>(() => getAllResourcesByTarget<Publication>(
//         'Publication', currentUser?.id, 'idUser'));

//     console.log("current user posts: ", posts)

//     useEffect(() => {
//         if (posts && !posts.length) refetch();
//     }, [])

//     return (
//         <SafeAreaView className="flex-1 bg-gray-900 px-4">
//             <Header />
//             <ProfileScreen />
//             <TrainingLayout />
//         </SafeAreaView>
//     );
// };

// export default SocialFeedScreen;r