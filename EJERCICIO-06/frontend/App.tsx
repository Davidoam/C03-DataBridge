import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';

const API_URL = 'http://TU_IP_LOCAL:3000';

type Libro = {
  id: number;
  titulo: string;
  autor: string;
  genero: string;
  leido: boolean;
};

export default function App() {
  const [libros, setLibros] = useState<Libro[]>([]);
  const [cargando, setCargando] = useState(true);
  const [mensaje, setMensaje] = useState('');
  const [ocupado, setOcupado] = useState<number | null>(null);

  const cargar = useCallback(async (): Promise<void> => {
    try {
      const response = await fetch(`${API_URL}/libros`);
      if (!response.ok) {
        throw new Error(`Error HTTP ${response.status}`);
      }
      setLibros((await response.json()) as Libro[]);
    } catch (error) {
      setMensaje(error instanceof Error ? error.message : 'No se pudo cargar la biblioteca');
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    void cargar();
  }, [cargar]);

  function confirmarEliminacion(libro: Libro): void {
    Alert.alert('Eliminar libro', `¿Quieres eliminar «${libro.titulo}»?`, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Eliminar', style: 'destructive', onPress: () => void eliminar(libro.id) },
    ]);
  }

  async function eliminar(id: number): Promise<void> {
    setOcupado(id);
    setMensaje('');
    try {
      const response = await fetch(`${API_URL}/libros/${id}`, { method: 'DELETE' });
      if (!response.ok) {
        throw new Error(`Error HTTP ${response.status}`);
      }
      await cargar();
      setMensaje('✓ Libro eliminado');
    } catch (error) {
      setMensaje(error instanceof Error ? error.message : 'No se pudo eliminar el libro');
    } finally {
      setOcupado(null);
    }
  }

  async function marcarComoLeido(id: number): Promise<void> {
    setOcupado(id);
    setMensaje('');
    try {
      const response = await fetch(`${API_URL}/libros/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leido: true }),
      });
      if (!response.ok) {
        throw new Error(`Error HTTP ${response.status}`);
      }
      await cargar();
      setMensaje('✓ Libro marcado como leído');
    } catch (error) {
      setMensaje(error instanceof Error ? error.message : 'No se pudo actualizar el libro');
    } finally {
      setOcupado(null);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>📚 My Library</Text>
      {cargando ? <ActivityIndicator size="large" color="#2563eb" /> : (
        <FlatList
          data={libros}
          keyExtractor={(libro) => String(libro.id)}
          contentContainerStyle={styles.list}
          ListEmptyComponent={<Text style={styles.empty}>No hay libros en la biblioteca.</Text>}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.bookTitle}>📚 {item.titulo}</Text>
              <Text style={styles.author}>{item.autor}</Text>
              <Text style={styles.genre}>{item.genero}</Text>
              <Text style={item.leido ? styles.read : styles.pending}>
                {item.leido ? 'Leído ✓' : 'Pendiente'}
              </Text>
              <View style={styles.actions}>
                {!item.leido && (
                  <Pressable style={styles.readButton} onPress={() => void marcarComoLeido(item.id)} disabled={ocupado === item.id}>
                    {ocupado === item.id ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Marcar como leído</Text>}
                  </Pressable>
                )}
                <Pressable style={styles.deleteButton} onPress={() => confirmarEliminacion(item)} disabled={ocupado === item.id}>
                  <Text style={styles.buttonText}>Eliminar</Text>
                </Pressable>
              </View>
            </View>
          )}
        />
      )}
      {!!mensaje && <Text style={styles.message}>{mensaje}</Text>}
      <Text style={styles.endpoint}>DELETE + PATCH · UI sincronizada</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#f4f7fb' },
  title: { fontSize: 30, fontWeight: '700', marginBottom: 24, color: '#17233c' },
  list: { gap: 16, paddingBottom: 16 },
  card: { backgroundColor: '#fff', borderRadius: 16, padding: 18, elevation: 2 },
  bookTitle: { fontSize: 22, fontWeight: '700', color: '#17233c' },
  author: { fontSize: 16, marginTop: 8, color: '#526078' },
  genre: { fontSize: 14, marginTop: 4, color: '#6b7280' },
  read: { fontSize: 15, fontWeight: '700', marginTop: 12, color: '#176b3a' },
  pending: { fontSize: 15, fontWeight: '700', marginTop: 12, color: '#a16207' },
  actions: { flexDirection: 'row', gap: 10, marginTop: 16 },
  readButton: { flex: 1, alignItems: 'center', backgroundColor: '#2563eb', borderRadius: 8, padding: 11 },
  deleteButton: { alignItems: 'center', backgroundColor: '#dc2626', borderRadius: 8, padding: 11 },
  buttonText: { color: '#fff', fontSize: 14, fontWeight: '700' },
  empty: { textAlign: 'center', color: '#6b7280' },
  message: { textAlign: 'center', marginTop: 12, color: '#176b3a', fontWeight: '700' },
  endpoint: { textAlign: 'center', marginTop: 12, color: '#6b7280' },
});

