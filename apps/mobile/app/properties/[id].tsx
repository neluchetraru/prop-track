import React from "react";
import {
  YStack,
  XStack,
  Text,
  Button,
  Card,
  ScrollView,
  Paragraph,
  Spinner,
  H4,
  Separator,
} from "tamagui";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { useAuthenticatedApi } from "@/hooks/useAuthenticatedApi";
import {
  Home,
  Building2,
  MapPin,
  Calendar,
  ArrowLeft,
  Edit3,
  Trash2,
  Building,
} from "@tamagui/lucide-icons";
import { Alert } from "react-native";
import Toast from "react-native-toast-message";

const PropertyTypeIcons = {
  HOUSE: Home,
  APARTMENT: Building2,
  VILLA: Building,
  COMMERCIAL: Building,
} as const;

export default function PropertyDetails() {
  const { id } = useLocalSearchParams();
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
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await api.properties.delete(id as string);
              Toast.show({
                type: "success",
                text1: "Property deleted successfully",
              });
              router.replace("/");
            } catch (error) {
              Toast.show({
                type: "error",
                text1: "Failed to delete property",
                text2: error instanceof Error ? error.message : "Unknown error",
              });
            }
          },
        },
      ]
    );
  };

  if (isLoading || !property) {
    return (
      <YStack f={1} ai="center" jc="center">
        <Spinner size="large" color="$green10" />
      </YStack>
    );
  }

  const Icon =
    PropertyTypeIcons[property.type as keyof typeof PropertyTypeIcons] || Home;

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

  return (
    <ScrollView>
      <YStack f={1} gap="$4">
        <XStack p="$4" ai="center" gap="$3">
          <Button
            size="$3"
            circular
            icon={ArrowLeft}
            onPress={() => router.back()}
          />
          <Text fos="$7" fow="bold" f={1}>
            Property Details
          </Text>
          <XStack gap="$2">
            <Button
              size="$3"
              circular
              icon={Edit3}
              onPress={() => router.push(`/properties/${id}/edit`)}
            />
            <Button
              size="$3"
              circular
              icon={Trash2}
              onPress={handleDelete}
              theme="error"
            />
          </XStack>
        </XStack>

        <Separator />

        <YStack px="$4" gap="$4">
          <Card p="$4">
            <YStack gap="$4">
              <XStack gap="$4" ai="center">
                <YStack w="$7" h="$7" ai="center" jc="center" br="$4">
                  <Icon size={32} />
                </YStack>
                <YStack f={1}>
                  <H4 fos="$6">{property.name}</H4>
                  {property.propertyLocation && (
                    <XStack ai="center" gap="$2" mt="$2">
                      <MapPin size={16} />
                      <Paragraph size="$3">
                        {property.propertyLocation.address}
                      </Paragraph>
                    </XStack>
                  )}
                </YStack>
              </XStack>

              <Separator />

              <YStack gap="$4">
                <XStack ai="center" gap="$2">
                  <Text fos="$3">Type:</Text>
                  <Card bordered br="$4">
                    <Text p="$2" fow="500" transform="capitalize">
                      {property.type.toLowerCase()}
                    </Text>
                  </Card>
                </XStack>

                {property.value && (
                  <XStack ai="center" gap="$2">
                    <Text fos="$3">Value:</Text>
                    <Card bordered br="$4">
                      <Text p="$2" fow="500">
                        {formatCurrency(property.value)}
                      </Text>
                    </Card>
                  </XStack>
                )}

                {property.notes && (
                  <YStack gap="$2">
                    <Text fos="$3">Notes:</Text>
                    <Card bordered br="$4" p="$2">
                      <Paragraph size="$3">{property.notes}</Paragraph>
                    </Card>
                  </YStack>
                )}

                {property.propertyLocation && (
                  <YStack gap="$2">
                    <Text fos="$3">Location:</Text>
                    <Card bordered br="$4" p="$2">
                      <Paragraph size="$3">
                        {property.propertyLocation.address}
                      </Paragraph>
                      <Paragraph size="$3">
                        {property.propertyLocation.city},{" "}
                        {property.propertyLocation.country}{" "}
                        {property.propertyLocation.postalCode}
                      </Paragraph>
                    </Card>
                  </YStack>
                )}

                <XStack ai="center" gap="$2">
                  <Calendar size={16} />
                  <Text fos="$3">
                    Added on {formatDate(property.createdAt)}
                  </Text>
                </XStack>

                <XStack ai="center" gap="$2">
                  <Calendar size={16} />
                  <Text fos="$3">
                    Last updated {formatDate(property.updatedAt)}
                  </Text>
                </XStack>
              </YStack>
            </YStack>
          </Card>

          <Card elevate bordered p="$4" theme="accent">
            <YStack gap="$2">
              <H4 fos="$5">Statistics</H4>
              <Paragraph fos="$3">Coming soon...</Paragraph>
            </YStack>
          </Card>

          <Card elevate bordered p="$4" theme="accent">
            <YStack gap="$2">
              <H4 fos="$5">Documents</H4>
              <Paragraph fos="$3">Coming soon...</Paragraph>
            </YStack>
          </Card>
        </YStack>
      </YStack>
      <Toast />
    </ScrollView>
  );
}
