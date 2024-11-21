import { Stack, useRouter } from "expo-router";
import { Button, Text, View, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";

export default function HomeScreen() {
  const router = useRouter();
  const [isNavigating, setIsNavigating] = useState(false);

  const handleNavigation = () => {
    if (!isNavigating) {
      setIsNavigating(true);
      router.push({
        pathname: "./secondPage",
        params: { id: '123' },
      });
      setTimeout(() => setIsNavigating(false), 1000);
    }
  };


  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Stack.Screen
        options={{
          title: 'Вход',
          headerTitleAlign: 'center',
          headerTitleStyle: { fontWeight: 'bold', color: '#fff' },
        }}
      />
      <Text style={styles.text}>Hello from reactasdasd!</Text>
      <Button
        title={'Press on me'}
        onPress={handleNavigation}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  text: {
    color: 'orange',
    fontSize: 26,
  },
});
