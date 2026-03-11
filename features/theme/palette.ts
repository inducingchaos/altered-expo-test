import { DynamicColorIOS } from 'react-native';

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

export const monoFont = DynamicColorIOS
  ? 'Menlo'
  : 'monospace';

export const lightPalette: AppPalette = {
  name: 'light',
  background: 'rgb(242, 242, 239)',
  panel: 'rgba(255, 255, 255, 0.7)',
  panelMuted: 'rgba(250, 249, 245, 0.8)',
  glass: 'rgba(255, 255, 255, 0.45)',
  text: 'rgb(24, 24, 22)',
  textMuted: 'rgb(82, 81, 77)',
  textSoft: 'rgb(112, 110, 104)',
  border: 'rgba(35, 34, 31, 0.1)',
  borderStrong: 'rgba(35, 34, 31, 0.2)',
  accent: 'rgb(96, 87, 70)',
  accentSoft: 'rgba(96, 87, 70, 0.12)',
  success: 'rgb(36, 132, 92)',
  danger: 'rgb(176, 58, 58)',
  shadow: '0 14px 40px rgba(16, 14, 8, 0.07)',
  tabTint: 'rgb(32, 31, 27)',
  chrome: 'rgba(255, 255, 255, 0.55)',
};

export const darkPalette: AppPalette = {
  name: 'dark',
  background: 'rgb(8, 8, 7)',
  panel: 'rgba(22, 22, 20, 0.78)',
  panelMuted: 'rgba(16, 16, 15, 0.82)',
  glass: 'rgba(38, 37, 34, 0.46)',
  text: 'rgb(239, 236, 228)',
  textMuted: 'rgb(184, 179, 167)',
  textSoft: 'rgb(134, 130, 120)',
  border: 'rgba(255, 249, 240, 0.08)',
  borderStrong: 'rgba(255, 249, 240, 0.16)',
  accent: 'rgb(201, 189, 162)',
  accentSoft: 'rgba(201, 189, 162, 0.12)',
  success: 'rgb(100, 214, 156)',
  danger: 'rgb(255, 124, 124)',
  shadow: '0 18px 48px rgba(0, 0, 0, 0.35)',
  tabTint: 'rgb(245, 240, 232)',
  chrome: 'rgba(28, 27, 25, 0.66)',
};

export function getPalette(themeName: ThemeName) {
  return themeName === 'dark' ? darkPalette : lightPalette;
}
