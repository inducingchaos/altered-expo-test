import React from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';

import { DataText, GlassSurface, SectionLabel, Surface } from '@/components/altered/ui';
import { SwipeTabScreen } from '@/components/altered/swipe-tab-screen';
import { useAltered } from '@/features/altered/store';
import { monoFont } from '@/features/theme/palette';
import { useAppTheme } from '@/features/theme/provider';

export default function KaiScreen() {
  const { palette } = useAppTheme();
  const { state, sendChatMessage } = useAltered();
  const [message, setMessage] = React.useState('');

  const submit = () => {
    sendChatMessage(message);
    setMessage('');
  };

  return (
    <SwipeTabScreen index={2}>
      <View style={{ flex: 1, backgroundColor: palette.background }}>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          contentContainerStyle={{ padding: 16, paddingBottom: 140, gap: 12 }}
        >
          <GlassSurface>
            <View style={{ padding: 18, gap: 8 }}>
              <SectionLabel>kAI</SectionLabel>
              <Text selectable style={{ color: palette.text, fontSize: 28, fontWeight: '500', letterSpacing: -0.6 }}>
                Direct line into ALTERED.
              </Text>
              <Text selectable style={{ color: palette.textMuted, fontSize: 14 }}>
                Keep chat grounded in stored thought, not detached assistant vibes.
              </Text>
            </View>
          </GlassSurface>

          {state.chatMessages.map((messageItem) => (
            <Surface key={messageItem.id}>
              <View
                style={{
                  padding: 14,
                  gap: 6,
                  backgroundColor: messageItem.role === 'assistant' ? palette.panelMuted : palette.accentSoft,
                }}
              >
                <Text selectable style={{ color: palette.textSoft, fontSize: 11, fontFamily: monoFont, textTransform: 'uppercase' }}>
                  {messageItem.role}
                </Text>
                <Text selectable style={{ color: palette.text, fontSize: 15, lineHeight: 22 }}>
                  {messageItem.text}
                </Text>
              </View>
            </Surface>
          ))}
        </ScrollView>

        <GlassSurface>
          <View style={{ padding: 12, gap: 10 }}>
            <TextInput
              value={message}
              onChangeText={setMessage}
              placeholder="Ask ALTERED about thoughts, systems, or next actions"
              placeholderTextColor={palette.textSoft}
              multiline
              style={{
                minHeight: 54,
                maxHeight: 110,
                borderRadius: 14,
                borderCurve: 'continuous',
                borderWidth: 1,
                borderColor: palette.border,
                paddingHorizontal: 14,
                paddingVertical: 12,
                color: palette.text,
                backgroundColor: palette.chrome,
                fontSize: 14,
              }}
            />
            <Pressable
              onPress={submit}
              style={{
                alignItems: 'center',
                borderRadius: 14,
                borderCurve: 'continuous',
                paddingVertical: 12,
                backgroundColor: palette.accentSoft,
                borderWidth: 1,
                borderColor: palette.borderStrong,
              }}
            >
              <DataText>Send to ALTERED</DataText>
            </Pressable>
          </View>
        </GlassSurface>
      </View>
    </SwipeTabScreen>
  );
}
