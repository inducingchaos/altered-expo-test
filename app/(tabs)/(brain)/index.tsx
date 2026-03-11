import React from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Pressable,
  Text,
  TextInput,
  View,
  type ListRenderItemInfo,
} from 'react-native';

import * as Clipboard from 'expo-clipboard';
import * as Haptics from 'expo-haptics';
import { Stack } from 'expo-router';
import Animated, { FadeIn } from 'react-native-reanimated';

import { ActionRow, Capsule, DataText, GlassSurface, SectionLabel, Separator, Surface } from '@/components/altered/ui';
import { SwipeTabScreen } from '@/components/altered/swipe-tab-screen';
import { useAltered } from '@/features/altered/store';
import type { Thought, ThoughtStatus } from '@/features/altered/types';
import { monoFont } from '@/features/theme/palette';
import { useAppTheme } from '@/features/theme/provider';

const statuses: ThoughtStatus[] = ['inbox', 'active', 'queued', 'blocked', 'archived'];

function formatDate(value: string) {
  return new Date(value).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

export default function BrainScreen() {
  const { palette } = useAppTheme();
  const {
    state,
    visibleThoughts,
    datasetCounts,
    addThought,
    setActiveDataset,
    setSearchQuery,
    toggleThoughtPinned,
    toggleThoughtValidated,
    updateThoughtStatus,
  } = useAltered();

  const [draft, setDraft] = React.useState('');
  const [draftDatasets, setDraftDatasets] = React.useState('');
  const [selectedThought, setSelectedThought] = React.useState<Thought | null>(null);
  const [captureExpanded, setCaptureExpanded] = React.useState(false);

  const handleSearch = React.useCallback(
    (event: { nativeEvent: { text: string } }) => {
      setSearchQuery(event.nativeEvent.text);
    },
    [setSearchQuery]
  );

  const handleAddThought = () => {
    if (!draft.trim()) return;
    addThought({ body: draft, datasetInput: draftDatasets });
    setDraft('');
    setDraftDatasets('');
    setCaptureExpanded(false);
    void Haptics.selectionAsync();
  };

  const runAction = async (action: () => void, copyValue?: string) => {
    action();
    if (copyValue) {
      await Clipboard.setStringAsync(copyValue);
    }
    setSelectedThought(null);
    void Haptics.selectionAsync();
  };

  const renderThought = ({ item }: ListRenderItemInfo<Thought>) => (
    <Pressable
      onPress={() => {
        setSelectedThought(item);
        void Haptics.selectionAsync();
      }}
      style={({ pressed }) => ({
        paddingHorizontal: 12,
        paddingVertical: 9,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        opacity: pressed ? 0.6 : 1,
        borderBottomWidth: 1,
        borderColor: palette.border,
      })}
    >
      <View style={{ flex: 1, gap: 2 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <Text selectable numberOfLines={1} style={{ color: palette.text, fontSize: 14, fontWeight: '500', flexShrink: 1 }}>
            {item.title}
          </Text>
          {item.pinned ? (
            <Text style={{ color: palette.accent, fontSize: 9, fontFamily: monoFont, letterSpacing: 0.4, textTransform: 'uppercase' }}>
              pinned
            </Text>
          ) : null}
        </View>
        <Text selectable numberOfLines={1} style={{ color: palette.textMuted, fontSize: 12 }}>
          {item.body}
        </Text>
      </View>

      <View style={{ alignItems: 'flex-end', gap: 2, flexShrink: 0 }}>
        <Text style={{ color: palette.textSoft, fontSize: 10, fontFamily: monoFont }}>
          {item.datasets[0] ?? '—'}
        </Text>
        <Text style={{ color: palette.textSoft, fontSize: 10, fontFamily: monoFont }}>
          {formatDate(item.updatedAt)}
        </Text>
      </View>

      <Pressable
        onPress={() => {
          setSelectedThought(item);
          void Haptics.selectionAsync();
        }}
        hitSlop={14}
        style={{
          width: 28,
          height: 28,
          borderRadius: 4,
          borderCurve: 'continuous',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: palette.chrome,
          borderWidth: 1,
          borderColor: palette.border,
        }}
      >
        <Text style={{ color: palette.textMuted, fontSize: 14, lineHeight: 16, fontFamily: monoFont }}>
          ···
        </Text>
      </Pressable>
    </Pressable>
  );

  return (
    <>
      <Stack.Screen
        options={{
          headerSearchBarOptions: {
            placeholder: 'Filter thoughts, datasets, or phrases',
            onChangeText: handleSearch,
          },
        }}
      />
      <SwipeTabScreen index={1}>
        <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
          <View style={{ flex: 1, backgroundColor: palette.background }}>
            <FlatList
              contentInsetAdjustmentBehavior="automatic"
              data={visibleThoughts}
              keyExtractor={(item) => item.id}
              renderItem={renderThought}
              keyboardDismissMode="on-drag"
              ListHeaderComponent={
                <View style={{ gap: 8, paddingHorizontal: 12, paddingTop: 8, paddingBottom: 4 }}>
                  <Surface>
                    <Pressable
                      onPress={() => setCaptureExpanded(!captureExpanded)}
                      style={{ paddingHorizontal: 12, paddingVertical: 10, flexDirection: 'row', alignItems: 'center', gap: 8 }}
                    >
                      <View style={{ flex: 1 }}>
                        <Text style={{ color: palette.textSoft, fontSize: 13, fontFamily: monoFont }}>
                          {captureExpanded ? 'Capture' : 'Quick capture...'}
                        </Text>
                      </View>
                      <View style={{ flexDirection: 'row', gap: 12 }}>
                        <DataText size={10}>{state.thoughts.length} thoughts</DataText>
                        <DataText size={10}>{datasetCounts.length} datasets</DataText>
                      </View>
                    </Pressable>

                    {captureExpanded ? (
                      <Animated.View entering={FadeIn.duration(160)} style={{ paddingHorizontal: 12, paddingBottom: 10, gap: 8 }}>
                        <Separator />
                        <TextInput
                          value={draft}
                          onChangeText={setDraft}
                          placeholder="What are you thinking?"
                          placeholderTextColor={palette.textSoft}
                          multiline
                          style={{
                            minHeight: 36,
                            maxHeight: 80,
                            borderRadius: 4,
                            borderCurve: 'continuous',
                            borderWidth: 1,
                            borderColor: palette.border,
                            paddingHorizontal: 10,
                            paddingVertical: 8,
                            color: palette.text,
                            backgroundColor: palette.glass,
                            fontSize: 13,
                          }}
                        />
                        <View style={{ flexDirection: 'row', gap: 8 }}>
                          <TextInput
                            value={draftDatasets}
                            onChangeText={setDraftDatasets}
                            placeholder="datasets: trust, ui"
                            placeholderTextColor={palette.textSoft}
                            autoCapitalize="none"
                            style={{
                              flex: 1,
                              borderRadius: 4,
                              borderCurve: 'continuous',
                              borderWidth: 1,
                              borderColor: palette.border,
                              paddingHorizontal: 10,
                              paddingVertical: 8,
                              color: palette.text,
                              backgroundColor: palette.glass,
                              fontFamily: monoFont,
                              fontSize: 12,
                            }}
                          />
                          <Pressable
                            onPress={handleAddThought}
                            style={({ pressed }) => ({
                              borderRadius: 4,
                              borderCurve: 'continuous',
                              borderWidth: 1,
                              borderColor: palette.borderStrong,
                              alignItems: 'center',
                              justifyContent: 'center',
                              paddingHorizontal: 14,
                              paddingVertical: 8,
                              backgroundColor: pressed ? palette.accentSoft : palette.chrome,
                            })}
                          >
                            <DataText size={11}>Add</DataText>
                          </Pressable>
                        </View>
                      </Animated.View>
                    ) : null}
                  </Surface>

                  <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, paddingVertical: 2 }}>
                    <Capsule label={`all ${state.thoughts.length}`} selected={!state.activeDataset} onPress={() => setActiveDataset(null)} />
                    {datasetCounts.map((dataset) => (
                      <Capsule
                        key={dataset.name}
                        label={`${dataset.name} ${dataset.count}`}
                        selected={state.activeDataset === dataset.name}
                        onPress={() => setActiveDataset(dataset.name)}
                      />
                    ))}
                  </View>

                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 4 }}>
                    <SectionLabel>Thought list</SectionLabel>
                    <Text style={{ color: palette.textSoft, fontSize: 10, fontFamily: monoFont }}>
                      {visibleThoughts.length} rows
                    </Text>
                  </View>
                </View>
              }
              contentContainerStyle={{ paddingBottom: 40 }}
              style={{ flex: 1 }}
            />

            <Modal transparent visible={selectedThought !== null} animationType="fade" onRequestClose={() => setSelectedThought(null)}>
              <Pressable style={{ flex: 1 }} onPress={() => setSelectedThought(null)}>
                <View style={{ flex: 1, justifyContent: 'flex-end', padding: 12, paddingBottom: 24, backgroundColor: 'rgba(0, 0, 0, 0.28)' }}>
                  {selectedThought ? (
                    <Pressable onPress={() => {}}>
                      <GlassSurface>
                        <View style={{ padding: 14, gap: 12 }}>
                          <View style={{ gap: 4 }}>
                            <SectionLabel>Actions</SectionLabel>
                            <Text selectable style={{ color: palette.text, fontSize: 16, fontWeight: '500' }}>
                              {selectedThought.title}
                            </Text>
                            <Text selectable numberOfLines={2} style={{ color: palette.textMuted, fontSize: 12 }}>
                              {selectedThought.body}
                            </Text>
                          </View>

                          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 4 }}>
                            {selectedThought.datasets.map((dataset) => (
                              <Capsule
                                key={dataset}
                                label={dataset}
                                selected={state.activeDataset === dataset}
                                onPress={() => void runAction(() => setActiveDataset(dataset))}
                              />
                            ))}
                          </View>

                          <View style={{ gap: 6 }}>
                            <ActionRow
                              label={selectedThought.pinned ? 'Remove from queue' : 'Pin to queue'}
                              onPress={() => void runAction(() => toggleThoughtPinned(selectedThought.id))}
                            />
                            <ActionRow
                              label={selectedThought.validated ? 'Mark validation open' : 'Mark validated'}
                              onPress={() => void runAction(() => toggleThoughtValidated(selectedThought.id))}
                            />
                            <ActionRow
                              label="Copy body"
                              onPress={() => void runAction(() => {}, selectedThought.body)}
                            />
                            {statuses
                              .filter((s) => s !== selectedThought.status)
                              .slice(0, 3)
                              .map((s) => (
                                <ActionRow
                                  key={s}
                                  label={`Move to ${s}`}
                                  onPress={() => void runAction(() => updateThoughtStatus(selectedThought.id, s))}
                                />
                              ))}
                          </View>

                          <Pressable
                            onPress={() => setSelectedThought(null)}
                            style={({ pressed }) => ({
                              borderRadius: 4,
                              borderCurve: 'continuous',
                              borderWidth: 1,
                              borderColor: palette.border,
                              paddingVertical: 10,
                              alignItems: 'center',
                              opacity: pressed ? 0.6 : 1,
                            })}
                          >
                            <DataText size={12}>Dismiss</DataText>
                          </Pressable>
                        </View>
                      </GlassSurface>
                    </Pressable>
                  ) : null}
                </View>
              </Pressable>
            </Modal>
          </View>
        </KeyboardAvoidingView>
      </SwipeTabScreen>
    </>
  );
}
