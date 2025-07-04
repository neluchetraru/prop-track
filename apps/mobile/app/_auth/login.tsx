import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { authClient } from "@/lib/auth-client";
import { Link, router } from "expo-router";
import Toast from "react-native-toast-message";
import { TextInput } from "react-native";
import { z } from "zod";

const formSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type FormData = z.infer<typeof formSchema>;
export default function Login() {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<FormData>({
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (data: FormData) => {
    try {
      const result = await authClient.signIn.email({
        email: data.email,
        password: data.password,
      });
      if (result?.error) {
        Toast.show({
          type: "error",
          text1: "Login Failed",
          text2: result.error.message || "Invalid email or password",
        });
        return;
      }
      router.replace("/(authenticated)/home");
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Login Failed",
        text2:
          error instanceof Error ? error.message : "Invalid email or password",
      });
    }
  };

  const handleGoogleLogin = async () => {
    try {
      // Optionally, you can set a loading state for Google login separately
      await authClient.signIn.social({
        provider: "google",
      });
      router.replace("/(authenticated)/home");
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Google Sign In Failed",
        text2: "Unable to sign in with Google",
      });
    }
  };

  return (
    <View className="flex-1 justify-center p-6 bg-white">
      <View className="items-center mb-8">
        <Text className="text-3xl font-bold">Welcome Back</Text>
      </View>

      {/* Email */}
      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, onBlur, value } }) => (
          <>
            <TextInput
              className="h-12 border border-gray-300 rounded-lg px-4 mb-1 bg-gray-50"
              placeholder="Email"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              autoCapitalize="none"
              keyboardType="email-address"
              editable={!isSubmitting}
              placeholderTextColor="#888"
            />
            {errors.email && (
              <Text className="text-red-500 mb-2 ml-1 text-xs">
                {errors.email.message}
              </Text>
            )}
          </>
        )}
      />

      {/* Password */}
      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, onBlur, value } }) => (
          <>
            <View className="flex-row items-center">
              <TextInput
                className="flex-1 h-12 border border-gray-300 rounded-lg px-4 mb-1 bg-gray-50"
                placeholder="Password"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                secureTextEntry={!showPassword}
                editable={!isSubmitting}
                placeholderTextColor="#888"
              />
              <TouchableOpacity
                onPress={() => setShowPassword((prev) => !prev)}
                style={{ marginLeft: 8 }}
                disabled={isSubmitting}
              >
                <Text className="text-blue-600 font-bold text-xs">
                  {showPassword ? "Hide" : "Show"}
                </Text>
              </TouchableOpacity>
            </View>
            {errors.password && (
              <Text className="text-red-500 mb-2 ml-1 text-xs">
                {errors.password.message}
              </Text>
            )}
          </>
        )}
      />

      <TouchableOpacity
        className={`h-12 rounded-lg flex-row justify-center items-center mb-4 bg-blue-600 ${
          isSubmitting ? "opacity-50" : ""
        }`}
        onPress={handleSubmit(onSubmit)}
        disabled={isSubmitting}
        activeOpacity={0.8}
      >
        {isSubmitting ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text className="text-white font-bold text-base">Sign In</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        className={`h-12 rounded-lg flex-row justify-center items-center mb-4 bg-white border border-gray-300`}
        onPress={handleGoogleLogin}
        disabled={isSubmitting}
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
