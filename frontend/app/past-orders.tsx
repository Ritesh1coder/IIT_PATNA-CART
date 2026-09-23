import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, ActivityIndicator, Alert, Image, TouchableOpacity } from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons"; 
import { API_BASE_URL } from "../config/api";

interface Order {
  id: string;
  buyer: string;
  createdAt: string;
  product: {
    title: string;
    price: number;
    description: string;
    images: string[];
    category: string;
    contact: string;
    productId: string;
    seller: string;
    status: string;
  };
}

const PastOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]); 
  const [loading, setLoading] = useState(true); 

  const fetchPastOrders = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert("Login Required", "Please login to view your past orders.");
        router.replace("./login");
        return;
      }

      const response = await axios.get(`${API_BASE_URL}/api/user/buyer-history`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setOrders(response.data.data); 
    } catch (error) {
      console.error("Error fetching past orders:", error);
      Alert.alert("Error", "Failed to fetch past orders. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPastOrders();
  }, []);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (orders.length === 0) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-lg text-gray-500">No past orders found.</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <View className="p-4 flex-row items-center border-b border-gray-200">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text className="text-xl font-bold ml-4">Past Orders</Text>
      </View>

      <ScrollView className="flex-1 p-4">
        {orders.map((order) => (
          <View key={order.id} className="bg-gray-100 p-4 rounded-lg mb-4 flex-row justify-between items-center">
            <View className="flex-1">
              <Text className="text-lg font-bold mb-2">{order.product.title}</Text>
              <Text className="text-gray-600">Price: ₹{order.product.price}</Text>
              <Text className="text-gray-600">Category: {order.product.category}</Text>
              <Text className="text-gray-600">
                Purchased on: {new Date(order.createdAt).toLocaleDateString()}
              </Text>
              <Text className="text-gray-600">Seller: {order.product.seller}</Text>
            </View>

            <Image
              source={{ uri: order.product.images[0] }}
              className="w-20 h-20 rounded-lg"
              resizeMode="cover"
            />
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default PastOrders;