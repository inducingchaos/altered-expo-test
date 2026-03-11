import { Platform } from 'react-native';

export type ThemeName = 'light' | 'dark';

export type AppPalette = {
  name: ThemeName;
  background: string;
  panel: string;
  panelMuted: string;
  glass: string;
  text: string;
  textMuted: string;
  textSoft: string;
  border: string;
  borderStrong: string;
  accent: string;
  accentSoft: string;
  success: string;
  danger: string;
  shadow: string;
  tabTint: string;
  chrome: string;
};

export const monoFont = Platform.select({
  ios: 'Menlo',
  default: 'monospace',
}) as string;

export const lightPalette: AppPalette = {
  name: 'light',
  background: 'rgb(246, 245, 241)',
  panel: 'rgba(255, 255, 255, 0.82)',
  panelMuted: 'rgba(250, 249, 245, 0.88)',
  glass: 'rgba(255, 255, 255, 0.48)',
  text: 'rgb(18, 18, 16)',
  textMuted: 'rgb(86, 84, 76)',
  textSoft: 'rgb(136, 132, 122)',
  border: 'rgba(28, 27, 22, 0.07)',
  borderStrong: 'rgba(28, 27, 22, 0.14)',
  accent: 'rgb(90, 82, 62)',
  accentSoft: 'rgba(90, 82, 62, 0.06)',
  success: 'rgb(38, 122, 80)',
  danger: 'rgb(168, 54, 50)',
  shadow: '0 4px 20px rgba(10, 8, 4, 0.03)',
  tabTint: 'rgb(26, 25, 22)',
  chrome: 'rgba(255, 255, 255, 0.55)',
};

export const darkPalette: AppPalette = {
  name: 'dark',
  background: 'rgb(10, 10, 9)',
  panel: 'rgba(20, 20, 18, 0.8)',
  panelMuted: 'rgba(16, 16, 15, 0.84)',
  glass: 'rgba(30, 30, 27, 0.48)',
  text: 'rgb(230, 226, 216)',
  textMuted: 'rgb(152, 148, 136)',
  textSoft: 'rgb(102, 99, 90)',
  border: 'rgba(255, 248, 232, 0.06)',
  borderStrong: 'rgba(255, 248, 232, 0.12)',
  accent: 'rgb(190, 178, 150)',
  accentSoft: 'rgba(190, 178, 150, 0.07)',
  success: 'rgb(84, 192, 132)',
  danger: 'rgb(232, 104, 104)',
  shadow: '0 8px 32px rgba(0, 0, 0, 0.24)',
  tabTint: 'rgb(230, 224, 212)',
  chrome: 'rgba(22, 22, 20, 0.65)',
};

export function getPalette(themeName: ThemeName) {
  return themeName === 'dark' ? darkPalette : lightPalette;
}
