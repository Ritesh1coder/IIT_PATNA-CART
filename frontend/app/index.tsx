import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { View, Image } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import "../global.css";

export default function Index() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = await AsyncStorage.getItem("token"); 
      if (token) {
        router.replace("./home"); 
      } else {
        router.replace("/login"); 
      }
      setLoading(false);
    };

    setTimeout(checkAuth, 3000); 
  }, []);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <Image
          source={require("../assets/images/splash.jpg")} 
          className="w-full"
          resizeMode="contain"
        />
      </View>
    );
  }

  return null;
}
