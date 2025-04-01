import React, { useState } from "react";
import { YStack, Input, Button, Text, XStack } from "tamagui";
import { Image } from "react-native";
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
      router.replace("/");
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
    <YStack f={1} jc="center" p="$4" space="$4" bg="$background">
      <YStack ai="center" mb="$8">
        <Text fos="$8">Welcome Back</Text>
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

      <Button
        size="$4"
        onPress={handleLogin}
        disabled={isLoading || !email || !password}
      >
        {isLoading ? "Signing in..." : "Sign In"}
      </Button>

      <Button
        size="$4"
        variant="outlined"
        onPress={handleGoogleLogin}
        disabled={isLoading}
        icon={
          <Image
            source={require("@/assets/images/google-logo.png")}
            style={{ width: 20, height: 20, marginRight: 10 }}
          />
        }
      >
        Sign in with Google
      </Button>

      <XStack jc="center" mt="$4">
        <Text>Don't have an account? </Text>
        <Link href="/register" asChild>
          <Text>Sign Up</Text>
        </Link>
      </XStack>
      <Toast />
    </YStack>
  );
}
