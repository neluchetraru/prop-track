import { authClient } from "@/lib/auth-client";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { useAuthenticatedApi } from "@/hooks/useAuthenticatedApi";
import { Feather } from "@expo/vector-icons";

export default function Dashboard() {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const { api } = useAuthenticatedApi();
  const {
    data: properties,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["properties"],
    queryFn: () => api.properties.list(),
    enabled: !!session,
  });

  const EmptyState = () => (
    <View className="flex-1 justify-center items-center py-16">
      <View className="w-24 h-24 rounded-full bg-gray-100 justify-center items-center mb-4">
        <Feather name="home" size={48} color="#2563eb" />
      </View>
      <Text className="text-xl font-bold text-center mb-2">
        No properties yet
      </Text>
      <Text className="text-gray-500 text-center mb-4">
        Add your first property to get started
      </Text>
      <TouchableOpacity
        className="h-12 px-6 bg-blue-600 rounded-lg flex-row justify-center items-center"
        onPress={() => router.push("/(authenticated)/properties/new")}
        activeOpacity={0.8}
      >
        <Feather name="plus" size={20} color="#fff" />
        <Text className="text-white font-bold text-base ml-2">
          Add Property
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View className="flex-1 bg-white">
      {/* DashboardHeader can be refactored separately if needed */}
      {/* <DashboardHeader /> */}
      <ScrollView
        className="flex-1 p-4"
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={refetch}
            tintColor="#2563eb"
          />
        }
      >
        {isLoading ? (
          <View className="flex-1 justify-center items-center py-16">
            <ActivityIndicator size="large" color="#2563eb" />
          </View>
        ) : (
          <View>
            {/* PropertyStats can be refactored separately if needed */}
            {/* <PropertyStats properties={properties || []} /> */}
            {properties && properties.length > 0 ? (
              <View>
                <View className="flex-row items-center justify-between mb-4">
                  <Text className="text-lg font-bold">My Properties</Text>
                  <TouchableOpacity
                    className="h-10 px-4 bg-blue-600 rounded-lg flex-row justify-center items-center"
                    onPress={() =>
                      router.push("/(authenticated)/properties/new")
                    }
                    activeOpacity={0.8}
                  >
                    <Feather name="plus" size={18} color="#fff" />
                    <Text className="text-white font-bold text-base ml-2">
                      Add
                    </Text>
                  </TouchableOpacity>
                </View>
                {properties.map((property) => (
                  <View
                    key={property.id}
                    className="bg-white rounded-xl shadow border border-gray-100 p-4 mb-4"
                  >
                    <Text className="text-lg font-semibold mb-1">
                      {property.name}
                    </Text>
                    <Text className="text-gray-500 mb-1 capitalize">
                      {property.type.toLowerCase()}
                    </Text>
                    {property.propertyLocation && (
                      <Text className="text-gray-400 mb-1">
                        {property.propertyLocation.address}
                      </Text>
                    )}
                    <TouchableOpacity
                      className="mt-2 self-end"
                      onPress={() =>
                        router.push(
                          `/(authenticated)/properties/${
                            property.id as string
                          } as string`
                        )
                      }
                    >
                      <Text className="text-blue-600 font-bold">
                        View Details
                      </Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            ) : (
              <EmptyState />
            )}
          </View>
        )}
      </ScrollView>
      {/* <QuickActions /> */}
    </View>
  );
}
