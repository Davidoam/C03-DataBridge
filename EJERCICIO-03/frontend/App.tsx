import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

type Mascota = {
  id: number;
  nombre: string;
  raza: string;
  edad: number;
  ciudad: string;
  nivelEnergia: string;
};

const API_URL = 'http://TU_IP_LOCAL:3000';

export default function App() {
  const [mascota, setMascota] = useState<Mascota | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function cargarMascota(): Promise<void> {
      try {
        const respuesta = await fetch(`${API_URL}/mascotas/1`);

        if (!respuesta.ok) {
          throw new Error('No se ha encontrado la mascota');
        }

        const dato: Mascota = await respuesta.json();
        setMascota(dato);
      } catch {
        setError(
          'No se ha podido conectar con NestJS. Revisa la IP y el puerto.',
        );
      } finally {
        setCargando(false);
      }
    }

    cargarMascota();
  }, []);

  if (cargando) {
    return <ActivityIndicator size="large" style={styles.loading} />;
  }

  if (error !== '') {
    return <Text style={styles.error}>{error}</Text>;
  }

  if (!mascota) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.emoji}>🐶</Text>
        <Text style={styles.eyebrow}>PET PROFILE</Text>
        <Text style={styles.title}>{mascota.nombre}</Text>
        <Text style={styles.breed}>{mascota.raza}</Text>
        <Text style={styles.details}>
          {mascota.edad} años · {mascota.ciudad}
        </Text>
        <Text style={styles.energy}>
          ⚡ Nivel de energía: {mascota.nivelEnergia}
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#EEF6FF',
  },
  card: {
    backgroundColor: '#FFFFFF',
    padding: 28,
    borderRadius: 24,
    alignItems: 'center',
    elevation: 3,
  },
  emoji: { fontSize: 56 },
  eyebrow: {
    color: '#2563EB',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 2,
    marginTop: 12,
  },
  title: {
    color: '#0F172A',
    fontSize: 30,
    fontWeight: '800',
    marginTop: 6,
  },
  breed: { color: '#334155', fontSize: 18, marginTop: 8 },
  details: { color: '#64748B', fontSize: 16, marginTop: 6 },
  energy: {
    color: '#1D4ED8',
    fontSize: 16,
    fontWeight: '700',
    marginTop: 20,
  },
  loading: { flex: 1, marginTop: 80 },
  error: {
    color: '#B91C1C',
    flex: 1,
    padding: 24,
    marginTop: 80,
    textAlign: 'center',
  },
});
