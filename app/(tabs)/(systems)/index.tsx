import { ScrollView, Text, View } from 'react-native';

import { Row, SectionLabel, Separator, Surface } from '@/components/altered/ui';
import { SwipeTabScreen } from '@/components/altered/swipe-tab-screen';
import { useAltered } from '@/features/altered/store';
import { monoFont } from '@/features/theme/palette';
import { useAppTheme } from '@/features/theme/provider';

export default function SystemsScreen() {
  const { palette } = useAppTheme();
  const { state, recentThoughts } = useAltered();

  return (
    <SwipeTabScreen index={3}>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={{ padding: 12, paddingBottom: 40, gap: 10 }}
        style={{ flex: 1, backgroundColor: palette.background }}
      >
        <View style={{ paddingHorizontal: 4, paddingVertical: 4 }}>
          <Text style={{ color: palette.textMuted, fontSize: 12 }}>
            The leverage layer between stored thought and outbound action.
          </Text>
        </View>

        <Surface>
          <View style={{ paddingHorizontal: 12, paddingTop: 10, paddingBottom: 6 }}>
            <SectionLabel>Available Systems</SectionLabel>
          </View>
          {state.systemModes.map((mode, index) => (
            <View key={mode.id}>
              <View style={{ paddingHorizontal: 12, paddingVertical: 9, gap: 3 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Text selectable style={{ color: palette.text, fontSize: 14, fontWeight: '500' }}>
                    {mode.name}
                  </Text>
                  <Text selectable style={{ color: palette.textSoft, fontSize: 10, fontFamily: monoFont }}>
                    {mode.command.split(' ')[0]}
                  </Text>
                </View>
                <Text selectable numberOfLines={2} style={{ color: palette.textMuted, fontSize: 12 }}>
                  {mode.description}
                </Text>
                <Text selectable style={{ color: palette.textSoft, fontSize: 10, fontFamily: monoFont, marginTop: 1 }}>
                  {mode.command}
                </Text>
              </View>
              {index < state.systemModes.length - 1 ? <Separator /> : null}
            </View>
          ))}
        </Surface>

        <Surface>
          <View style={{ paddingHorizontal: 12, paddingTop: 10, paddingBottom: 6 }}>
            <SectionLabel>Recent Inputs</SectionLabel>
          </View>
          {recentThoughts.map((thought) => (
            <Row
              key={thought.id}
              title={thought.title}
              trailing={thought.datasets[0]}
              compact
            />
          ))}
        </Surface>
      </ScrollView>
    </SwipeTabScreen>
  );
}
