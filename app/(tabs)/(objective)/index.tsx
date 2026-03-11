import React from 'react';
import { Platform, Pressable, ScrollView, Text, TextInput, View } from 'react-native';

import * as Haptics from 'expo-haptics';

import { AdaptiveGlass } from '@/components/altered/adaptive-glass';
import { useAltered } from '@/features/altered/store';

export default function ObjectiveScreen() {
  const { state, updateObjective, resolveChange, visibleThoughts } = useAltered();
  const [title, setTitle] = React.useState(state.objective.title);
  const [outcome, setOutcome] = React.useState(state.objective.outcome);
  const [timeframe, setTimeframe] = React.useState(state.objective.timeframe);
  const [constraints, setConstraints] = React.useState(state.objective.constraints);
  const [successCriteria, setSuccessCriteria] = React.useState(state.objective.successCriteria);

  React.useEffect(() => {
    setTitle(state.objective.title);
    setOutcome(state.objective.outcome);
    setTimeframe(state.objective.timeframe);
    setConstraints(state.objective.constraints);
    setSuccessCriteria(state.objective.successCriteria);
  }, [state.objective]);

  const pendingChanges = state.proposedChanges.filter((change) => change.status === 'pending');
  const nextActions = visibleThoughts
    .filter((thought) => thought.status === 'open' || thought.status === 'in-progress')
    .slice(0, 5);

  const saveObjective = () => {
    updateObjective({ title, outcome, timeframe, constraints, successCriteria });
    if (Platform.OS === 'ios') {
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };

  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={{ padding: 16, gap: 12 }}>
      <AdaptiveGlass style={{ borderRadius: 20, overflow: 'hidden', padding: 16, gap: 10 }}>
        <Text selectable style={{ fontSize: 13, fontWeight: '700', letterSpacing: 0.9 }}>
          COMMAND 01
        </Text>
        <Text selectable style={{ fontSize: 24, fontWeight: '900', textTransform: 'uppercase' }}>
          Clarify Objective
        </Text>
        <Text selectable style={{ fontSize: 13, color: '#666666' }}>
          Define the outcome and constraints that every future thought and action should optimize for.
        </Text>

        <TextInput
          value={title}
          onChangeText={setTitle}
          placeholder="Objective title"
          style={inputStyle}
          placeholderTextColor="#666666"
        />
        <TextInput
          value={outcome}
          onChangeText={setOutcome}
          placeholder="Desired outcome"
          multiline
          style={[inputStyle, { minHeight: 70, textAlignVertical: 'top' }]}
          placeholderTextColor="#666666"
        />
        <TextInput
          value={timeframe}
          onChangeText={setTimeframe}
          placeholder="Timeframe (e.g. 14 days)"
          style={inputStyle}
          placeholderTextColor="#666666"
        />
        <TextInput
          value={constraints}
          onChangeText={setConstraints}
          placeholder="Constraints"
          multiline
          style={[inputStyle, { minHeight: 62, textAlignVertical: 'top' }]}
          placeholderTextColor="#666666"
        />
        <TextInput
          value={successCriteria}
          onChangeText={setSuccessCriteria}
          placeholder="Success criteria"
          multiline
          style={[inputStyle, { minHeight: 62, textAlignVertical: 'top' }]}
          placeholderTextColor="#666666"
        />

        <Pressable
          onPress={saveObjective}
          style={{
            borderRadius: 12,
            borderWidth: 2,
            borderColor: '#111111',
            paddingVertical: 10,
            alignItems: 'center',
            backgroundColor: '#111111',
          }}
        >
          <Text selectable style={{ color: '#FFFFFF', fontSize: 13, fontWeight: '800', letterSpacing: 0.8 }}>
            SAVE OBJECTIVE
          </Text>
        </Pressable>
      </AdaptiveGlass>

      <View style={{ borderRadius: 18, borderWidth: 2, borderColor: '#111111', padding: 14, gap: 8 }}>
        <Text selectable style={{ fontSize: 13, fontWeight: '800', letterSpacing: 0.8 }}>
          REVIEW PROPOSED CHANGES
        </Text>
        {pendingChanges.length === 0 ? (
          <Text selectable style={{ fontSize: 13, color: '#666666' }}>
            No pending proposals.
          </Text>
        ) : (
          pendingChanges.map((change) => (
            <View
              key={change.id}
              style={{ borderWidth: 1.5, borderColor: '#111111', borderRadius: 12, padding: 10, gap: 8 }}
            >
              <Text selectable style={{ fontSize: 14, fontWeight: '800' }}>
                {change.title}
              </Text>
              <Text selectable style={{ fontSize: 12, color: '#444444' }}>
                {change.reason}
              </Text>
              <View style={{ flexDirection: 'row', gap: 8 }}>
                <Pressable
                  onPress={() => resolveChange(change.id, 'approved')}
                  style={{
                    borderWidth: 1.5,
                    borderColor: '#111111',
                    borderRadius: 10,
                    paddingHorizontal: 10,
                    paddingVertical: 6,
                    backgroundColor: '#111111',
                  }}
                >
                  <Text selectable style={{ color: '#FFFFFF', fontSize: 11, fontWeight: '800' }}>
                    APPROVE
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => resolveChange(change.id, 'rejected')}
                  style={{
                    borderWidth: 1.5,
                    borderColor: '#111111',
                    borderRadius: 10,
                    paddingHorizontal: 10,
                    paddingVertical: 6,
                  }}
                >
                  <Text selectable style={{ fontSize: 11, fontWeight: '800' }}>REJECT</Text>
                </Pressable>
              </View>
            </View>
          ))
        )}
      </View>

      <View style={{ borderRadius: 18, borderWidth: 2, borderColor: '#111111', padding: 14, gap: 8 }}>
        <Text selectable style={{ fontSize: 13, fontWeight: '800', letterSpacing: 0.8 }}>
          VIEW NEXT ACTIONS
        </Text>
        {nextActions.map((thought, index) => (
          <Text key={thought.id} selectable style={{ fontSize: 13, color: '#222222' }}>
            {index + 1}. {thought.text}
          </Text>
        ))}
      </View>
    </ScrollView>
  );
}

const inputStyle = {
  borderWidth: 2,
  borderColor: '#111111',
  borderRadius: 12,
  paddingHorizontal: 12,
  paddingVertical: 9,
  backgroundColor: '#FFFFFF',
  fontSize: 14,
  fontWeight: '600' as const,
};
