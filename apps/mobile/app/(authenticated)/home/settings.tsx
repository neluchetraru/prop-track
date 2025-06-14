import { Drawer } from "expo-router/drawer";
import React from "react";
import { View, Text } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function SettingsScreen() {
  return (
    <View className="flex-1 justify-center items-center bg-white">
      <Text className="text-2xl font-bold">Settings</Text>
      <Text className="text-gray-500 mt-2">Settings screen coming soon.</Text>
    </View>
  );
}
