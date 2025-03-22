import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Toast from "react-native-toast-message";
import { authClient } from "@/lib/auth-client";
import { useAuthenticatedApi } from "@/hooks/useAuthenticatedApi";

export default function NewProperty() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [type, setType] = useState("HOUSE");
  const { data: session } = authClient.useSession();
  const { api, withAuth } = useAuthenticatedApi();

  const createProperty = useMutation({
    mutationFn: () =>
      api.properties.create({
        name,
        address,
        type,
        userId: session?.user?.id ?? "",
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["properties"] });
      Toast.show({
        type: "success",
        text1: "Property created successfully",
      });
      router.back();
    },
    onError: (error: Error) => {
      Toast.show({
        type: "error",
        text1: "Failed to create property",
        text2: error.message,
      });
    },
  });

  const handleSubmit = () => {
    if (!session?.user?.id) {
      Toast.show({
        type: "error",
        text1: "You must be logged in",
      });
      return;
    }

    if (!name || !address || !type) {
      Toast.show({
        type: "error",
        text1: "All fields are required",
      });
      return;
    }

    createProperty.mutate();
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.label}>Property Name</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Enter property name"
        />

        <Text style={styles.label}>Address</Text>
        <TextInput
          style={styles.input}
          value={address}
          onChangeText={setAddress}
          placeholder="Enter property address"
          multiline
        />

        <Text style={styles.label}>Type</Text>
        <View style={styles.typeContainer}>
          {["HOUSE", "APARTMENT", "CONDO"].map((propertyType) => (
            <TouchableOpacity
              key={propertyType}
              style={[
                styles.typeButton,
                type === propertyType && styles.typeButtonActive,
              ]}
              onPress={() => setType(propertyType)}
            >
              <Text
                style={[
                  styles.typeButtonText,
                  type === propertyType && styles.typeButtonTextActive,
                ]}
              >
                {propertyType}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSubmit}
          disabled={createProperty.isPending}
        >
          <Text style={styles.submitButtonText}>
            {createProperty.isPending ? "Creating..." : "Create Property"}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  form: {
    padding: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  typeContainer: {
    flexDirection: "row",
    marginBottom: 24,
  },
  typeButton: {
    flex: 1,
    padding: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    marginRight: 8,
    borderRadius: 8,
    alignItems: "center",
  },
  typeButtonActive: {
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
  },
  typeButtonText: {
    color: "#666",
  },
  typeButtonTextActive: {
    color: "#fff",
  },
  submitButton: {
    backgroundColor: "#007AFF",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
