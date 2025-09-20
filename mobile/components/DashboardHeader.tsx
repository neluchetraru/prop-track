import { authClient } from "../lib/auth-client";
import { useRouter } from "expo-router";
import React from "react";
import { View, Text, TouchableOpacity, Modal, Image } from "react-native";
import { Feather } from "@expo/vector-icons";

export function DashboardHeader() {
  const router = useRouter();
  const [showProfileMenu, setShowProfileMenu] = React.useState(false);

  const handleSignOut = async () => {
    await authClient.signOut();
    router.replace("/_auth/login");
  };

  return (
    <View className="flex-row items-center justify-between p-4 bg-white">
      <View className="flex-row items-center gap-2">
        <View className="flex-row items-center gap-1">
          <Feather name="home" size={24} color="#2563eb" />
          <Text className="text-2xl font-bold ml-3 text-blue-700">
            PropTrack
          </Text>
        </View>
      </View>

      <View className="flex-row items-center gap-2">
        <TouchableOpacity
          className="w-10 h-10 rounded-full bg-gray-100 justify-center items-center mr-2"
          onPress={() => {
            /* TODO: Implement notifications */
          }}
          activeOpacity={0.8}
        >
          <Feather name="bell" size={22} color="#2563eb" />
        </TouchableOpacity>

        <TouchableOpacity
          className="w-10 h-10 rounded-full bg-gray-100 justify-center items-center"
          onPress={() => setShowProfileMenu(true)}
          activeOpacity={0.8}
        >
          <Feather name="user" size={22} color="#2563eb" />
        </TouchableOpacity>
      </View>

      <Modal
        visible={showProfileMenu}
        animationType="slide"
        transparent
        onRequestClose={() => setShowProfileMenu(false)}
      >
        <View className="flex-1 justify-end items-center bg-black/40">
          <View className="w-full max-w-xl bg-white rounded-t-2xl p-6">
            <View className="flex-row items-center gap-3 mb-4">
              <View className="w-12 h-12 rounded-full bg-gray-200 justify-center items-center">
                {/* Placeholder avatar, replace with Image if available */}
                <Feather name="user" size={28} color="#2563eb" />
              </View>
              <View>
                <Text className="font-bold text-lg">John Doe</Text>
                <Text className="text-gray-500">john@example.com</Text>
              </View>
            </View>
            <View className="gap-2">
              <TouchableOpacity
                className="flex-row items-center gap-2 px-4 h-12 rounded-lg bg-gray-100 mb-2"
                onPress={() => {
                  setShowProfileMenu(false);
                  router.push("/settings" as any);
                }}
                activeOpacity={0.8}
              >
                <Feather name="settings" size={20} color="#2563eb" />
                <Text className="font-semibold text-base text-blue-700">
                  Settings
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="flex-row items-center gap-2 px-4 h-12 rounded-lg bg-gray-100 mb-2"
                onPress={() => {
                  setShowProfileMenu(false);
                  router.push("/account" as any);
                }}
                activeOpacity={0.8}
              >
                <Feather name="user" size={20} color="#2563eb" />
                <Text className="font-semibold text-base text-blue-700">
                  Account
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="flex-row items-center gap-2 px-4 h-12 rounded-lg bg-red-100"
                onPress={handleSignOut}
                activeOpacity={0.8}
              >
                <Feather name="log-out" size={20} color="#dc2626" />
                <Text className="font-semibold text-base text-red-700">
                  Sign Out
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
