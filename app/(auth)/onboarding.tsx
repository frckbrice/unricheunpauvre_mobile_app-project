// import React, { useState, useRef } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   Dimensions,
//   TouchableOpacity,
//   FlatList,
//   Image,
//   SafeAreaView,
// } from "react-native";
// import { AntDesign } from "@expo/vector-icons";
// import { useRouter } from "expo-router";

// const { width, height } = Dimensions.get("window");

// const slides = [
//   {
//     id: "1",
//     title: "Bienvenue sur unricheunpauvre app",
//     description:
//       "Transformez vos rêves en réalité grâce à notre communauté de soutien et de financement participatif.",
//     icon: "heart",
//   },
//   {
//     id: "2",
//     title: "Nos Services",
//     description:
//       "Spécialisés dans le développement durable et l'éducation, nous vous accompagnons dans la réalisation de vos projets depuis plusieurs années.",
//     icon: "solution1",
//   },
//   {
//     id: "3",
//     title: "Notre Engagement",
//     description:
//       "Notre équipe expérimentée étudie, planifie et estime le budget nécessaire pour concrétiser vos projets en 48 heures.",
//     icon: "Safety",
//   },
//   {
//     id: "4",
//     title: "Rejoignez-nous",
//     description:
//       "Ensemble, construisons un avenir meilleur en soutenant des projets qui ont du sens.",
//     icon: "team",
//   },
// ];

// const OnboardingScreen = () => {
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const slidesRef = useRef(null);

//   const router = useRouter();

//   const viewConfigRef = useRef({ viewAreaCoveragePercentThreshold: 50 });

//   // Add this new function to handle viewable items change
//   const onViewableItemsChanged = useRef(({ viewableItems }) => {
//     if (viewableItems && viewableItems.length > 0) {
//       setCurrentIndex(viewableItems[0].index);
//     }
//   });

//   const updateCurrentSlideIndex = (e) => {
//     const contentOffsetX = e.nativeEvent.contentOffset.x;
//     const currentIndex = Math.round(contentOffsetX / width);
//     setCurrentIndex(currentIndex);
//   };

//   const goToNextSlide = () => {
//     const nextSlideIndex = currentIndex + 1;
//     if (nextSlideIndex != slides.length) {
//       slidesRef.current.scrollToIndex({
//         index: nextSlideIndex,
//         animated: true,
//       });
//       setCurrentIndex(nextSlideIndex);
//     }
//   };

//   const skip = () => {
//     slidesRef.current.scrollToIndex({
//       index: slides.length - 1,
//       animated: true,
//     });
//     setCurrentIndex(slides.length - 1);
//     router.replace("/register");
//   };

//   const renderSlide = ({ item }) => {
//     return (
//       <View style={[styles.slide]}>
//         <AntDesign name={item.icon} size={80} color="#2563EB" />
//         <Text style={styles.title}>{item.title}</Text>
//         <Text style={styles.description}>{item.description}</Text>
//       </View>
//     );
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <View style={styles.logoContainer}>
//         {/* <View style={styles.logo}> */}
//         {/* <Text style={styles.logoText}> */}
//         {/* RP */}
//         <Image
//           source={require("@/assets/images/icon.png")}
//           resizeMode="contain"
//           // style={styles.logo}
//           className="w-20 h-20"
//         />
//         {/* </Text> */}
//         {/* </View> */}
//       </View>

//       {/* <FlatList
//         ref={slidesRef}
//         data={slides}
//         renderItem={renderSlide}
//         horizontal
//         pagingEnabled
//         showsHorizontalScrollIndicator={false}
//         onMomentumScrollEnd={updateCurrentSlideIndex}
//         keyExtractor={(item) => item.id}
//       /> */}

//       <FlatList
//         ref={slidesRef}
//         data={slides}
//         renderItem={renderSlide}
//         horizontal
//         pagingEnabled
//         bounces={false}
//         showsHorizontalScrollIndicator={false}
//         onViewableItemsChanged={onViewableItemsChanged.current}
//         viewabilityConfig={viewConfigRef.current}
//         onMomentumScrollEnd={updateCurrentSlideIndex}
//         keyExtractor={(item) => item.id}
//       />

//       <View style={styles.pagination}>
//         {slides.map((_, index) => {
//           console.log("\n\n currentIndex, and index: ", index, currentIndex);
//           return (
//             <View
//               key={index}
//               style={[
//                 styles.paginationDot,
//                 currentIndex === index && styles.paginationDotActive,
//               ]}
//             />
//           );
//         })}
//       </View>

