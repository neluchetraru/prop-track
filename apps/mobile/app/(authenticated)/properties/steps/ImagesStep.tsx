import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { Camera, X, Image as ImageIcon } from "lucide-react-native";
import { Label } from "@/components/ui/label";
import FormDescription from "@/components/FormDescription";
import FormError from "@/components/form-error";
import * as ImagePicker from "expo-image-picker";
import DraggableFlatList, {
  RenderItemParams,
} from "react-native-draggable-flatlist";

interface ImageFile {
  uri: string;
  name: string;
  type: string;
}

interface ImagesStepProps {
  images: ImageFile[];
  setImages: (imgs: ImageFile[]) => void;
  setValue: (field: string, value: any) => void;
  errors?: { images?: { message?: string } };
}

export default function ImagesStep({
  images,
  setImages,
  setValue,
  errors,
}: ImagesStepProps) {
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
      allowsMultipleSelection: true,
    });
    if (!result.canceled && result.assets) {
      const newImages = result.assets.map((asset) => ({
        uri: asset.uri,
        name: asset.fileName || `image-${Date.now()}.jpg`,
        type: asset.mimeType || "image/jpeg",
      }));
      setImages([...images, ...newImages]);
      setValue("images", [...images, ...newImages]);
    }
  };

  return (
    <View className="gap-4">
      <View>
        <Label className="text-blue-700 font-semibold mb-2">
          Property Images
        </Label>
        <FormDescription>
          Add high-quality images to showcase your property. The first image
          will be used as the cover. Drag and drop to reorder.
        </FormDescription>
        {errors?.images?.message && <FormError error={errors.images.message} />}
      </View>
      <TouchableOpacity
        className="flex-row items-center gap-2 px-4 h-12 rounded-lg bg-blue-600 justify-center mb-2 shadow-lg active:scale-95"
        onPress={pickImage}
        activeOpacity={0.85}
      >
        <Camera size={20} color="#fff" />
        <Text className="text-white font-bold">Add Images</Text>
        <View className="ml-2 px-2 py-0.5 rounded-full bg-white/20">
          <Text className="text-xs text-white font-semibold">
            {images.length}
          </Text>
        </View>
      </TouchableOpacity>
      {images.length === 0 ? (
        <View className="flex-col items-center justify-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-200">
          <ImageIcon size={40} color="#cbd5e1" />
          <Text className="text-gray-400 mt-2">No images added yet</Text>
        </View>
      ) : (
        <DraggableFlatList
          data={images}
          horizontal
          keyExtractor={(item, index) => item.uri + index}
          onDragEnd={({ data }) => {
            setImages(data);
            setValue("images", data);
          }}
          contentContainerStyle={{ flexDirection: "row", gap: 8 }}
          renderItem={({
            item,
            getIndex,
            drag,
          }: RenderItemParams<ImageFile>) => (
            <View className="relative size-36 rounded-xl border border-gray-200 bg-gray-100 mr-2 overflow-hidden shadow-sm shadow-gray-200">
              <TouchableOpacity
                className="flex-1"
                onLongPress={drag}
                activeOpacity={0.9}
              >
                <Image
                  source={{ uri: item.uri }}
                  className="size-36"
                  resizeMode="cover"
                />
              </TouchableOpacity>
              <TouchableOpacity
                className="absolute top-2 right-2 size-8 rounded-full bg-white justify-center items-center shadow"
                onPress={() => {
                  const newImages = images.filter((_, i) => i !== getIndex());
                  setImages(newImages);
                  setValue("images", newImages);
                }}
                activeOpacity={0.7}
              >
                <X size={15} color="#dc2626" />
              </TouchableOpacity>
              {getIndex() === 0 && (
                <View className="absolute bottom-2 left-2 bg-blue-600/90 px-2 py-0.5 rounded-full">
                  <Text className="text-xs text-white font-bold">Cover</Text>
                </View>
              )}
            </View>
          )}
        />
      )}
    </View>
  );
}
