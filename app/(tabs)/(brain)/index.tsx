import { ScrollView, Text, View } from 'react-native';

export default function BrainScreen() {
  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={{ padding: 20 }}>
      <View style={{ borderRadius: 20, borderWidth: 2, borderColor: '#121212', padding: 16 }}>
        <Text selectable style={{ fontSize: 22, fontWeight: '800' }}>
          ALTERED
        </Text>
        <Text selectable style={{ marginTop: 8, opacity: 0.7 }}>
          Building brutal minimal list mechanics...
        </Text>
      </View>
    </ScrollView>
  );
}
