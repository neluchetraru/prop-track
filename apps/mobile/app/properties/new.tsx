import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Platform,
  Modal,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Toast from "react-native-toast-message";
import { authClient } from "@/lib/auth-client";
import { useAuthenticatedApi } from "@/hooks/useAuthenticatedApi";
import {
  Home,
  Building2,
  Building,
  Camera,
  Upload,
  UserPlus,
  ChevronRight,
  ChevronLeft,
  X,
  MapPin,
} from "lucide-react-native";
import { z } from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MapLocationPicker } from "@/components/MapLocationPicker";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";
import { TenantForm } from "@/components/TenantForm";

const PROPERTY_TYPES = [
  {
    value: "HOUSE",
    label: "House",
    icon: <Home size={24} color="#2563eb" />,
  },
  {
    value: "APARTMENT",
    label: "Apartment",
    icon: <Building2 size={24} color="#2563eb" />,
  },
  {
    value: "VILLA",
    label: "Villa",
    icon: <Building size={24} color="#2563eb" />,
  },
  {
    value: "COMMERCIAL",
    label: "Commercial",
    icon: <Building size={24} color="#2563eb" />,
  },
];

const tenantSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .nonempty("Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  leaseStartDate: z.string().optional(),
  leaseEndDate: z.string().optional(),
  monthlyRent: z.number().optional(),
});

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
  tenants: z.array(tenantSchema).optional(),
  images: z
    .array(z.object({ uri: z.string(), name: z.string(), type: z.string() }))
    .optional(),
  documents: z
    .array(z.object({ uri: z.string(), name: z.string(), type: z.string() }))
    .optional(),
});

type PropertyFormData = z.infer<typeof propertySchema>;

const STEPS = [
  "Basic Info",
  "Location",
  "Images",
  "Documents",
  "Tenants",
  "Review",
];

