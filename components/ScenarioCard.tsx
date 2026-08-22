import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Scenario } from '../constants/scenarios';
import { Colors } from '../constants/colors';
import { Badge } from './ui/Badge';
import { useApp } from '../context/AppContext';

interface ScenarioCardProps {
  scenario: Scenario;
  featured?: boolean;
}

export function ScenarioCard({ scenario, featured }: ScenarioCardProps) {
  const router = useRouter();
  const { chineseAssist } = useApp();

  return (
    <Pressable
      style={[styles.card, featured && styles.cardFeatured]}
      onPress={() => router.push(`/practice/${scenario.id}`)}
    >
      <View style={styles.top}>
        <Text style={styles.icon}>{scenario.icon}</Text>
        <Badge category={scenario.category} />
      </View>
      <Text style={styles.title}>{scenario.title}</Text>
      {chineseAssist && (
        <Text style={styles.titleCn}>{scenario.titleCn}</Text>
      )}
      <Text style={styles.desc}>{scenario.description}</Text>
      <Text style={styles.arrow}>Practice →</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
  },
  cardFeatured: {
    borderColor: '#ff6b2b26',
    backgroundColor: '#ff6b2b06',
  },
  top: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  icon: { fontSize: 22 },
  title: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 2,
  },
  titleCn: {
    fontSize: 11,
    color: Colors.dim,
    marginBottom: 5,
  },
  desc: {
    fontSize: 12,
    color: Colors.muted,
    lineHeight: 18,
  },
  arrow: {
    fontSize: 12,
    color: Colors.orange,
    marginTop: 8,
  },
});
