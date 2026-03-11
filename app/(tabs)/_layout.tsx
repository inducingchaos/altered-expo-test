import { DynamicColorIOS } from 'react-native';

import { NativeTabs } from 'expo-router/unstable-native-tabs';

import { useAppTheme } from '@/features/theme/provider';

const fallbackTint = '#201f1b';

export default function TabsLayout() {
  const { palette } = useAppTheme();

  const tintColor =
    typeof DynamicColorIOS === 'function'
      ? DynamicColorIOS({ light: fallbackTint, dark: palette.tabTint })
      : palette.tabTint;

  return (
    <NativeTabs tintColor={tintColor} minimizeBehavior="onScrollDown">
      <NativeTabs.Trigger name="(start)">
        <NativeTabs.Trigger.Icon sf={{ default: 'list.bullet.rectangle', selected: 'list.bullet.rectangle.fill' }} md="checklist" />
        <NativeTabs.Trigger.Label>Start</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="(brain)">
        <NativeTabs.Trigger.Icon sf={{ default: 'brain', selected: 'brain.head.profile' }} md="neurology" />
        <NativeTabs.Trigger.Label>Brain</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="(kai)">
        <NativeTabs.Trigger.Icon sf={{ default: 'message', selected: 'message.fill' }} md="chat_bubble" />
        <NativeTabs.Trigger.Label>kAI</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="(systems)">
        <NativeTabs.Trigger.Icon sf={{ default: 'square.stack.3d.up', selected: 'square.stack.3d.up.fill' }} md="hub" />
        <NativeTabs.Trigger.Label>Systems</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="(more)" role="more">
        <NativeTabs.Trigger.Icon sf={{ default: 'ellipsis.circle', selected: 'ellipsis.circle.fill' }} md="more_horiz" />
        <NativeTabs.Trigger.Label>More</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
