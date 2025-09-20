import { Drawer } from "expo-router/drawer";
import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Switch,
  Image,
  ActivityIndicator,
} from "react-native";
import {
  User,
  Home,
  List,
  Settings,
  Moon,
  LogOut,
  Sun,
} from "lucide-react-native";
import { useRouter, usePathname } from "expo-router";
import { authClient } from "../../lib/auth-client";
import { useColorScheme } from "../../hooks/useColorScheme";
import type { DrawerContentComponentProps } from "@react-navigation/drawer";

const drawerItems = [
  {
    label: "Home",
    icon: Home,
    route: "home",
  },
  {
    label: "Properties",
    icon: List,
    route: "home/properties",
  },
  {
    label: "Profile",
    icon: User,
    route: "home/profile",
  },
  {
    label: "Settings",
    icon: Settings,
    route: "home/settings",
  },
] as {
  label: string;
  icon: React.ElementType;
  route: string;
}[];

function CustomDrawerContent({ navigation }: DrawerContentComponentProps) {
  const { data: session } = authClient.useSession();
  const { isDarkColorScheme, toggleColorScheme } = useColorScheme();
  const user = session?.user;
  const pathname = usePathname();

  // Helper to check if route is active
  const isActive = (route: string) => pathname?.includes(route);

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
          <View className="w-20 h-20 rounded-full bg-gray-200 dark:bg-gray-800 justify-center items-center mb-2">
            <User size={40} color="#2563eb" />
          </View>
        )}
        <Text className="text-xl font-bold text-blue-700 dark:text-blue-300 mb-1">
          {user?.name || "User"}
        </Text>
        <Text className="text-gray-500 dark:text-gray-300">{user?.email}</Text>
      </View>

      {/* Navigation Links */}
      <View className="gap-2 mb-8">
        {drawerItems.map((item) => (
          <TouchableOpacity
            key={item.route}
            className={`flex-row items-center gap-3 px-4 h-12 rounded-lg mb-2 ${isActive(item.route)
              ? "bg-blue-100 dark:bg-blue-900"
              : "bg-gray-100 dark:bg-gray-800"
              }`}
            onPress={() => {
              navigation.navigate(item.route);
            }}
            activeOpacity={0.85}
          >
            <item.icon
              size={20}
              color={
                isActive(item.route)
                  ? isDarkColorScheme
                    ? "#93c5fd"
                    : "#2563eb"
                  : isDarkColorScheme
                    ? "#93c5fd"
                    : "#2563eb"
              }
            />
            <Text
              className={`font-semibold text-base ${isActive(item.route)
                ? "text-blue-700 dark:text-blue-300"
                : "text-blue-700 dark:text-blue-300"
                }`}
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Theme Toggle */}
      <View className="flex-row items-center justify-between px-4 mb-8 bg-gray-100 dark:bg-gray-800 rounded-lg">
        <View className="flex-row items-center gap-2">
          {isDarkColorScheme ? (
            <Moon size={20} color="#2563eb" />
          ) : (
            <Sun size={20} color="#2563eb" />
          )}
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

      {/* Separator */}
      <View className="border-t border-gray-200 dark:border-gray-700 my-4" />

      {/* Sign Out */}
      <TouchableOpacity
        className="flex-row items-center gap-3 px-4 h-12 rounded-lg bg-red-100 dark:bg-red-800"
        onPress={async () => {
          await authClient.signOut();
        }}
        activeOpacity={0.85}
      >
        <LogOut size={20} color={isDarkColorScheme ? "#fca5a5" : "#dc2626"} />
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

  console.log(user);

  if (isPending || !user) {
    return (
      <View className="flex-1 justify-center items-center bg-white dark:bg-gray-900">
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
      <Drawer.Screen
        name="home/profile"
        options={{
          drawerLabel: "Profile",
          headerShown: false,
        }}
      />
      <Drawer.Screen
        name="home/settings"
        options={{
          drawerLabel: "Settings",
          headerShown: false,
        }}
      />
    </Drawer>
  );
}
