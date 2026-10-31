import React, { useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { EventItem } from '../types/event';

type Category = EventItem['category'];
type FieldName = 'title' | 'date' | 'place' | 'description';
type FormErrors = Partial<Record<FieldName, string>>;

type EventFormProps = {
  onAdd: (event: EventItem) => void;
};

const FORM_CATEGORIES: Category[] = ['Навчання', 'Культура', 'Спорт'];
// Перевіряє лише запис «дд.мм, гг:хх», а не існування дня чи години.
const DATE_PATTERN = /^\d{2}\.\d{2}, \d{2}:\d{2}$/;

export function EventForm({ onAdd }: EventFormProps) {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [place, setPlace] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<Category>('Навчання');
  const [errors, setErrors] = useState<FormErrors>({});
  const counter = useRef(0);

  const clearError = (field: FieldName) =>
    setErrors((current) => (current[field] ? { ...current, [field]: undefined } : current));

  const handleSubmit = () => {
    const cleanTitle = title.trim();
    const cleanDate = date.trim();
    const cleanPlace = place.trim();
    const cleanDescription = description.trim();

    const nextErrors: FormErrors = {};
    if (!cleanTitle) nextErrors.title = 'Введіть назву події';
    if (!cleanDate) {
      nextErrors.date = 'Введіть дату й час';
    } else if (!DATE_PATTERN.test(cleanDate)) {
      nextErrors.date = 'Формат дати: дд.мм, гг:хх, наприклад 12.10, 14:00';
    }
    if (!cleanPlace) nextErrors.place = 'Введіть місце проведення';
    if (!cleanDescription) nextErrors.description = 'Введіть опис події';

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    counter.current += 1;
    onAdd({
      id: `local-${Date.now()}-${counter.current}`,
      title: cleanTitle,
      date: cleanDate,
      place: cleanPlace,
      category,
      description: cleanDescription,
    });

    setTitle('');
    setDate('');
    setPlace('');
    setDescription('');
    setErrors({});
  };

  const renderError = (field: FieldName) =>
    errors[field] ? (
      <Text style={styles.errorText} accessibilityRole="alert">
        Помилка: {errors[field]}
      </Text>
    ) : null;

  return (
    <View style={styles.form}>
      <Text style={styles.formTitle}>Нова подія</Text>

      <Text style={styles.label}>Назва</Text>
      <TextInput
        style={[styles.input, errors.title && styles.inputError]}
        value={title}
        onChangeText={(text) => {
          setTitle(text);
          clearError('title');
        }}
        placeholder="Наприклад, День відкритих дверей"
        placeholderTextColor="#a0aec0"
        returnKeyType="next"
      />
      {renderError('title')}

      <Text style={styles.label}>Дата й час</Text>
      <TextInput
        style={[styles.input, errors.date && styles.inputError]}
        value={date}
        onChangeText={(text) => {
          setDate(text);
          clearError('date');
        }}
        placeholder="12.10, 14:00"
        placeholderTextColor="#a0aec0"
        autoCapitalize="none"
        returnKeyType="next"
      />
      {renderError('date')}

      <Text style={styles.label}>Місце</Text>
      <TextInput
        style={[styles.input, errors.place && styles.inputError]}
        value={place}
        onChangeText={(text) => {
          setPlace(text);
          clearError('place');
        }}
        placeholder="Наприклад, Кабінет 101"
        placeholderTextColor="#a0aec0"
        returnKeyType="next"
      />
      {renderError('place')}

      <Text style={styles.label}>Опис</Text>
      <TextInput
        style={[styles.input, styles.inputMultiline, errors.description && styles.inputError]}
        value={description}
        onChangeText={(text) => {
          setDescription(text);
          clearError('description');
        }}
        placeholder="Коротко опишіть подію"
        placeholderTextColor="#a0aec0"
        multiline
        textAlignVertical="top"
      />
      {renderError('description')}

      <Text style={styles.label}>Категорія</Text>
      <View style={styles.categoryRow}>
        {FORM_CATEGORIES.map((item) => {
          const selected = item === category;
          return (
            <Pressable
              key={item}
              onPress={() => setCategory(item)}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              accessibilityLabel={`Категорія ${item}${selected ? ', вибрано' : ''}`}
              style={({ pressed }) => [
                styles.categoryButton,
                selected && styles.categoryButtonSelected,
                pressed && styles.pressed,
              ]}
            >
              <Text style={[styles.categoryText, selected && styles.categoryTextSelected]}>
                {selected ? '✓ ' : ''}
                {item}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <Pressable
        onPress={handleSubmit}
        accessibilityRole="button"
        accessibilityLabel="Додати подію"
        style={({ pressed }) => [styles.submitButton, pressed && styles.submitPressed]}
      >
        <Text style={styles.submitText}>Додати подію</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  form: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 16,
    marginBottom: 16,
  },
  formTitle: { fontSize: 18, fontWeight: 'bold', color: '#1a202c', marginBottom: 4 },
  label: { fontSize: 14, fontWeight: '600', color: '#2d3748', marginTop: 12, marginBottom: 4 },
  input: {
    borderWidth: 1,
    borderColor: '#cbd5e0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    color: '#1a202c',
    backgroundColor: '#f7fafc',
  },
  inputMultiline: { minHeight: 90 },
  inputError: { borderColor: '#c53030', backgroundColor: '#fff5f5' },
  errorText: { marginTop: 4, fontSize: 13, fontWeight: '600', color: '#c53030' },
  categoryRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  categoryButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#cbd5e0',
    backgroundColor: '#edf2f7',
  },
  categoryButtonSelected: { backgroundColor: '#3182ce', borderColor: '#3182ce' },
  categoryText: { fontSize: 14, fontWeight: '600', color: '#4a5568' },
  categoryTextSelected: { color: '#ffffff' },
  pressed: { opacity: 0.7 },
  submitButton: {
    marginTop: 16,
    backgroundColor: '#2b6cb0',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  submitPressed: { backgroundColor: '#2c5282' },
  submitText: { color: '#ffffff', fontSize: 16, fontWeight: 'bold' },
});
