import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { authClient } from "@/lib/auth-client";
import { Link } from "expo-router";
import Toast from "react-native-toast-message";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async () => {
    console.log("Starting registration attempt...");
    try {
      setIsLoading(true);
      const result = await authClient.signUp.email({
        email,
        password,
        name: "TODO",
      });

      console.log("Registration successful");
      console.log(result);
      Toast.show({
        type: "success",
        text1: "Registration Successful",
        text2: "Please sign in with your credentials",
      });
    } catch (error) {
      console.error("Registration failed:", error);
      Toast.show({
        type: "error",
        text1: "Registration Failed",
        text2:
          error instanceof Error ? error.message : "Could not create account ",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const isDisabled =
    isLoading ||
    !email ||
    !password ||
    !confirmPassword ||
    password !== confirmPassword;

  return (
    <View className="flex-1 justify-center p-6 bg-white">
      <View className="items-center mb-8">
        <Text className="text-3xl font-bold">Create Account</Text>
      </View>

      <TextInput
        className="h-12 border border-gray-300 rounded-lg px-4 mb-4 bg-gray-50"
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        editable={!isLoading}
        placeholderTextColor="#888"
      />

      <TextInput
        className="h-12 border border-gray-300 rounded-lg px-4 mb-4 bg-gray-50"
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        editable={!isLoading}
        placeholderTextColor="#888"
      />

      <TextInput
        className="h-12 border border-gray-300 rounded-lg px-4 mb-4 bg-gray-50"
        placeholder="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        editable={!isLoading}
        placeholderTextColor="#888"
      />

      <TouchableOpacity
        className={`h-12 rounded-lg flex-row justify-center items-center mb-4 bg-blue-600 ${
          isDisabled ? "opacity-50" : ""
        }`}
        onPress={handleRegister}
        disabled={isDisabled}
        activeOpacity={0.8}
      >
        <Text className="text-white font-bold text-base">
          {isLoading ? "Creating Account..." : "Sign Up"}
        </Text>
      </TouchableOpacity>

      <View className="flex-row justify-center items-center mt-4">
        <Text>Already have an account? </Text>
        <Link href="/_auth/login" asChild>
          <Text className="text-blue-600 font-bold ml-1">Sign In</Text>
        </Link>
      </View>
      <Toast />
    </View>
  );
}
