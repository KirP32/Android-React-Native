import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { Platform } from "react-native";
import * as NavigationBar from "expo-navigation-bar";
import React from "react";

export default function TabLayout() {
  useEffect(() => {
    NavigationBar.setBackgroundColorAsync("white");
  }, []);

  return (
    <>
      <StatusBar style="auto" />
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: "blue",
          tabBarInactiveTintColor: "gray",
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Главная",
            tabBarIcon: ({ color }) => (
              <FontAwesome size={24} name="home" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="History"
          options={{
            title: "История",
            tabBarIcon: ({ color }) => (
              <FontAwesome size={24} name="history" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="Settings"
          options={{
            title: "Настройки",
            tabBarIcon: ({ color }) => (
              <FontAwesome size={24} name="cog" color={color} />
            ),
          }}
        />
      </Tabs>
    </>
  );
}
