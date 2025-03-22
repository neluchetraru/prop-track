import React, { useState } from "react";
import { YStack, Input, Button, Text, XStack } from "tamagui";
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
          error instanceof Error ? error.message : "Could not create account",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <YStack f={1} jc="center" p="$4" space="$4" bg="$background">
      <YStack ai="center" mb="$8">
        <Text fontSize="$8" fontWeight="bold">
          Create Account
        </Text>
      </YStack>

      <Input
        size="$4"
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <Input
        size="$4"
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <Input
        size="$4"
        placeholder="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />

      <Button
        size="$4"
        theme="active"
        onPress={handleRegister}
        disabled={
          isLoading ||
          !email ||
          !password ||
          !confirmPassword ||
          password !== confirmPassword
        }
      >
        {isLoading ? "Creating Account..." : "Sign Up"}
      </Button>

      <XStack jc="center" mt="$4">
        <Text color="$gray10">Already have an account? </Text>
        <Link href="/login" asChild>
          <Text color="$blue10" fontWeight="600">
            Sign In
          </Text>
        </Link>
      </XStack>
      <Toast />
    </YStack>
  );
}
