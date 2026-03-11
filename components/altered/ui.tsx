import type { PropsWithChildren } from 'react';
import { Pressable, Text, View } from 'react-native';

import { AdaptiveGlass } from '@/components/altered/adaptive-glass';
import { monoFont } from '@/features/theme/palette';
import { useAppTheme } from '@/features/theme/provider';

export function Surface({ children }: PropsWithChildren) {
  const { palette } = useAppTheme();

  return (
    <View
      style={{
        borderRadius: 18,
        borderCurve: 'continuous',
        overflow: 'hidden',
        backgroundColor: palette.panelMuted,
        borderWidth: 1,
        borderColor: palette.border,
        boxShadow: palette.shadow,
      }}
    >
      {children}
    </View>
  );
}

export function GlassSurface({ children }: PropsWithChildren) {
  const { palette } = useAppTheme();

  return (
    <AdaptiveGlass
      style={{
        borderRadius: 18,
        borderCurve: 'continuous',
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: palette.border,
        backgroundColor: palette.glass,
      }}
    >
      {children}
    </AdaptiveGlass>
  );
}

export function SectionLabel({ children }: PropsWithChildren) {
  const { palette } = useAppTheme();

  return (
    <Text
      selectable
      style={{
        color: palette.textSoft,
        fontSize: 12,
        letterSpacing: 1.4,
        textTransform: 'uppercase',
        fontFamily: monoFont,
      }}
    >
      {children}
    </Text>
  );
}

export function DataText({ children }: PropsWithChildren) {
  const { palette } = useAppTheme();

  return (
    <Text
      selectable
      style={{
        color: palette.text,
        fontSize: 12,
        fontFamily: monoFont,
      }}
    >
      {children}
    </Text>
  );
}

type CapsuleProps = {
  label: string;
  selected?: boolean;
  onPress?: () => void;
};

export function Capsule({ label, onPress, selected = false }: CapsuleProps) {
  const { palette } = useAppTheme();

  return (
    <Pressable
      onPress={onPress}
      style={{
        paddingHorizontal: 10,
        paddingVertical: 7,
        borderRadius: 999,
        borderCurve: 'continuous',
        borderWidth: 1,
        borderColor: selected ? palette.borderStrong : palette.border,
        backgroundColor: selected ? palette.accentSoft : 'transparent',
      }}
    >
      <Text
        selectable
        style={{
          color: palette.text,
          fontSize: 11,
          textTransform: 'uppercase',
          letterSpacing: 0.8,
          fontFamily: monoFont,
        }}
      >
        {label}
      </Text>
    </Pressable>
  );
}

type MetricProps = {
  label: string;
  value: string;
};

export function Metric({ label, value }: MetricProps) {
  const { palette } = useAppTheme();

  return (
    <View style={{ gap: 4 }}>
      <Text selectable style={{ color: palette.textSoft, fontSize: 11, fontFamily: monoFont, textTransform: 'uppercase' }}>
        {label}
      </Text>
      <Text selectable style={{ color: palette.text, fontSize: 16, fontFamily: monoFont, fontVariant: ['tabular-nums'] }}>
        {value}
      </Text>
    </View>
  );
}
