import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";
import { authClient } from "@/lib/auth-client";
import { Link, router } from "expo-router";
import Toast from "react-native-toast-message";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    console.log("Starting login attempt...");
    try {
      setIsLoading(true);
      const result = await authClient.signIn.email({
        email,
        password,
      });
      console.log(result);
      console.log("Login successful, session:", await authClient.getSession());
      router.replace("/(authenticated)/home");
    } catch (error) {
      console.error("Login failed:", error);
      Toast.show({
        type: "error",
        text1: "Login Failed",
        text2:
          error instanceof Error ? error.message : "Invalid email or password",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      await authClient.signIn.social({
        provider: "google",
      });
      console.log("Google login successful");
      router.replace("/(authenticated)/home");
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Google Sign In Failed",
        text2: "Unable to sign in with Google",
      });
      console.error("Google login failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View className="flex-1 justify-center p-6 bg-white">
      <View className="items-center mb-8">
        <Text className="text-3xl font-bold">Welcome Back</Text>
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

      <TouchableOpacity
        className={`h-12 rounded-lg flex-row justify-center items-center mb-4 bg-blue-600 ${
          isLoading || !email || !password ? "opacity-50" : ""
        }`}
        onPress={handleLogin}
        disabled={isLoading || !email || !password}
        activeOpacity={0.8}
      >
        <Text className="text-white font-bold text-base">
          {isLoading ? "Signing in..." : "Sign In"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        className={`h-12 rounded-lg flex-row justify-center items-center mb-4 bg-white border border-gray-300 ${
          isLoading ? "opacity-50" : ""
        }`}
        onPress={handleGoogleLogin}
        disabled={isLoading}
        activeOpacity={0.8}
      >
        <Image
          source={require("@/assets/images/google-logo.png")}
          className="w-5 h-5 mr-2"
        />
        <Text className="text-gray-900 font-bold text-base">
          Sign in with Google
        </Text>
      </TouchableOpacity>

      <View className="flex-row justify-center items-center mt-4">
        <Text>Don't have an account? </Text>
        <Link href="/_auth/register" asChild>
          <Text className="text-blue-600 font-bold ml-1">Sign Up</Text>
        </Link>
      </View>
      <Toast />
    </View>
  );
}
