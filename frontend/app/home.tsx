// HomeScreen.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Image,
  TouchableOpacity,
  FlatList,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from "react-native-reanimated";
import { API_BASE_URL } from "../config/api";

const HomeScreen = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  interface Product {
    productId: number;
    title: string;
    price: number;
    images: string[];
  }

  const [latestProducts, setLatestProducts] = useState<Product[]>([]);
  const translateX = useSharedValue(-250);

  useEffect(() => {
    translateX.value = sidebarOpen ? withTiming(0) : withTiming(-250);
  }, [sidebarOpen]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const sidebarStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  useEffect(() => {
    const fetchLatestProducts = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) {
          router.replace("./login");
          return;
        }
        const response = await axios.get(`${API_BASE_URL}/api/user/products`, {
          params: { size: 5 },
          headers: { Authorization: `Bearer ${token}` },
        });
        setLatestProducts(response.data.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchLatestProducts();
  }, []);

  const categories = [
    { id: 1, name: "Electronics", image: require("../assets/images/electronics.png") },
    { id: 2, name: "Fashion", image: require("../assets/images/clothing.png") },
    { id: 3, name: "Home", image: require("../assets/images/decor.png") },
    { id: 4, name: "Sports", image: require("../assets/images/sports.png") },
    { id: 5, name: "Books", image: require("../assets/images/education.png") },
    { id: 6, name: "Toys", image: require("../assets/images/toys.png") },
    { id: 7, name: "Beauty", image: require("../assets/images/beauty.png") },
    { id: 8, name: "Hobby", image: require("../assets/images/hobby.png") },
  ];

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("token");
      router.replace("./login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const handleSearchSubmit = () => {
    if (searchQuery.trim()) {
      router.push({
        pathname: "./search-results",
        params: { query: searchQuery }, 
      });
    }
  };

  return (
    <View className="flex-1 bg-white">
      <Animated.View className="absolute left-0 top-0 h-full w-64 bg-gray-800 p-6 z-50" style={sidebarStyle}>
        <TouchableOpacity onPress={toggleSidebar} className="mb-6">
          <Ionicons name="close" size={30} color="white" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push("./upload-product")} className="mb-4">
          <Text className="text-white text-lg">Upload Product</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push("./past-orders")} className="mb-4">
          <Text className="text-white text-lg">Past Orders</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push("./past-sold-items")} className="mb-4">
          <Text className="text-white text-lg">Past Sold Items</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push("./unsold-items")} className="mb-4">
          <Text className="text-white text-lg">All Listings</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push("./wishlist")} className="mb-4">
          <Text className="text-white text-lg">Wishlist</Text>
        </TouchableOpacity>
      </Animated.View>
      <View className="p-4 mb-6 flex-row justify-between items-center">
        <TouchableOpacity onPress={toggleSidebar}>
          <Ionicons name="menu" size={30} color="black" />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={30} color="black" />
        </TouchableOpacity>
      </View>

      {/* Rest of the content */}
      <ScrollView>
        {/* Search Bar */}
        <View className="px-4 pb-4 mb-4">
          <TextInput
            className="w-full bg-gray-200 rounded-lg px-4 py-4"
            placeholder="Search for products..."
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery} // Update search query state
            onSubmitEditing={handleSearchSubmit} // Trigger search on submit
          />
        </View>

        {/* Image Banner */}
        <View className="px-4 pb-0 mb-4">
          <Image
            source={require("../assets/images/splash.jpg")}
            className="w-full h-80 rounded-lg"
            resizeMode="contain"
          />
        </View>

        {/* Categories */}
        <View className="px-4 pb-4">
          <Text className="text-xl font-bold mb-4">Categories</Text>
          <View className="flex-row flex-wrap">
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                className="w-1/4 p-2 items-center"
                onPress={() =>
                  router.push({ pathname: "./category-products", params: { category: category.name } })
                }
              >
                <Image
                  source={category.image}
                  className="w-16 h-16"
                  resizeMode="cover"
                />
                <Text className="text-center mt-2">{category.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View className="px-4 pb-4">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-xl font-bold">Latest Products</Text>
            <TouchableOpacity onPress={() => router.push("./allItems")}>
              <Text className="text-blue-500">See All</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            horizontal
            data={latestProducts}
            keyExtractor={(item) => item.productId.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                className="mr-4"
                onPress={() => router.push({ pathname: "./product-details", params: { product: JSON.stringify(item) } })}
              >
                <Image
                  source={{ uri: item.images[0] }}
                  className="w-32 h-32 rounded-lg"
                  resizeMode="cover"
                />
                <Text className="mt-2 font-medium">{item.title}</Text>
                <Text className="text-gray-600">₹{item.price}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default HomeScreen;