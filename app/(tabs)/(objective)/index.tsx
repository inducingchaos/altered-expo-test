import { ScrollView, Text, View } from 'react-native';

export default function ObjectiveScreen() {
  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={{ padding: 20 }}>
      <View style={{ borderRadius: 20, borderWidth: 2, borderColor: '#121212', padding: 16 }}>
        <Text selectable style={{ fontSize: 18, fontWeight: '700' }}>
          Objective command surface coming next.
        </Text>
      </View>
    </ScrollView>
  );
}
