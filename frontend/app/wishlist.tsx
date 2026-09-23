import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, Image, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import { router } from "expo-router";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL } from "../config/api";

interface WishlistItem {
  createdAt: string;
  product: {
    buyer: string;
    category: string;
    contact: string;
    createdAt: string;
    description: string;
    images: string[];
    price: number;
    productId: number;
    seller: string;
    status: string;
    title: string;
  };
  productId: number;
  roll_number: string;
  wishlistId: number;
}

const Wishlist = () => {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]); 
  const [loading, setLoading] = useState(true); 

  const fetchWishlist = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert("Login Required", "Please login to view your wishlist.");
        router.replace("./login");
        return;
      }

      const response = await axios.get(`${API_BASE_URL}/api/user/wishlist`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setWishlist(response.data);
    } catch (error) {
      console.error("Error fetching wishlist:", error);
      Alert.alert("Error", "Failed to fetch wishlist. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (wishlist.length === 0) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-lg text-gray-500">Your wishlist is empty.</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white p-4">
      <View className="flex-row justify-between items-center mb-6">
        <Text className="text-2xl font-bold">Wishlist</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text className="text-blue-500 text-lg">Back</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="flex-row flex-wrap justify-between">
          {wishlist.map((item) => (
            <TouchableOpacity
              key={item.wishlistId}
              className="w-[48%] bg-gray-100 rounded-lg p-3 mb-4"
              onPress={() =>
                router.push({ pathname: "./product-details", params: { product: JSON.stringify(item.product) } })
              }
            >
              <Image
                source={{ uri: item.product.images[0] }}
                className="w-full h-40 rounded-lg"
                resizeMode="cover"
              />

              <View className="mt-2">
                <Text className="text-lg font-medium" numberOfLines={1}>
                  {item.product.title}
                </Text>
                <Text className="text-gray-600 mt-1">₹{item.product.price}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default Wishlist;