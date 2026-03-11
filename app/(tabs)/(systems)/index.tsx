import { ScrollView, Text, View } from 'react-native';

import { DataText, GlassSurface, SectionLabel, Surface } from '@/components/altered/ui';
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
        contentContainerStyle={{ padding: 16, paddingBottom: 48, gap: 12 }}
        style={{ flex: 1, backgroundColor: palette.background }}
      >
        <GlassSurface>
          <View style={{ padding: 18, gap: 8 }}>
            <SectionLabel>Systems</SectionLabel>
            <Text selectable style={{ color: palette.text, fontSize: 28, fontWeight: '500', letterSpacing: -0.6 }}>
              Different ways to interact with your brain.
            </Text>
            <Text selectable style={{ color: palette.textMuted, fontSize: 14 }}>
              Systems are the leverage layer between stored thought and outbound action.
            </Text>
          </View>
        </GlassSurface>

        {state.systemModes.map((mode) => (
          <Surface key={mode.id}>
            <View style={{ padding: 16, gap: 8 }}>
              <SectionLabel>{mode.name}</SectionLabel>
              <Text selectable style={{ color: palette.text, fontSize: 17, fontWeight: '500' }}>
                {mode.description}
              </Text>
              <Text selectable style={{ color: palette.textSoft, fontSize: 12, fontFamily: monoFont }}>
                {mode.command}
              </Text>
            </View>
          </Surface>
        ))}

        <Surface>
          <View style={{ padding: 16, gap: 12 }}>
            <SectionLabel>Recent Inputs</SectionLabel>
            {recentThoughts.map((thought) => (
              <View key={thought.id} style={{ gap: 4 }}>
                <Text selectable style={{ color: palette.text, fontSize: 15, fontWeight: '500' }}>
                  {thought.title}
                </Text>
                <DataText>{thought.datasets.join(' · ')}</DataText>
              </View>
            ))}
          </View>
        </Surface>
      </ScrollView>
    </SwipeTabScreen>
  );
}
