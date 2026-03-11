import { requireNativeViewManager } from 'expo-modules-core';
import type { ViewProps } from 'react-native';

export type VariableBlurViewProps = ViewProps & {
  maxBlurRadius?: number;
  startOffset?: number;
  direction?: 'blurredTopClearBottom' | 'blurredBottomClearTop';
};

export default requireNativeViewManager<VariableBlurViewProps>('VariableBlur');
