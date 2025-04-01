import React from "react";
import {
  YStack,
  XStack,
  Input,
  Button,
  Text,
  ScrollView,
  Label,
  Card,
  RadioGroup,
  Paragraph,
} from "tamagui";
import { useRouter } from "expo-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Toast from "react-native-toast-message";
import { authClient } from "@/lib/auth-client";
import { useAuthenticatedApi } from "@/hooks/useAuthenticatedApi";
import { Home, Building2, Building, AlertCircle } from "@tamagui/lucide-icons";
import { z } from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MapLocationPicker } from "@/components/MapLocationPicker";

const PROPERTY_TYPES = [
  { value: "HOUSE", label: "House", icon: Home },
  { value: "APARTMENT", label: "Apartment", icon: Building2 },
  { value: "VILLA", label: "Villa", icon: Building },
  { value: "COMMERCIAL", label: "Commercial", icon: Building },
] as const;

// Zod schema for form validation
const propertySchema = z.object({
  name: z
    .string()
    .min(3, "Name must be at least 3 characters")
    .max(50, "Name must be less than 50 characters")
    .trim()
    .nonempty("Property name is required"),
  notes: z.string().optional(),
  value: z.number().optional(),
  type: z.enum(["HOUSE", "APARTMENT", "VILLA", "COMMERCIAL"]),
  propertyLocation: z.object({
    address: z
      .string()
      .min(5, "Address must be at least 5 characters")
      .max(200, "Address must be less than 200 characters")
      .trim()
      .nonempty("Address is required"),
    city: z
      .string()
      .min(2, "City must be at least 2 characters")
      .max(100, "City must be less than 100 characters")
      .trim()
      .nonempty("City is required"),
    country: z
      .string()
      .min(2, "Country must be at least 2 characters")
      .max(100, "Country must be less than 100 characters")
      .trim()
      .nonempty("Country is required"),
    postalCode: z
      .string()
      .min(2, "Postal code must be at least 2 characters")
      .max(20, "Postal code must be less than 20 characters")
      .trim()
      .nonempty("Postal code is required"),
  }),
});

type PropertyFormData = z.infer<typeof propertySchema>;

