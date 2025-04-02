import merge from "deepmerge";
import { DarkTheme as NavigationDarkTheme } from "@react-navigation/native";
import { MD3DarkTheme as PaperDarkTheme } from "react-native-paper";

export const CombinedDarkTheme = merge(PaperDarkTheme, NavigationDarkTheme);

export const customDarkTheme = {
  ...CombinedDarkTheme,
  colors: {
    ...CombinedDarkTheme.colors,
    primary: "#bb86fc",
    accent: "#03dac6",
    background: "#121212",
    surface: "#1e1e1e",
    text: "#ffffff",
    placeholder: "#aaaaaa",
  },
};
