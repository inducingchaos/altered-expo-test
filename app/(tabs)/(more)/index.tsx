import { Pressable, ScrollView, Text, View } from 'react-native';

import * as Haptics from 'expo-haptics';

import { Capsule, Metric, SectionLabel, Separator, Surface } from '@/components/altered/ui';
import { SwipeTabScreen } from '@/components/altered/swipe-tab-screen';
import { useAltered } from '@/features/altered/store';
import type { AppearanceMode } from '@/features/altered/types';
import { monoFont } from '@/features/theme/palette';
import { useAppTheme } from '@/features/theme/provider';

const modes: AppearanceMode[] = ['system', 'light', 'dark'];

export default function MoreScreen() {
  const { palette } = useAppTheme();
  const { state, setAppearanceMode } = useAltered();

  return (
    <SwipeTabScreen index={4}>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={{ padding: 12, paddingBottom: 40, gap: 10 }}
        style={{ flex: 1, backgroundColor: palette.background }}
      >
        <View style={{ flexDirection: 'row', gap: 16, paddingVertical: 4, paddingHorizontal: 4 }}>
          <Metric label="Appearance" value={state.appearanceMode} />
          <Metric label="Thoughts" value={`${state.thoughts.length}`} />
          <Metric label="Validations" value={`${state.validations.length}`} />
        </View>

        <Surface>
          <View style={{ paddingHorizontal: 12, paddingTop: 10, paddingBottom: 6 }}>
            <SectionLabel>Appearance</SectionLabel>
          </View>
          <View style={{ paddingHorizontal: 12, paddingBottom: 10 }}>
            <View style={{ flexDirection: 'row', gap: 6 }}>
              {modes.map((mode) => (
                <Capsule
                  key={mode}
                  label={mode}
                  selected={state.appearanceMode === mode}
                  onPress={() => {
                    setAppearanceMode(mode);
                    void Haptics.selectionAsync();
                  }}
                />
              ))}
            </View>
          </View>
        </Surface>

        <Surface>
          <View style={{ paddingHorizontal: 12, paddingTop: 10, paddingBottom: 6 }}>
            <SectionLabel>Environment</SectionLabel>
          </View>
          <PreferenceRow label="Liquid glass" value="Enabled where available" />
          <Separator />
          <PreferenceRow label="Thought storage" value="Shared in-memory model" />
          <Separator />
          <PreferenceRow label="Navigation" value="Native tabs + swipe" />
        </Surface>

        <Surface>
          <View style={{ paddingHorizontal: 12, paddingTop: 10, paddingBottom: 6 }}>
            <SectionLabel>Account</SectionLabel>
          </View>
          <PreferenceRow label="Status" value="Not connected" />
          <Separator />
          <PreferenceRow label="Sync" value="Pending networking layer" />
          <Separator />
          <PreferenceRow label="Exports" value="Structured systems only" />
          <View style={{ padding: 10 }}>
            <Pressable
              onPress={() => {
                setAppearanceMode('system');
                void Haptics.selectionAsync();
              }}
              style={({ pressed }) => ({
                paddingVertical: 9,
                borderRadius: 4,
                borderCurve: 'continuous',
                borderWidth: 1,
                borderColor: palette.border,
                alignItems: 'center',
                opacity: pressed ? 0.6 : 1,
              })}
            >
              <Text style={{ color: palette.textMuted, fontSize: 12, fontFamily: monoFont }}>
                Reset to system appearance
              </Text>
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
        paddingHorizontal: 12,
        paddingVertical: 9,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 12,
      }}
    >
      <Text selectable style={{ color: palette.text, fontSize: 13, flex: 1 }}>
        {label}
      </Text>
      <Text selectable style={{ color: palette.textSoft, fontSize: 11, fontFamily: monoFont }}>
        {value}
      </Text>
    </View>
  );
}
