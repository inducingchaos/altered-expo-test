import type { PropsWithChildren } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';

import { BlurView } from 'expo-blur';
import { GlassView, isLiquidGlassAvailable } from 'expo-glass-effect';

type AdaptiveGlassProps = PropsWithChildren<{
  style?: StyleProp<ViewStyle>;
  interactive?: boolean;
}>;

export function AdaptiveGlass({ children, style, interactive = false }: AdaptiveGlassProps) {
  if (isLiquidGlassAvailable()) {
    return (
      <GlassView isInteractive={interactive} style={style}>
        {children}
      </GlassView>
    );
  }

  return (
    <BlurView tint="systemMaterial" intensity={95} style={style}>
      {children}
    </BlurView>
  );
}
