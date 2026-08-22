import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { Colors } from '../../constants/colors';
import { Category } from '../../constants/scenarios';

const categoryColors: Record<Category, { text: string; bg: string; border: string }> = {
  'On-Site': { text: Colors.orange, bg: Colors.orangeTint, border: Colors.orangeBorder },
  'Business': { text: Colors.violet, bg: Colors.violetTint, border: Colors.violetBorder },
  'Production': { text: Colors.cyan, bg: Colors.cyanTint, border: Colors.cyanBorder },
  'Travel': { text: Colors.green, bg: Colors.greenTint, border: Colors.greenBorder },
};

interface BadgeProps {
  category: Category;
}

export function Badge({ category }: BadgeProps) {
  const c = categoryColors[category];
  return (
    <Text
      style={[
        styles.badge,
        { color: c.text, backgroundColor: c.bg, borderColor: c.border },
      ]}
    >
      {category}
    </Text>
  );
}

const styles = StyleSheet.create({
  badge: {
    fontSize: 10,
    fontWeight: '600',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    overflow: 'hidden',
  },
});