export default function NewProperty() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: session } = authClient.useSession();
  const { api } = useAuthenticatedApi();
  const [currentStep, setCurrentStep] = useState(0);
  const [images, setImages] = useState<
    Array<{ uri: string; name: string; type: string }>
  >([]);
  const [documents, setDocuments] = useState<
    Array<{ uri: string; name: string; type: string }>
  >([]);
  const [tenants, setTenants] = useState<Array<z.infer<typeof tenantSchema>>>(
    []
  );
  const [showTenantForm, setShowTenantForm] = useState(false);

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<PropertyFormData>({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      name: "",
      notes: "",
      value: undefined,
      type: "HOUSE",
      tenants: [],
      images: [],
      documents: [],
    },
  });

  const handleLocationSelect = (location: {
    address: string;
    city: string;
    country: string;
    postalCode: string;
  }) => {
    setValue("propertyLocation.address", location.address);
    setValue("propertyLocation.city", location.city);
    setValue("propertyLocation.country", location.country);
    setValue("propertyLocation.postalCode", location.postalCode);
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });
    if (!result.canceled) {
      const newImage = {
        uri: result.assets[0].uri,
        name: `image-${Date.now()}.jpg`,
        type: "image/jpeg",
      };
      setImages((prev) => [...prev, newImage]);
      setValue("images", [...images, newImage]);
    }
  };

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: [
          "application/pdf",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ],
        copyToCacheDirectory: true,
      });
      if (result.assets && result.assets.length > 0) {
        const doc = result.assets[0];
        const newDoc = {
          uri: doc.uri,
          name: doc.name,
          type: doc.mimeType || "application/octet-stream",
        };
        setDocuments((prev) => [...prev, newDoc]);
        setValue("documents", [...documents, newDoc]);
      }
    } catch (err) {
      console.error("Error picking document:", err);
      Toast.show({
        type: "error",
        text1: "Error picking document",
        text2: "Please try again",
      });
    }
  };

  const handleAddTenant = (tenant: z.infer<typeof tenantSchema>) => {
    setTenants((prev) => [...prev, tenant]);
    setValue("tenants", [...tenants, tenant]);
    setShowTenantForm(false);
  };

  const createProperty = useMutation({
    mutationFn: async (data: PropertyFormData) => {
      // First, upload images and documents to get their URLs
      const uploadedImages = await Promise.all(
        (data.images || []).map(async (image) => {
          // Implement your image upload logic here
          // Return the uploaded image URL
          return { url: "temporary-url" }; // Replace with actual upload
        })
      );
      const uploadedDocuments = await Promise.all(
        (data.documents || []).map(async (doc) => {
          // Implement your document upload logic here
          // Return the uploaded document URL
          return { url: "temporary-url" }; // Replace with actual upload
        })
      );
      return api.properties.create({
        ...data,
        propertyLocation: {
          create: {
            ...data.propertyLocation,
          },
        },
        tenants: {
          create: data.tenants?.map((tenant) => ({
            ...tenant,
            phone: tenant.phone || "",
          })),
        },
        images: uploadedImages,
        documents: uploadedDocuments,
      });
    },
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

  const renderStepContent = () => {
    switch (currentStep) {
      case 0: // Basic Info
        return (
          <View className="gap-4">
            <View className="gap-2">
              <Text className="font-semibold mb-1">Property Name</Text>
              <Controller
                control={control}
                name="name"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    className="h-12 border border-gray-300 rounded-lg px-4 bg-gray-50"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    placeholder="Enter property name"
                    placeholderTextColor="#888"
                  />
                )}
              />
              {errors.name && (
                <Text className="text-red-600 mt-1 text-sm">
                  {errors.name.message}
                </Text>
              )}
            </View>

            <View className="gap-2">
              <Text className="font-semibold mb-1">Property Type</Text>
              <Controller
                control={control}
                name="type"
                render={({ field: { onChange, value } }) => (
                  <View className="flex-row flex-wrap gap-2">
                    {PROPERTY_TYPES.map(({ value: typeValue, label, icon }) => (
                      <TouchableOpacity
                        key={typeValue}
                        className={`flex-row items-center gap-2 px-4 py-2 rounded-lg border ${
                          value === typeValue
                            ? "border-blue-600 bg-blue-50"
                            : "border-gray-200 bg-white"
                        }`}
                        onPress={() => onChange(typeValue)}
                        activeOpacity={0.85}
                      >
                        {icon}
                        <Text className="font-medium text-base">{label}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              />
            </View>

            <View className="gap-2">
              <Text className="font-semibold mb-1">Value</Text>
              <Controller
                control={control}
                name="value"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    className="h-12 border border-gray-300 rounded-lg px-4 bg-gray-50"
                    value={value?.toString()}
                    onChangeText={(text) =>
                      onChange(text ? parseFloat(text) : undefined)
                    }
                    onBlur={onBlur}
                    placeholder="Enter property value"
                    keyboardType="numeric"
                    placeholderTextColor="#888"
                  />
                )}
              />
            </View>

            <View className="gap-2">
              <Text className="font-semibold mb-1">Notes</Text>
              <Controller
                control={control}
                name="notes"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    className="h-12 border border-gray-300 rounded-lg px-4 bg-gray-50"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    placeholder="Enter property notes"
                    multiline
                    numberOfLines={3}
                    placeholderTextColor="#888"
                  />
                )}
              />
            </View>
          </View>
        );
      case 1: // Location
        return (
          <View className="gap-4">
            <MapLocationPicker
              onLocationSelect={handleLocationSelect}
              trigger={
                <View className="flex-row items-center gap-2">
                  <MapPin size={20} color="#2563eb" />
                  <Text className="text-blue-700 font-semibold">
                    Select Location
                  </Text>
                </View>
              }
            />
            {watch("propertyLocation")?.address && (
              <View className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                <Text className="font-bold mb-1">Selected Location</Text>
                <Text>{watch("propertyLocation")?.address}</Text>
                <Text>
                  {watch("propertyLocation")?.city},{" "}
                  {watch("propertyLocation")?.country}{" "}
                  {watch("propertyLocation")?.postalCode}
                </Text>
              </View>
            )}
          </View>
        );
      case 2: // Images
        return (
          <View className="gap-4">
            <TouchableOpacity
              className="flex-row items-center gap-2 px-4 h-12 rounded-lg bg-blue-600 justify-center mb-2"
              onPress={pickImage}
              activeOpacity={0.85}
            >
              <Camera size={20} color="#fff" />
              <Text className="text-white font-bold">Add Images</Text>
            </TouchableOpacity>
            <ScrollView horizontal className="flex-row gap-2">
              {images.map((image, index) => (
                <View
                  key={index}
                  className="relative w-36 h-36 rounded-xl border border-gray-200 bg-gray-100 mr-2 overflow-hidden"
                >
                  <Image
                    source={{ uri: image.uri }}
                    style={{ width: 144, height: 144, borderRadius: 16 }}
                  />
                  <TouchableOpacity
                    className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white justify-center items-center shadow"
                    onPress={() => {
                      const newImages = images.filter((_, i) => i !== index);
                      setImages(newImages);
                      setValue("images", newImages);
                    }}
                  >
                    <X size={18} color="#dc2626" />
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          </View>
        );
      case 3: // Documents
        return (
          <View className="gap-4">
            <TouchableOpacity
              className="flex-row items-center gap-2 px-4 h-12 rounded-lg bg-blue-600 justify-center mb-2"
              onPress={pickDocument}
              activeOpacity={0.85}
            >
              <Upload size={20} color="#fff" />
              <Text className="text-white font-bold">Add Documents</Text>
            </TouchableOpacity>
            <View className="gap-2">
              {documents.map((doc, index) => (
                <View
                  key={index}
                  className="flex-row items-center justify-between rounded-xl border border-gray-200 bg-gray-50 p-4 mb-2"
                >
                  <Text className="flex-1 mr-2" numberOfLines={1}>
                    {doc.name}
                  </Text>
                  <TouchableOpacity
                    className="w-8 h-8 rounded-full bg-white justify-center items-center shadow"
                    onPress={() => {
                      const newDocs = documents.filter((_, i) => i !== index);
                      setDocuments(newDocs);
                      setValue("documents", newDocs);
                    }}
                  >
                    <X size={18} color="#dc2626" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>
        );
      case 4: // Tenants
        return (
          <View className="gap-4">
            <TouchableOpacity
              className="flex-row items-center gap-2 px-4 h-12 rounded-lg bg-blue-600 justify-center mb-2"
              onPress={() => setShowTenantForm(true)}
              activeOpacity={0.85}
            >
              <UserPlus size={20} color="#fff" />
              <Text className="text-white font-bold">Add Tenant</Text>
            </TouchableOpacity>
            <View className="gap-2">
              {tenants.map((tenant, index) => (
                <View
                  key={index}
                  className="rounded-xl border border-gray-200 bg-gray-50 p-4 mb-2"
                >
                  <Text className="font-bold mb-1">{tenant.name}</Text>
                  <Text>{tenant.email}</Text>
                  {tenant.phone && <Text>{tenant.phone}</Text>}
                  {tenant.leaseStartDate && (
                    <Text>
                      Lease: {tenant.leaseStartDate} - {tenant.leaseEndDate}
                    </Text>
                  )}
                  {tenant.monthlyRent && (
                    <Text>Rent: ${tenant.monthlyRent}/month</Text>
                  )}
                </View>
              ))}
            </View>
            <TenantForm
              open={showTenantForm}
              onOpenChange={setShowTenantForm}
              onSubmit={handleAddTenant}
            />
          </View>
        );
      case 5: // Review
        return (
          <View className="gap-4">
            <View className="rounded-xl border border-gray-200 bg-gray-50 p-4">
              <Text className="font-bold mb-2">Basic Information</Text>
              <Text>Name: {watch("name")}</Text>
              <Text>Type: {watch("type")}</Text>
              {watch("value") && <Text>Value: ${watch("value")}</Text>}
              {watch("notes") && <Text>Notes: {watch("notes")}</Text>}
              <View className="my-2 border-b border-gray-200" />
              <Text className="font-bold mb-2">Location</Text>
              <Text>{watch("propertyLocation")?.address}</Text>
              <Text>
                {watch("propertyLocation")?.city},{" "}
                {watch("propertyLocation")?.country}{" "}
                {watch("propertyLocation")?.postalCode}
              </Text>
              <View className="my-2 border-b border-gray-200" />
              <Text className="font-bold mb-2">Images</Text>
              <Text>{images.length} images added</Text>
              <View className="my-2 border-b border-gray-200" />
              <Text className="font-bold mb-2">Documents</Text>
              <Text>{documents.length} documents added</Text>
              <View className="my-2 border-b border-gray-200" />
              <Text className="font-bold mb-2">Tenants</Text>
              <Text>{tenants.length} tenants added</Text>
            </View>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <View className="flex-1 bg-white">
      <ScrollView>
        <View className="flex-1 p-4 gap-4">
          {/* Step Progress */}
          <View className="w-full h-2 bg-gray-200 rounded-full mb-4 overflow-hidden">
            <View
              className="h-2 bg-blue-600 rounded-full"
              style={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }}
            />
          </View>

          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-xl font-bold text-blue-700">
              {STEPS[currentStep]}
            </Text>
            <Text className="text-gray-500">
              Step {currentStep + 1} of {STEPS.length}
            </Text>
          </View>

          <View className="rounded-2xl border border-gray-200 bg-white p-4 shadow">
            {renderStepContent()}
          </View>
        </View>
      </ScrollView>

      <View className="flex-row border-t border-gray-200 p-4 gap-4 justify-between bg-white">
        <TouchableOpacity
          className={`flex-1 h-12 rounded-lg justify-center items-center ${
            currentStep === 0 ? "bg-gray-100" : "bg-blue-50"
          }`}
          disabled={currentStep === 0}
          onPress={() => setCurrentStep((prev) => prev - 1)}
          activeOpacity={currentStep === 0 ? 1 : 0.85}
        >
          <ChevronLeft
            size={20}
            color={currentStep === 0 ? "#a3a3a3" : "#2563eb"}
          />
          <Text
            className={`font-bold ${
              currentStep === 0 ? "text-gray-400" : "text-blue-700"
            }`}
          >
            Back
          </Text>
        </TouchableOpacity>
        {currentStep === STEPS.length - 1 ? (
          <TouchableOpacity
            className="flex-1 h-12 rounded-lg bg-blue-600 justify-center items-center ml-2"
            onPress={handleSubmit(onSubmit)}
            disabled={isSubmitting}
            activeOpacity={isSubmitting ? 1 : 0.85}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="font-bold text-white">Create Property</Text>
            )}
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            className="flex-1 h-12 rounded-lg bg-blue-600 justify-center items-center ml-2"
            onPress={() => setCurrentStep((prev) => prev + 1)}
            activeOpacity={0.85}
          >
            <Text className="font-bold text-white">Next</Text>
            <ChevronRight size={20} color="#fff" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
