import { Pressable, ScrollView, Text, View } from 'react-native';

import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';

import { Metric, Row, SectionLabel, Separator, Surface } from '@/components/altered/ui';
import { SwipeTabScreen } from '@/components/altered/swipe-tab-screen';
import { useAltered } from '@/features/altered/store';
import { monoFont } from '@/features/theme/palette';
import { useAppTheme } from '@/features/theme/provider';

const statusColor: Record<string, string> = {
  pending: 'rgb(200, 180, 100)',
  clear: 'rgb(80, 170, 120)',
  flagged: 'rgb(210, 100, 90)',
};

export default function StartScreen() {
  const { palette } = useAppTheme();
  const { queueThoughts, state } = useAltered();

  return (
    <SwipeTabScreen index={0}>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={{ padding: 12, paddingBottom: 40, gap: 10 }}
        style={{ flex: 1, backgroundColor: palette.background }}
      >
        <View style={{ flexDirection: 'row', gap: 16, paddingVertical: 4, paddingHorizontal: 4 }}>
          <Metric label="Queue" value={`${queueThoughts.length}`} />
          <Metric label="Validations" value={`${state.validations.length}`} />
          <Metric label="Shortcuts" value={`${state.shortcuts.length}`} />
        </View>

        <Surface>
          <View style={{ paddingHorizontal: 12, paddingTop: 10, paddingBottom: 4 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <SectionLabel>Task Queue</SectionLabel>
              <Text style={{ color: palette.textSoft, fontSize: 10, fontFamily: monoFont }}>
                {queueThoughts.length} in motion
              </Text>
            </View>
          </View>
          {queueThoughts.map((thought) => (
            <Row
              key={thought.id}
              title={thought.title}
              subtitle={thought.body}
              trailing={thought.datasets[0]}
              trailingMuted={thought.status}
              badge={thought.pinned ? 'pinned' : undefined}
              onPress={() => {
                router.navigate('/(tabs)/(brain)');
                void Haptics.selectionAsync();
              }}
            />
          ))}
          {queueThoughts.length === 0 ? (
            <View style={{ padding: 12 }}>
              <Text style={{ color: palette.textSoft, fontSize: 12, fontFamily: monoFont }}>No active work.</Text>
            </View>
          ) : null}
        </Surface>

        <Surface>
          <View style={{ paddingHorizontal: 12, paddingTop: 10, paddingBottom: 6 }}>
            <SectionLabel>Validations</SectionLabel>
          </View>
          {state.validations.map((validation, index) => (
            <View key={validation.id}>
              <View style={{ paddingHorizontal: 12, paddingVertical: 8, flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <View
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: 3,
                    backgroundColor: statusColor[validation.status] ?? palette.textSoft,
                  }}
                />
                <View style={{ flex: 1, gap: 1 }}>
                  <Text selectable style={{ color: palette.text, fontSize: 13, fontWeight: '500' }}>
                    {validation.label}
                  </Text>
                  <Text selectable numberOfLines={1} style={{ color: palette.textMuted, fontSize: 11 }}>
                    {validation.detail}
                  </Text>
                </View>
                <Text style={{ color: palette.textSoft, fontSize: 10, fontFamily: monoFont, textTransform: 'uppercase' }}>
                  {validation.status}
                </Text>
              </View>
              {index < state.validations.length - 1 ? <Separator /> : null}
            </View>
          ))}
        </Surface>

        <Surface>
          <View style={{ paddingHorizontal: 12, paddingTop: 10, paddingBottom: 6 }}>
            <SectionLabel>Shortcuts</SectionLabel>
          </View>
          {state.shortcuts.map((shortcut, index) => (
            <View key={shortcut.id}>
              <Pressable
                onPress={() => {
                  router.navigate(shortcut.id === 'chat' ? '/(tabs)/(kai)' : shortcut.id === 'queue' ? '/(tabs)/(brain)' : '/(tabs)/(brain)');
                  void Haptics.selectionAsync();
                }}
                style={({ pressed }) => ({
                  paddingHorizontal: 12,
                  paddingVertical: 9,
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 10,
                  opacity: pressed ? 0.6 : 1,
                })}
              >
                <View style={{ flex: 1, gap: 1 }}>
                  <Text selectable style={{ color: palette.text, fontSize: 13, fontWeight: '500' }}>
                    {shortcut.label}
                  </Text>
                  <Text selectable numberOfLines={1} style={{ color: palette.textMuted, fontSize: 11 }}>
                    {shortcut.detail}
                  </Text>
                </View>
                <Text style={{ color: palette.textSoft, fontSize: 12, fontFamily: monoFont }}>→</Text>
              </Pressable>
              {index < state.shortcuts.length - 1 ? <Separator /> : null}
            </View>
          ))}
        </Surface>
      </ScrollView>
    </SwipeTabScreen>
  );
}
