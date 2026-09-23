import React, { useState, useEffect } from "react";
import { View, Text, FlatList, Image, TouchableOpacity, ScrollView } from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { API_BASE_URL } from "../config/api";

const AllItems = () => {
  interface Product {
    productId: number;
    description: String,
    title: string;
    price: number;
    images: string[];
  }

  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) {
          router.replace("./login");
          return;
        }
        const response = await axios.get(`${API_BASE_URL}/api/user/products`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProducts(response.data.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchAllProducts();
  }, []);

  return (
    <View className="flex-1 bg-gray-100 p-4">
      {/* Header */}
      <View className="flex-row justify-between items-center mb-6">
        <Text className="text-2xl font-bold">All Items</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text className="text-blue-500 text-lg">Back</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="flex-row flex-wrap justify-between">
          {products.map((item) => (
            <TouchableOpacity
              key={item.productId.toString()}
              className="w-[48%] bg-white rounded-lg shadow-sm mb-4 p-3"
              onPress={() => router.push({ pathname: "./product-details", params: { product: JSON.stringify(item) } })}
            >
              <Image
                source={{ uri: item.images[0] }}
                className="w-full h-40 rounded-lg"
                resizeMode="cover"
              />
              <View className="mt-2">
                <Text className="text-lg font-medium" numberOfLines={1}>
                  {item.title}
                </Text>
                <Text className="text-gray-600 mt-1">₹{item.price}</Text>
                <Text className="text-sm text-gray-500 mt-1" numberOfLines={2}>
                  {item.description}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default AllItems;