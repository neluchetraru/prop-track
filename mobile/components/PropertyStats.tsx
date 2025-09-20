import React from "react";
import { View, Text } from "react-native";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import type { Property } from "../api/properties";

interface PropertyStatsProps {
  properties: Property[];
}

export function PropertyStats({ properties }: PropertyStatsProps) {
  const totalProperties = properties.length;
  const totalValue = properties.reduce((sum, p) => sum + (p.value || 0), 0);

  // The following fields may not exist on your Property type. Adjust as needed.
  // const upcomingPayments = properties.filter((p) => {
  //   const nextPayment = new Date((p as any).nextPaymentDate || "");
  //   return (
  //     nextPayment > new Date() &&
  //     nextPayment < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
  //   );
  // }).length;
  // const pendingTasks = properties.filter(
  //   (p) => (p as any).pendingTasks?.length > 0
  // ).length;

  const stats = [
    {
      label: "Total Properties",
      value: totalProperties,
      icon: <Feather name="home" size={28} color="#2563eb" />,
      bg: "bg-blue-50",
      color: "text-blue-700",
      format: (v: number) => v.toString(),
    },
    {
      label: "Total Value",
      value: totalValue,
      icon: <Feather name="dollar-sign" size={28} color="#22c55e" />,
      bg: "bg-green-50",
      color: "text-green-700",
      format: (v: number) => `$${(v / 1000000).toFixed(1)}M`,
    },
    // Uncomment and adjust if your Property type supports these fields
    // {
    //   label: "Upcoming Payments",
    //   value: upcomingPayments,
    //   icon: <Feather name="calendar" size={28} color="#f59e42" />,
    //   bg: "bg-yellow-50",
    //   color: "text-yellow-700",
    //   format: (v: number) => v.toString(),
    // },
    // {
    //   label: "Pending Tasks",
    //   value: pendingTasks,
    //   icon: <MaterialCommunityIcons name="clipboard-check-outline" size={28} color="#6366f1" />,
    //   bg: "bg-indigo-50",
    //   color: "text-indigo-700",
    //   format: (v: number) => v.toString(),
    // },
  ];

  return (
    <View className="flex-row flex-wrap justify-between gap-4 mb-4">
      {stats.map((stat, index) => (
        <View
          key={index}
          className={`w-[48%] rounded-2xl shadow-md border border-gray-100 p-5 mb-2 ${stat.bg}`}
        >
          <View className="flex-row items-center gap-4 mb-2">
            <View className="w-12 h-12 rounded-full justify-center items-center bg-white shadow-sm">
              {stat.icon}
            </View>
            <View>
              <Text className={`font-bold text-base mb-1 ${stat.color}`}>
                {stat.label}
              </Text>
              <Text className="text-2xl font-extrabold text-gray-900">
                {stat.format(stat.value)}
              </Text>
            </View>
          </View>
        </View>
      ))}
    </View>
  );
}
