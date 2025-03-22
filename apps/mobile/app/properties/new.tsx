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

const PROPERTY_TYPES = [
  { value: "HOUSE", label: "House", icon: Home },
  { value: "APARTMENT", label: "Apartment", icon: Building2 },
  { value: "CONDO", label: "Condo", icon: Building },
] as const;

// Zod schema for form validation
const propertySchema = z.object({
  name: z
    .string()
    .min(3, "Name must be at least 3 characters")
    .max(50, "Name must be less than 50 characters")
    .trim()
    .nonempty("Property name is required"),
  address: z
    .string()
    .min(5, "Address must be at least 5 characters")
    .max(200, "Address must be less than 200 characters")
    .trim()
    .nonempty("Address is required"),
  type: z.enum(["HOUSE", "APARTMENT", "CONDO"]),
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
    formState: { errors, isSubmitting },
  } = useForm<PropertyFormData>({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      name: "",
      address: "",
      type: "HOUSE",
    },
  });

  const createProperty = useMutation({
    mutationFn: (data: PropertyFormData) =>
      api.properties.create({
        ...data,
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
      <YStack f={1} p="$4" space="$4">
        <Card elevate bordered p="$4">
          <YStack space="$4">
            <Text fontSize="$8" fontWeight="bold" color="$blue10">
              Add New Property
            </Text>

            <YStack space="$2">
              <Label htmlFor="name" color="$gray11">
                Property Name
              </Label>
              <Controller
                control={control}
                name="name"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    id="name"
                    size="$4"
                    borderWidth={2}
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    placeholder="Enter property name"
                    borderColor={errors.name ? "$red8" : "$gray8"}
                  />
                )}
              />
              {errors.name && (
                <XStack space="$2" ai="center" mt="$2">
                  <AlertCircle size={16} color="$red10" />
                  <Paragraph size="$2" color="$red10">
                    {errors.name.message}
                  </Paragraph>
                </XStack>
              )}
            </YStack>

            <YStack space="$2">
              <Label htmlFor="address" color="$gray11">
                Address
              </Label>
              <Controller
                control={control}
                name="address"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    id="address"
                    size="$4"
                    borderWidth={2}
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    placeholder="Enter property address"
                    multiline
                    numberOfLines={3}
                    textAlignVertical="top"
                    borderColor={errors.address ? "$red8" : "$gray8"}
                  />
                )}
              />
              {errors.address && (
                <XStack space="$2" ai="center" mt="$2">
                  <AlertCircle size={16} color="$red10" />
                  <Paragraph size="$2" color="$red10">
                    {errors.address.message}
                  </Paragraph>
                </XStack>
              )}
            </YStack>

            <YStack space="$2">
              <Label color="$gray11">Property Type</Label>
              <Controller
                control={control}
                name="type"
                render={({ field: { onChange, value } }) => (
                  <RadioGroup value={value} onValueChange={onChange} space="$2">
                    <XStack space="$4" flexWrap="wrap">
                      {PROPERTY_TYPES.map(
                        ({ value: typeValue, label, icon: Icon }) => (
                          <RadioGroup.Item
                            key={typeValue}
                            value={typeValue}
                            size="$4"
                            p="$4"
                            flexDirection="row"
                            alignItems="center"
                            borderColor={
                              value === typeValue ? "$blue10" : "$gray5"
                            }
                            borderWidth={2}
                            borderRadius="$4"
                            backgroundColor={
                              value === typeValue ? "$blue2" : "transparent"
                            }
                          >
                            <Icon
                              size={24}
                              color={
                                value === typeValue ? "$blue10" : "$gray10"
                              }
                            />
                            <Text
                              ml="$2"
                              color={
                                value === typeValue ? "$blue10" : "$gray10"
                              }
                              fontWeight={
                                value === typeValue ? "bold" : "normal"
                              }
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

            <Button
              size="$4"
              theme="active"
              onPress={handleSubmit(onSubmit)}
              disabled={isSubmitting || createProperty.isPending}
              pressStyle={{ scale: 0.97 }}
              opacity={isSubmitting || createProperty.isPending ? 0.5 : 1}
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
