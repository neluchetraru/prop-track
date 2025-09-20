import React from "react";
import { Tabs } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";

const tabItems = [
  {
    name: "index",
    label: "Home",
    icon: "home",
  },
  {
    name: "properties",
    label: "Properties",
    icon: "list",
  },
  {
    name: "profile",
    label: "Profile",
    icon: "user",
  },
  {
    name: "settings",
    label: "Settings",
    icon: "settings",
  },
];

function DrawerButton({ navigation }: { navigation: any }) {
  return (
    <TouchableOpacity
      style={{ marginLeft: 16 }}
      onPress={() => navigation.openDrawer()}
      activeOpacity={0.7}
    >
      <Feather name="menu" size={24} color="#222" />
    </TouchableOpacity>
  );
}

export default function TabsLayout() {
  return (
    <Tabs>
      {tabItems.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={({ navigation }) => ({
            title: tab.label,
            tabBarLabel: tab.label,
            tabBarIcon: ({ color, size }) => (
              <Feather name={tab.icon as any} size={size} color={color} />
            ),
            headerLeft: () => <DrawerButton navigation={navigation} />,
          })}
        />
      ))}
    </Tabs>
  );
}
