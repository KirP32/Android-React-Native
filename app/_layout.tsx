import { DarkTheme, ThemeProvider } from "@react-navigation/native";
import { Slot, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
export default function RootLayout() {
  return (
    <ThemeProvider value={DarkTheme}>
      <Stack />
      <StatusBar style="light" />
    </ThemeProvider>
  );
}
