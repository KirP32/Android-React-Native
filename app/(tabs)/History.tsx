import { View, Text } from "react-native";
import React from "react";
import { Stack } from "expo-router";

export default function History() {
  return (
    <View>
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
      <Text>Profile</Text>
    </View>
  );
}
