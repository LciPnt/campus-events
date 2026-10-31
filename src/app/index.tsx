import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { EventCard } from '../components/EventCard';
import { EventForm } from '../components/EventForm';
import { additionalEvents, initialEvents } from '../data/events';
import { EventItem } from '../types/event';

type CategoryFilter = EventItem['category'] | 'Усі';
const CATEGORIES: CategoryFilter[] = ['Усі', 'Навчання', 'Культура', 'Спорт'];

const COLUMN_BREAKPOINT = 700;
const SIDE_PADDING = 16;
const COLUMN_GAP = 12;

export default function Page() {
  const { width } = useWindowDimensions();
  const columns = width >= COLUMN_BREAKPOINT ? 2 : 1;
  const twoColumnItemWidth = (width - SIDE_PADDING * 2 - COLUMN_GAP) / 2;

  const [events, setEvents] = useState<EventItem[]>(initialEvents);
  const [category, setCategory] = useState<CategoryFilter>('Усі');
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [filterNotice, setFilterNotice] = useState<string>('');
  const [refreshing, setRefreshing] = useState(false);
  const previousCategory = useRef<CategoryFilter>(category);

  useEffect(() => {
    if (previousCategory.current !== category) {
      previousCategory.current = category;
      setFilterNotice(`Фільтр: ${category}`);
      const timer = setTimeout(() => setFilterNotice(''), 2000);
      return () => clearTimeout(timer);
    }
  }, [category]);

  const visibleEvents = useMemo(() => {
    if (category === 'Усі') {
      return events;
    }
    return events.filter((event) => event.category === category);
  }, [events, category]);

  const handleToggleFavorite = (id: string) => {
    setFavoriteIds((current) =>
      current.includes(id) ? current.filter((itemId) => itemId !== id) : [...current, id]
    );
  };

  const handleAddEvent = (event: EventItem) => {
    setEvents((previous) => [event, ...previous]);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await new Promise<void>((resolve) => setTimeout(resolve, 800));
      setEvents((current) => {
        const knownIds = new Set(current.map((event) => event.id));
        const fresh = additionalEvents.filter((event) => !knownIds.has(event.id));
        return fresh.length > 0 ? [...current, ...fresh] : current;
      });
    } finally {
      setRefreshing(false);
    }
  };

  const listHeader = (
    <View>
      <Image
        source={require('../../assets/images/college-events.jpg')}
        accessible
        accessibilityLabel="Логотип БКПЕПу"
        style={styles.banner}
        resizeMode="cover"
      />
      <Text style={styles.headerTitle}>Події коледжу</Text>

      <EventForm onAdd={handleAddEvent} />

      <View style={styles.categoryContainer}>
        {CATEGORIES.map((cat) => {
          const isActive = category === cat;
          return (
            <Pressable
              key={cat}
              style={({ pressed }) => [
                styles.categoryButton,
                isActive && styles.categoryButtonActive,
                pressed && styles.pressed,
              ]}
              onPress={() => setCategory(cat)}
              accessibilityRole="button"
              accessibilityLabel={`Фільтр ${cat}`}
            >
              <Text style={[styles.categoryText, isActive && styles.categoryTextActive]}>
                {cat}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.infoBar}>
        <Text style={styles.favoritesCount}>Обрано: {favoriteIds.length}</Text>
        {filterNotice !== '' && <Text style={styles.noticeText}>{filterNotice}</Text>}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        key={columns}
        numColumns={columns}
        columnWrapperStyle={columns === 2 ? styles.columnWrapper : undefined}
        data={visibleEvents}
        keyExtractor={(event) => event.id}
        extraData={favoriteIds}
        renderItem={({ item }) => (
          <View style={columns === 2 ? [styles.cell, { maxWidth: twoColumnItemWidth }] : undefined}>
            <EventCard
              event={item}
              isFavorite={favoriteIds.includes(item.id)}
              onToggleFavorite={() => handleToggleFavorite(item.id)}
            />
          </View>
        )}
        ListHeaderComponent={listHeader}
        ListEmptyComponent={
          <Text style={styles.emptyText}>У цій категорії поки немає подій</Text>
        }
        refreshing={refreshing}
        onRefresh={handleRefresh}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f7fafc', paddingTop: 50 },
  listContent: { paddingHorizontal: SIDE_PADDING, paddingBottom: 24 },
  columnWrapper: { gap: COLUMN_GAP },
  cell: { flex: 1 },
  banner: { width: '100%', height: 150, borderRadius: 12, marginBottom: 12 },
  headerTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1a202c',
    textAlign: 'center',
    marginBottom: 16,
  },
  categoryContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 },
  categoryButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#edf2f7',
    borderWidth: 1,
    borderColor: '#cbd5e0',
  },
  categoryButtonActive: { backgroundColor: '#3182ce', borderColor: '#3182ce' },
  pressed: { opacity: 0.7 },
  categoryText: { fontSize: 14, fontWeight: '600', color: '#4a5568' },
  categoryTextActive: { color: '#ffffff' },
  infoBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    minHeight: 24,
  },
  favoritesCount: { fontSize: 15, fontWeight: 'bold', color: '#2d3748' },
  noticeText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#9c4221',
    backgroundColor: '#feebc8',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#718096',
    marginTop: 32,
    fontStyle: 'italic',
  },
});
