import { Stack, useRouter } from "expo-router";
import { Button, Text, View, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import Login from "@/components/Login";

export default function HomeScreen() {
  const router = useRouter();
  const [isNavigating, setIsNavigating] = useState(false);

  const handleNavigation = () => {
    if (!isNavigating) {
      setIsNavigating(true);
      router.push({
        pathname: "./secondPage",
        params: { id: "123" },
      });
      setTimeout(() => setIsNavigating(false), 1000);
    }
  };

  return (
    <SafeAreaView style={styles.safeView}>
      <Stack.Screen
        options={{
          title: "LegendCorporation",
          headerTitleAlign: "center",
          headerStyle: {
            backgroundColor: "#A0222A",
          },
          headerTitleStyle: { fontWeight: "bold", color: "#fff" },
        }}
      />
      <Login />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
