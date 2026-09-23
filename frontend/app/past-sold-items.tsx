import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, ActivityIndicator, Alert, Image, TouchableOpacity } from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons"; 
import { API_BASE_URL } from "../config/api";

interface SoldItem {
  id: string;
  buyer: string;
  product: {
    title: string;
    price: number;
    images: string[];
    category: string;
  };
  createdAt: string;
}

const PastSoldItems = () => {
  const [soldItems, setSoldItems] = useState<SoldItem[]>([]);
  const [loading, setLoading] = useState(true); 

  const fetchSoldItems = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert("Login Required", "Please login to view your sold items.");
        router.replace("./login");
        return;
      }

      const response = await axios.get(`${API_BASE_URL}/api/user/seller-completed-history`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSoldItems(response.data.data); // Set the fetched sold items
    } catch (error) {
      console.error("Error fetching sold items:", error);
      Alert.alert("Error", "Failed to fetch sold items. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSoldItems();
  }, []);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (soldItems.length === 0) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-lg text-gray-500">No sold items found.</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <View className="p-4 flex-row items-center border-b border-gray-200">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text className="text-xl font-bold ml-4">Past Sold Items</Text>
      </View>

      <ScrollView className="flex-1 p-4">
        {soldItems.map((item) => (
          <View key={item.id} className="bg-gray-100 p-4 rounded-lg mb-4">
            <Image
              source={{ uri: item.product.images[0] }}
              className="w-full h-40 rounded-lg"
              resizeMode="cover"
            />

            <View className="mt-2">
              <Text className="text-lg font-bold">{item.product.title}</Text>
              <Text className="text-gray-600">Price: ₹{item.product.price}</Text>
              <Text className="text-gray-600">Category: {item.product.category}</Text>
              <Text className="text-gray-600">Buyer: {item.buyer}</Text>
              <Text className="text-gray-600">
                Sold on: {new Date(item.createdAt).toLocaleDateString()}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default PastSoldItems;