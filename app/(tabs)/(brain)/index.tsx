import React from 'react';
import {
  FlatList,
  Modal,
  Pressable,
  Text,
  TextInput,
  View,
  useWindowDimensions,
  type ListRenderItemInfo,
} from 'react-native';

import * as Clipboard from 'expo-clipboard';
import * as Haptics from 'expo-haptics';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { GlassSurface, Capsule, DataText, Metric, SectionLabel, Surface } from '@/components/altered/ui';
import { SwipeTabScreen } from '@/components/altered/swipe-tab-screen';
import { useAltered } from '@/features/altered/store';
import type { Thought, ThoughtStatus } from '@/features/altered/types';
import { monoFont } from '@/features/theme/palette';
import { useAppTheme } from '@/features/theme/provider';

const statuses: ThoughtStatus[] = ['inbox', 'active', 'queued', 'blocked', 'archived'];

function formatDate(value: string) {
  return new Date(value).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  });
}

export default function BrainScreen() {
  const { width } = useWindowDimensions();
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
  const [searchInput, setSearchInput] = React.useState(state.searchQuery);
  const [selectedThought, setSelectedThought] = React.useState<Thought | null>(null);
  const deferredSearch = React.useDeferredValue(searchInput);

  React.useEffect(() => {
    setSearchQuery(deferredSearch);
  }, [deferredSearch, setSearchQuery]);

  const handleAddThought = () => {
    addThought({ body: draft, datasetInput: draftDatasets });
    setDraft('');
    setDraftDatasets('');
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

  const renderThought = ({ item, index }: ListRenderItemInfo<Thought>) => (
    <Animated.View entering={FadeInDown.delay(index * 28).duration(220)}>
      <Pressable
        onPress={() => setSelectedThought(item)}
        style={{
          paddingHorizontal: 14,
          paddingVertical: 12,
          backgroundColor: index % 2 === 0 ? 'transparent' : palette.accentSoft,
          borderBottomWidth: 1,
          borderColor: palette.border,
          flexDirection: 'row',
          gap: 12,
          alignItems: 'center',
        }}
      >
        <View style={{ flex: 1, gap: 6 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Text selectable numberOfLines={1} style={{ color: palette.text, fontSize: 15, fontWeight: '600', flex: 1 }}>
              {item.title}
            </Text>
            {item.pinned ? (
              <Text selectable style={{ color: palette.accent, fontSize: 10, fontFamily: monoFont }}>
                PINNED
              </Text>
            ) : null}
          </View>

          <Text selectable numberOfLines={1} style={{ color: palette.textMuted, fontSize: 13 }}>
            {item.body}
          </Text>
        </View>

        <View style={{ alignItems: 'flex-end', gap: 6 }}>
          <Text selectable style={{ color: palette.textSoft, fontSize: 11, fontFamily: monoFont }}>
            {item.datasets[0] ?? 'untagged'}
          </Text>
          <Text selectable style={{ color: palette.textSoft, fontSize: 11, fontFamily: monoFont }}>
            {formatDate(item.updatedAt)}
          </Text>
        </View>

        <Pressable
          onPress={() => setSelectedThought(item)}
          hitSlop={12}
          style={{
            width: 40,
            height: 40,
            borderRadius: 12,
            borderCurve: 'continuous',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: palette.chrome,
            borderWidth: 1,
            borderColor: palette.border,
          }}
        >
          <Text selectable style={{ color: palette.text, fontSize: 18, lineHeight: 18, fontFamily: monoFont }}>
            ...
          </Text>
        </Pressable>
      </Pressable>
    </Animated.View>
  );

  return (
    <SwipeTabScreen index={1}>
      <View style={{ flex: 1, backgroundColor: palette.background }}>
        <FlatList
          contentInsetAdjustmentBehavior="automatic"
          data={visibleThoughts}
          keyExtractor={(item) => item.id}
          renderItem={renderThought}
          ListHeaderComponent={
            <View style={{ gap: 12, padding: 16 }}>
              <GlassSurface>
                <View style={{ padding: 16, gap: 14 }}>
                  <View style={{ gap: 6 }}>
                    <SectionLabel>Thought Database</SectionLabel>
                    <Text selectable style={{ color: palette.text, fontSize: 28, fontWeight: '500', letterSpacing: -0.6 }}>
                      ALTERED keeps thought, datasets, and structure in one thin layer.
                    </Text>
                  </View>

                  <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 18 }}>
                    <Metric label="Thoughts" value={`${state.thoughts.length}`} />
                    <Metric label="Datasets" value={`${datasetCounts.length}`} />
                    <Metric label="Filtered" value={`${visibleThoughts.length}`} />
                  </View>
                </View>
              </GlassSurface>

              <Surface>
                <View style={{ padding: 14, gap: 12 }}>
                  <View style={{ flexDirection: width > 720 ? 'row' : 'column', gap: 10 }}>
                    <TextInput
                      value={searchInput}
                      onChangeText={setSearchInput}
                      placeholder="Filter thoughts, datasets, or phrases"
                      placeholderTextColor={palette.textSoft}
                      style={{
                        flex: 1,
                        borderRadius: 14,
                        borderCurve: 'continuous',
                        borderWidth: 1,
                        borderColor: palette.border,
                        paddingHorizontal: 14,
                        paddingVertical: 12,
                        color: palette.text,
                        backgroundColor: palette.glass,
                        fontFamily: monoFont,
                        fontSize: 14,
                      }}
                    />
                    <TextInput
                      value={draft}
                      onChangeText={setDraft}
                      placeholder="Quick capture"
                      placeholderTextColor={palette.textSoft}
                      style={{
                        flex: width > 720 ? 1 : undefined,
                        borderRadius: 14,
                        borderCurve: 'continuous',
                        borderWidth: 1,
                        borderColor: palette.border,
                        paddingHorizontal: 14,
                        paddingVertical: 12,
                        color: palette.text,
                        backgroundColor: palette.glass,
                        fontSize: 14,
                      }}
                    />
                  </View>

                  <View style={{ flexDirection: width > 720 ? 'row' : 'column', gap: 10 }}>
                    <TextInput
                      value={draftDatasets}
                      onChangeText={setDraftDatasets}
                      placeholder="datasets: trust, ui, systems"
                      placeholderTextColor={palette.textSoft}
                      autoCapitalize="none"
                      style={{
                        flex: 1,
                        borderRadius: 14,
                        borderCurve: 'continuous',
                        borderWidth: 1,
                        borderColor: palette.border,
                        paddingHorizontal: 14,
                        paddingVertical: 12,
                        color: palette.text,
                        backgroundColor: palette.glass,
                        fontFamily: monoFont,
                        fontSize: 13,
                      }}
                    />
                    <Pressable
                      onPress={handleAddThought}
                      style={{
                        minWidth: 140,
                        borderRadius: 14,
                        borderCurve: 'continuous',
                        borderWidth: 1,
                        borderColor: palette.borderStrong,
                        alignItems: 'center',
                        justifyContent: 'center',
                        paddingHorizontal: 16,
                        paddingVertical: 12,
                        backgroundColor: palette.accentSoft,
                      }}
                    >
                      <DataText>Add thought</DataText>
                    </Pressable>
                  </View>

                  <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
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
                </View>
              </Surface>

              <Surface>
                <View style={{ paddingHorizontal: 14, paddingTop: 12, paddingBottom: 4, gap: 8 }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <SectionLabel>Raycast-style list</SectionLabel>
                    <DataText>{visibleThoughts.length} rows</DataText>
                  </View>
                </View>
              </Surface>
            </View>
          }
          contentContainerStyle={{ paddingBottom: 48 }}
          style={{ flex: 1 }}
        />

        <Modal transparent visible={selectedThought !== null} animationType="fade" onRequestClose={() => setSelectedThought(null)}>
          <View style={{ flex: 1, justifyContent: 'flex-end', padding: 16, backgroundColor: 'rgba(0, 0, 0, 0.22)' }}>
            {selectedThought ? (
              <GlassSurface>
                <View style={{ padding: 18, gap: 16 }}>
                  <View style={{ gap: 6 }}>
                    <SectionLabel>Thought Actions</SectionLabel>
                    <Text selectable style={{ color: palette.text, fontSize: 22, fontWeight: '500' }}>
                      {selectedThought.title}
                    </Text>
                    <Text selectable style={{ color: palette.textMuted, fontSize: 14 }}>{selectedThought.body}</Text>
                  </View>

                  <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                    {selectedThought.datasets.map((dataset) => (
                      <Capsule key={dataset} label={dataset} selected={state.activeDataset === dataset} onPress={() => runAction(() => setActiveDataset(dataset))} />
                    ))}
                  </View>

                  <View style={{ gap: 10 }}>
                    <MenuAction label={selectedThought.pinned ? 'Remove from queue' : 'Pin to queue'} onPress={() => runAction(() => toggleThoughtPinned(selectedThought.id))} />
                    <MenuAction label={selectedThought.validated ? 'Mark validation open' : 'Mark validated'} onPress={() => runAction(() => toggleThoughtValidated(selectedThought.id))} />
                    <MenuAction label="Copy thought body" onPress={() => void runAction(() => {}, selectedThought.body)} />
                    {statuses
                      .filter((status) => status !== selectedThought.status)
                      .slice(0, 3)
                      .map((status) => (
                        <MenuAction key={status} label={`Move to ${status}`} onPress={() => runAction(() => updateThoughtStatus(selectedThought.id, status))} />
                      ))}
                  </View>

                  <Pressable
                    onPress={() => setSelectedThought(null)}
                    style={{
                      borderRadius: 14,
                      borderCurve: 'continuous',
                      borderWidth: 1,
                      borderColor: palette.border,
                      paddingVertical: 12,
                      alignItems: 'center',
                    }}
                  >
                    <DataText>Close</DataText>
                  </Pressable>
                </View>
              </GlassSurface>
            ) : null}
          </View>
        </Modal>
      </View>
    </SwipeTabScreen>
  );
}

function MenuAction({ label, onPress }: { label: string; onPress: () => void }) {
  const { palette } = useAppTheme();

  return (
    <Pressable
      onPress={onPress}
      style={{
        paddingHorizontal: 14,
        paddingVertical: 14,
        borderRadius: 14,
        borderCurve: 'continuous',
        backgroundColor: palette.chrome,
        borderWidth: 1,
        borderColor: palette.border,
      }}
    >
      <Text selectable style={{ color: palette.text, fontSize: 14, fontFamily: monoFont }}>
        {label}
      </Text>
    </Pressable>
  );
}
