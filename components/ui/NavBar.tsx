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
  /** Hide the settings gear (e.g. on the Settings screen itself) */
  hideSettings?: boolean;
}

export function NavBar({
  rightLabel, rightLabelCn, rightHref, rightHighlighted, hideSettings,
}: NavBarProps) {
  const router = useRouter();
  const { chineseAssist } = useApp();
  return (
    <View style={styles.bar}>
      <Text style={styles.logo}>◈ ON STAGE</Text>

      <View style={styles.right}>
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

        {!hideSettings && (
          <Pressable
            onPress={() => router.push('/settings')}
            style={styles.settingsBtn}
            hitSlop={10}
          >
            <Text style={styles.settingsIcon}>⚙</Text>
            {chineseAssist && <Text style={styles.settingsCn}>设置</Text>}
          </Pressable>
        )}
      </View>
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
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 18,
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
  settingsBtn: {
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border2,
    borderRadius: 8,
    paddingHorizontal: 9,
    paddingVertical: 4,
    backgroundColor: Colors.card,
  },
  settingsIcon: { fontSize: 15, color: Colors.text },
  settingsCn: { fontSize: 8, color: Colors.dim, marginTop: 1 },
});
