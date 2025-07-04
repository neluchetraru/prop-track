import { View, Text } from "react-native";
import React from "react";

const FormError = ({ error }: { error: string }) => {
  return (
    <View>
      <Text className="text-xs text-red-600 mt-1">{error}</Text>
    </View>
  );
};

export default FormError;