export default function NewProperty() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: session } = authClient.useSession();
  const { api } = useAuthenticatedApi();

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<PropertyFormData>({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      name: "",
      notes: "",
      value: undefined,
      type: "HOUSE",
    },
  });

  const handleLocationSelect = (location: {
    address: string;
    city: string;
    country: string;
    postalCode: string;
  }) => {
    console.log("location", location);
    setValue("propertyLocation.address", location.address);
    setValue("propertyLocation.city", location.city);
    setValue("propertyLocation.country", location.country);
    setValue("propertyLocation.postalCode", location.postalCode);
  };

  const createProperty = useMutation({
    mutationFn: (data: PropertyFormData) =>
      api.properties.create({
        ...data,
        propertyLocation: {
          create: {
            ...data.propertyLocation,
          },
        },
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

  const onSubmit = async (data: PropertyFormData) => {
    if (!session?.user?.id) {
      Toast.show({
        type: "error",
        text1: "You must be logged in",
      });
      return;
    }

    createProperty.mutate(data);
  };

  return (
    <ScrollView>
      <YStack f={1} p="$4" gap="$4">
        <Card p="$4">
          <YStack gap="$4">
            <Text>Add New Property</Text>

            <YStack gap="$2">
              <Label htmlFor="name">Property Name</Label>
              <Controller
                control={control}
                name="name"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    id="name"
                    size="$4"
                    bw={2}
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    placeholder="Enter property name"
                    bc={errors.name ? "$red8" : "$colorTransparent"}
                  />
                )}
              />
              {errors.name && (
                <XStack gap="$2" ai="center" mt="$2">
                  <AlertCircle size={16} col="$red10" />
                  <Paragraph size="$2" col="$red10">
                    {errors.name.message}
                  </Paragraph>
                </XStack>
              )}
            </YStack>

            <YStack gap="$2">
              <Label htmlFor="notes">Notes</Label>
              <Controller
                control={control}
                name="notes"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    id="notes"
                    size="$4"
                    bw={2}
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    placeholder="Enter property notes"
                    multiline
                    numberOfLines={3}
                  />
                )}
              />
            </YStack>

            <YStack gap="$2">
              <Label htmlFor="value">Value</Label>
              <Controller
                control={control}
                name="value"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    id="value"
                    size="$4"
                    bw={2}
                    value={value?.toString()}
                    onChangeText={(text) =>
                      onChange(parseFloat(text) || undefined)
                    }
                    onBlur={onBlur}
                    placeholder="Enter property value"
                    keyboardType="numeric"
                  />
                )}
              />
            </YStack>

            <YStack gap="$2">
              <Label>Property Type</Label>
              <Controller
                control={control}
                name="type"
                render={({ field: { onChange, value } }) => (
                  <RadioGroup value={value} onValueChange={onChange} gap="$2">
                    <XStack fw="wrap" gap="$2">
                      {PROPERTY_TYPES.map(
                        ({ value: typeValue, label, icon: Icon }) => (
                          <RadioGroup.Item
                            key={typeValue}
                            value={typeValue}
                            size="$4"
                            p="$4"
                            flexDirection="row"
                            alignItems="center"
                            bc={
                              value === typeValue ? "$green10" : "$background"
                            }
                            bw={2}
                            br="$4"
                          >
                            <Icon
                              size={24}
                              col={
                                value === typeValue ? "$green10" : "$background"
                              }
                            />
                            <Text
                              ml="$2"
                              col={
                                value === typeValue ? "$green10" : "$background"
                              }
                              fow={value === typeValue ? "bold" : "normal"}
                            >
                              {label}
                            </Text>
                          </RadioGroup.Item>
                        )
                      )}
                    </XStack>
                  </RadioGroup>
                )}
              />
            </YStack>

            <YStack gap="$2">
              <Label>Location</Label>
              <MapLocationPicker
                onLocationSelect={handleLocationSelect}
                trigger={
                  <Text>
                    {control._formValues.propertyLocation?.address
                      ? "Change Location"
                      : "Select Location on Map"}
                  </Text>
                }
              />
            </YStack>

            <YStack gap="$2">
              <Label htmlFor="address">Address</Label>
              <Controller
                control={control}
                name="propertyLocation.address"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    id="address"
                    size="$4"
                    bw={2}
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    placeholder="Enter property address"
                    multiline
                    numberOfLines={3}
                    bc={
                      errors.propertyLocation?.address
                        ? "$red8"
                        : "$colorTransparent"
                    }
                    editable={false}
                  />
                )}
              />
              {errors.propertyLocation?.address && (
                <XStack gap="$2" ai="center" mt="$2">
                  <AlertCircle size={16} col="$red10" />
                  <Paragraph size="$2" col="$red10">
                    {errors.propertyLocation?.address?.message}
                  </Paragraph>
                </XStack>
              )}
            </YStack>

            <XStack gap="$2">
              <YStack f={1} gap="$2">
                <Label htmlFor="city">City</Label>
                <Controller
                  control={control}
                  name="propertyLocation.city"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      id="city"
                      size="$4"
                      bw={2}
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      placeholder="Enter city"
                      bc={
                        errors.propertyLocation?.city
                          ? "$red8"
                          : "$colorTransparent"
                      }
                    />
                  )}
                />
                {errors.propertyLocation?.city && (
                  <XStack gap="$2" ai="center" mt="$2">
                    <AlertCircle size={16} col="$red10" />
                    <Paragraph size="$2" col="$red10">
                      {errors.propertyLocation?.city?.message}
                    </Paragraph>
                  </XStack>
                )}
              </YStack>

              <YStack f={1} gap="$2">
                <Label htmlFor="country">Country</Label>
                <Controller
                  control={control}
                  name="propertyLocation.country"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      id="country"
                      size="$4"
                      bw={2}
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      placeholder="Enter country"
                      bc={
                        errors.propertyLocation?.country
                          ? "$red8"
                          : "$colorTransparent"
                      }
                    />
                  )}
                />
                {errors.propertyLocation?.country && (
                  <XStack gap="$2" ai="center" mt="$2">
                    <AlertCircle size={16} col="$red10" />
                    <Paragraph size="$2" col="$red10">
                      {errors.propertyLocation?.country?.message}
                    </Paragraph>
                  </XStack>
                )}
              </YStack>
            </XStack>

            <YStack gap="$2">
              <Label htmlFor="postalCode">Postal Code</Label>
              <Controller
                control={control}
                name="propertyLocation.postalCode"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    id="postalCode"
                    size="$4"
                    bw={2}
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    placeholder="Enter postal code"
                    bc={
                      errors.propertyLocation?.postalCode
                        ? "$red8"
                        : "$colorTransparent"
                    }
                  />
                )}
              />
              {errors.propertyLocation?.postalCode && (
                <XStack gap="$2" ai="center" mt="$2">
                  <AlertCircle size={16} col="$red10" />
                  <Paragraph size="$2" col="$red10">
                    {errors.propertyLocation?.postalCode?.message}
                  </Paragraph>
                </XStack>
              )}
            </YStack>

            <Button
              size="$4"
              theme="accent"
              onPress={handleSubmit(onSubmit)}
              disabled={isSubmitting || createProperty.isPending}
              pressStyle={{ scale: 0.97 }}
              o={isSubmitting || createProperty.isPending ? 0.5 : 1}
            >
              {createProperty.isPending ? "Creating..." : "Create Property"}
            </Button>
          </YStack>
        </Card>
      </YStack>
      <Toast />
    </ScrollView>
  );
}
