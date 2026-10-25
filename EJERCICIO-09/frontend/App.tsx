import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native';

const API_URL = 'http://TU_IP_LOCAL:3000';

type Evento = {
  id: number;
  nombre: string;
  ciudad: string;
  categoria: string;
  fecha: string;
};

export default function App() {
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [ciudad, setCiudad] = useState('Zaragoza');
  const [categoria, setCategoria] = useState('Tecnología');
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  const filtrar = useCallback(async (ciudadFiltro: string, categoriaFiltro: string): Promise<void> => {
    setCargando(true);
    setError('');
    const params: string[] = [];
    const ciudadLimpia = ciudadFiltro.trim();
    const categoriaLimpia = categoriaFiltro.trim();

    if (ciudadLimpia) {
      params.push(`ciudad=${encodeURIComponent(ciudadLimpia)}`);
    }
    if (categoriaLimpia) {
      params.push(`categoria=${encodeURIComponent(categoriaLimpia)}`);
    }

    const query = params.length > 0 ? `?${params.join('&')}` : '';

    try {
      const response = await fetch(`${API_URL}/eventos${query}`);
      if (!response.ok) {
        throw new Error(`Error HTTP ${response.status}`);
      }
      setEventos((await response.json()) as Evento[]);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'No se pudo conectar con la API');
      setEventos([]);
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    void filtrar(ciudad, categoria);
  }, [filtrar]);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>🎟️ Event Radar</Text>
      <TextInput placeholder="Ciudad" value={ciudad} onChangeText={setCiudad} style={styles.input} />
      <TextInput placeholder="Categoría" value={categoria} onChangeText={setCategoria} style={styles.input} />
      <Pressable style={styles.button} onPress={() => void filtrar(ciudad, categoria)}>
        <Text style={styles.buttonText}>Filtrar eventos</Text>
      </Pressable>

      {cargando ? <ActivityIndicator size="large" color="#2563eb" style={styles.loader} /> : (
        <FlatList
          data={eventos}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.list}
          ListEmptyComponent={<Text style={styles.empty}>No hay eventos con esos filtros.</Text>}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.name}>🎟️ {item.nombre}</Text>
              <Text style={styles.details}>{item.ciudad} · {item.categoria}</Text>
              <Text style={styles.date}>{item.fecha}</Text>
            </View>
          )}
        />
      )}
      {!!error && <Text style={styles.error}>{error}</Text>}
      <Text style={styles.endpoint}>Query Params · ciudad + categoría</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#f4f7fb' },
  title: { fontSize: 30, fontWeight: '700', marginBottom: 20, color: '#17233c' },
  input: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#ccd5e4', borderRadius: 10, padding: 12, marginBottom: 12 },
  button: { alignItems: 'center', backgroundColor: '#2563eb', borderRadius: 10, padding: 14, marginBottom: 18 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  loader: { marginTop: 24 },
  list: { gap: 12, paddingBottom: 18 },
  card: { backgroundColor: '#fff', borderRadius: 14, padding: 16, elevation: 2 },
  name: { fontSize: 21, fontWeight: '700', color: '#17233c' },
  details: { fontSize: 16, marginTop: 7, color: '#526078' },
  date: { fontSize: 15, marginTop: 8, color: '#6b7280' },
  empty: { textAlign: 'center', color: '#6b7280' },
  error: { textAlign: 'center', color: '#b91c1c', marginTop: 12 },
  endpoint: { textAlign: 'center', marginTop: 12, color: '#6b7280' },
});

