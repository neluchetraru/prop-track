import { useAuthenticatedApi } from "@/hooks/useAuthenticatedApi";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import {
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  Check,
} from "lucide-react-native";
import React, { useState, useRef, useEffect } from "react";
import { useForm, FieldErrors } from "react-hook-form";
import {
  ActivityIndicator,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Dimensions,
} from "react-native";
import Toast from "react-native-toast-message";
import { z } from "zod";
import BasicInfoStep from "@/app/(authenticated)/properties/steps/BasicInfoStep";
import DocumentsStep from "@/app/(authenticated)/properties/steps/DocumentsStep";
import ImagesStep from "@/app/(authenticated)/properties/steps/ImagesStep";
import LocationStep from "@/app/(authenticated)/properties/steps/LocationStep";
import ReviewStep from "@/app/(authenticated)/properties/steps/ReviewStep";
import TenantsStep from "@/app/(authenticated)/properties/steps/TenantsStep";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

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
  currency: z.enum(["USD", "EUR", "GBP", "JPY"]),
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

export type PropertyFormData = z.infer<typeof propertySchema>;

const STEPS = [
  "Basic Info",
  "Location",
  "Images",
  "Documents",
  "Tenants",
  "Review",
];

// Helper: map errors to steps
function getStepsWithErrors(errors: FieldErrors<PropertyFormData>): number[] {
  const steps: number[] = [];
  if (
    errors.name ||
    errors.type ||
    errors.value ||
    errors.currency ||
    errors.notes
  )
    steps.push(0);
  if (errors.propertyLocation) steps.push(1);
  if (errors.images) steps.push(2);
  if (errors.documents) steps.push(3);
  if (errors.tenants) steps.push(4);
  return steps;
}

// Helper: get error messages for a step
function getStepErrorMessages(
  errors: FieldErrors<PropertyFormData>,
  step: number
): string[] {
  const messages: string[] = [];
  if (step === 0) {
    if (errors.name?.message) messages.push(errors.name.message as string);
    if (errors.type?.message) messages.push(errors.type.message as string);
    if (errors.value?.message) messages.push(errors.value.message as string);
    if (errors.currency?.message)
      messages.push(errors.currency.message as string);
    if (errors.notes?.message) messages.push(errors.notes.message as string);
  }
  if (step === 1 && errors.propertyLocation) {
    const loc = errors.propertyLocation;
    if (loc.address?.message) messages.push(loc.address.message as string);
    if (loc.city?.message) messages.push(loc.city.message as string);
    if (loc.country?.message) messages.push(loc.country.message as string);
    if (loc.postalCode?.message)
      messages.push(loc.postalCode.message as string);
  }
  if (step === 2 && errors.images?.message)
    messages.push(errors.images.message as string);
  if (step === 3 && errors.documents?.message)
    messages.push(errors.documents.message as string);
  if (step === 4 && errors.tenants?.message)
    messages.push(errors.tenants.message as string);
  return messages;
}

// Helper: get first error step index
function getFirstErrorStep(
  errors: FieldErrors<PropertyFormData>
): number | null {
  if (
    errors.name ||
    errors.type ||
    errors.value ||
    errors.currency ||
    errors.notes
  )
    return 0;
  if (errors.propertyLocation) return 1;
  if (errors.images) return 2;
  if (errors.documents) return 3;
  if (errors.tenants) return 4;
  return null;
}

