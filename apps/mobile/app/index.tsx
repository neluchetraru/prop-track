import { authClient } from "@/lib/auth-client";
import type { Property } from "@prop-track/database";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
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
} from "tamagui";
import { Home, Plus, Building2, MapPin } from "@tamagui/lucide-icons";
import { RefreshControl } from "react-native";
import { useAuthenticatedApi } from "@/hooks/useAuthenticatedApi";

const PropertyTypeIcons = {
  HOUSE: Home,
  APARTMENT: Building2,
  CONDO: Building2,
} as const;

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

  console.log(properties);

  const PropertyCard = ({ property }: { property: Property }) => {
    const Icon =
      PropertyTypeIcons[property.type as keyof typeof PropertyTypeIcons] ||
      Home;

    return (
      <Card
        elevate
        bordered
        // animation="lazy"
        enterStyle={{ scale: 0.95, y: 10, opacity: 0 }}
        pressStyle={{ scale: 0.97 }}
        onPress={() => router.push(`/properties/${property.id}`)}
        mb="$4"
      >
        <Card.Header padded>
          <XStack space="$4" ai="center">
            <YStack w="$5" h="$5" ai="center" jc="center" br="$4" bg="$blue2">
              <Icon size={24} color="$blue10" />
            </YStack>
            <YStack f={1} space="$1">
              <Text fontSize="$5" fontWeight="bold" color="$gray12">
                {property.name}
              </Text>
              <XStack ai="center" space="$2">
                <MapPin size={14} color="$gray10" />
                <Paragraph size="$2" color="$gray11">
                  {property.address}
                </Paragraph>
              </XStack>
            </YStack>
            <Card
              size="$2"
              bordered
              br="$4"
              bg="$blue2"
              borderColor="transparent"
            >
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
        </Card.Header>
      </Card>
    );
  };

  const EmptyState = () => (
    <YStack f={1} ai="center" jc="center" space="$4" py="$8">
      <YStack
        w="$12"
        h="$12"
        br="$8"
        bg="$blue2"
        ai="center"
        jc="center"
        mb="$2"
      >
        <Home size={48} color="$blue10" />
      </YStack>
      <H4 ta="center" color="$gray12">
        No properties yet
      </H4>
      <Paragraph ta="center" color="$gray11">
        Add your first property to get started
      </Paragraph>
      <Button
        size="$4"
        theme="blue"
        onPress={() => router.push("/properties/new")}
        iconAfter={Plus}
      >
        Add Property
      </Button>
    </YStack>
  );

  return (
    <YStack f={1} bg="$background">
      <XStack
        backgroundColor="$background"
        borderBottomColor="$borderColor"
        borderBottomWidth={1}
        p="$4"
        ai="center"
        jc="space-between"
      >
        <Text fontSize="$7" fontWeight="bold" color="$gray12">
          My Properties
        </Text>
        {properties && properties.length > 0 && (
          <Button
            size="$3"
            theme="blue"
            onPress={() => router.push("/properties/new")}
            icon={Plus}
          >
            Add
          </Button>
        )}
      </XStack>

      <ScrollView
        f={1}
        p="$4"
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={refetch}
            tintColor="$gray10"
          />
        }
      >
        {isLoading ? (
          <YStack f={1} ai="center" jc="center" p="$8">
            <Spinner size="large" color="$blue10" />
          </YStack>
        ) : properties && properties.length > 0 ? (
          <YStack space="$2">
            {properties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </YStack>
        ) : (
          <EmptyState />
        )}
      </ScrollView>
    </YStack>
  );
}
