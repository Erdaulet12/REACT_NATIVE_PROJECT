import React from "react";
import { View } from "react-native";
import { Stack } from "expo-router";
import { Provider as PaperProvider } from "react-native-paper";
import { customDarkTheme } from "../theme";

export default function Layout() {
  return (
    <PaperProvider theme={customDarkTheme}>
      <View
        style={{ flex: 1, backgroundColor: customDarkTheme.colors.background }}
      >
        <Stack
          screenOptions={{
            headerStyle: { backgroundColor: customDarkTheme.colors.surface },
            headerTitleAlign: "center",
            headerTintColor: customDarkTheme.colors.text,
            headerTitleStyle: { fontWeight: "bold" },
            animation: "slide_from_right",
          }}
        >
          <Stack.Screen name="index" options={{ title: "Главная" }} />
          <Stack.Screen
            name="add-note"
            options={{ title: "Добавить заметку" }}
          />
          <Stack.Screen
            name="edit-note"
            options={{ title: "Редактировать заметку" }}
          />
        </Stack>
      </View>
    </PaperProvider>
  );
}
