import React from "react";
import { View, Text } from "react-native";

export default function ProfileScreen() {
  return (
    <View className="flex-1 justify-center items-center bg-white">
      <Text className="text-2xl font-bold">Profile</Text>
      <Text className="text-gray-500 mt-2">
        User profile and settings coming soon.
      </Text>
    </View>
  );
}
