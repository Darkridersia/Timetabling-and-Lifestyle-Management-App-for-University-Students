import { StyleSheet, Text, View, SafeAreaView, Image } from "react-native";
import React, { useState, useEffect } from "react";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";

// Define the type for the route parameters
type RestScreenRouteParams = {
  incrementIndex: () => void;
};

// Apply the type to the route
const RestScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<{ params: RestScreenRouteParams }, 'params'>>();
  const { incrementIndex } = route.params; // Use the defined type

  const [timeLeft, setTimeLeft] = useState(3);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          setTimeout(() => {
            incrementIndex();
            navigation.goBack();
          }, 0); // Slight delay before incrementing index
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <SafeAreaView>
      <Image
        source={{
          uri: "https://cdn-images.cure.fit/www-curefit-com/image/upload/fl_progressive,f_auto,q_auto:eco,w_500,ar_500:300,c_fit/dpr_2/image/carefit/bundle/CF01032_magazine_2.png",
        }}
        style={{ width: "100%", height: 420 }}
      />
      <Text
        style={{
          fontSize: 30,
          fontWeight: "900",
          marginTop: 50,
          textAlign: "center",
        }}
      >
        TAKE A BREAK!
      </Text>
      <Text
        style={{
          fontSize: 40,
          fontWeight: "800",
          marginTop: 50,
          textAlign: "center",
        }}
      >
        {timeLeft}
      </Text>
    </SafeAreaView>
  );
};

export default RestScreen;
