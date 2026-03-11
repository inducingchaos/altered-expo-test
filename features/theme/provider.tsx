import React from 'react';
import { DarkTheme, DefaultTheme, ThemeProvider as NavigationThemeProvider } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';

import { useAltered } from '@/features/altered/store';
import { getPalette, type AppPalette, type ThemeName } from '@/features/theme/palette';
import { useColorScheme } from '@/hooks/use-color-scheme';

type ThemeContextValue = {
  themeName: ThemeName;
  palette: AppPalette;
};

const ThemeContext = React.createContext<ThemeContextValue | null>(null);

export function AppThemeProvider({ children }: React.PropsWithChildren) {
  const systemScheme = useColorScheme();
  const { state } = useAltered();

  const themeName: ThemeName =
    state.appearanceMode === 'system' ? (systemScheme === 'dark' ? 'dark' : 'light') : state.appearanceMode;

  const palette = React.useMemo(() => getPalette(themeName), [themeName]);

  const navigationTheme = React.useMemo(
    () =>
      themeName === 'dark'
        ? {
            ...DarkTheme,
            colors: {
              ...DarkTheme.colors,
              background: palette.background,
              card: palette.background,
              text: palette.text,
              border: palette.border,
              primary: palette.accent,
            },
          }
        : {
            ...DefaultTheme,
            colors: {
              ...DefaultTheme.colors,
              background: palette.background,
              card: palette.background,
              text: palette.text,
              border: palette.border,
              primary: palette.accent,
            },
          },
    [palette, themeName]
  );

  return (
    <ThemeContext.Provider value={{ themeName, palette }}>
      <NavigationThemeProvider value={navigationTheme}>
        {children}
        <StatusBar style={themeName === 'dark' ? 'light' : 'dark'} />
      </NavigationThemeProvider>
    </ThemeContext.Provider>
  );
}

export function useAppTheme() {
  const context = React.useContext(ThemeContext);
  if (!context) {
    throw new Error('useAppTheme must be used inside AppThemeProvider.');
  }

  return context;
}
