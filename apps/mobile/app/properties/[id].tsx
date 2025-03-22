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
} from "@tamagui/lucide-icons";
import { Alert } from "react-native";
import Toast from "react-native-toast-message";

const PropertyTypeIcons = {
  HOUSE: Home,
  APARTMENT: Building2,
  CONDO: Building2,
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
        <Spinner size="large" color="$blue10" />
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

  return (
    <ScrollView>
      <YStack f={1} space="$4">
        <XStack p="$4" ai="center" space="$3">
          <Button
            size="$3"
            circular
            icon={ArrowLeft}
            onPress={() => router.back()}
            // theme="gray"
          />
          <Text fontSize="$6" fontWeight="bold" f={1}>
            Property Details
          </Text>
          <XStack space="$2">
            <Button
              size="$3"
              circular
              icon={Edit3}
              onPress={() => router.push(`/properties/${id}/edit`)}
              theme="blue"
            />
            <Button
              size="$3"
              circular
              icon={Trash2}
              onPress={handleDelete}
              theme="red"
            />
          </XStack>
        </XStack>

        <Separator />

        <YStack px="$4" space="$4">
          <Card elevate bordered p="$4">
            <YStack space="$4">
              <XStack space="$4" ai="center">
                <YStack
                  w="$6"
                  h="$6"
                  ai="center"
                  jc="center"
                  br="$4"
                  bg="$blue2"
                >
                  <Icon size={32} color="$blue10" />
                </YStack>
                <YStack f={1}>
                  <H4 color="$gray12">{property.name}</H4>
                  <XStack ai="center" space="$2" mt="$2">
                    <MapPin size={16} color="$gray10" />
                    <Paragraph size="$3" color="$gray11">
                      {property.address}
                    </Paragraph>
                  </XStack>
                </YStack>
              </XStack>

              <Separator />

              <YStack space="$4">
                <XStack ai="center" space="$2">
                  <Text color="$gray11" fontSize="$3">
                    Type:
                  </Text>
                  <Card bordered br="$4" bg="$blue2" borderColor="transparent">
                    <Text
                      p="$2"
                      color="$blue10"
                      fontWeight="500"
                      textTransform="capitalize"
                    >
                      {property.type.toLowerCase()}
                    </Text>
                  </Card>
                </XStack>

                <XStack ai="center" space="$2">
                  <Calendar size={16} color="$gray10" />
                  <Text color="$gray11" fontSize="$3">
                    Added on {formatDate(property.createdAt)}
                  </Text>
                </XStack>

                <XStack ai="center" space="$2">
                  <Calendar size={16} color="$gray10" />
                  <Text color="$gray11" fontSize="$3">
                    Last updated {formatDate(property.updatedAt)}
                  </Text>
                </XStack>
              </YStack>
            </YStack>
          </Card>

          {/* Additional sections can be added here */}
          <Card elevate bordered p="$4">
            <YStack space="$2">
              <H4 color="$gray12">Statistics</H4>
              <Paragraph color="$gray11">Coming soon...</Paragraph>
            </YStack>
          </Card>

          <Card elevate bordered p="$4">
            <YStack space="$2">
              <H4 color="$gray12">Documents</H4>
              <Paragraph color="$gray11">Coming soon...</Paragraph>
            </YStack>
          </Card>
        </YStack>
      </YStack>
      <Toast />
    </ScrollView>
  );
}