export default function NewProperty() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { api } = useAuthenticatedApi();
  const [currentStep, setCurrentStep] = useState(0);
  const [images, setImages] = useState<
    Array<{ uri: string; name: string; type: string }>
  >([]);
  const [documents, setDocuments] = useState<
    Array<{ uri: string; name: string; type: string }>
  >([]);
  const scrollViewRef = useRef<ScrollView>(null);

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
      currency: "USD",
      type: "HOUSE",
      tenants: [],
      images: [],
      documents: [],
    },
  });

  // Error step helpers
  const stepsWithErrors = getStepsWithErrors(errors);

  // Error handler for form submit
  const onError = (formErrors: FieldErrors<PropertyFormData>) => {
    Toast.show({
      type: "error",
      text1: "Please fix errors before submitting. See highlighted steps.",
    });
    // Scroll to first error bubble
    const firstErrorIdx = getFirstErrorStep(formErrors);
    if (firstErrorIdx !== null && scrollViewRef.current) {
      const bubbleWidth = 48;
      const screenWidth = Dimensions.get("window").width;
      const offset = Math.max(
        0,
        bubbleWidth * firstErrorIdx - screenWidth / 2 + bubbleWidth / 2
      );
      scrollViewRef.current.scrollTo({ x: offset, animated: true });
    }
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
        images: {
          create: uploadedImages,
        },
        documents: {
          create: uploadedDocuments,
        },
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
    console.log(data);

    createProperty.mutate(data);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return <BasicInfoStep control={control} errors={errors} />;
      case 1:
        return (
          <LocationStep control={control} errors={errors} setValue={setValue} />
        );
      case 2:
        return (
          <ImagesStep
            images={images}
            setImages={setImages}
            setValue={setValue}
          />
        );
      case 3:
        return (
          <DocumentsStep
            documents={documents}
            setDocuments={setDocuments}
            setValue={setValue}
          />
        );
      case 4:
        return (
          <TenantsStep control={control} errors={errors} setValue={setValue} />
        );
      case 5:
        return (
          <ReviewStep
            watch={watch}
            images={images}
            documents={documents}
            tenants={watch("tenants") || []}
          />
        );
      default:
        return null;
    }
  };

  // Scroll to current step when it changes
  useEffect(() => {
    if (scrollViewRef.current) {
      const bubbleWidth = 48; // width of each bubble + margin
      const screenWidth = Dimensions.get("window").width;
      const offset = Math.max(
        0,
        bubbleWidth * currentStep - screenWidth / 2 + bubbleWidth / 2
      );
      scrollViewRef.current.scrollTo({ x: offset, animated: true });
    }
  }, [currentStep]);

  return (
    <>
      <KeyboardAwareScrollView
        enableOnAndroid
        keyboardShouldPersistTaps="handled"
        extraScrollHeight={180}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <View className="p-4 gap-4">
          {/* Bubble Stepper */}
          <ScrollView
            ref={scrollViewRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              alignItems: "center",
              paddingBottom: 8,
              paddingTop: 8,
            }}
            style={{ marginBottom: 12 }}
          >
            <View
              style={{
                position: "relative",
                minHeight: 60,
                justifyContent: "center",
              }}
            >
              {/* Centered connecting line behind bubbles */}
              <View
                style={{
                  position: "absolute",
                  top: 24, // half of bubble height (48/2)
                  left: 0,
                  right: 0,
                  height: 4,
                  backgroundColor: "#e5e7eb",
                  zIndex: 0,
                }}
              />
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  zIndex: 1,
                }}
              >
                {STEPS.map((step, idx) => {
                  const isCurrent = idx === currentStep;
                  const isCompleted = idx < currentStep;
                  const hasError = stepsWithErrors.includes(idx);
                  // Bubble color
                  let bubbleColor = "#e5e7eb"; // gray-200
                  if (hasError) bubbleColor = "#dc2626"; // red-600
                  else if (isCurrent || isCompleted) bubbleColor = "#2563eb"; // blue-600
                  // Text color
                  let textColor = isCurrent || isCompleted ? "#fff" : "#64748b";
                  if (hasError) textColor = "#fff";
                  return (
                    <TouchableOpacity
                      key={step}
                      onPress={() => setCurrentStep(idx)}
                      activeOpacity={0.8}
                      style={{
                        alignItems: "center",
                        marginRight: idx < STEPS.length - 1 ? 32 : 0,
                      }}
                    >
                      <View
                        style={{
                          width: isCurrent ? 48 : 36,
                          height: isCurrent ? 48 : 36,
                          borderRadius: 24,
                          backgroundColor: bubbleColor,
                          borderWidth: isCurrent ? 3 : 0,
                          borderColor: isCurrent ? "#2563eb" : "transparent",
                          alignItems: "center",
                          justifyContent: "center",
                          marginBottom: 4,
                          shadowColor: isCurrent ? "#2563eb" : undefined,
                          shadowOpacity: isCurrent ? 0.2 : 0,
                          shadowRadius: isCurrent ? 6 : 0,
                          elevation: isCurrent ? 4 : 0,
                          zIndex: 2,
                        }}
                      >
                        {isCompleted && !hasError ? (
                          <Check color="#fff" size={22} />
                        ) : hasError ? (
                          <AlertTriangle color="#fff" size={22} />
                        ) : (
                          <Text
                            style={{
                              color: textColor,
                              fontWeight: "bold",
                              fontSize: isCurrent ? 20 : 16,
                            }}
                          >
                            {idx + 1}
                          </Text>
                        )}
                      </View>
                      {/* Step label */}
                      <Text
                        style={{
                          color: isCurrent
                            ? "#2563eb"
                            : hasError
                            ? "#dc2626"
                            : "#64748b",
                          fontWeight: isCurrent ? "bold" : "normal",
                          fontSize: 12,
                          maxWidth: 70,
                          textAlign: "center",
                          marginTop: 4,
                        }}
                        numberOfLines={2}
                      >
                        {step}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          </ScrollView>

          {/* Error summary for current step */}
          {getStepErrorMessages(errors, currentStep).length > 0 && (
            <View className="bg-red-50 border border-red-200 rounded-lg p-3 mb-2 flex-row items-center gap-2">
              <AlertTriangle
                size={18}
                color="#dc2626"
                style={{ marginRight: 6 }}
              />
              <View>
                {getStepErrorMessages(errors, currentStep).map((msg, i) => (
                  <Text key={i} className="text-red-700 text-sm font-semibold">
                    {msg}
                  </Text>
                ))}
              </View>
            </View>
          )}

          <View className="rounded-2xl border border-gray-200 bg-white p-4 shadow">
            {renderStepContent()}
          </View>
        </View>
      </KeyboardAwareScrollView>
      <View className="flex-row border-t border-gray-200 p-4 gap-4 justify-between bg-white">
        <TouchableOpacity
          className={`flex-1 h-12 rounded-lg justify-center items-center ${
            currentStep === 0 ? "bg-gray-100" : "bg-blue-50"
          }`}
          disabled={currentStep === 0}
          onPress={() => setCurrentStep((prev) => prev - 1)}
          activeOpacity={currentStep === 0 ? 1 : 0.85}
        >
          <View className="flex-row items-center gap-2">
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
          </View>
        </TouchableOpacity>
        {currentStep === STEPS.length - 1 ? (
          <TouchableOpacity
            className="flex-1 h-12 rounded-lg bg-blue-600 justify-center items-center ml-2"
            onPress={handleSubmit(onSubmit, onError)}
            disabled={isSubmitting}
            activeOpacity={isSubmitting ? 1 : 0.85}
          >
            <View className="flex-row items-center gap-2">
              {isSubmitting ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text className="font-bold text-white">Create Property</Text>
              )}
            </View>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            className="flex-1 h-12 rounded-lg bg-blue-600 justify-center items-center ml-2"
            onPress={() => setCurrentStep((prev) => prev + 1)}
            activeOpacity={0.85}
          >
            <View className="flex-row items-center gap-2">
              <Text className="font-bold text-white">Next</Text>
              <ChevronRight size={20} color="#fff" />
            </View>
          </TouchableOpacity>
        )}
      </View>
    </>
  );
}
