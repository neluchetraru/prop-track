import { cn } from "@/lib/utils";
import React from "react";
import { Text } from "react-native";

export default function FormDescription({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Text className={cn("text-xs text-gray-400 mt-1", className)}>
      {children}
    </Text>
  );
}
