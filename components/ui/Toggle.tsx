import React from 'react';
import { Pressable, StyleSheet, Animated } from 'react-native';
import { Colors } from '../../constants/colors';

interface ToggleProps {
  value: boolean;
  onToggle: () => void;
}

export function Toggle({ value, onToggle }: ToggleProps) {
  return (
    <Pressable
      onPress={onToggle}
      style={[styles.track, value ? styles.trackOn : styles.trackOff]}
      accessibilityRole="switch"
      accessibilityState={{ checked: value }}
    >
      <Animated.View style={[styles.thumb, value ? styles.thumbOn : styles.thumbOff]} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  track: {
    width: 44,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  trackOn: { backgroundColor: Colors.orange },
  trackOff: { backgroundColor: Colors.border2 },
  thumb: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#fff',
  },
  thumbOn: { alignSelf: 'flex-end' },
  thumbOff: { alignSelf: 'flex-start' },
});
