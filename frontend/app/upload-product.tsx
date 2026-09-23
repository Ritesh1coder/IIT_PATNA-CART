import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image,
} from "react-native";
import { router } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { Picker } from "@react-native-picker/picker";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StripeProvider } from "@stripe/stripe-react-native";
import { API_BASE_URL } from "../config/api";

const UploadProduct = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("electronics");
  const [contact, setContact] = useState("");
  const [images, setImages] = useState<string[]>([]);

  const categories = [
    "electronics",
    "fashion",
    "home",
    "sports",
    "books",
    "toys",
    "beauty",
    "hobby",
  ];

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Denied",
        "Please allow access to your photos to upload images."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 1,
    });

    if (!result.canceled) {
      const selectedImages: string[] = result.assets.map(
        (asset: ImagePicker.ImagePickerAsset) => asset.uri
      );
      setImages([...images, ...selectedImages]);
    }
  };

  const handleSubmit = async () => {
    if (
      !title ||
      !description ||
      !price ||
      !category ||
      !contact ||
      images.length === 0
    ) {
      Alert.alert(
        "Error",
        "Please fill out all fields and upload at least one image."
      );
      return;
    }

    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert("Login Required", "Please login to upload a product.");
        router.replace("./login");
        return;
      }

      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("category", category);
      formData.append("contact", contact);
      images.forEach((image, index) => {
        formData.append("images", {
          uri: image,
          name: `image_${index}.jpg`,
          type: "image/jpeg",
        } as any);
      });

      const response = await axios.post(
        `${API_BASE_URL}/api/user/upload-item`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        Alert.alert("Success", "Product uploaded successfully!");
        router.replace("./home");
      }
    } catch (error) {
      console.error("Error uploading product:", error);
      Alert.alert("Error", "Failed to upload product. Please try again.");
    }
  };

  return (
    <StripeProvider publishableKey="pk_test_51QvkxW2Y68AfWneTqlrUBE6uOP6kX9vU8tabtqGkPjK3QZVLbuxZt1PILUnuevRT556KcG47oxVv2mrIxbqMjTCM00wm1gOSLz">
      <ScrollView className="flex-1 bg-white p-4">
        <Text className="text-2xl font-bold mb-6">Upload Product</Text>

        <Text className="text-lg font-medium mb-2">Title</Text>
        <TextInput
          className="w-full bg-gray-100 rounded-lg p-3 mb-4"
          placeholder="Enter product title"
          value={title}
          onChangeText={setTitle}
        />

        <Text className="text-lg font-medium mb-2">Description</Text>
        <TextInput
          className="w-full bg-gray-100 rounded-lg p-3 mb-4"
          placeholder="Enter product description"
          multiline
          numberOfLines={4}
          value={description}
          onChangeText={setDescription}
        />

        <Text className="text-lg font-medium mb-2">Price</Text>
        <TextInput
          className="w-full bg-gray-100 rounded-lg p-3 mb-4"
          placeholder="Enter product price"
          keyboardType="numeric"
          value={price}
          onChangeText={setPrice}
        />

        <Text className="text-lg font-medium mb-2">Category</Text>
        <View className="w-full bg-gray-100 rounded-lg mb-4">
          <Picker
            selectedValue={category}
            onValueChange={(itemValue: string) => setCategory(itemValue)}
          >
            {categories.map((cat: string) => (
              <Picker.Item
                key={cat}
                label={cat.charAt(0).toUpperCase() + cat.slice(1)}
                value={cat}
              />
            ))}
          </Picker>
        </View>

        <Text className="text-lg font-medium mb-2">Contact</Text>
        <TextInput
          className="w-full bg-gray-100 rounded-lg p-3 mb-4"
          placeholder="Enter your contact number"
          keyboardType="phone-pad"
          value={contact}
          onChangeText={setContact}
        />

        <Text className="text-lg font-medium mb-2">Upload Images</Text>
        <TouchableOpacity
          className="w-full bg-gray-100 rounded-lg p-4 items-center mb-4"
          onPress={pickImage}
        >
          <Text className="text-blue-500">Select Images</Text>
        </TouchableOpacity>

        <View className="flex-row flex-wrap">
          {images.map((image, index) => (
            <Image
              key={index}
              source={{ uri: image }}
              className="w-20 h-20 rounded-lg mr-2 mb-2"
              resizeMode="cover"
            />
          ))}
        </View>

        <TouchableOpacity
          className="w-full bg-blue-500 rounded-lg p-4 items-center mt-6"
          onPress={handleSubmit}
        >
          <Text className="text-white text-lg font-semibold">
            Upload Product
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </StripeProvider>
  );
};

export default UploadProduct;
