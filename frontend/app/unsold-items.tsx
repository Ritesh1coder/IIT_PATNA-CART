import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, ActivityIndicator, Alert, Image, TouchableOpacity } from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons"; 
import { API_BASE_URL } from "../config/api";
interface Listing {
  productId: string;
  title: string;
  price: number;
  images: string[];
  category: string;
  status: string;
  createdAt: string;
}

const AllListings = () => {
  const [listings, setListings] = useState<Listing[]>([]); 
  const [loading, setLoading] = useState(true); 
  
  const fetchListings = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert("Login Required", "Please login to view your listings.");
        router.replace("./login");
        return;
      }

      const response = await axios.get(`${API_BASE_URL}/api/user/seller-lisitings`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setListings(response.data.data); 
    } catch (error) {
      console.error("Error fetching listings:", error);
      Alert.alert("Error", "Failed to fetch listings. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (listings.length === 0) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-lg text-gray-500">No listings found.</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <View className="p-4 flex-row items-center border-b border-gray-200">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text className="text-xl font-bold ml-4">All Listings</Text>
      </View>

      <ScrollView className="flex-1 p-4">
        {listings.map((listing) => (
          <View key={listing.productId} className="bg-gray-100 p-4 rounded-lg mb-4">
            <Image
              source={{ uri: listing.images[0] }}
              className="w-full h-40 rounded-lg"
              resizeMode="cover"
            />
            <View className="mt-2">
              <Text className="text-lg font-bold">{listing.title}</Text>
              <Text className="text-gray-600">Price: ₹{listing.price}</Text>
              <Text className="text-gray-600">Category: {listing.category}</Text>
              <Text className="text-gray-600">Status: {listing.status}</Text>
              <Text className="text-gray-600">
                Listed on: {new Date(listing.createdAt).toLocaleDateString()}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default AllListings;