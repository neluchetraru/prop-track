import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";

interface Alert {
  id: string;
  type: "lease" | "payment" | "task" | "document";
  title: string;
  description: string;
  dueDate: Date;
  propertyId: string;
}

interface AlertsPanelProps {
  alerts: Alert[];
  onAlertPress: (alert: Alert) => void;
}

export function AlertsPanel({ alerts, onAlertPress }: AlertsPanelProps) {
  const getAlertIcon = (type: Alert["type"]) => {
    switch (type) {
      case "lease":
        return <Feather name="file-text" size={16} color="#2563eb" />;
      case "payment":
        return <Feather name="calendar" size={16} color="#2563eb" />;
      case "task":
        return (
          <MaterialCommunityIcons
            name="alert-circle-outline"
            size={16}
            color="#f59e42"
          />
        );
      case "document":
        return <Feather name="file-text" size={16} color="#2563eb" />;
      default:
        return <Feather name="bell" size={16} color="#2563eb" />;
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  return (
    <View className="border border-gray-200 rounded-2xl bg-white p-4 mb-4">
      <View className="flex-row items-center mb-4 gap-2">
        <Feather name="bell" size={20} color="#2563eb" />
        <Text className="font-bold text-lg">Alerts & Reminders</Text>
      </View>
      <View>
        {alerts.map((alert) => (
          <TouchableOpacity
            key={alert.id}
            className="border border-gray-100 rounded-xl mb-3 bg-gray-50 active:scale-95"
            onPress={() => onAlertPress(alert)}
            activeOpacity={0.9}
          >
            <View className="flex-row items-center p-4 gap-3">
              <View className="w-8 h-8 rounded-full bg-blue-50 justify-center items-center mr-2">
                {getAlertIcon(alert.type)}
              </View>
              <View className="flex-1 gap-0.5">
                <Text className="font-bold text-base mb-0.5">
                  {alert.title}
                </Text>
                <Text className="text-gray-600 text-sm mb-0.5">
                  {alert.description}
                </Text>
              </View>
              <Text className="text-gray-400 text-xs ml-2">
                {formatDate(alert.dueDate)}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
