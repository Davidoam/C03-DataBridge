import { useState } from 'react';
import {
  ActivityIndicator,
  Button,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

type Restaurante = {
  id: number;
  nombre: string;
  tipo: string;
  ciudad: string;
  puntuacion: number;
  precioMedio: number;
};

const API_URL = 'http://TU_IP_LOCAL:3000';

export default function App() {
  const [nombre, setNombre] = useState('');
  const [tipo, setTipo] = useState('');
  const [ciudad, setCiudad] = useState('');
  const [precioMedio, setPrecioMedio] = useState('');
  const [restaurante, setRestaurante] = useState<Restaurante | null>(null);
  const [mensaje, setMensaje] = useState('');
  const [guardando, setGuardando] = useState(false);

  async function guardar(): Promise<void> {
    setGuardando(true);
    setMensaje('');

    try {
      const respuesta = await fetch(`${API_URL}/restaurantes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre,
          tipo,
          ciudad,
          puntuacion: 9,
          precioMedio: Number(precioMedio),
        }),
      });

      if (!respuesta.ok) {
        throw new Error('Error al guardar');
      }

      const dato: Restaurante = await respuesta.json();
      setRestaurante(dato);
      setMensaje('✓ Persistido');
    } catch {
      setMensaje('Error al guardar');
    } finally {
      setGuardando(false);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>🍜 Food Spots</Text>
      <Text style={styles.subtitle}>Nuevo restaurante</Text>

      <TextInput
        style={styles.input}
        placeholder="Nombre"
        value={nombre}
        onChangeText={setNombre}
      />
      <TextInput
        style={styles.input}
        placeholder="Tipo"
        value={tipo}
        onChangeText={setTipo}
      />
      <TextInput
        style={styles.input}
        placeholder="Ciudad"
        value={ciudad}
        onChangeText={setCiudad}
      />
      <TextInput
        style={styles.input}
        placeholder="Precio medio"
        keyboardType="numeric"
        value={precioMedio}
        onChangeText={setPrecioMedio}
      />

      {guardando ? (
        <ActivityIndicator size="small" />
      ) : (
        <Button title="Guardar restaurante" onPress={guardar} />
      )}

      {mensaje !== '' && <Text style={styles.message}>{mensaje}</Text>}

      {restaurante && (
        <View style={styles.card}>
          <Text style={styles.restaurant}>🍜 {restaurante.nombre}</Text>
          <Text style={styles.details}>
            {restaurante.tipo} · {restaurante.ciudad}
          </Text>
          <Text style={styles.price}>
            Precio medio: {Number(restaurante.precioMedio)} €
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#FFF7ED' },
  title: { color: '#431407', fontSize: 30, fontWeight: '800', marginBottom: 6 },
  subtitle: { color: '#9A3412', fontSize: 18, marginBottom: 20 },
  input: {
    backgroundColor: '#FFFFFF',
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#FED7AA',
  },
  message: { color: '#166534', fontWeight: '700', marginTop: 14 },
  card: {
    backgroundColor: '#FFFFFF',
    padding: 18,
    borderRadius: 16,
    marginTop: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#EA580C',
  },
  restaurant: { color: '#431407', fontSize: 20, fontWeight: '800' },
  details: { color: '#7C2D12', marginTop: 8 },
  price: { color: '#9A3412', fontWeight: '700', marginTop: 8 },
});
