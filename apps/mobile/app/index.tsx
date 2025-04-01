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
  ScrollView,
  Paragraph,
  Spinner,
  H4,
} from "tamagui";
import { Home, Plus, Building2, MapPin } from "@tamagui/lucide-icons";
import { RefreshControl } from "react-native";
import { useAuthenticatedApi } from "@/hooks/useAuthenticatedApi";
import { PropertyCard } from "@/components/PropertyCard";
import { DashboardHeader } from "@/components/DashboardHeader";
import { PropertyStats } from "@/components/PropertyStats";
import { QuickActions } from "@/components/QuickActions";

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
    <YStack f={1} ai="center" jc="center" gap="$4" py="$8">
      <YStack w="$12" h="$12" br="$8" ai="center" jc="center" mb="$2">
        <Home size={48} />
      </YStack>
      <H4 ta="center">No properties yet</H4>
      <Paragraph ta="center">Add your first property to get started</Paragraph>
      <Button
        size="$4"
        onPress={() => router.push("/properties/new")}
        iconAfter={Plus}
      >
        Add Property
      </Button>
    </YStack>
  );

  return (
    <YStack f={1} bg="$background">
      <DashboardHeader />

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
        ) : (
          <YStack gap="$4">
            <PropertyStats properties={properties || []} />
            {properties && properties.length > 0 ? (
              <YStack gap="$2">
                <XStack ai="center" jc="space-between">
                  <H4>My Properties</H4>
                  <Button
                    size="$3"
                    onPress={() => router.push("/properties/new")}
                    icon={Plus}
                  >
                    Add
                  </Button>
                </XStack>

                {properties.map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </YStack>
            ) : (
              <EmptyState />
            )}
          </YStack>
        )}
      </ScrollView>
      <QuickActions />
    </YStack>
  );
}
