import { AdaptiveGlass } from '@/components/altered/adaptive-glass';
import { useAltered } from '@/features/altered/store';
import { Pressable, ScrollView, Text, View } from '@/tw';

export default function DatasetsScreen() {
  const { datasetCounts, state, setActiveDataset } = useAltered();

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      className="flex-1 bg-altered-paper"
      contentContainerClassName="p-4 gap-3"
    >
      <AdaptiveGlass style={{ borderRadius: 20, overflow: 'hidden', padding: 16, gap: 8 }}>
        <Text className="text-2xl font-black uppercase tracking-[1px] text-altered-ink">dataset map</Text>
        <Text className="text-[13px] text-altered-muted">
          Datasets are arbitrary tags. They create dynamic working views over one flat thought list.
        </Text>
        <Text className="text-[13px] font-bold text-altered-ink">
          {datasetCounts.length} datasets across {state.thoughts.length} thoughts
        </Text>
      </AdaptiveGlass>

      <View className="gap-3">
        {datasetCounts.map((dataset) => {
          const preview = state.thoughts
            .filter((thought) => thought.datasets.includes(dataset.name))
            .slice(0, 3)
            .map((thought) => thought.text);

          return (
            <View
              key={dataset.name}
              className="rounded-[18px] border-2 border-altered-ink bg-white p-3.5 gap-2.5"
            >
              <Text className="text-sm font-black uppercase text-altered-ink tracking-[0.8px]">
                {dataset.name} ({dataset.count})
              </Text>
              {preview.map((line, index) => (
                <Text key={`${dataset.name}-${index}`} className="text-[13px] text-altered-ink">
                  {index + 1}. {line}
                </Text>
              ))}
              <Pressable
                onPress={() => setActiveDataset(dataset.name)}
                className="self-start rounded-full border border-altered-ink px-3 py-1"
              >
                <Text className="text-[11px] font-extrabold uppercase tracking-[0.8px] text-altered-ink">
                  focus in brain tab
                </Text>
              </Pressable>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}
