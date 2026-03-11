import { Pressable, ScrollView, Text, View } from 'react-native';

import { Capsule, GlassSurface, Metric, SectionLabel, Surface } from '@/components/altered/ui';
import { SwipeTabScreen } from '@/components/altered/swipe-tab-screen';
import { useAltered } from '@/features/altered/store';
import type { AppearanceMode } from '@/features/altered/types';
import { useAppTheme } from '@/features/theme/provider';

const modes: AppearanceMode[] = ['system', 'light', 'dark'];

export default function MoreScreen() {
  const { palette } = useAppTheme();
  const { state, setAppearanceMode } = useAltered();

  return (
    <SwipeTabScreen index={4}>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={{ padding: 16, paddingBottom: 48, gap: 12 }}
        style={{ flex: 1, backgroundColor: palette.background }}
      >
        <GlassSurface>
          <View style={{ padding: 18, gap: 14 }}>
            <View style={{ gap: 6 }}>
              <SectionLabel>Preferences</SectionLabel>
              <Text selectable style={{ color: palette.text, fontSize: 28, fontWeight: '500', letterSpacing: -0.6 }}>
                Configure the shell without adding noise.
              </Text>
            </View>

            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 18 }}>
              <Metric label="Appearance" value={state.appearanceMode} />
              <Metric label="Thoughts" value={`${state.thoughts.length}`} />
              <Metric label="Validations" value={`${state.validations.length}`} />
            </View>
          </View>
        </GlassSurface>

        <Surface>
          <View style={{ padding: 16, gap: 12 }}>
            <SectionLabel>Dark Mode</SectionLabel>
            <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
              {modes.map((mode) => (
                <Capsule key={mode} label={mode} selected={state.appearanceMode === mode} onPress={() => setAppearanceMode(mode)} />
              ))}
            </View>
          </View>
        </Surface>

        <Surface>
          <View style={{ padding: 16, gap: 12 }}>
            <SectionLabel>Environment</SectionLabel>
            <PreferenceRow label="Liquid glass" value="Enabled where available" />
            <PreferenceRow label="Thought storage" value="Shared in-memory model" />
            <PreferenceRow label="Navigation" value="Native tabs plus horizontal swipe" />
          </View>
        </Surface>

        <Surface>
          <View style={{ padding: 16, gap: 12 }}>
            <SectionLabel>Future Preferences</SectionLabel>
            <PreferenceRow label="Account" value="Not connected yet" />
            <PreferenceRow label="Sync" value="Pending networking layer" />
            <PreferenceRow label="Exports" value="Structured systems only" />
            <Pressable
              onPress={() => setAppearanceMode('system')}
              style={{
                paddingVertical: 12,
                borderRadius: 14,
                borderCurve: 'continuous',
                borderWidth: 1,
                borderColor: palette.border,
                alignItems: 'center',
                backgroundColor: palette.accentSoft,
              }}
            >
              <Text selectable style={{ color: palette.text, fontSize: 14 }}>Reset to system appearance</Text>
            </Pressable>
          </View>
        </Surface>
      </ScrollView>
    </SwipeTabScreen>
  );
}

function PreferenceRow({ label, value }: { label: string; value: string }) {
  const { palette } = useAppTheme();

  return (
    <View
      style={{
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderColor: palette.border,
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 12,
      }}
    >
      <Text selectable style={{ color: palette.text, fontSize: 15, flex: 1 }}>
        {label}
      </Text>
      <Text selectable style={{ color: palette.textSoft, fontSize: 13 }}>
        {value}
      </Text>
    </View>
  );
}
