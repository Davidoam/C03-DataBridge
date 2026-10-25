import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';

const API_URL = 'http://TU_IP_LOCAL:3000';

type Sneaker = {
  id: number;
  marca: string;
  modelo: string;
  precio: number;
  talla: number;
  stock: number;
};

export default function App() {
  const [items, setItems] = useState<Sneaker[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [ocupado, setOcupado] = useState<number | null>(null);

  const request = useCallback(async (url: string, options?: RequestInit): Promise<Response> => {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    return response;
  }, []);

  const cargar = useCallback(async (): Promise<void> => {
    try {
      const response = await request(`${API_URL}/sneakers`);
      setItems((await response.json()) as Sneaker[]);
      setError('');
    } catch {
      setError('No se pudo conectar con la API.');
    } finally {
      setCargando(false);
    }
  }, [request]);

  useEffect(() => {
    void cargar();
  }, [cargar]);

  async function crear(): Promise<void> {
    setError('');
    try {
      await request(`${API_URL}/sneakers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ marca: 'Nike', modelo: 'Air Max 1', precio: 149.99, talla: 42, stock: 4 }),
      });
      await cargar();
    } catch {
      setError('Error al crear.');
    }
  }

  async function rebajar(id: number): Promise<void> {
    setOcupado(id);
    setError('');
    try {
      await request(`${API_URL}/sneakers/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ precio: 139.99 }),
      });
      await cargar();
    } catch {
      setError('Error al actualizar.');
    } finally {
      setOcupado(null);
    }
  }

  async function eliminar(id: number): Promise<void> {
    setOcupado(id);
    setError('');
    try {
      await request(`${API_URL}/sneakers/${id}`, { method: 'DELETE' });
      await cargar();
    } catch {
      setError('Error al eliminar.');
    } finally {
      setOcupado(null);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>👟 Sneaker Vault</Text>
      {error !== '' && <Text style={styles.error}>{error}</Text>}
      <Pressable style={styles.newButton} onPress={() => void crear()}>
        <Text style={styles.buttonText}>Nueva</Text>
      </Pressable>
      {cargando ? <ActivityIndicator size="large" color="#2563eb" /> : (
        <FlatList
          data={items}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.list}
          ListEmptyComponent={<Text style={styles.empty}>No hay zapatillas en el inventario.</Text>}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.model}>👟 {item.modelo}</Text>
              <Text style={styles.details}>{item.marca} · Talla {item.talla}</Text>
              <Text style={styles.price}>{Number(item.precio).toFixed(2)} €</Text>
              {item.stock === 0 ? <Text style={styles.soldOut}>AGOTADO</Text> : <Text style={styles.stock}>Stock {item.stock}</Text>}
              <View style={styles.actions}>
                <Pressable style={styles.updateButton} onPress={() => void rebajar(item.id)} disabled={ocupado === item.id}>
                  {ocupado === item.id ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Rebajar</Text>}
                </Pressable>
                <Pressable style={styles.deleteButton} onPress={() => void eliminar(item.id)} disabled={ocupado === item.id}>
                  <Text style={styles.buttonText}>Eliminar</Text>
                </Pressable>
              </View>
            </View>
          )}
        />
      )}
      <Text style={styles.endpoint}>CRUD · GET · POST · PATCH · DELETE ✓</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#f4f7fb' },
  title: { fontSize: 30, fontWeight: '700', marginBottom: 20, color: '#17233c' },
  list: { gap: 16, paddingVertical: 16 },
  card: { backgroundColor: '#fff', borderRadius: 16, padding: 18, elevation: 2 },
  model: { fontSize: 22, fontWeight: '700', color: '#17233c' },
  details: { fontSize: 16, marginTop: 8, color: '#526078' },
  price: { fontSize: 16, marginTop: 8, color: '#17233c' },
  stock: { fontSize: 15, fontWeight: '700', marginTop: 10, color: '#176b3a' },
  soldOut: { fontSize: 15, fontWeight: '800', marginTop: 10, color: '#b91c1c' },
  actions: { flexDirection: 'row', gap: 10, marginTop: 16 },
  newButton: { alignItems: 'center', backgroundColor: '#17233c', borderRadius: 9, padding: 13 },
  updateButton: { flex: 1, alignItems: 'center', backgroundColor: '#2563eb', borderRadius: 8, padding: 11 },
  deleteButton: { alignItems: 'center', backgroundColor: '#dc2626', borderRadius: 8, padding: 11 },
  buttonText: { color: '#fff', fontSize: 14, fontWeight: '700' },
  error: { color: '#b91c1c', marginBottom: 12, textAlign: 'center' },
  empty: { textAlign: 'center', color: '#6b7280' },
  endpoint: { textAlign: 'center', marginTop: 12, color: '#6b7280' },
});

