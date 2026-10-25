import { useState } from 'react';
import { ActivityIndicator, Pressable, SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native';

const API_URL = 'http://TU_IP_LOCAL:3000';

type Viaje = {
  id: number;
  destino: string;
  pais: string;
  estado: string;
  fecha: string;
};

function formatFecha(fecha: string): string {
  const [year, month, day] = fecha.slice(0, 10).split('-');
  return `${day}/${month}/${year}`;
}

export default function App() {
  const [viaje, setViaje] = useState<Viaje>({
    id: 1,
    destino: 'Tokio',
    pais: 'Japón',
    estado: 'RESERVADO',
    fecha: '2027-04-01',
  });
  const [estado, setEstado] = useState('RESERVADO');
  const [fecha, setFecha] = useState('2027-04-10');
  const [mensaje, setMensaje] = useState('');
  const [guardando, setGuardando] = useState(false);

  async function guardarCambios(): Promise<void> {
    setGuardando(true);
    setMensaje('');

    try {
      const response = await fetch(`${API_URL}/viajes/1`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado, fecha }),
      });

      if (!response.ok) {
        throw new Error(`Error HTTP ${response.status}`);
      }

      const actualizado = (await response.json()) as Viaje;
      setViaje(actualizado);
      setMensaje('✓ Actualizado');
    } catch (error) {
      setMensaje(error instanceof Error ? error.message : 'No se pudo actualizar el viaje');
    } finally {
      setGuardando(false);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>✈️ Travel Book</Text>
      <View style={styles.card}>
        <Text style={styles.destination}>✈️ {viaje.destino}</Text>
        <Text style={styles.subtitle}>{viaje.pais} · {viaje.estado}</Text>
        <Text style={styles.date}>📅 Fecha: {formatFecha(viaje.fecha)}</Text>
      </View>

      <Text style={styles.label}>Estado</Text>
      <TextInput value={estado} onChangeText={setEstado} style={styles.input} />
      <Text style={styles.label}>Fecha (YYYY-MM-DD)</Text>
      <TextInput value={fecha} onChangeText={setFecha} style={styles.input} autoCapitalize="none" />

      <Pressable style={styles.button} onPress={() => void guardarCambios()} disabled={guardando}>
        {guardando ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Guardar cambios</Text>}
      </Pressable>
      {!!mensaje && <Text style={styles.message}>{mensaje}</Text>}
      <Text style={styles.endpoint}>PATCH /viajes/1</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#f4f7fb' },
  title: { fontSize: 30, fontWeight: '700', marginBottom: 24, color: '#17233c' },
  card: { backgroundColor: '#fff', borderRadius: 16, padding: 20, marginBottom: 24, elevation: 2 },
  destination: { fontSize: 24, fontWeight: '700', color: '#17233c' },
  subtitle: { fontSize: 16, marginTop: 8, color: '#526078' },
  date: { fontSize: 16, marginTop: 14, color: '#526078' },
  label: { fontSize: 15, fontWeight: '600', marginBottom: 6, color: '#17233c' },
  input: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#ccd5e4', borderRadius: 10, padding: 12, marginBottom: 16 },
  button: { alignItems: 'center', backgroundColor: '#2563eb', borderRadius: 10, padding: 14, marginTop: 4 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  message: { textAlign: 'center', marginTop: 16, color: '#176b3a', fontWeight: '700' },
  endpoint: { textAlign: 'center', marginTop: 12, color: '#6b7280' },
});

