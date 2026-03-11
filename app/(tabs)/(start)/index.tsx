import { Pressable, ScrollView, Text, View } from 'react-native';

import { router } from 'expo-router';

import { Capsule, DataText, GlassSurface, Metric, SectionLabel, Surface } from '@/components/altered/ui';
import { SwipeTabScreen } from '@/components/altered/swipe-tab-screen';
import { useAltered } from '@/features/altered/store';
import { monoFont } from '@/features/theme/palette';
import { useAppTheme } from '@/features/theme/provider';

export default function StartScreen() {
  const { palette } = useAppTheme();
  const { queueThoughts, state } = useAltered();

  return (
    <SwipeTabScreen index={0}>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={{ padding: 16, paddingBottom: 48, gap: 12 }}
        style={{ flex: 1, backgroundColor: palette.background }}
      >
        <GlassSurface>
          <View style={{ padding: 18, gap: 16 }}>
            <View style={{ gap: 6 }}>
              <SectionLabel>Start Surface</SectionLabel>
              <Text selectable style={{ color: palette.text, fontSize: 30, fontWeight: '500', letterSpacing: -0.8 }}>
                Minimal command center for queue, validations, and shortcuts.
              </Text>
            </View>

            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 18 }}>
              <Metric label="Queue" value={`${queueThoughts.length}`} />
              <Metric label="Validations" value={`${state.validations.length}`} />
              <Metric label="Shortcuts" value={`${state.shortcuts.length}`} />
            </View>
          </View>
        </GlassSurface>

        <Surface>
          <View style={{ padding: 16, gap: 12 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <SectionLabel>Task Queue</SectionLabel>
              <DataText>{queueThoughts.length} in motion</DataText>
            </View>
            {queueThoughts.map((thought) => (
              <View key={thought.id} style={{ gap: 6, paddingBottom: 12, borderBottomWidth: 1, borderColor: palette.border }}>
                <Text selectable style={{ color: palette.text, fontSize: 16, fontWeight: '500' }}>
                  {thought.title}
                </Text>
                <Text selectable style={{ color: palette.textMuted, fontSize: 13 }}>
                  {thought.body}
                </Text>
                <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
                  <Capsule label={thought.status} selected />
                  {thought.datasets.slice(0, 2).map((dataset) => (
                    <Capsule key={dataset} label={dataset} />
                  ))}
                </View>
              </View>
            ))}
          </View>
        </Surface>

        <Surface>
          <View style={{ padding: 16, gap: 12 }}>
            <SectionLabel>Validations</SectionLabel>
            {state.validations.map((validation) => (
              <View key={validation.id} style={{ gap: 4 }}>
                <Text selectable style={{ color: palette.text, fontSize: 15, fontWeight: '500' }}>
                  {validation.label}
                </Text>
                <Text selectable style={{ color: palette.textMuted, fontSize: 13 }}>{validation.detail}</Text>
                <Text selectable style={{ color: palette.textSoft, fontSize: 12, fontFamily: monoFont }}>
                  {validation.status}
                </Text>
              </View>
            ))}
          </View>
        </Surface>

        <Surface>
          <View style={{ padding: 16, gap: 12 }}>
            <SectionLabel>Shortcuts</SectionLabel>
            {state.shortcuts.map((shortcut) => (
              <Pressable
                key={shortcut.id}
                onPress={() => router.navigate(shortcut.id === 'chat' ? '/(tabs)/(kai)' : '/(tabs)/(brain)')}
                style={{
                  paddingHorizontal: 14,
                  paddingVertical: 14,
                  borderRadius: 14,
                  borderCurve: 'continuous',
                  borderWidth: 1,
                  borderColor: palette.border,
                  backgroundColor: palette.accentSoft,
                }}
              >
                <Text selectable style={{ color: palette.text, fontSize: 15, fontWeight: '500' }}>
                  {shortcut.label}
                </Text>
                <Text selectable style={{ color: palette.textMuted, fontSize: 13 }}>{shortcut.detail}</Text>
              </Pressable>
            ))}
          </View>
        </Surface>
      </ScrollView>
    </SwipeTabScreen>
  );
}
