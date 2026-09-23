// app/search-results.tsx
import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Image, TouchableOpacity, ScrollView, ActivityIndicator } from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams, router } from "expo-router";
import { API_BASE_URL } from "../config/api";

interface Product {
  productId: number;
  title: string;
  price: number;
  images: string[];
  description: string;
  category: string;
  contact: string;
  seller: string;
  status: string;
  createdAt: string;
  buyer: string;
}

const SearchResults = () => {
  const { query } = useLocalSearchParams(); 
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const response = await axios.get(`${API_BASE_URL}/api/user/search-query`, {
          params: { query },
          headers: { Authorization: `Bearer ${token}` },
        });
        setSearchResults(response.data.data); 
      } catch (error) {
        console.error("Error fetching search results:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSearchResults();
  }, [query]);

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-100 p-4">
      <View className="flex-row justify-between items-center mb-6">
        <Text className="text-2xl font-bold">Search Results for "{query}"</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text className="text-blue-500 text-lg">Back</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="flex-row flex-wrap justify-between">
          {searchResults.map((item) => (
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

export default SearchResults;