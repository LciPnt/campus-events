import { StyleSheet, Text, View } from 'react-native';

export default function Page() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Події коледжу</Text>
      <Text style={styles.description}>
        Слідкуйте за найсвіжішими заходами, лекціями та подіями нашого навчального закладу.
      </Text>
      <Text style={styles.subtitle}>Список подій з’явиться тут</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 12,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#4a5568',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  subtitle: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#718096',
    textAlign: 'center',
  },
});