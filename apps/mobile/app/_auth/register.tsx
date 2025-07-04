import React from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { authClient } from "@/lib/auth-client";
import { Link, router } from "expo-router";
import Toast from "react-native-toast-message";
import { TextInput } from "react-native";
import { z } from "zod";

const formSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Password must be at least 6 characters"),
});

type FormData = z.infer<typeof formSchema>;

export default function Register() {
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    setError,
    reset,
  } = useForm<FormData>({
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const password = watch("password");

  const onSubmit = async (data: FormData) => {
    try {
      const result = await authClient.signUp.email({
        email: data.email,
        password: data.password,
        name: "TODO",
      });
      console.log(result);
      if (result?.error) {
        Toast.show({
          type: "error",
          text1: "Registration Failed",
          text2: result.error.message || "Could not create account",
        });
        return;
      }
      Toast.show({
        type: "success",
        text1: "Registration Successful",
        text2: "Please sign in with your credentials",
      });
      router.replace("/(authenticated)/home");
      reset();
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Registration Failed",
        text2:
          error instanceof Error ? error.message : "Could not create account ",
      });
    }
  };

  return (
    <View className="flex-1 justify-center p-6 bg-white">
      <View className="items-center mb-8">
        <Text className="text-3xl font-bold">Create Account</Text>
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
        rules={{
          required: "Password is required",
          minLength: {
            value: 6,
            message: "Password must be at least 6 characters",
          },
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <>
            <TextInput
              className="h-12 border border-gray-300 rounded-lg px-4 mb-1 bg-gray-50"
              placeholder="Password"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              secureTextEntry
              editable={!isSubmitting}
              placeholderTextColor="#888"
            />
            {errors.password && (
              <Text className="text-red-500 mb-2 ml-1 text-xs">
                {errors.password.message}
              </Text>
            )}
            <Text className="text-gray-400 mb-2 ml-1 text-xs">
              Min 6 characters
            </Text>
          </>
        )}
      />

      {/* Confirm Password */}
      <Controller
        control={control}
        name="confirmPassword"
        rules={{
          required: "Please confirm your password",
          validate: (value) => value === password || "Passwords do not match",
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <>
            <TextInput
              className="h-12 border border-gray-300 rounded-lg px-4 mb-1 bg-gray-50"
              placeholder="Confirm Password"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              secureTextEntry
              editable={!isSubmitting}
              placeholderTextColor="#888"
            />
            {errors.confirmPassword && (
              <Text className="text-red-500 mb-2 ml-1 text-xs">
                {errors.confirmPassword.message}
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
          <Text className="text-white font-bold text-base">Sign Up</Text>
        )}
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
