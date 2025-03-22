import { authClient } from "@/lib/auth-client";
import { Ionicons } from "@expo/vector-icons";
import type { Property } from "@prop-track/database";
import { createApi } from "@prop-track/api";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import React from "react";
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { api } from "@/lib/api";

// Create the API instance with auth

export default function Dashboard() {
  const router = useRouter();
  const { data: session } = authClient.useSession();

  const {
    data: properties,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["properties"],
    queryFn: () => api.properties.list(),
    enabled: !!session, // Only run query when session exists
  });

  const PropertyCard = ({ property }: { property: Property }) => (
    <TouchableOpacity
      style={styles.propertyCard}
      // onPress={() => router.push(`/properties/${property.id}`)}
    >
      <View style={styles.propertyHeader}>
        <Text style={styles.propertyName}>{property.name}</Text>
        <Text style={styles.propertyType}>{property.type}</Text>
      </View>
      <Text style={styles.propertyAddress}>{property.address}</Text>
    </TouchableOpacity>
  );

  const EmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="home-outline" size={64} color="#666" />
      <Text style={styles.emptyStateText}>No properties yet</Text>
      <Text style={styles.emptyStateSubtext}>
        Add your first property to get started
      </Text>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => router.push("/properties/new")}
      >
        <Text style={styles.addButtonText}>Add Property</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Properties</Text>
        {properties && properties.length > 0 && (
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => router.push("/properties/new")}
          >
            <Text style={styles.addButtonText}>Add Property</Text>
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={properties}
        renderItem={({ item }) => <PropertyCard property={item} />}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={refetch} />
        }
        ListEmptyComponent={EmptyState}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  listContent: {
    padding: 16,
    flexGrow: 1,
  },
  propertyCard: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  propertyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  propertyName: {
    fontSize: 18,
    fontWeight: "600",
  },
  propertyType: {
    fontSize: 14,
    color: "#666",
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  propertyAddress: {
    fontSize: 14,
    color: "#666",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  emptyStateText: {
    fontSize: 20,
    fontWeight: "600",
    marginTop: 16,
  },
  emptyStateSubtext: {
    fontSize: 16,
    color: "#666",
    marginTop: 8,
    marginBottom: 24,
  },
  addButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
