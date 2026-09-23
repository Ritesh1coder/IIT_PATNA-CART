import React, { useState } from "react";
import { View, Text, Image, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useStripe, StripeProvider  } from "@stripe/stripe-react-native"; // Import Stripe hooks
import { API_BASE_URL } from "../config/api";

const ProductDetails = () => {
  const { product } = useLocalSearchParams();
  const productData = JSON.parse(Array.isArray(product) ? product[0] : product);
  const [isFavorite, setIsFavorite] = useState(false); 
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const { initPaymentSheet, presentPaymentSheet } = useStripe();

  const toggleWishlist = async () => {
    if (wishlistLoading) return;
    setWishlistLoading(true);

    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert("Login Required", "Please login to add items to your wishlist.");
        router.replace("./login");
        return;
      }

      const endpoint = isFavorite
        ? `${API_BASE_URL}/api/user/wishlistDelete`
        : `${API_BASE_URL}/api/user/wishlistAdd`;

      const payload = { productId: productData.productId };

      const response = await axios.post(endpoint, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setIsFavorite(!isFavorite);
      Alert.alert(
        isFavorite ? "Removed from Wishlist" : "Added to Wishlist",
        isFavorite
          ? "This item has been removed from your wishlist."
          : "This item has been added to your wishlist."
      );
    } catch (error) {
      console.error("Error updating wishlist:", error);
      Alert.alert("Error", "Failed to update wishlist. Please try again.");
    } finally {
      setWishlistLoading(false);
    }
  };

  const handleBuyNow = async () => {
    setPaymentLoading(true);

    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert("Login Required", "Please login to proceed with the payment.");
        router.replace("./login");
        return;
      }

      const response = await axios.post(
        `${API_BASE_URL}/api/user/create-payment-intent`,
        { amount: productData.price * 100 }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const { clientSecret } = response.data;

      const { error } = await initPaymentSheet({
        paymentIntentClientSecret: clientSecret,
        merchantDisplayName: "Your App Name",
      });

      if (error) {
        Alert.alert("Error", error.message);
        return;
      }

      const { error: paymentError } = await presentPaymentSheet();

      if (paymentError) {
        Alert.alert("Payment Failed", paymentError.message);
        return;
      }

      await axios.post(
        `${API_BASE_URL}/api/user/transaction-success`,
        { productId: productData.productId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      Alert.alert("Success", "Payment successful! Your order has been placed.");
      router.replace("./home");
    } catch (error) {
      console.error("Error during payment:", error);
      Alert.alert("Error", "Payment failed. Please try again.");
    } finally {
      setPaymentLoading(false);
    }
  };

  return (
    <StripeProvider
    publishableKey="pk_test_51QvkxW2Y68AfWneTqlrUBE6uOP6kX9vU8tabtqGkPjK3QZVLbuxZt1PILUnuevRT556KcG47oxVv2mrIxbqMjTCM00wm1gOSLz">
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="p-4 flex-row items-center justify-between border-b border-gray-200">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text className="text-xl font-bold">Product Details</Text>
        <TouchableOpacity onPress={toggleWishlist} disabled={wishlistLoading}>
          <Ionicons
            name={isFavorite ? "heart" : "heart-outline"}
            size={24}
            color={isFavorite ? "red" : "black"}
          />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} className="flex-1 p-4">
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
          {productData.images.map((image: string, index: number) => (
            <Image
              key={index}
              source={{ uri: image }}
              className="w-80 h-80 rounded-lg mr-4"
              resizeMode="cover"
            />
          ))}
        </ScrollView>

        <Text className="text-2xl font-bold mb-2">{productData.title}</Text>
        <Text className="text-xl text-blue-600 font-semibold mb-4">
          ₹{productData.price}
        </Text>

        <Text className="text-gray-600 text-base mb-6">
          {productData.description}
        </Text>

        <View className="bg-gray-100 p-4 rounded-lg mb-6">
          <Text className="text-lg font-semibold mb-2">Seller Information</Text>
          <Text className="text-gray-600">Seller ID: {productData.seller}</Text>
          <Text className="text-gray-600">Contact: {productData.contact}</Text>
        </View>

        <TouchableOpacity
          className="bg-green-500 p-4 rounded-lg items-center mb-4"
          onPress={handleBuyNow}
          disabled={paymentLoading}
        >
          {paymentLoading ? (
            <ActivityIndicator size="small" color="#ffffff" />
          ) : (
            <Text className="text-white text-lg font-semibold">Buy Now</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-blue-500 p-4 rounded-lg items-center"
          onPress={() => {
            console.log("Contact Seller:", productData.contact);
          }}
        >
          <Text className="text-white text-lg font-semibold">Contact Seller</Text>
        </TouchableOpacity>
      </ScrollView>
    </View></StripeProvider>
  );
};

export default ProductDetails;