import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Keyboard,
  TouchableWithoutFeedback,
  TextInput,
} from "react-native";
import { Mail } from "lucide-react-native";
import { z } from "zod";
import { Toast } from "toastify-react-native";
import { router } from "expo-router";

const emailSchema = z.string().email("Invalid email address");

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setError(null);
    const result = emailSchema.safeParse(email);
    if (!result.success) {
      setError(result.error.errors[0].message);
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      Toast.success("If this email exists, a reset link has been sent.");
    }, 1200);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View className="flex-1 justify-center p-6 bg-white">
        <View className="items-center mb-8">
          <Text className="text-2xl font-bold">Forgot Password</Text>
          <Text className="text-gray-500 mt-1 text-base text-center">
            Enter your email and we'll send you a reset link.
          </Text>
        </View>
        {submitted ? (
          <View className="items-center my-8">
            <Text className="text-green-600 font-semibold text-center mb-2">
              Check your email for a reset link!
            </Text>
            <TouchableOpacity
              onPress={() => router.replace("/_auth/login")}
              className="mt-4"
            >
              <Text className="text-blue-600 font-bold underline text-base">
                Back to Login
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <View className="flex-row items-center h-12 border border-gray-300 rounded-lg px-4 mb-1 bg-gray-50">
              <Mail size={20} color="#888" style={{ marginRight: 8 }} />
              <TextInput
                className="flex-1"
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                editable={!isSubmitting}
                placeholderTextColor="#888"
              />
            </View>
            {error && (
              <Text className="text-red-500 mb-2 ml-1 text-xs">{error}</Text>
            )}
            <TouchableOpacity
              className={`h-12 rounded-lg flex-row justify-center items-center mb-4 bg-blue-600 shadow ${
                !email || !!error || isSubmitting ? "opacity-50" : ""
              }`}
              onPress={handleSubmit}
              disabled={!email || !!error || isSubmitting}
              activeOpacity={0.8}
            >
              {isSubmitting ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text className="text-white font-bold text-base">
                  Send Reset Link
                </Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => router.replace("/_auth/login")}
              className="self-center"
            >
              <Text className="text-blue-600 font-bold underline text-base">
                Back to Login
              </Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
}
