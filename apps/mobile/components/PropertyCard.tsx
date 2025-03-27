import type { Property } from "@prop-track/database";
import {
  Building2,
  DollarSign,
  Edit3,
  Eye,
  FileText,
  Home,
  MapPin,
  Users,
} from "@tamagui/lucide-icons";
import { useRouter } from "expo-router";
import {
  Button,
  Card,
  Paragraph,
  SizableText,
  Text,
  XStack,
  YStack,
} from "tamagui";

const PropertyTypeIcons = {
  HOUSE: Home,
  APARTMENT: Building2,
  CONDO: Building2,
} as const;

interface PropertyCardProps {
  property: Property;
}

export function PropertyCard({ property }: PropertyCardProps) {
  const router = useRouter();
  const Icon =
    PropertyTypeIcons[property.type as keyof typeof PropertyTypeIcons] || Home;

  return (
    <Card
      animation="bouncy"
      scale={0.97}
      hoverStyle={{ scale: 0.99 }}
      pressStyle={{ scale: 0.95 }}
      enterStyle={{ scale: 0.95, y: 10, opacity: 0 }}
      exitStyle={{ scale: 0.95, y: 10, opacity: 0 }}
      onPress={() => router.push(`/properties/${property.id}`)}
    >
      <Card.Header>
        <YStack gap="$3">
          <XStack gap="$4" ai="center">
            <YStack w="$5" h="$5" ai="center" jc="center" br="$4">
              <Icon size={24} />
            </YStack>
            <YStack f={1} gap="$1">
              <SizableText size="$5">{property.name}</SizableText>
              <XStack ai="center" gap="$2">
                <MapPin size={14} />
                <Paragraph size="$2">{property.address}</Paragraph>
              </XStack>
            </YStack>
            <Card size="$2" bordered br="$4" borderWidth={1}>
              <Text p="$2" transform="capitalize">
                {property.type.toLowerCase()}
              </Text>
            </Card>
          </XStack>

          <XStack gap="$3" jc="space-between">
            <XStack gap="$2" ai="center">
              <DollarSign size={16} />
              <Text fos="$3">{property.value?.toLocaleString()}</Text>
            </XStack>
            <XStack gap="$2" ai="center">
              <Users size={16} />
              <Text fos="$3">{property.occupancyStatus}</Text>
            </XStack>
          </XStack>

          <XStack gap="$2" jc="flex-end">
            <Button
              size="$2"
              circular
              icon={Eye}
              onPress={() => router.push(`/properties/${property.id}`)}
            />
            <Button
              size="$2"
              circular
              icon={Edit3}
              onPress={() => router.push(`/properties/${property.id}/edit`)}
            />
            <Button
              size="$2"
              circular
              icon={FileText}
              onPress={() =>
                router.push(`/properties/${property.id}/documents`)
              }
            />
          </XStack>
        </YStack>
      </Card.Header>
    </Card>
  );
}
