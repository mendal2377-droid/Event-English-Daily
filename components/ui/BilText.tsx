import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { useApp } from '../../context/AppContext';
import { Colors } from '../../constants/colors';
import { cnSize } from '../../constants/typography';

interface BilTextProps {
  en: string;
  cn: string;
  enStyle?: object;
  cnStyle?: object;
  style?: object;
}

export function BilText({ en, cn, enStyle, cnStyle, style }: BilTextProps) {
  const { chineseAssist } = useApp();
  return (
    <View style={style}>
      <Text style={[styles.en, enStyle]}>{en}</Text>
      {chineseAssist && (
        <Text style={[styles.cn, cnStyle]}>{cn}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  en: {
    color: Colors.text,
    fontSize: 14,
  },
  cn: {
    color: Colors.dim,
    fontSize: cnSize(14),
    marginTop: 2,
    fontStyle: 'normal',
  },
});
