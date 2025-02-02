// //libraries
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   Image,
//   Alert,
//   ActivityIndicator,
// } from "react-native";
// import React, { useState } from "react";
// import { router } from "expo-router";

// //constants
// import { icons } from "../constants";
// import { API_URL } from "@/constants/constants";
// import { getAllResourcesByTarget } from "@/lib/api";
// import SearchScreen from "@/app/(tabulate)/search";

// const SearchInput = ({ placeholder }) => {
//   // const pathName = usePathname();
//   const [query, setQuery] = useState("");
//   const [uploading, setUploading] = useState(false);
//   const [posts, setPosts] = useState([]);

//   const handleSearch = async () => {
//     if (!query) {
//       return Alert.alert("Missing query", "Please enter a search query");
//     }

//     setUploading(true);
//     try {
//       const data = await getAllResourcesByTarget(
//         "publications",
//         query,
//         "searchString"
//       );
//       if (data.data) {
//         console.log(
//           "\n\n insde searchInput, publications for this category: ",
//           data
//         );
//         setPosts(data.data);
//       }
//     } catch (error) {
//       console.error("Error fetching Publication data :", error);
//     } finally {
//       setUploading(false);
//     }
//   };

//   if (posts.length > 0) {
//     // router.push({
//     //   pathname: "/search",
//     //   params: { search: query },
//     // });
//     return <SearchScreen publications={posts} />;
//   }

//   return (
//     <View className="border-2 border-black-200 rounded-2xl w-full px-4 h-16 focus:border-secondary items-center bg-black-100 flex-row justify-between space-x-4">
//       <TextInput
//         placeholder={placeholder}
//         className="font-pregular text-white mt-0.5 flex-1 font-psemibold text-base "
//         value={query}
//         onBlur={handleSearch} // Call API when input loses focus
//         onChangeText={(text) => setQuery(text)}
//         placeholderTextColor={"#CDCDE0"} // make it pop just a bit.
//       />
//       <TouchableOpacity onPress={handleSearch}>
//         {uploading ? (
//           <ActivityIndicator size={"small"} color={"#60A5FA"} />
//         ) : (
//           <Image
//             source={icons.search}
//             className="w-5 h-5"
//             resizeMode="contain"
//           />
//         )}
//       </TouchableOpacity>
//     </View>
//   );
// };

// export default SearchInput;

// SearchInput.tsx
import React, { memo, useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";
import { getAllResourcesByTarget } from "@/lib/api";
import { icons } from "@/constants";

const SearchInput = ({ placeholder, onSearchResults }) => {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) {
      Alert.alert("Missing query", "Please enter a search query");
      return;
    }

    setLoading(true);
    try {
      const { data } = await getAllResourcesByTarget(
        "publications",
        query,
        "searchString"
      );
      onSearchResults(data || []);
    } catch (error) {
      console.error("Search error:", error);
      Alert.alert("Error", "Failed to perform search");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="border-2 border-black-200 rounded-2xl w-full px-4 h-14 focus:border-secondary items-center bg-black-100 flex-row justify-between space-x-4">
      <TextInput
        placeholder={placeholder}
        className="font-pregular text-white mt-0.5 flex-1 font-psemibold text-base"
        value={query}
        onChangeText={setQuery}
        onBlur={handleSearch}
        placeholderTextColor="#CDCDE0"
      />
      <TouchableOpacity onPress={handleSearch}>
        {loading ? (
          <ActivityIndicator size="small" color="#60A5FA" />
        ) : (
          <Image
            source={icons.search}
            className="w-5 h-5"
            resizeMode="contain"
          />
        )}
      </TouchableOpacity>
    </View>
  );
};

export default memo(SearchInput);
