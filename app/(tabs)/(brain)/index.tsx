import React from 'react';
import {
  FlatList,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
  type ListRenderItemInfo,
} from 'react-native';

import * as Haptics from 'expo-haptics';
import Animated, {
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { AdaptiveGlass } from '@/components/altered/adaptive-glass';
import { useAltered } from '@/features/altered/store';
import type { Thought, ThoughtStatus } from '@/features/altered/types';

const statuses: ThoughtStatus[] = ['open', 'in-progress', 'blocked', 'done'];

export default function BrainScreen() {
  const { state, visibleThoughts, datasetCounts, addThought, setThoughtStatus, setActiveDataset } =
    useAltered();

  const [thoughtText, setThoughtText] = React.useState('');
  const [datasetText, setDatasetText] = React.useState('');

  const pulse = useSharedValue(0.9);

  React.useEffect(() => {
    pulse.value = withRepeat(withTiming(1.04, { duration: 950 }), -1, true);
  }, [pulse]);

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
    opacity: pulse.value,
  }));

  const handleAdd = React.useCallback(() => {
    if (!thoughtText.trim()) {
      return;
    }

    addThought(thoughtText, datasetText);
    setThoughtText('');
    setDatasetText('');

    if (Platform.OS === 'ios') {
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  }, [addThought, datasetText, thoughtText]);

  const renderThought = ({ item, index }: ListRenderItemInfo<Thought>) => {
    return (
      <Animated.View entering={FadeInDown.delay(40 * index).duration(260)}>
        <View
          style={{
            borderRadius: 18,
            borderWidth: 2,
            borderColor: '#111111',
            backgroundColor: '#F9F9F9',
            padding: 14,
            gap: 10,
          }}
        >
          <Text selectable style={{ fontSize: 16, fontWeight: '800', color: '#101010' }}>
            {item.text}
          </Text>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
            {item.datasets.length === 0 ? (
              <Text selectable style={{ fontSize: 12, color: '#777777', textTransform: 'uppercase' }}>
                no dataset
              </Text>
            ) : (
              item.datasets.map((dataset) => (
                <Pressable
                  key={`${item.id}-${dataset}`}
                  onPress={() => setActiveDataset(dataset)}
                  style={{
                    borderWidth: 1,
                    borderColor: '#151515',
                    borderRadius: 999,
                    paddingHorizontal: 10,
                    paddingVertical: 5,
                    backgroundColor: '#ECECEC',
                  }}
                >
                  <Text
                    selectable
                    style={{
                      fontSize: 11,
                      fontWeight: '700',
                      letterSpacing: 0.8,
                      textTransform: 'uppercase',
                    }}
                  >
                    {dataset}
                  </Text>
                </Pressable>
              ))
            )}
          </ScrollView>

          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {statuses.map((status) => {
              const selected = item.status === status;
              return (
                <Pressable
                  key={`${item.id}-${status}`}
                  onPress={() => setThoughtStatus(item.id, status)}
                  style={{
                    borderWidth: 1.5,
                    borderColor: selected ? '#111111' : '#BBBBBB',
                    backgroundColor: selected ? '#111111' : '#FFFFFF',
                    borderRadius: 10,
                    paddingHorizontal: 10,
                    paddingVertical: 6,
                  }}
                >
                  <Text
                    selectable
                    style={{
                      fontSize: 11,
                      fontWeight: '700',
                      textTransform: 'uppercase',
                      color: selected ? '#FFFFFF' : '#333333',
                      letterSpacing: 0.5,
                    }}
                  >
                    {status}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      </Animated.View>
    );
  };

  return (
    <FlatList
      contentInsetAdjustmentBehavior="automatic"
      data={visibleThoughts}
      keyExtractor={(item) => item.id}
      renderItem={renderThought}
      ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
      contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
      ListHeaderComponent={
        <View style={{ gap: 12, marginBottom: 12 }}>
          <AdaptiveGlass style={{ borderRadius: 22, overflow: 'hidden', padding: 16, gap: 8 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Animated.View
                style={[
                  {
                    width: 9,
                    height: 9,
                    borderRadius: 999,
                    backgroundColor: '#0A0A0A',
                  },
                  pulseStyle,
                ]}
              />
              <Text
                selectable
                style={{
                  fontSize: 26,
                  lineHeight: 30,
                  fontWeight: '900',
                  letterSpacing: 1,
                  textTransform: 'uppercase',
                }}
              >
                altered
              </Text>
            </View>
            <Text selectable style={{ fontSize: 13, color: '#555555' }}>
              Flat-thought database for high-agency founders. Objective anchor:
            </Text>
            <Text selectable style={{ fontSize: 15, fontWeight: '700', color: '#101010' }}>
              {state.objective.title}
            </Text>
          </AdaptiveGlass>

          <AdaptiveGlass style={{ borderRadius: 18, overflow: 'hidden', padding: 14, gap: 10 }}>
            <Text selectable style={{ fontSize: 12, fontWeight: '700', letterSpacing: 0.8 }}>
              QUICK CAPTURE
            </Text>
            <TextInput
              value={thoughtText}
              onChangeText={setThoughtText}
              placeholder="Capture a thought, action, or clarification"
              placeholderTextColor="#666666"
              multiline
              style={{
                minHeight: 70,
                borderWidth: 2,
                borderColor: '#111111',
                borderRadius: 14,
                padding: 12,
                backgroundColor: '#FFFFFF',
                fontSize: 15,
                fontWeight: '600',
              }}
            />
            <TextInput
              value={datasetText}
              onChangeText={setDatasetText}
              placeholder="datasets (comma separated): objective, trust, workflow"
              placeholderTextColor="#666666"
              autoCapitalize="none"
              style={{
                borderWidth: 2,
                borderColor: '#111111',
                borderRadius: 14,
                paddingHorizontal: 12,
                paddingVertical: 10,
                backgroundColor: '#FFFFFF',
                fontSize: 14,
              }}
            />
            <Pressable
              onPress={handleAdd}
              style={{
                borderRadius: 12,
                borderWidth: 2,
                borderColor: '#111111',
                paddingVertical: 10,
                alignItems: 'center',
                backgroundColor: '#111111',
              }}
            >
              <Text
                selectable
                style={{ color: '#FFFFFF', fontSize: 13, fontWeight: '800', letterSpacing: 1 }}
              >
                ADD THOUGHT
              </Text>
            </Pressable>
          </AdaptiveGlass>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
            <Pressable
              onPress={() => setActiveDataset(null)}
              style={{
                borderRadius: 999,
                borderWidth: 2,
                borderColor: state.activeDataset ? '#111111' : '#000000',
                paddingHorizontal: 12,
                paddingVertical: 7,
                backgroundColor: state.activeDataset ? '#FFFFFF' : '#111111',
              }}
            >
              <Text
                selectable
                style={{
                  color: state.activeDataset ? '#111111' : '#FFFFFF',
                  fontWeight: '800',
                  textTransform: 'uppercase',
                  fontSize: 11,
                  letterSpacing: 0.8,
                }}
              >
                all ({state.thoughts.length})
              </Text>
            </Pressable>

            {datasetCounts.map((entry) => {
              const selected = state.activeDataset === entry.name;
              return (
                <Pressable
                  key={entry.name}
                  onPress={() => setActiveDataset(entry.name)}
                  style={{
                    borderRadius: 999,
                    borderWidth: 2,
                    borderColor: '#111111',
                    paddingHorizontal: 12,
                    paddingVertical: 7,
                    backgroundColor: selected ? '#111111' : '#FFFFFF',
                  }}
                >
                  <Text
                    selectable
                    style={{
                      color: selected ? '#FFFFFF' : '#111111',
                      fontWeight: '800',
                      textTransform: 'uppercase',
                      fontSize: 11,
                      letterSpacing: 0.8,
                    }}
                  >
                    {entry.name} ({entry.count})
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>
      }
      ListEmptyComponent={
        <View style={{ borderRadius: 18, borderWidth: 2, borderColor: '#111111', padding: 18 }}>
          <Text selectable style={{ fontSize: 15, fontWeight: '700' }}>
            No thoughts match this dataset filter yet.
          </Text>
        </View>
      }
    />
  );
}
