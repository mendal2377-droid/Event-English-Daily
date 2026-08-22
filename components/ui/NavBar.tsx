import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '../../constants/colors';
import { useApp } from '../../context/AppContext';

interface NavBarProps {
  rightLabel?: string;
  rightLabelCn?: string;
  rightHref?: string;
  rightHighlighted?: boolean;
}

export function NavBar({ rightLabel, rightLabelCn, rightHref, rightHighlighted }: NavBarProps) {
  const router = useRouter();
  const { chineseAssist } = useApp();
  return (
    <View style={styles.bar}>
      <Text style={styles.logo}>◈ ON STAGE</Text>
      {rightLabel && (
        <Pressable onPress={() => rightHref && router.push(rightHref as any)}>
          <Text style={[styles.linkEn, rightHighlighted && styles.linkEnHi]}>
            {rightLabel}
          </Text>
          {chineseAssist && rightLabelCn && (
            <Text style={[styles.linkCn, rightHighlighted && styles.linkCnHi]}>
              {rightLabelCn}
            </Text>
          )}
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    backgroundColor: Colors.bg,
  },
  logo: {
    fontFamily: 'serif',
    fontSize: 13,
    color: Colors.orange,
    fontWeight: '600',
  },
  linkEn: {
    fontSize: 12,
    color: Colors.muted,
    textAlign: 'right',
  },
  linkEnHi: { color: Colors.violet },
  linkCn: {
    fontSize: 10,
    color: Colors.dim,
    textAlign: 'right',
  },
  linkCnHi: { color: Colors.violet, opacity: 0.7 },
});
