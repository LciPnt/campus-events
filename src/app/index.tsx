import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { EventCard } from '../components/EventCard';
import { initialEvents } from '../data/events';

export default function Page() {
  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Події коледжу</Text>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {initialEvents.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7fafc',
    paddingTop: 50,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1a202c',
    textAlign: 'center',
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
});