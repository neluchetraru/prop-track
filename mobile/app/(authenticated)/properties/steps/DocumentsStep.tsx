import * as DocumentPicker from "expo-document-picker";
import { FileText, Upload, X } from "lucide-react-native";
import React from "react";
import { Text, TouchableOpacity, View, Modal } from "react-native";
import { Label } from "../../../../components/ui/label";
import FormDescription from "../../../../components/FormDescription";

const DOCUMENT_TYPES = [
  "PERSONAL",
  "PROPERTY_REGISTRATION",
  "PROPERTY_UTILITY",
  "OTHER",
];

const DOCUMENT_TYPE_LABELS = {
  PERSONAL: "Personal",
  PROPERTY_REGISTRATION: "Property Registration",
  PROPERTY_UTILITY: "Property Utility",
  OTHER: "Other",
};
export default function DocumentsStep({
  documents,
  setDocuments,
  setValue,
}: {
  documents: any[];
  setDocuments: (docs: any[]) => void;
  setValue: (field: string, value: any) => void;
}) {
  const [pendingDoc, setPendingDoc] = React.useState<any>(null);
  const [showTypePicker, setShowTypePicker] = React.useState(false);

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
          type: doc.mimeType || "OTHER",
        };
        setPendingDoc(newDoc);
        setShowTypePicker(true);
      }
    } catch (err) {
      console.error("Error picking document:", err);
    }
  };

  const handleTypeSelect = (type: string) => {
    const docWithType = { ...pendingDoc, type: type };
    setDocuments([...documents, docWithType]);
    setValue("documents", [...documents, docWithType]);
    setShowTypePicker(false);
    setPendingDoc(null);
  };

  return (
    <View className="gap-4">
      <View>
        <Label className="text-blue-700 font-semibold mb-2">
          Property Documents
        </Label>
        <FormDescription>
          Upload important documents for your property (e.g. lease, deed,
          inspection report). Supported formats: PDF, DOC, DOCX.
        </FormDescription>
      </View>
      <TouchableOpacity
        className="flex-row items-center gap-2 px-4 h-12 rounded-lg bg-blue-600 justify-center mb-2 shadow-lg active:scale-95"
        onPress={pickDocument}
        activeOpacity={0.85}
      >
        <Upload size={20} color="#fff" />
        <Text className="text-white font-bold">Add Documents</Text>
        <View className="ml-2 px-2 py-0.5 rounded-full bg-white/20">
          <Text className="text-xs text-white font-semibold">
            {documents.length}
          </Text>
        </View>
      </TouchableOpacity>
      {documents.length === 0 ? (
        <View className="flex-col items-center justify-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-200">
          <FileText size={40} color="#cbd5e1" />
          <Text className="text-gray-400 mt-2">No documents added yet</Text>
        </View>
      ) : (
        <View className="flex flex-col gap-2">
          {documents.map((doc, index) => (
            <View
              key={index}
              className="flex-row items-center rounded-xl border border-gray-200 bg-gray-50 p-4 mb-2 shadow-sm shadow-gray-200"
            >
              <FileText size={20} color="#2563eb" className="mr-2" />
              {/* Document type badge */}
              {doc.type && (
                <View className="px-2 py-0.5 rounded-full bg-blue-50 border border-blue-200 mr-2">
                  <Text className="text-xs text-blue-700 font-semibold">
                    {DOCUMENT_TYPE_LABELS[
                      doc.type as keyof typeof DOCUMENT_TYPE_LABELS
                    ] || doc.type}
                  </Text>
                </View>
              )}
              <Text className="flex-1 mr-2" numberOfLines={1}>
                {doc.name}
              </Text>
              <TouchableOpacity
                className="size-8 rounded-full bg-white justify-center items-center shadow ml-2"
                onPress={() => {
                  const newDocs = documents.filter((_, i) => i !== index);
                  setDocuments(newDocs);
                  setValue("documents", newDocs);
                }}
                activeOpacity={0.7}
              >
                <X size={15} color="#dc2626" />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}
      {/* Document type picker modal */}
      <Modal visible={showTypePicker} transparent animationType="fade">
        <View className="flex-1 justify-center items-center bg-black/40">
          <View className="bg-white rounded-xl p-6 w-80">
            <Text className="text-lg font-bold mb-4">Select Document Type</Text>
            {DOCUMENT_TYPES.map((type) => (
              <TouchableOpacity
                key={type}
                className="py-3 px-4 rounded-lg mb-2 bg-blue-50"
                onPress={() => handleTypeSelect(type)}
              >
                <Text className="text-blue-700 font-semibold">
                  {DOCUMENT_TYPE_LABELS[
                    type as keyof typeof DOCUMENT_TYPE_LABELS
                  ] || type}
                </Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              className="mt-2 py-2"
              onPress={() => {
                setShowTypePicker(false);
                setPendingDoc(null);
              }}
            >
              <Text className="text-gray-500 text-center">Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
