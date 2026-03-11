import { ScrollView, Text, View } from 'react-native';

import { AdaptiveGlass } from '@/components/altered/adaptive-glass';
import { useAltered } from '@/features/altered/store';

export default function DatasetsScreen() {
  const { datasetCounts, state, setActiveDataset } = useAltered();

  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={{ padding: 16, gap: 12 }}>
      <AdaptiveGlass style={{ borderRadius: 20, overflow: 'hidden', padding: 16, gap: 8 }}>
        <Text selectable style={{ fontSize: 22, fontWeight: '900', letterSpacing: 1, textTransform: 'uppercase' }}>
          dataset map
        </Text>
        <Text selectable style={{ fontSize: 13, color: '#666666' }}>
          Datasets are arbitrary tags. They create dynamic working views over one flat thought list.
        </Text>
        <Text selectable style={{ fontSize: 13, fontWeight: '700' }}>
          {datasetCounts.length} datasets across {state.thoughts.length} thoughts
        </Text>
      </AdaptiveGlass>

      {datasetCounts.map((dataset) => {
        const preview = state.thoughts
          .filter((thought) => thought.datasets.includes(dataset.name))
          .slice(0, 3)
          .map((thought) => thought.text);

        return (
          <View
            key={dataset.name}
            style={{
              borderRadius: 18,
              borderWidth: 2,
              borderColor: '#121212',
              backgroundColor: '#FCFCFC',
              padding: 14,
              gap: 10,
            }}
          >
            <Text selectable style={{ fontSize: 14, fontWeight: '900', textTransform: 'uppercase' }}>
              {dataset.name} ({dataset.count})
            </Text>
            {preview.map((line, index) => (
              <Text key={`${dataset.name}-${index}`} selectable style={{ fontSize: 13, color: '#222222' }}>
                {index + 1}. {line}
              </Text>
            ))}
            <Text
              selectable
              onPress={() => setActiveDataset(dataset.name)}
              style={{
                fontSize: 12,
                fontWeight: '800',
                textDecorationLine: 'underline',
                textTransform: 'uppercase',
                letterSpacing: 0.6,
              }}
            >
              focus in brain tab
            </Text>
          </View>
        );
      })}
    </ScrollView>
  );
}
