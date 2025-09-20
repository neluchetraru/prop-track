import React from "react";
import { View, Text, TouchableOpacity, Modal } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export function QuickActions() {
  const router = useRouter();
  const [showActions, setShowActions] = React.useState(false);

  const actions = [
    {
      icon: <Feather name="plus" size={22} color="#2563eb" />,
      label: "Add New Property",
      onPress: () => {
        setShowActions(false);
        router.push("/(app)/properties/new" as any);
      },
    },
    {
      icon: <Feather name="upload" size={22} color="#2563eb" />,
      label: "Upload Document",
      onPress: () => {
        setShowActions(false);
        router.push("/(app)/documents/upload" as any);
      },
    },
    {
      icon: <Feather name="calendar" size={22} color="#2563eb" />,
      label: "Add Task / Reminder",
      onPress: () => {
        setShowActions(false);
        router.push("/(app)/tasks/new" as any);
      },
    },
  ];

  return (
    <>
      {/* Floating Action Button */}
      <TouchableOpacity
        className="w-16 h-16 rounded-full bg-blue-600 justify-center items-center absolute bottom-6 right-6 shadow-lg z-50"
        onPress={() => setShowActions(true)}
        activeOpacity={0.85}
        style={{ elevation: 10 }}
      >
        <Feather name="plus" size={32} color="#fff" />
      </TouchableOpacity>

      {/* Quick Actions Modal */}
      <Modal
        visible={showActions}
        animationType="slide"
        transparent
        onRequestClose={() => setShowActions(false)}
      >
        <View className="flex-1 justify-end items-center bg-black/40">
          <View className="w-full max-w-xl bg-white rounded-t-2xl p-6">
            <Text className="font-bold text-lg mb-4 text-center text-blue-700">
              Quick Actions
            </Text>
            {actions.map((action, index) => (
              <TouchableOpacity
                key={index}
                className="flex-row items-center gap-3 px-4 h-14 rounded-lg bg-gray-100 mb-3"
                onPress={action.onPress}
                activeOpacity={0.85}
              >
                {action.icon}
                <Text className="font-semibold text-base text-gray-800">
                  {action.label}
                </Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              className="mt-2 px-4 h-12 rounded-lg bg-gray-200 justify-center items-center"
              onPress={() => setShowActions(false)}
              activeOpacity={0.8}
            >
              <Text className="font-bold text-gray-700">Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}
