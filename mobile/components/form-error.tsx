import React from "react";
import { Text } from "react-native";

const FormError = ({ error }: { error: string }) => {
  return (
    <Text className="text-red-500 text-xs mt-1">
      {error}
    </Text>
  );
};

export default FormError;