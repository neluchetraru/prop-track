import { PropertyFormData } from "@/app/(authenticated)/properties/new";
import FormError from "@/components/form-error";
import FormDescription from "@/components/FormDescription";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useGeocoding } from "@/hooks/useGeocoding";
import { Feather } from "@expo/vector-icons";
import * as Location from "expo-location";
import {
  ArrowRight,
  Check,
  Crosshair,
  MapPin,
  Maximize2,
  Pin,
  Search,
  X,
} from "lucide-react-native";
import React, { useEffect, useRef, useState } from "react";
import {
  Control,
  Controller,
  FieldErrors,
  UseFormSetValue,
} from "react-hook-form";
import {
  ActivityIndicator,
  Modal,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, { PROVIDER_GOOGLE, Region } from "react-native-maps";

// TODO: Use google maps API

function LocationMapView({
  region,
  onRegionChange,
  onUseMyLocation,
  isLocating,
  setMapFullScreen,
  isMapLoading,
  mapRef,
  fullScreen = false,
}: {
  region: Region | undefined;
  onRegionChange: (reg: Region) => void;
  onUseMyLocation: () => void;
  isLocating: boolean;
  setMapFullScreen: (val: boolean) => void;
  isMapLoading: boolean;
  mapRef: React.RefObject<MapView | null>;
  fullScreen?: boolean;
}) {
  return (
    <View
      className={
        fullScreen
          ? "flex-1 relative"
          : "w-full h-80 rounded-xl overflow-hidden bg-gray-200 mb-3 relative"
      }
    >
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={{ flex: 1, width: "100%", height: "100%" }}
        region={region}
        onRegionChange={onRegionChange}
        showsUserLocation
        showsMyLocationButton={false}
        loadingEnabled
      />
      {/* Center Pin */}
      <View className="absolute top-1/2 left-1/2 -ml-[18px] -mt-9 z-10 items-center justify-center pointer-events-none">
        <MapPin size={30} />
      </View>
      {/* Floating locate button */}
      <TouchableOpacity
        className="absolute bottom-4 right-4 bg-white rounded-full w-12 h-12 items-center justify-center shadow-lg z-20 border border-gray-200"
        onPress={onUseMyLocation}
        disabled={isLocating}
        activeOpacity={0.85}
      >
        {isLocating ? (
          <ActivityIndicator size={20} color="#2563eb" />
        ) : (
          <Crosshair size={22} color="#2563eb" />
        )}
      </TouchableOpacity>
      {/* Floating full screen button */}
      {!fullScreen && (
        <TouchableOpacity
          className="absolute top-4 right-4 bg-white rounded-full w-12 h-12 items-center justify-center shadow-lg z-20 border border-gray-200"
          onPress={() => setMapFullScreen(true)}
          activeOpacity={0.85}
        >
          <Maximize2 size={22} color="#2563eb" />
        </TouchableOpacity>
      )}
      {/* Loading overlay */}
      {isMapLoading && (
        <View className="absolute inset-0 bg-white/60 items-center justify-center z-20">
          <ActivityIndicator size="large" color="#2563eb" />
        </View>
      )}
    </View>
  );
}

export default function LocationStep({
  control,
  errors,
  setValue,
}: {
  control: Control<PropertyFormData>;
  errors: FieldErrors<PropertyFormData>;
  setValue: UseFormSetValue<PropertyFormData>;
}) {
  const [region, setRegion] = useState<Region | undefined>(undefined);
  const [isMapLoading, setIsMapLoading] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [fullScreen, setFullScreen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const { searchLocation } = useGeocoding();
  const mapRef = useRef<MapView | null>(null);

  // On mount, if no initial location, try to get user's location
  useEffect(() => {
    (async () => {
      setIsLocating(true);
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status === "granted") {
          let loc = await Location.getCurrentPositionAsync({});
          setRegion({
            latitude: loc.coords.latitude,
            longitude: loc.coords.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          });
        }
      } catch {}
      setIsLocating(false);
    })();
  }, []);

  // Helper to update address as map moves
  const updateAddressFromRegion = async (reg: Region) => {
    setIsMapLoading(true);
    const location = await searchLocation(`${reg.latitude},${reg.longitude}`);
    if (location) {
      setValue("propertyLocation", {
        address: location.address,
        city: location.city,
        country: location.country,
        postalCode: location.postalCode,
      });
    }
    setIsMapLoading(false);
  };

  // Generic handler for both inline and modal 'use my location' actions
  const onUseMyLocationGeneric = async (
    setRegionFn: React.Dispatch<React.SetStateAction<Region | undefined>>,
    mapRefObj: React.RefObject<MapView | null>,
    setLocating: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    setLocating(true);
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setLocating(false);
        return;
      }
      let loc = await Location.getCurrentPositionAsync({});
      const location = await searchLocation(
        `${loc.coords.latitude},${loc.coords.longitude}`
      );
      if (location) {
        setRegionFn({
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        });
        mapRefObj.current?.animateToRegion({
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        });
        setValue("propertyLocation", {
          address: location.address,
          city: location.city,
          country: location.country,
          postalCode: location.postalCode,
        });
      }
    } catch (e) {
      // handle error
    }
    setLocating(false);
  };

  // Inline map handler
  const onUseMyLocation = () =>
    onUseMyLocationGeneric(setRegion, mapRef, setIsLocating);

  // Full screen modal logic
  const [modalRegion, setModalRegion] = useState(region);
  const modalMapRef = useRef<MapView | null>(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalLocating, setModalLocating] = useState(false);

  const handleModalRegionChangeComplete = async (reg: Region) => {
    setModalLoading(true);
    const location = await searchLocation(`${reg.latitude},${reg.longitude}`);
    if (location) {
      setValue("propertyLocation", {
        address: location.address,
        city: location.city,
        country: location.country,
        postalCode: location.postalCode,
      });
    }
    setModalLoading(false);
  };

  const handleModalUseMyLocation = () =>
    onUseMyLocationGeneric(setModalRegion, modalMapRef, setModalLocating);

  const handleSearchPress = async () => {
    if (!searchText.trim()) return;
    setIsMapLoading(true);
    try {
      const location = await searchLocation(searchText);
      if (location) {
        const region = {
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        };
        setRegion(region);
        mapRef.current?.animateToRegion(region);
        setValue("propertyLocation", {
          address: location.address,
          city: location.city,
          country: location.country,
          postalCode: location.postalCode,
        });
      }
    } finally {
      setIsMapLoading(false);
    }
  };

  return (
    <View className="gap-6">
      {/* Search Bar */}
      <View className="relative">
        <Input
          className="pl-10 pr-10 h-11 w-full"
          placeholder="Search location..."
          placeholderTextColor="#888"
          value={searchText}
          onChangeText={setSearchText}
        />

        <View className="absolute left-3 top-1/2 -translate-y-1/2">
          <Search size={18} color="#888" />
        </View>
        {searchText.length > 0 && (
          <TouchableOpacity
            onPress={() => setSearchText("")}
            className="absolute right-10 top-1/2 -translate-y-1/2"
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <X size={18} color="#888" />
          </TouchableOpacity>
        )}

        <TouchableOpacity
          onPress={handleSearchPress}
          className="absolute right-3 top-1/2 -translate-y-1/2"
          disabled={isMapLoading || !searchText.trim()}
        >
          {isMapLoading ? (
            <ActivityIndicator size={18} color="#2563eb" />
          ) : (
            <ArrowRight size={20} color="#2563eb" />
          )}
        </TouchableOpacity>
      </View>

      {/* Map with floating controls */}
      <LocationMapView
        region={region}
        onRegionChange={updateAddressFromRegion}
        onUseMyLocation={onUseMyLocation}
        isLocating={isLocating}
        setMapFullScreen={() => {
          setModalRegion(region);
          setFullScreen(true);
        }}
        isMapLoading={isMapLoading}
        mapRef={mapRef}
      />

      {/* Manual Address Input Fields */}
      <View className="gap-4">
        <Controller
          control={control}
          name="propertyLocation.address"
          render={({ field }) => (
            <View>
              <Label className="text-blue-700 font-semibold mb-2">
                Street Address
              </Label>
              <Input
                placeholder="Street Address"
                value={field.value}
                onChangeText={field.onChange}
                clearButtonMode="while-editing"
              />
              {errors.propertyLocation?.address && (
                <FormError
                  error={errors.propertyLocation.address.message as string}
                />
              )}
              <FormDescription>e.g. "123 Main St"</FormDescription>
            </View>
          )}
        />
        <Controller
          control={control}
          name="propertyLocation.city"
          render={({ field }) => (
            <View>
              <Label className="text-blue-700 font-semibold mb-2">City</Label>
              <Input
                placeholder="City"
                value={field.value}
                onChangeText={field.onChange}
                clearButtonMode="while-editing"
              />
              {errors.propertyLocation?.city && (
                <FormError
                  error={errors.propertyLocation.city.message as string}
                />
              )}
              <FormDescription>e.g. "New York"</FormDescription>
            </View>
          )}
        />
        <Controller
          control={control}
          name="propertyLocation.country"
          render={({ field }) => (
            <View>
              <Label className="text-blue-700 font-semibold mb-2">
                Country
              </Label>
              <Input
                placeholder="Country"
                value={field.value}
                onChangeText={field.onChange}
                clearButtonMode="while-editing"
              />
              {errors.propertyLocation?.country && (
                <FormError
                  error={errors.propertyLocation.country.message as string}
                />
              )}
              <FormDescription>e.g. "United States"</FormDescription>
            </View>
          )}
        />
        <Controller
          control={control}
          name="propertyLocation.postalCode"
          render={({ field }) => (
            <View>
              <Label className="text-blue-700 font-semibold mb-2">
                Postal Code
              </Label>
              <Input
                placeholder="Postal Code"
                value={field.value}
                onChangeText={field.onChange}
                clearButtonMode="while-editing"
              />
              {errors.propertyLocation?.postalCode && (
                <FormError
                  error={errors.propertyLocation.postalCode.message as string}
                />
              )}
              <FormDescription>e.g. "10001"</FormDescription>
            </View>
          )}
        />
      </View>

      {/* Full Screen Modal */}
      <Modal
        visible={fullScreen}
        animationType="slide"
        presentationStyle="fullScreen"
      >
        <View className="flex-1 bg-white">
          {/* Top bar */}
          <View className="flex-row items-center justify-between px-4 pt-4 pb-2 bg-white z-30">
            <TouchableOpacity
              onPress={() => setFullScreen(false)}
              className="p-2 rounded-full bg-gray-100"
            >
              <X size={24} color="#222" />
            </TouchableOpacity>
            <Text className="text-lg font-bold text-blue-700">
              Select Location
            </Text>
            <TouchableOpacity
              onPress={() => setFullScreen(false)}
              className="p-2 rounded-full bg-blue-600"
            >
              <Check size={24} color="#fff" />
            </TouchableOpacity>
          </View>
          {/* Map */}
          <LocationMapView
            region={modalRegion}
            onRegionChange={handleModalRegionChangeComplete}
            onUseMyLocation={handleModalUseMyLocation}
            isLocating={modalLocating}
            setMapFullScreen={() => setFullScreen(false)}
            isMapLoading={modalLoading}
            mapRef={modalMapRef}
            fullScreen={true}
          />
        </View>
      </Modal>
    </View>
  );
}
