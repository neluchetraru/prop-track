import type { Property } from "@prop-track/database";
import { useRouter } from "expo-router";
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";

const PropertyTypeIcons = {
  HOUSE: <Feather name="home" size={24} color="#2563eb" />,
  APARTMENT: (
    <MaterialCommunityIcons name="office-building" size={24} color="#2563eb" />
  ),
  CONDO: (
    <MaterialCommunityIcons name="office-building" size={24} color="#2563eb" />
  ),
};

interface PropertyCardProps {
  property: Property;
}

export function PropertyCard({ property }: PropertyCardProps) {
  const router = useRouter();
  const Icon = PropertyTypeIcons[
    property.type as keyof typeof PropertyTypeIcons
  ] || <Feather name="home" size={24} color="#2563eb" />;

  return (
    <TouchableOpacity
      className="bg-white border border-gray-200 rounded-2xl mb-4 shadow-sm"
      activeOpacity={0.95}
      onPress={() => router.push(`/properties/${property.id}`)}
    >
      <View className="p-4">
        <View className="flex-row items-center mb-3 gap-4">
          <View className="w-12 h-12 rounded-full bg-blue-50 justify-center items-center mr-2">
            {Icon}
          </View>
          <View className="flex-1 gap-0.5">
            <Text className="font-bold text-lg mb-0.5">{property.name}</Text>
            <View className="flex-row items-center gap-2 mb-0.5">
              <Feather name="map-pin" size={14} color="#64748b" />
              <Text className="text-gray-500 text-xs">{property.address}</Text>
            </View>
          </View>
          <View className="px-2 py-1 border border-gray-200 rounded-lg bg-gray-50">
            <Text className="capitalize text-xs text-gray-700">
              {property.type.toLowerCase()}
            </Text>
          </View>
        </View>

        <View className="flex-row justify-between mb-3">
          <View className="flex-row items-center gap-2">
            <Feather name="dollar-sign" size={16} color="#22c55e" />
            <Text className="text-gray-700 text-sm">
              {property.value?.toLocaleString()}
            </Text>
          </View>
          <View className="flex-row items-center gap-2">
            <Feather name="users" size={16} color="#2563eb" />
            <Text className="text-gray-700 text-sm">
              {property.occupancyStatus}
            </Text>
          </View>
        </View>

        <View className="flex-row justify-end gap-2 mt-2">
          <TouchableOpacity
            className="w-10 h-10 rounded-full bg-gray-100 justify-center items-center"
            onPress={() => router.push(`/properties/${property.id}`)}
            activeOpacity={0.8}
          >
            <Feather name="eye" size={18} color="#2563eb" />
          </TouchableOpacity>
          <TouchableOpacity
            className="w-10 h-10 rounded-full bg-gray-100 justify-center items-center"
            onPress={() => router.push(`/properties/${property.id}/edit`)}
            activeOpacity={0.8}
          >
            <Feather name="edit-3" size={18} color="#2563eb" />
          </TouchableOpacity>
          <TouchableOpacity
            className="w-10 h-10 rounded-full bg-gray-100 justify-center items-center"
            onPress={() => router.push(`/properties/${property.id}/documents`)}
            activeOpacity={0.8}
          >
            <Feather name="file-text" size={18} color="#2563eb" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}
