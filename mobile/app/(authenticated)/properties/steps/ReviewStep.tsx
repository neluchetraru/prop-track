import React from "react";
import { View, Text } from "react-native";
import { Label } from "../../../../components/ui/label";
import FormDescription from "../../../../components/FormDescription";
import { Image as ImageIcon, FileText, Users, Home } from "lucide-react-native";

interface ReviewStepProps {
  watch: any;
  images: Array<{ uri: string; name: string; type: string }>;
  documents: Array<{ uri: string; name: string; type: string }>;
  tenants: Array<{
    name: string;
    email: string;
    phone?: string;
    leaseStartDate?: string;
    leaseEndDate?: string;
    monthlyRent?: number;
  }>;
}

export default function ReviewStep({ watch, images, documents, tenants }: ReviewStepProps) {
  const propertyLocation = watch("propertyLocation");
  return (
    <View className="gap-6">
      {/* Basic Info */}
      <View>
        <Label className="text-blue-700 font-semibold mb-2">
          Basic Information
        </Label>
        <FormDescription>
          Review the main details of your property.
        </FormDescription>
        <View className="rounded-xl border border-gray-200 bg-gray-50 p-4 mt-2">
          <Text className="font-bold mb-1">
            {watch("name") || (
              <Text className="text-gray-400">No name set</Text>
            )}
          </Text>
          <Text className="capitalize mb-1">
            {watch("type") || (
              <Text className="text-gray-400">No type set</Text>
            )}
          </Text>
          {watch("value") ? (
            <Text className="mb-1">Value: ${watch("value")}</Text>
          ) : (
            <Text className="text-gray-400 mb-1">No value set</Text>
          )}
          {watch("notes") ? (
            <Text className="mb-1">Notes: {watch("notes")}</Text>
          ) : (
            <Text className="text-gray-400 mb-1">No notes</Text>
          )}
        </View>
      </View>

      {/* Location */}
      <View>
        <Label className="text-blue-700 font-semibold mb-2">Location</Label>
        <FormDescription>Where is your property located?</FormDescription>
        <View className="rounded-xl border border-gray-200 bg-gray-50 p-4 mt-2">
          {propertyLocation?.address ? (
            <>
              <Text>{propertyLocation.address}</Text>
              <Text>
                {propertyLocation.city}, {propertyLocation.country}{" "}
                {propertyLocation.postalCode}
              </Text>
            </>
          ) : (
            <View className="flex-col items-center justify-center py-4">
              <Home size={32} color="#cbd5e1" />
              <Text className="text-gray-400 mt-2">No location set</Text>
            </View>
          )}
        </View>
      </View>

      {/* Images */}
      <View>
        <Label className="text-blue-700 font-semibold mb-2">Images</Label>
        <FormDescription>Photos to showcase your property.</FormDescription>
        <View className="rounded-xl border border-gray-200 bg-gray-50 p-4 mt-2">
          {images.length === 0 ? (
            <View className="flex-col items-center justify-center py-4">
              <ImageIcon size={32} color="#cbd5e1" />
              <Text className="text-gray-400 mt-2">No images added</Text>
            </View>
          ) : (
            <Text>
              {images.length} image{images.length > 1 ? "s" : ""} added
            </Text>
          )}
        </View>
      </View>

      {/* Documents */}
      <View>
        <Label className="text-blue-700 font-semibold mb-2">Documents</Label>
        <FormDescription>Important files for your property.</FormDescription>
        <View className="rounded-xl border border-gray-200 bg-gray-50 p-4 mt-2">
          {documents.length === 0 ? (
            <View className="flex-col items-center justify-center py-4">
              <FileText size={32} color="#cbd5e1" />
              <Text className="text-gray-400 mt-2">No documents added</Text>
            </View>
          ) : (
            <Text>
              {documents.length} document{documents.length > 1 ? "s" : ""} added
            </Text>
          )}
        </View>
      </View>

      {/* Tenants */}
      <View>
        <Label className="text-blue-700 font-semibold mb-2">Tenants</Label>
        <FormDescription>People renting this property.</FormDescription>
        <View className="rounded-xl border border-gray-200 bg-gray-50 p-4 mt-2">
          {tenants.length === 0 ? (
            <View className="flex-col items-center justify-center py-4">
              <Users size={32} color="#cbd5e1" />
              <Text className="text-gray-400 mt-2">No tenants added</Text>
            </View>
          ) : (
            <Text>
              {tenants.length} tenant{tenants.length > 1 ? "s" : ""} added
            </Text>
          )}
        </View>
      </View>
    </View>
  );
}
