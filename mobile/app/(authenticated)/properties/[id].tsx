import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { useAuthenticatedApi } from "../../../hooks/useAuthenticatedApi";
import { Toast } from "toastify-react-native";
import { Alert } from "react-native";
import {
  Home,
  Building2,
  Building,
  MapPin,
  Edit3,
  Trash2,
  ArrowLeft,
  Calendar,
} from "lucide-react-native";

const PropertyTypeIcons = {
  HOUSE: <Home size={32} color="#2563eb" />,
  APARTMENT: <Building2 size={32} color="#2563eb" />,
  VILLA: <Building size={32} color="#2563eb" />,
  COMMERCIAL: <Building size={32} color="#2563eb" />,
};

export default function PropertyDetails() {
  const params = useLocalSearchParams();
  const id = params.id as string;
  console.log(id);
  console.log(params);
  const router = useRouter();
  const { api } = useAuthenticatedApi();

  const { data: property, isLoading } = useQuery({
    queryKey: ["property", id],
    queryFn: () => api.properties.get(id as string),
  });

  const handleDelete = () => {
    Alert.alert(
      "Delete Property",
      "Are you sure you want to delete this property? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await api.properties.delete(id as string);
              Toast.success("Property deleted successfully");
              router.replace("/(authenticated)/home");
            } catch (error) {
              Toast.error("Failed to delete property");
            }
          },
        },
      ]
    );
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatCurrency = (value: number | null) => {
    if (value === null) return "Not set";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value);
  };

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#22c55e" />
      </View>
    );
  }

  if (!property) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Property not found</Text>
      </View>
    );
  }

  const IconComponent = PropertyTypeIcons[
    property.type as keyof typeof PropertyTypeIcons
  ] || <Home size={32} color="#2563eb" />;

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="p-6">
        {/* Header Actions */}
        <View className="flex-row items-center justify-between mb-6">
          <TouchableOpacity
            className="p-2 rounded-full bg-gray-100 mr-2"
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color="#222" />
          </TouchableOpacity>
          <Text className="flex-1 text-2xl font-bold text-center">
            Property Details
          </Text>
          <View className="flex-row">
            <TouchableOpacity
              className="p-2 rounded-full bg-gray-100 mr-2"
              onPress={() => router.push(`/properties/${id}/edit`)}
            >
              <Edit3 size={22} color="#222" />
            </TouchableOpacity>
            <TouchableOpacity
              className="p-2 rounded-full bg-red-100"
              onPress={handleDelete}
            >
              <Trash2 size={22} color="#dc2626" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Property Card */}
        <View className="bg-white rounded-2xl shadow border border-gray-100 p-6 mb-6">
          <View className="flex-row items-center mb-4">
            <View className="w-14 h-14 rounded-full bg-gray-100 justify-center items-center mr-4">
              {IconComponent}
            </View>
            <View className="flex-1">
              <Text className="text-xl font-bold mb-1">{property.name}</Text>
              {property.propertyLocation && (
                <View className="flex-row items-center">
                  <MapPin size={16} color="#888" />
                  <Text className="ml-2 text-gray-600">
                    {property.propertyLocation.address}
                  </Text>
                </View>
              )}
            </View>
          </View>

          <View className="border-t border-gray-200 my-4" />

          <View className="mb-2 flex-row items-center">
            <Text className="text-gray-500 w-24">Type:</Text>
            <Text className="capitalize font-semibold">
              {property.type.toLowerCase()}
            </Text>
          </View>
          {property.value && (
            <View className="mb-2 flex-row items-center">
              <Text className="text-gray-500 w-24">Value:</Text>
              <Text className="font-semibold">
                {formatCurrency(property.value)}
              </Text>
            </View>
          )}
          {property.notes && (
            <View className="mb-2">
              <Text className="text-gray-500 mb-1">Notes:</Text>
              <View className="bg-gray-50 rounded p-2">
                <Text className="text-gray-700">{property.notes}</Text>
              </View>
            </View>
          )}
          {property.propertyLocation && (
            <View className="mb-2">
              <Text className="text-gray-500 mb-1">Location:</Text>
              <View className="bg-gray-50 rounded p-2">
                <Text className="text-gray-700">
                  {property.propertyLocation.address}
                </Text>
                <Text className="text-gray-700">
                  {property.propertyLocation.city},{" "}
                  {property.propertyLocation.country}{" "}
                  {property.propertyLocation.postalCode}
                </Text>
              </View>
            </View>
          )}
          <View className="mb-2 flex-row items-center">
            <Calendar size={16} color="#888" />
            <Text className="ml-2 text-gray-500">
              Added on {formatDate(property.createdAt)}
            </Text>
          </View>
          <View className="mb-2 flex-row items-center">
            <Calendar size={16} color="#888" />
            <Text className="ml-2 text-gray-500">
              Last updated {formatDate(property.updatedAt)}
            </Text>
          </View>
        </View>

        {/* Statistics Card */}
        <View className="bg-white rounded-2xl shadow border border-gray-100 p-6 mb-6">
          <Text className="text-lg font-bold mb-2">Statistics</Text>
          <Text className="text-gray-500">Coming soon...</Text>
        </View>

        {/* Documents Card */}
        <View className="bg-white rounded-2xl shadow border border-gray-100 p-6 mb-6">
          <Text className="text-lg font-bold mb-2">Documents</Text>
          <Text className="text-gray-500">Coming soon...</Text>
        </View>
      </View>
    </ScrollView>
  );
}
