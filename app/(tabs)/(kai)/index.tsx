import React from 'react';
import { FlatList, KeyboardAvoidingView, Pressable, Text, TextInput, View, type ListRenderItemInfo } from 'react-native';

import * as Haptics from 'expo-haptics';

import { GlassSurface } from '@/components/altered/ui';
import { SwipeTabScreen } from '@/components/altered/swipe-tab-screen';
import { useAltered } from '@/features/altered/store';
import type { ChatMessage } from '@/features/altered/types';
import { monoFont } from '@/features/theme/palette';
import { useAppTheme } from '@/features/theme/provider';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function KaiScreen() {
  const { palette } = useAppTheme();
  const { state, sendChatMessage } = useAltered();
  const [message, setMessage] = React.useState('');
  const insets = useSafeAreaInsets();
  const listRef = React.useRef<FlatList<ChatMessage>>(null);

  const submit = () => {
    if (!message.trim()) return;
    sendChatMessage(message);
    setMessage('');
    void Haptics.selectionAsync();
    setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 100);
  };

  const renderMessage = ({ item }: ListRenderItemInfo<ChatMessage>) => (
    <View
      style={{
        paddingHorizontal: 14,
        paddingVertical: 10,
        gap: 4,
        backgroundColor: item.role === 'user' ? palette.accentSoft : 'transparent',
        borderBottomWidth: 1,
        borderColor: palette.border,
      }}
    >
      <Text style={{ color: palette.textSoft, fontSize: 9, fontFamily: monoFont, textTransform: 'uppercase', letterSpacing: 0.8 }}>
        {item.role}
      </Text>
      <Text selectable style={{ color: palette.text, fontSize: 14, lineHeight: 20 }}>
        {item.text}
      </Text>
    </View>
  );

  return (
    <SwipeTabScreen index={2}>
      <KeyboardAvoidingView style={{ flex: 1, backgroundColor: palette.background }} behavior="padding">
        <FlatList
          ref={listRef}
          contentInsetAdjustmentBehavior="automatic"
          data={state.chatMessages}
          keyExtractor={(item) => item.id}
          renderItem={renderMessage}
          keyboardDismissMode="on-drag"
          ListHeaderComponent={
            <View style={{ paddingHorizontal: 14, paddingTop: 8, paddingBottom: 12 }}>
              <Text style={{ color: palette.textMuted, fontSize: 12 }}>
                Chat grounded in stored thought, not detached assistant vibes.
              </Text>
            </View>
          }
          contentContainerStyle={{ paddingBottom: 8 }}
          style={{ flex: 1 }}
        />

        <GlassSurface>
          <View style={{ paddingHorizontal: 10, paddingTop: 8, paddingBottom: Math.max(8, insets.bottom - 48), gap: 8 }}>
            <View style={{ flexDirection: 'row', gap: 8, alignItems: 'flex-end' }}>
              <TextInput
                value={message}
                onChangeText={setMessage}
                placeholder="Ask ALTERED..."
                placeholderTextColor={palette.textSoft}
                multiline
                style={{
                  flex: 1,
                  minHeight: 36,
                  maxHeight: 88,
                  borderRadius: 4,
                  borderCurve: 'continuous',
                  borderWidth: 1,
                  borderColor: palette.border,
                  paddingHorizontal: 10,
                  paddingVertical: 8,
                  color: palette.text,
                  backgroundColor: palette.chrome,
                  fontSize: 13,
                }}
              />
              <Pressable
                onPress={submit}
                style={({ pressed }) => ({
                  borderRadius: 4,
                  borderCurve: 'continuous',
                  paddingHorizontal: 14,
                  paddingVertical: 10,
                  backgroundColor: pressed ? palette.accentSoft : palette.chrome,
                  borderWidth: 1,
                  borderColor: palette.borderStrong,
                })}
              >
                <Text style={{ color: palette.text, fontSize: 12, fontFamily: monoFont }}>Send</Text>
              </Pressable>
            </View>
          </View>
        </GlassSurface>
      </KeyboardAvoidingView>
    </SwipeTabScreen>
  );
}
