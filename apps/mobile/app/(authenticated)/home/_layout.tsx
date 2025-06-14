import React from "react";
import { Tabs } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";

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
      <Tabs.Screen
        name="index"
        options={({ navigation }) => ({
          title: "Home",
          tabBarLabel: "Home",
          headerLeft: () => <DrawerButton navigation={navigation} />,
        })}
      />
      <Tabs.Screen
        name="profile"
        options={({ navigation }) => ({
          title: "Profile",
          tabBarLabel: "Profile",
          headerLeft: () => <DrawerButton navigation={navigation} />,
        })}
      />
      <Tabs.Screen
        name="settings"
        options={({ navigation }) => ({
          title: "Settings",
          tabBarLabel: "Settings",
          headerLeft: () => <DrawerButton navigation={navigation} />,
        })}
      />
    </Tabs>
  );
}
