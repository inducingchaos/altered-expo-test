import { DynamicColorIOS, PlatformColor } from 'react-native';

import { NativeTabs } from 'expo-router/unstable-native-tabs';

const tintColor =
  typeof DynamicColorIOS === 'function'
    ? DynamicColorIOS({ light: '#0A0A0A', dark: '#F5F5F5' })
    : PlatformColor('label');

export default function TabsLayout() {
  return (
    <NativeTabs tintColor={tintColor} minimizeBehavior="onScrollDown">
      <NativeTabs.Trigger name="(brain)">
        <NativeTabs.Trigger.Icon sf="brain" md="neurology" />
        <NativeTabs.Trigger.Label>Brain</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="(datasets)">
        <NativeTabs.Trigger.Icon sf="square.stack.3d.up" md="data_object" />
        <NativeTabs.Trigger.Label>Datasets</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="(objective)">
        <NativeTabs.Trigger.Icon sf="target" md="flag" />
        <NativeTabs.Trigger.Label>Objective</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
