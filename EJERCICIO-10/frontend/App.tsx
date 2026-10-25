import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native';

const API_URL = 'http://TU_IP_LOCAL:3000';

type Destino = {
  id: number;
  ciudad: string;
  pais: string;
  descripcion: string;
  visitado: boolean;
};

export default function App() {
  const [destinos, setDestinos] = useState<Destino[]>([]);
  const [ciudad, setCiudad] = useState('');
  const [pais, setPais] = useState('');
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
      const response = await request(`${API_URL}/destinos`);
      setDestinos((await response.json()) as Destino[]);
      setError('');
    } catch {
      setError('No se pudieron cargar los destinos.');
    } finally {
      setCargando(false);
    }
  }, [request]);

  useEffect(() => {
    void cargar();
  }, [cargar]);

  async function crear(): Promise<void> {
    if (!ciudad.trim() || !pais.trim()) {
      setError('Escribe ciudad y país.');
      return;
    }
    setError('');
    try {
      await request(`${API_URL}/destinos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ciudad: ciudad.trim(), pais: pais.trim(), descripcion: 'Nuevo destino', visitado: false }),
      });
      setCiudad('');
      setPais('');
      await cargar();
    } catch {
      setError('No se pudo crear.');
    }
  }

  async function editar(id: number): Promise<void> {
    setOcupado(id);
    setError('');
    try {
      await request(`${API_URL}/destinos/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ descripcion: 'Destino actualizado' }),
      });
      await cargar();
    } catch {
      setError('No se pudo actualizar.');
    } finally {
      setOcupado(null);
    }
  }

  async function marcarVisitado(id: number): Promise<void> {
    setOcupado(id);
    setError('');
    try {
      await request(`${API_URL}/destinos/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ visitado: true }),
      });
      await cargar();
    } catch {
      setError('No se pudo marcar como visitado.');
    } finally {
      setOcupado(null);
    }
  }

  async function eliminar(id: number): Promise<void> {
    setOcupado(id);
    setError('');
    try {
      await request(`${API_URL}/destinos/${id}`, { method: 'DELETE' });
      await cargar();
    } catch {
      setError('No se pudo eliminar.');
    } finally {
      setOcupado(null);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>🌍 Wander</Text>
      {!!error && <Text style={styles.error}>{error}</Text>}
      <TextInput placeholder="Ciudad" value={ciudad} onChangeText={setCiudad} style={styles.input} />
      <TextInput placeholder="País" value={pais} onChangeText={setPais} style={styles.input} />
      <Pressable style={styles.createButton} onPress={() => void crear()}>
        <Text style={styles.buttonText}>Crear destino</Text>
      </Pressable>

      {cargando ? <ActivityIndicator size="large" color="#2563eb" style={styles.loader} /> : (
        <FlatList
          data={destinos}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.list}
          ListEmptyComponent={<Text style={styles.empty}>No hay destinos.</Text>}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.place}>🌍 {item.ciudad}</Text>
              <Text style={styles.country}>{item.pais}</Text>
              <Text style={styles.description}>{item.descripcion}</Text>
              <Text style={item.visitado ? styles.visited : styles.pending}>{item.visitado ? 'Visitado ✓' : 'Pendiente'}</Text>
              <View style={styles.actions}>
                {!item.visitado && <Pressable style={styles.visitButton} onPress={() => void marcarVisitado(item.id)} disabled={ocupado === item.id}>
                  <Text style={styles.buttonText}>Marcar visitado</Text>
                </Pressable>}
                <Pressable style={styles.editButton} onPress={() => void editar(item.id)} disabled={ocupado === item.id}>
                  <Text style={styles.buttonText}>Editar</Text>
                </Pressable>
                <Pressable style={styles.deleteButton} onPress={() => void eliminar(item.id)} disabled={ocupado === item.id}>
                  <Text style={styles.buttonText}>Eliminar</Text>
                </Pressable>
              </View>
            </View>
          )}
        />
      )}
      <Text style={styles.endpoint}>CRUD + mejora Full Stack ✓</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#f4f7fb' },
  title: { fontSize: 30, fontWeight: '700', marginBottom: 20, color: '#17233c' },
  input: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#ccd5e4', borderRadius: 10, padding: 12, marginBottom: 12 },
  createButton: { alignItems: 'center', backgroundColor: '#17233c', borderRadius: 9, padding: 13, marginBottom: 18 },
  loader: { marginTop: 24 },
  list: { gap: 14, paddingBottom: 16 },
  card: { backgroundColor: '#fff', borderRadius: 16, padding: 18, elevation: 2 },
  place: { fontSize: 22, fontWeight: '700', color: '#17233c' },
  country: { fontSize: 16, marginTop: 5, color: '#526078' },
  description: { fontSize: 15, marginTop: 7, color: '#6b7280' },
  visited: { fontSize: 15, fontWeight: '700', marginTop: 10, color: '#176b3a' },
  pending: { fontSize: 15, fontWeight: '700', marginTop: 10, color: '#a16207' },
  actions: { flexDirection: 'row', gap: 8, marginTop: 15 },
  visitButton: { flex: 1, alignItems: 'center', backgroundColor: '#2563eb', borderRadius: 8, padding: 10 },
  editButton: { alignItems: 'center', backgroundColor: '#64748b', borderRadius: 8, padding: 10 },
  deleteButton: { alignItems: 'center', backgroundColor: '#dc2626', borderRadius: 8, padding: 10 },
  buttonText: { color: '#fff', fontSize: 13, fontWeight: '700' },
  error: { color: '#b91c1c', textAlign: 'center', marginBottom: 12 },
  empty: { textAlign: 'center', color: '#6b7280' },
  endpoint: { textAlign: 'center', marginTop: 12, color: '#6b7280' },
});

