import { useGeocoding } from "@/hooks/useGeocoding";
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  Dimensions,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";

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
        <TouchableOpacity
          className="flex-row items-center px-4 py-2 bg-blue-600 rounded-lg"
          onPress={() => setOpen(true)}
          activeOpacity={0.8}
        >
          <Text className="text-white font-bold">{trigger}</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          className="flex-row items-center px-4 py-2 bg-blue-600 rounded-lg"
          onPress={() => setOpen(true)}
          activeOpacity={0.8}
        >
          <Text className="text-white font-bold">Select Location</Text>
        </TouchableOpacity>
      )}

      <Modal
        visible={open}
        animationType="slide"
        transparent
        onRequestClose={() => setOpen(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/40">
          <View className="w-full max-w-xl bg-white rounded-2xl p-6">
            <Text className="text-xl font-bold mb-2 text-center">
              Select Location
            </Text>
            <Text className="text-gray-500 mb-4 text-center">
              Search for a location or tap on the map to select
            </Text>

            <View className="flex-row items-center mb-4">
              <TextInput
                className="flex-1 h-12 border border-gray-300 rounded-lg px-4 bg-gray-50 mr-2"
                placeholder="Search location..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                onSubmitEditing={handleSearch}
                editable={!isLoading}
                placeholderTextColor="#888"
              />
              <TouchableOpacity
                className="h-12 px-4 bg-blue-600 rounded-lg justify-center items-center"
                onPress={handleSearch}
                disabled={isLoading}
                activeOpacity={0.8}
              >
                {isLoading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text className="text-white font-bold">Search</Text>
                )}
              </TouchableOpacity>
            </View>

            <View className="rounded-lg overflow-hidden border border-gray-200 mb-4">
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
            </View>

            {selectedLocation && (
              <View className="bg-gray-50 rounded-lg border border-gray-200 p-4 mb-4">
                <Text className="font-bold mb-1">Selected Location</Text>
                <Text className="mb-1">{selectedLocation.address}</Text>
                <Text className="text-gray-500">
                  {selectedLocation.city}, {selectedLocation.country}{" "}
                  {selectedLocation.postalCode}
                </Text>
              </View>
            )}

            <View className="flex-row justify-end gap-4 mt-2">
              <TouchableOpacity
                className="px-4 h-10 rounded-lg bg-gray-200 justify-center items-center mr-2"
                onPress={() => setOpen(false)}
              >
                <Text className="font-bold text-gray-700">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="px-4 h-10 rounded-lg bg-blue-600 justify-center items-center"
                onPress={handleConfirm}
                disabled={!selectedLocation}
                activeOpacity={selectedLocation ? 0.8 : 1}
              >
                <Text className="font-bold text-white">Confirm Location</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
