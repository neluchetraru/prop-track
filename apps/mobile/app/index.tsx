import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { authClient } from "@/lib/auth-client";

export default function Index() {
  const { data: session } = authClient.useSession();

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Welcome {session?.user.email}!</Text>
      <Button title="Sign Out" onPress={() => authClient.signOut()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  text: {
    fontSize: 18,
    marginBottom: 20,
  },
});
