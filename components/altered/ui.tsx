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
        borderRadius: 6,
        borderCurve: 'continuous',
        overflow: 'hidden',
        backgroundColor: palette.panelMuted,
        borderWidth: 1,
        borderColor: palette.border,
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
        borderRadius: 6,
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
        fontSize: 10,
        letterSpacing: 1.6,
        textTransform: 'uppercase',
        fontFamily: monoFont,
      }}
    >
      {children}
    </Text>
  );
}

export function DataText({ children, size = 11 }: PropsWithChildren<{ size?: number }>) {
  const { palette } = useAppTheme();

  return (
    <Text
      selectable
      style={{
        color: palette.text,
        fontSize: size,
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
        paddingHorizontal: 8,
        paddingVertical: 5,
        borderRadius: 3,
        borderCurve: 'continuous',
        borderWidth: 1,
        borderColor: selected ? palette.borderStrong : palette.border,
        backgroundColor: selected ? palette.accentSoft : 'transparent',
      }}
    >
      <Text
        selectable
        style={{
          color: selected ? palette.text : palette.textMuted,
          fontSize: 10,
          textTransform: 'uppercase',
          letterSpacing: 0.6,
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
    <View style={{ gap: 2 }}>
      <Text selectable style={{ color: palette.textSoft, fontSize: 10, fontFamily: monoFont, textTransform: 'uppercase', letterSpacing: 0.4 }}>
        {label}
      </Text>
      <Text selectable style={{ color: palette.text, fontSize: 14, fontFamily: monoFont, fontVariant: ['tabular-nums'] }}>
        {value}
      </Text>
    </View>
  );
}

export function Separator() {
  const { palette } = useAppTheme();

  return <View style={{ height: 1, backgroundColor: palette.border }} />;
}

type RowProps = {
  title: string;
  subtitle?: string;
  trailing?: string;
  trailingMuted?: string;
  badge?: string;
  onPress?: () => void;
  onLongPress?: () => void;
  compact?: boolean;
};

export function Row({ title, subtitle, trailing, trailingMuted, badge, onPress, onLongPress, compact = false }: RowProps) {
  const { palette } = useAppTheme();

  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      style={({ pressed }) => ({
        paddingHorizontal: 12,
        paddingVertical: compact ? 8 : 10,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        opacity: pressed ? 0.7 : 1,
        borderBottomWidth: 1,
        borderColor: palette.border,
      })}
    >
      <View style={{ flex: 1, gap: 2 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <Text selectable numberOfLines={1} style={{ color: palette.text, fontSize: 14, fontWeight: '500', flexShrink: 1 }}>
            {title}
          </Text>
          {badge ? (
            <Text style={{ color: palette.accent, fontSize: 9, fontFamily: monoFont, letterSpacing: 0.4, textTransform: 'uppercase' }}>
              {badge}
            </Text>
          ) : null}
        </View>
        {subtitle ? (
          <Text selectable numberOfLines={1} style={{ color: palette.textMuted, fontSize: 12 }}>
            {subtitle}
          </Text>
        ) : null}
      </View>

      <View style={{ alignItems: 'flex-end', gap: 2, flexShrink: 0 }}>
        {trailing ? (
          <Text style={{ color: palette.textSoft, fontSize: 10, fontFamily: monoFont }}>
            {trailing}
          </Text>
        ) : null}
        {trailingMuted ? (
          <Text style={{ color: palette.textSoft, fontSize: 10, fontFamily: monoFont }}>
            {trailingMuted}
          </Text>
        ) : null}
      </View>
    </Pressable>
  );
}

type ActionRowProps = {
  label: string;
  detail?: string;
  onPress?: () => void;
  destructive?: boolean;
};

export function ActionRow({ label, detail, onPress, destructive = false }: ActionRowProps) {
  const { palette } = useAppTheme();

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderRadius: 4,
        borderCurve: 'continuous',
        backgroundColor: pressed ? palette.accentSoft : palette.chrome,
        borderWidth: 1,
        borderColor: palette.border,
      })}
    >
      <Text selectable style={{ color: destructive ? palette.danger : palette.text, fontSize: 13, fontFamily: monoFont }}>
        {label}
      </Text>
      {detail ? (
        <Text selectable style={{ color: palette.textSoft, fontSize: 11, marginTop: 2 }}>
          {detail}
        </Text>
      ) : null}
    </Pressable>
  );
}
