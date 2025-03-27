import React from "react";
import { XStack, YStack, Card, Text, H4 } from "tamagui";
import {
  Building2,
  DollarSign,
  Calendar,
  ClipboardCheck,
} from "@tamagui/lucide-icons";
import type { Property } from "@prop-track/database";

interface PropertyStatsProps {
  properties: Property[];
}

export function PropertyStats({ properties }: PropertyStatsProps) {
  const totalProperties = properties.length;
  const totalValue = properties.reduce((sum, p) => sum + (p.value || 0), 0);
  const upcomingPayments = properties.filter((p) => {
    const nextPayment = new Date(p.nextPaymentDate || "");
    return (
      nextPayment > new Date() &&
      nextPayment < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    );
  }).length;
  const pendingTasks = properties.filter(
    (p) => p.pendingTasks?.length > 0
  ).length;

  const stats = [
    {
      label: "Total Properties",
      value: totalProperties,
      icon: Building2,
      format: (v: number) => v.toString(),
    },
    {
      label: "Total Value",
      value: totalValue,
      icon: DollarSign,
      format: (v: number) => `$${(v / 1000000).toFixed(1)}M`,
    },
    {
      label: "Upcoming Payments",
      value: upcomingPayments,
      icon: Calendar,
      format: (v: number) => v.toString(),
    },
    {
      label: "Pending Tasks",
      value: pendingTasks,
      icon: ClipboardCheck,
      format: (v: number) => v.toString(),
    },
  ];

  return (
    <XStack gap="$2" fw="wrap" jc="space-between">
      {stats.map((stat, index) => (
        <Card key={index} size="$4" w="48%" pressStyle={{ scale: 0.98 }}>
          <Card.Header>
            <XStack gap="$3" ai="center">
              <YStack ai="center" jc="center" bg="$background">
                <stat.icon size={20} />
              </YStack>
              <YStack>
                <Text fos="$2">{stat.label}</Text>
                <H4>{stat.format(stat.value)}</H4>
              </YStack>
            </XStack>
          </Card.Header>
        </Card>
      ))}
    </XStack>
  );
}
