import React from "react";
import { YStack, Card, Text, XStack, Button } from "tamagui";
import { Bell, Calendar, FileText, AlertTriangle } from "@tamagui/lucide-icons";

interface Alert {
  id: string;
  type: "lease" | "payment" | "task" | "document";
  title: string;
  description: string;
  dueDate: Date;
  propertyId: string;
}

interface AlertsPanelProps {
  alerts: Alert[];
  onAlertPress: (alert: Alert) => void;
}

export function AlertsPanel({ alerts, onAlertPress }: AlertsPanelProps) {
  const getAlertIcon = (type: Alert["type"]) => {
    switch (type) {
      case "lease":
        return FileText;
      case "payment":
        return Calendar;
      case "task":
        return AlertTriangle;
      case "document":
        return FileText;
      default:
        return Bell;
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  return (
    <Card bordered p="$4" bg="$background">
      <YStack gap="$4">
        <XStack ai="center" gap="$2">
          <Bell size={20} />
          <Text fow="bold" fos="$5">
            Alerts & Reminders
          </Text>
        </XStack>

        <YStack gap="$3">
          {alerts.map((alert) => {
            const Icon = getAlertIcon(alert.type);
            return (
              <Card
                key={alert.id}
                bordered
                pressStyle={{ scale: 0.98 }}
                onPress={() => onAlertPress(alert)}
              >
                <Card.Header padded>
                  <XStack gap="$3" ai="center">
                    <YStack
                      w="$4"
                      h="$4"
                      ai="center"
                      jc="center"
                      br="$4"
                      bg="$background"
                    >
                      <Icon size={16} />
                    </YStack>
                    <YStack f={1} gap="$1">
                      <Text fow="bold">{alert.title}</Text>
                      <Text fos="$2">{alert.description}</Text>
                    </YStack>
                    <Text fos="$2">{formatDate(alert.dueDate)}</Text>
                  </XStack>
                </Card.Header>
              </Card>
            );
          })}
        </YStack>
      </YStack>
    </Card>
  );
}