//       <View style={styles.bottomButtons}>
//         {currentIndex === slides.length - 1 ? (
//           <TouchableOpacity
//             style={styles.button}
//             onPress={() => router.replace("/register")}
//           >
//             <Text style={styles.buttonText}>Commencer</Text>
//             <AntDesign name="arrowright" size={20} color="white" />
//           </TouchableOpacity>
//         ) : (
//           <>
//             <TouchableOpacity style={styles.button} onPress={goToNextSlide}>
//               <Text style={styles.buttonText}>Suivant</Text>
//               <AntDesign name="arrowright" size={20} color="white" />
//             </TouchableOpacity>
//             <TouchableOpacity style={styles.skipButton} onPress={skip}>
//               <Text style={styles.skipButtonText}>Passer</Text>
//             </TouchableOpacity>
//           </>
//         )}
//       </View>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#F8FAFC",
//     marginTop: 100,
//   },
//   logoContainer: {
//     alignItems: "center",
//     marginTop: 20,
//     marginBottom: 20,
//   },
//   logo: {
//     width: 64,
//     height: 64,
//     backgroundColor: "#2563EB",
//     borderRadius: 16,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   logoText: {
//     color: "white",
//     fontSize: 24,
//     fontWeight: "bold",
//   },
//   slide: {
//     width,
//     paddingHorizontal: 20,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: "bold",
//     color: "#1E293B",
//     textAlign: "center",
//     marginTop: 20,
//     marginBottom: 10,
//   },
//   description: {
//     fontSize: 16,
//     color: "#64748B",
//     textAlign: "center",
//     paddingHorizontal: 20,
//   },
//   pagination: {
//     flexDirection: "row",
//     justifyContent: "center",
//     marginBottom: 20,
//   },
//   paginationDot: {
//     height: 8,
//     width: 8,
//     borderRadius: 4,
//     backgroundColor: "#CBD5E1",
//     marginHorizontal: 4,
//   },
//   paginationDotActive: {
//     backgroundColor: "#2563EB",
//   },
//   bottomButtons: {
//     paddingHorizontal: 20,
//     paddingBottom: 30,
//   },
//   button: {
//     backgroundColor: "#2563EB",
//     padding: 15,
//     borderRadius: 12,
//     flexDirection: "row",
//     justifyContent: "center",
//     alignItems: "center",
//     marginBottom: 10,
//   },
//   buttonText: {
//     color: "white",
//     fontSize: 16,
//     fontWeight: "600",
//     marginRight: 8,
//   },
//   skipButton: {
//     padding: 15,
//     borderRadius: 12,
//   },
//   skipButtonText: {
//     color: "#64748B",
//     fontSize: 16,
//     fontWeight: "600",
//     textAlign: "center",
//   },
// });

// export default OnboardingScreen;

