import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import { authClient } from "@/lib/auth-client";
import Toast from "react-native-toast-message";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

function useProtectedRoute() {
  const segments = useSegments();
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    const inAuthGroup = segments[0] === "(auth)";

    if (isPending) return;

    if (!session && !inAuthGroup) {
      // Redirect to login if not authenticated
      router.replace("/login");
    } else if (session && inAuthGroup) {
      // Redirect to home if authenticated
      router.replace("/");
    }
  }, [session, isPending, segments]);
}

export default function RootLayout() {
  useProtectedRoute();
  const { isPending } = authClient.useSession();
  console.log("isPending", authClient.getSession());

  if (isPending) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Stack>
        <Stack.Screen name="(auth)/login" options={{ headerShown: false }} />
        <Stack.Screen name="index" options={{ title: "Home" }} />
      </Stack>
      <Toast />
    </QueryClientProvider>
  );
}
