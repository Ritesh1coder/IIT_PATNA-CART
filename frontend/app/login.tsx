import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";
import { Link, router } from "expo-router";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL } from "../config/api";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const checkAuth = async () => {
      const token = await AsyncStorage.getItem("token");
      console.log(token);
      if (token) {
        router.push("./home");
      }
    };
    checkAuth();
  }, []);
  const handleLogin = async () => {
    console.log("Login pressed:", { email, password });
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/auth/login`,
        { email, password }
      );
      if (response.status == 200) {
        const token = response.data.token;
        await AsyncStorage.setItem("token", token);
        router.replace("./home");
      }
    } catch (error) {
      throw error;
    }
  };

  return (
    <View className="flex-1 bg-white px-6 justify-center">
      <View className="items-center">
        <Image
          source={require("../assets/images/login_img.jpg")}
          className="w-60 h-60"
          resizeMode="contain"
        />
      </View>

      <View className="mb-8">
        <Text className="text-3xl font-black text-gray-800 text-center">
          Welcome Back!
        </Text>
        <Text className="text-gray-600 text-center mt-2">
          Sign in to continue
        </Text>
      </View>

      <Text className="text-gray-700 mb-2 ml-1">Email</Text>
      <TextInput
        className="w-full bg-gray-50 rounded-lg px-4 py-3 mb-4 border border-rose-100"
        placeholder="Enter your email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        placeholderTextColor="#999"
      />

      <Text className="text-gray-700 mb-2 ml-1">Password</Text>
      <TextInput
        className="w-full bg-gray-50 rounded-lg px-4 py-3 mb-6 border border-rose-100"
        placeholder="Enter your password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholderTextColor="#999"
      />
      <TouchableOpacity
        className="bg-rose-500 rounded-lg py-3 active:bg-rose-600"
        onPress={handleLogin}
      >
        <Text className="text-white text-center font-medium text-lg">
          Login
        </Text>
      </TouchableOpacity>

      <View className="flex-row justify-center mt-6">
        <Text className="text-gray-600">Don't have an account? </Text>
        <Link href="./register" className="text-rose-500 font-medium">
          Register
        </Link>
      </View>
    </View>
  );
};

export default LoginScreen;
