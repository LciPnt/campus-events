import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { EventItem } from '../types/event';

type EventCardProps = {
  event: EventItem;
  isFavorite: boolean;
  onToggleFavorite: () => void;
};

export function EventCard({ event, isFavorite, onToggleFavorite }: EventCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>{event.title}</Text>
        <Text style={styles.category}>{event.category}</Text>
      </View>
      <Text style={styles.info}>📅 {event.date}  •  📍 {event.place}</Text>
      <Text style={styles.description}>{event.description}</Text>

      <Pressable
        style={[styles.favoriteButton, isFavorite && styles.favoriteButtonActive]}
        onPress={onToggleFavorite}
        accessibilityRole="button"
        accessibilityLabel={
          isFavorite
            ? `Видалити ${event.title} з обраного`
            : `Додати ${event.title} до обраного`
        }
      >
        <Text style={[styles.favoriteButtonText, isFavorite && styles.favoriteButtonTextActive]}>
          {isFavorite ? 'Прибрати з обраного' : 'В обране'}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a202c',
    flex: 1,
    marginRight: 8,
  },
  category: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2b6cb0',
    backgroundColor: '#ebf8ff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    overflow: 'hidden',
  },
  info: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4a5568',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#718096',
    lineHeight: 20,
    marginBottom: 12,
  },
  favoriteButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#3182ce',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  favoriteButtonActive: {
    backgroundColor: '#e53e3e',
    borderColor: '#e53e3e',
  },
  favoriteButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3182ce',
  },
  favoriteButtonTextActive: {
    color: '#ffffff',
  },
});