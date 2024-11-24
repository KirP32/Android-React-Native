import { Stack } from "expo-router";
import { View, Text, StyleSheet } from "react-native";

export default function Tab() {
  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerTitleStyle: {
            fontWeight: "bold",
            fontSize: 20,
            color: "black",
          },
          headerTitleAlign: "center",
        }}
      />
      <Text>Главная вкладка</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
