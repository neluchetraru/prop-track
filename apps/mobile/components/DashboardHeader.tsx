import { authClient } from "@/lib/auth-client";
import {
  Bell,
  Home,
  LogOut,
  MapPin,
  Moon,
  Settings,
  Sun,
  User,
} from "@tamagui/lucide-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Avatar, Button, Card, Sheet, Text, XStack, YStack } from "tamagui";

export function DashboardHeader() {
  const router = useRouter();
  const [showProfileMenu, setShowProfileMenu] = React.useState(false);

  const handleSignOut = async () => {
    await authClient.signOut();
    router.replace("/login");
  };

  return (
    <XStack ai="center" jc="space-between" p="$4">
      <XStack ai="center" gap="$2">
        <XStack ai="center" gap="$1">
          <Home size={24} col="$color" />
          <Text fos="$9" fow="bold" ml="$3">
            PropTrack
          </Text>
        </XStack>
      </XStack>

      <XStack ai="center" gap="$2">
        <Button
          size="$3"
          circular
          icon={Bell}
          onPress={() => {
            /* TODO: Implement notifications */
          }}
        />

        <Button
          size="$3"
          circular
          icon={User}
          onPress={() => setShowProfileMenu(true)}
        />
      </XStack>

      <Sheet
        modal
        open={showProfileMenu}
        onOpenChange={setShowProfileMenu}
        snapPointsMode="fit"
        position={0}
        animation="medium"
        dismissOnSnapToBottom
      >
        <Sheet.Overlay bg="$shadow6" />
        <Sheet.Handle />
        <Sheet.Frame>
          <YStack p="$4" gap="$4">
            <XStack ai="center" gap="$3" mb="$2">
              <Avatar circular size="$6" />
              <YStack>
                <Text fow="bold" fos="$5">
                  John Doe
                </Text>
                <Text fos="$3">john@example.com</Text>
              </YStack>
            </XStack>
            <YStack gap="$2">
              <Button
                size="$4"
                icon={Settings}
                onPress={() => {
                  setShowProfileMenu(false);
                  router.push("/settings" as any);
                }}
              >
                Settings
              </Button>
              <Button
                size="$4"
                icon={User}
                onPress={() => {
                  setShowProfileMenu(false);
                  router.push("/account" as any);
                }}
              >
                Account
              </Button>
              <Button
                size="$4"
                icon={LogOut}
                theme="error"
                onPress={handleSignOut}
              >
                Sign Out
              </Button>
            </YStack>
          </YStack>
        </Sheet.Frame>
      </Sheet>
    </XStack>
  );
}
