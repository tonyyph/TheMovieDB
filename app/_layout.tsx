import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";

import { WatchlistProvider } from "@/contexts/WatchlistContext";
import { useColorScheme } from "@/hooks/use-color-scheme";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  anchor: "(tabs)"
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  const [loaded] = useFonts({
    "SourceSansPro-Regular": require("../assets/fonts/SourceSansPro-Regular.ttf"),
    "SourceSansPro-Bold": require("../assets/fonts/SourceSansPro-Bold.ttf"),
    "SourceSansPro-Semibold": require("../assets/fonts/SourceSansPro-Semibold.ttf"),
    "SourceSansPro-Light": require("../assets/fonts/SourceSansPro-Light.ttf"),
    "SourceSansPro-Black": require("../assets/fonts/SourceSansPro-Black.ttf"),
    "SourceSansPro-ExtraLight": require("../assets/fonts/SourceSansPro-ExtraLight.ttf"),
    "SourceSansPro-Italic": require("../assets/fonts/SourceSansPro-Italic.ttf"),
    "SourceSansPro-BoldItalic": require("../assets/fonts/SourceSansPro-BoldItalic.ttf"),
    "SourceSansPro-SemiboldItalic": require("../assets/fonts/SourceSansPro-SemiboldItalic.ttf"),
    "SourceSansPro-LightItalic": require("../assets/fonts/SourceSansPro-LightItalic.ttf"),
    "SourceSansPro-BlackItalic": require("../assets/fonts/SourceSansPro-BlackItalic.ttf"),
    "SourceSansPro-ExtraLightItalic": require("../assets/fonts/SourceSansPro-ExtraLightItalic.ttf")
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <WatchlistProvider>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="movie/[id]"
            options={{
              headerShown: false,
              presentation: "card",
              animation: "slide_from_right"
            }}
          />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </WatchlistProvider>
  );
}
