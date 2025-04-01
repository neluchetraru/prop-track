import { useGeocoding } from "@/hooks/useGeocoding";
import { MapPin, Search, X } from "@tamagui/lucide-icons";
import React, { useState } from "react";
import { Dimensions, StyleSheet } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { Button, Card, Dialog, Input, Text, XStack, YStack } from "tamagui";

const { width, height } = Dimensions.get("window");

interface Location {
  latitude: number;
  longitude: number;
  address: string;
  city: string;
  country: string;
  postalCode: string;
}

interface MapLocationPickerProps {
  onLocationSelect: (location: Location) => void;
  initialLocation?: Location;
  trigger?: React.ReactNode;
}

export function MapLocationPicker({
  onLocationSelect,
  initialLocation,
  trigger,
}: MapLocationPickerProps) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(
    initialLocation || null
  );
  const { searchLocation, isLoading } = useGeocoding();

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    const location = await searchLocation(searchQuery);
    if (location) {
      setSelectedLocation(location);
      onLocationSelect(location);
    }
  };

  const handleMapPress = async (event: any) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    const location = await searchLocation(`${latitude},${longitude}`);
    if (location) {
      setSelectedLocation(location);
      onLocationSelect(location);
    }
  };

  const handleConfirm = () => {
    if (selectedLocation) {
      onLocationSelect(selectedLocation);
      setOpen(false);
    }
  };

  return (
    <>
      {trigger ? (
        <Button onPress={() => setOpen(true)} icon={MapPin}>
          {trigger}
        </Button>
      ) : (
        <Button onPress={() => setOpen(true)} icon={MapPin}>
          Select Location
        </Button>
      )}

      <Dialog modal open={open} onOpenChange={setOpen}>
        <Dialog.Portal>
          <Dialog.Overlay
            key="overlay"
            animation="quick"
            o={0.5}
            enterStyle={{ o: 0 }}
            exitStyle={{ o: 0 }}
          />
          <Dialog.Content
            bordered
            elevate
            key="content"
            animation={[
              "quick",
              {
                opacity: {
                  overshootClamping: true,
                },
              },
            ]}
            enterStyle={{ x: 0, y: -20, o: 0, scale: 0.9 }}
            exitStyle={{ x: 0, y: 10, o: 0, scale: 0.95 }}
            space
            w="90%"
            maw={600}
            scale={1}
            o={1}
            x={0}
            y={0}
          >
            <Dialog.Title>Select Location</Dialog.Title>
            <Dialog.Description>
              Search for a location or tap on the map to select
            </Dialog.Description>

            <XStack gap="$2">
              <Input
                f={1}
                size="$4"
                placeholder="Search location..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                onSubmitEditing={handleSearch}
              />
              <Button
                size="$4"
                icon={Search}
                onPress={handleSearch}
                disabled={isLoading}
              />
            </XStack>

            <Card bordered p="$2">
              <MapView
                provider={PROVIDER_GOOGLE}
                style={styles.map}
                initialRegion={
                  selectedLocation
                    ? {
                        latitude: selectedLocation.latitude,
                        longitude: selectedLocation.longitude,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                      }
                    : undefined
                }
                onPress={handleMapPress}
              >
                {selectedLocation && (
                  <Marker
                    coordinate={{
                      latitude: selectedLocation.latitude,
                      longitude: selectedLocation.longitude,
                    }}
                    title={selectedLocation.address}
                  />
                )}
              </MapView>
            </Card>

            {selectedLocation && (
              <Card bordered p="$4">
                <YStack gap="$2">
                  <Text fow="bold">Selected Location</Text>
                  <Text>{selectedLocation.address}</Text>
                  <Text>
                    {selectedLocation.city}, {selectedLocation.country}{" "}
                    {selectedLocation.postalCode}
                  </Text>
                </YStack>
              </Card>
            )}

            <XStack gap="$3" mt="$4" jc="flex-end">
              <Dialog.Close asChild>
                <Button>Cancel</Button>
              </Dialog.Close>
              <Button
                theme="accent"
                onPress={handleConfirm}
                disabled={!selectedLocation}
              >
                Confirm Location
              </Button>
            </XStack>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog>
    </>
  );
}

const styles = StyleSheet.create({
  map: {
    width: width - 64, // Account for padding and modal margins
    height: 300,
    borderRadius: 8,
    overflow: "hidden",
  },
});
