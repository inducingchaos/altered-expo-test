import React from 'react';
import { useCssElement } from 'react-native-css';
import {
  Pressable as RNPressable,
  ScrollView as RNScrollView,
  Text as RNText,
  TextInput as RNTextInput,
  View as RNView,
} from 'react-native';

export const View = (props: React.ComponentProps<typeof RNView> & { className?: string }) => {
  return useCssElement(RNView as any, props as any, { className: 'style' });
};

export const Text = (props: React.ComponentProps<typeof RNText> & { className?: string }) => {
  return useCssElement(RNText as any, props as any, { className: 'style' });
};

export const ScrollView = (
  props: React.ComponentProps<typeof RNScrollView> & {
    className?: string;
    contentContainerClassName?: string;
  }
) => {
  return useCssElement(RNScrollView as any, props as any, {
    className: 'style',
    contentContainerClassName: 'contentContainerStyle',
  });
};

export const Pressable = (
  props: React.ComponentProps<typeof RNPressable> & {
    className?: string;
  }
) => {
  return useCssElement(RNPressable as any, props as any, { className: 'style' });
};

export const TextInput = (
  props: React.ComponentProps<typeof RNTextInput> & {
    className?: string;
  }
) => {
  return useCssElement(RNTextInput as any, props as any, { className: 'style' });
};
