import React from "react";
import { YStack, Button, Sheet, Text, XStack } from "tamagui";
import { Plus, Upload, Calendar, FileText } from "@tamagui/lucide-icons";
import { useRouter } from "expo-router";

export function QuickActions() {
  const router = useRouter();
  const [showActions, setShowActions] = React.useState(false);

  const actions = [
    {
      icon: Plus,
      label: "Add New Property",
      onPress: () => {
        setShowActions(false);
        router.push("/(app)/properties/new" as any);
      },
    },
    {
      icon: Upload,
      label: "Upload Document",
      onPress: () => {
        setShowActions(false);
        router.push("/(app)/documents/upload" as any);
      },
    },
    {
      icon: Calendar,
      label: "Add Task / Reminder",
      onPress: () => {
        setShowActions(false);
        router.push("/(app)/tasks/new" as any);
      },
    },
  ];

  return (
    <>
      <Button
        size="$6"
        circular
        icon={Plus}
        onPress={() => setShowActions(true)}
        pos="absolute"
        b="$4"
        r="$4"
        elevation={10}
      />

      <Sheet
        modal
        open={showActions}
        onOpenChange={setShowActions}
        snapPointsMode="fit"
        position={0}
        dismissOnSnapToBottom
        zIndex={100_000}
      >
        <Sheet.Overlay bg="$shadow6" />
        <Sheet.Handle />
        <Sheet.Frame>
          <YStack p="$4" gap="$3">
            <Text fow="bold" fos="$5">
              Quick Actions
            </Text>
            {actions.map((action, index) => (
              <Button
                key={index}
                size="$4"
                icon={action.icon}
                onPress={action.onPress}
              >
                {action.label}
              </Button>
            ))}
          </YStack>
        </Sheet.Frame>
      </Sheet>
    </>
  );
}
