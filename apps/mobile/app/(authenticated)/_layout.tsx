import { Drawer } from "expo-router/drawer";
import React, { useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Switch,
  Image,
  ActivityIndicator,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { authClient } from "@/lib/auth-client";
import { useColorScheme } from "@/lib/useColorScheme";
import type { DrawerContentComponentProps } from "@react-navigation/drawer";

function CustomDrawerContent({ navigation }: DrawerContentComponentProps) {
  const { data: session } = authClient.useSession();
  const { colorScheme, isDarkColorScheme, toggleColorScheme } =
    useColorScheme();
  const user = session?.user;

  return (
    <View className="flex-1 bg-white dark:bg-gray-900 p-6">
      {/* User Info */}
      <View className="items-center mb-8 mt-4">
        {user?.image ? (
          <Image
            source={{ uri: user.image }}
            className="w-20 h-20 rounded-full mb-2"
            resizeMode="cover"
          />
        ) : (
          <View className="w-20 h-20 rounded-full bg-gray-200 justify-center items-center mb-2">
            <Feather name="user" size={40} color="#2563eb" />
          </View>
        )}
        <Text className="text-xl font-bold text-blue-700 dark:text-blue-300 mb-1">
          {user?.name || "User"}
        </Text>
        <Text className="text-gray-500 dark:text-gray-300">{user?.email}</Text>
      </View>

      {/* Navigation Links */}
      <View className="gap-2 mb-8">
        <TouchableOpacity
          className="flex-row items-center gap-3 px-4 h-12 rounded-lg bg-gray-100 dark:bg-gray-800 mb-2"
          onPress={() => {
            navigation.navigate("home");
          }}
          activeOpacity={0.85}
        >
          <Feather name="home" size={20} color="#2563eb" />
          <Text className="font-semibold text-base text-blue-700 dark:text-blue-300">
            Home
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="flex-row items-center gap-3 px-4 h-12 rounded-lg bg-gray-100 dark:bg-gray-800 mb-2"
          onPress={() => {
            navigation.navigate("properties/new");
          }}
          activeOpacity={0.85}
        >
          <Feather name="list" size={20} color="#2563eb" />
          <Text className="font-semibold text-base text-blue-700 dark:text-blue-300">
            Properties
          </Text>
        </TouchableOpacity>
      </View>

      {/* Theme Toggle */}
      <View className="flex-row items-center justify-between px-4 mb-8">
        <View className="flex-row items-center gap-2">
          <Feather
            name={isDarkColorScheme ? "moon" : "sun"}
            size={20}
            color="#2563eb"
          />
          <Text className="font-semibold text-base text-blue-700 dark:text-blue-300">
            {isDarkColorScheme ? "Dark" : "Light"} Mode
          </Text>
        </View>
        <Switch
          value={isDarkColorScheme}
          onValueChange={toggleColorScheme}
          thumbColor={isDarkColorScheme ? "#2563eb" : "#f4f3f4"}
          trackColor={{ false: "#d1d5db", true: "#2563eb" }}
        />
      </View>

      {/* Sign Out */}
      <TouchableOpacity
        className="flex-row items-center gap-3 px-4 h-12 rounded-lg bg-red-100 dark:bg-red-800"
        onPress={async () => {
          await authClient.signOut();
          // No need to redirect here, the layout guard will handle it
        }}
        activeOpacity={0.85}
      >
        <Feather name="log-out" size={20} color="#dc2626" />
        <Text className="font-semibold text-base text-red-700 dark:text-red-300">
          Sign Out
        </Text>
      </TouchableOpacity>
    </View>
  );
}

export default function AuthenticatedLayout() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  React.useEffect(() => {
    if (!isPending && !user) {
      router.replace("/_auth/login");
    }
  }, [isPending, user, router]);

  if (isPending || !user) {
    // Optionally show a loading spinner here
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  return (
    <Drawer drawerContent={CustomDrawerContent}>
      <Drawer.Screen
        name="home"
        options={{
          drawerLabel: "Home",
          headerShown: false,
        }}
      />
      <Drawer.Screen
        name="home/properties"
        options={{
          drawerLabel: "Properties",
          headerShown: false,
        }}
      />
    </Drawer>
  );
}