import React, { useState, useRef } from "react";
import {
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  FlatList,
  Image,
  SafeAreaView,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { useRouter } from "expo-router";
// import { ViewToken } from "@react-native/community/viewpager";

const { width } = Dimensions.get("window");

interface Slide {
  id: string;
  title: string;
  description: string;
  // icon: keyof typeof AntDesign.glyphMap;
}

const slides: Slide[] = [
  {
    id: "1",
    title: " BIENVENUE SUR UN RICHE UN PAUVRE ",
    description:
      `NOUS SOMMES TOUS LE RICHE D’UN PAUVRE ET NOUS SOMMES TOUS LE PAUVRE D’UN RICHE.
      Cependant, avant tout, nous sommes des êtres humains, chacun d'entre nous ayant des rêves que nous aspirons à réaliser.
        
      Il arrive parfois que nous ne puissions pas concrétiser nos rêves par nous- mêmes, que ce soit par manque de moyens ou de soutien, et nous avons alors besoin de l'aide d'autrui pour les réaliser.
`,
    // icon: "heart",
  },
  {
    id: "2",
    title: "Nos Services",
    description:
      `Cette application vous offre la possibilité de partager vos rêves, et quelqu'un sur cette terre pourra les concrétiser pour vous, selon sa propre volonté.

Quel que soit le rêve, qu'il soit matériel, lié à la santé, à une carrière, à l'humain, au social, à l'humanitaire ou à tout autre domaine, vous pourrez l’exprimer librement sur ce site, permettant ainsi à autrui de le réaliser.

`,
    // icon: "solution1",
  },
  {
    id: "3",
    title: "Notre Engagement",
    description:
      `
      Retrouvez votre humanité en partageant vos désirs et en contribuant à la réalisation des souhaits des autres.

      Ce qui peut sembler insignifiant pour vous peut revêtir une grande importance pour autrui, et vice versa.

Les transactions effectuées sur ce site sont sécurisées et suivies.

En tant qu'utilisateur, vous serez amené à valider votre identité dès que votre rêve sera réalisé, afin d'éviter toute usurpation.

`,
    // icon: "Safety",
  },
  {
    id: "4",
    title: "Rejoignez-nous",
    description:
      `
      Vous ne pourrez pas communiquer directement avec les autres utilisateurs, mais uniquement avec les administrateurs.

 Vous aurez la possibilité d'apprécier et de commenter les publications, ainsi que de les ajouter à vos favoris pour éventuellement les réaliser à votre convenance.

Donner pour aider, recevoir pour rêver.

Vous êtes le seul capable de transformer votre avenir, tout en influençant celui des autres.`,
    // icon: "team",
  },
];

type OnboardingScreenProps = {
  onComplete: () => void;
};

const OnboardingScreen = ({ onComplete }: OnboardingScreenProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const slidesRef = useRef<FlatList>(null);
  const router = useRouter();

  const viewConfigRef = useRef({ viewAreaCoveragePercentThreshold: 50 });

  const handleOnboardingComplete = () => {
    onComplete();
  };


  const onViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: any[] }) => {
    if (viewableItems && viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index ?? 0);
    }
  });

  const updateCurrentSlideIndex = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const contentOffsetX = e.nativeEvent.contentOffset.x;
    const currentIndex = Math.round(contentOffsetX / width);
    setCurrentIndex(currentIndex);
  };

  const goToNextSlide = () => {
    const nextSlideIndex = currentIndex + 1;
    if (nextSlideIndex !== slides.length) {
      slidesRef.current?.scrollToIndex({
        index: nextSlideIndex,
        animated: true,
      });
      setCurrentIndex(nextSlideIndex);
    }
  };

  const skip = () => {
    slidesRef.current?.scrollToIndex({
      index: slides.length - 1,
      animated: true,
    });
    setCurrentIndex(slides.length - 1);
    router.replace("/register");
  };

  const renderSlide = ({ item }: { item: Slide }) => {
    return (
      <View className="w-screen px-5 items-center justify-center">
        {/* <AntDesign name={item.icon} size={80} color="#2563EB" /> */}
        <Text className="text-2xl font-bold text-slate-900 text-center mt-5 mb-2.5">
          {item.title}
        </Text>
        <Text className="text-base text-slate-500 text-stretch px-5">
          {item.description}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50 pt-5">
      <View className="items-center mt-5 mb-5">
        <Image
          source={require("@/assets/images/icon.png")}
          resizeMode="contain"
          className="w-16 h-16"
        />
      </View>

      <FlatList
        ref={slidesRef}
        data={slides}
        renderItem={renderSlide}
        horizontal
        pagingEnabled
        bounces={false}
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged.current}
        viewabilityConfig={viewConfigRef.current}
        onMomentumScrollEnd={updateCurrentSlideIndex}
        keyExtractor={(item) => item.id}
      />

      <View className="flex-row justify-center mb-5">
        {slides.map((_, index) => (
          <View
            key={index}
            className={`h-2 w-2 rounded-full mx-1 ${currentIndex === index ? "bg-blue-600" : "bg-slate-300"
              }`}
          />
        ))}
      </View>

      <View className="px-5 pb-8">
        {currentIndex === slides.length - 1 ? (
          <TouchableOpacity
            className="bg-blue-600 p-4 rounded-xl flex-row justify-center items-center mb-2.5"
            onPress={() => handleOnboardingComplete()}
          >
            <Text className="text-white text-base font-semibold mr-2">
              Commencez l'expérience.
            </Text>
            <AntDesign name="arrowright" size={20} color="white" />
          </TouchableOpacity>
        ) : (
          <>
            <TouchableOpacity
              className="bg-blue-600 p-4 rounded-xl flex-row justify-center items-center mb-2.5"
              onPress={goToNextSlide}
            >
              <Text className="text-white text-base font-semibold mr-2">
                Suivant
              </Text>
              <AntDesign name="arrowright" size={20} color="white" />
            </TouchableOpacity>
            <TouchableOpacity
              className="p-4 rounded-xl"
              onPress={skip}
            >
              <Text className="text-slate-500 text-base font-semibold text-center">
                Passer
              </Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </SafeAreaView>
  );
};

export default OnboardingScreen;