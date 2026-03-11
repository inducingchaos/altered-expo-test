import type { PropsWithChildren } from 'react';

import { router } from 'expo-router';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

const tabRoutes = ['/(tabs)/(start)', '/(tabs)/(brain)', '/(tabs)/(kai)', '/(tabs)/(systems)', '/(tabs)/(more)'] as const;

type SwipeTabScreenProps = PropsWithChildren<{
  index: number;
}>;

export function SwipeTabScreen({ children, index }: SwipeTabScreenProps) {
  const gesture = Gesture.Pan()
    .activeOffsetX([-24, 24])
    .failOffsetY([-16, 16])
    .onEnd((event) => {
      const movedLeft = event.translationX < -56 || event.velocityX < -650;
      const movedRight = event.translationX > 56 || event.velocityX > 650;

      if (movedLeft && index < tabRoutes.length - 1) {
        router.navigate(tabRoutes[index + 1]);
      }

      if (movedRight && index > 0) {
        router.navigate(tabRoutes[index - 1]);
      }
    });

  return <GestureDetector gesture={gesture}>{children}</GestureDetector>;
}
