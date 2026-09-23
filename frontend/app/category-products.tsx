import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, ActivityIndicator, Alert, Image, TouchableOpacity } from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons"; // Import Ionicons for the back icon
import { API_BASE_URL } from "../config/api";

interface Product {
  productId: string;
  title: string;
  price: number;
  description: string;
  images: string[];
  category: string;
  contact: string;
  seller: string;
  status: string;
}

const CategoryProducts = () => {
  const { category } = useLocalSearchParams(); 
  const [products, setProducts] = useState<Product[]>([]); 
  const [loading, setLoading] = useState(true); 

  const fetchProductsByCategory = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert("Login Required", "Please login to view products.");
        router.replace("./login");
        return;
      }
      if (typeof category === "string") {
        console.log(category.toLowerCase());
      }
      const response = await axios.get(`${API_BASE_URL}/api/user/products`, {
        params: { category: category },
        headers: { Authorization: `Bearer ${token}` },
      });

      setProducts(response.data.data); // Set the fetched products
    } catch (error) {
      console.error("Error fetching products:", error);
      Alert.alert("Error", "Failed to fetch products. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductsByCategory();
  }, [category]);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (products.length === 0) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-lg text-gray-500">No products found in this category.</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <View className="p-4 flex-row items-center border-b border-gray-200">
        <TouchableOpacity onPress={() => router.push("/home")}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text className="text-xl font-bold ml-4">{category}</Text>
      </View>

      <ScrollView className="flex-1 p-4">
        <View className="flex-row flex-wrap justify-between">
          {products.map((product) => (
            <TouchableOpacity
              key={product.productId}
              className="w-[48%] bg-gray-100 p-3 rounded-lg mb-4"
              onPress={() =>
                router.push({ pathname: "./product-details", params: { product: JSON.stringify(product) } })
              }
            >
              <Image
                source={{ uri: product.images[0] }}
                className="w-full h-40 rounded-lg"
                resizeMode="cover"
              />

              <View className="mt-2">
                <Text className="text-lg font-medium" numberOfLines={1}>
                  {product.title}
                </Text>
                <Text className="text-gray-600 mt-1">₹{product.price}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default CategoryProducts;