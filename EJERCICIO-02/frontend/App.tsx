import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

type Pelicula = {
  id: number;
  titulo: string;
  genero: string;
  anio: number;
  puntuacion: number;
  favorita: boolean;
};

// En un móvil físico sustituye TU_IP_LOCAL por la IPv4 del ordenador.
const API_URL = 'http://TU_IP_LOCAL:3000';

export default function App() {
  const [peliculas, setPeliculas] = useState<Pelicula[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function cargarPeliculas(): Promise<void> {
      try {
        const respuesta = await fetch(`${API_URL}/peliculas`);

        if (!respuesta.ok) {
          throw new Error('La API no ha respondido correctamente');
        }

        const datos: Pelicula[] = await respuesta.json();
        setPeliculas(datos);
      } catch {
        setError(
          'No se ha podido conectar con NestJS. Revisa la IP y el puerto.',
        );
      } finally {
        setCargando(false);
      }
    }

    cargarPeliculas();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>CARTELERA</Text>
        <Text style={styles.title}>🎬 CineBox</Text>
        <Text style={styles.subtitle}>Películas recuperadas desde PostgreSQL</Text>
      </View>

      {cargando && <ActivityIndicator size="large" style={styles.center} />}

      {error !== '' && <Text style={styles.error}>{error}</Text>}

      {!cargando && error === '' && (
        <FlatList
          data={peliculas}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.cardContent}>
                <Text style={styles.movie}>{item.titulo}</Text>
                <Text style={styles.details}>
                  {item.genero} · {item.anio}
                </Text>
                <Text style={styles.score}>
                  ★ {Number(item.puntuacion).toFixed(1)}
                </Text>
              </View>
              <Text style={item.favorita ? styles.favorite : styles.notFavorite}>
                {item.favorita ? '♥' : '♡'}
              </Text>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: { paddingHorizontal: 20, paddingTop: 28, paddingBottom: 18 },
  eyebrow: { color: '#E11D48', fontSize: 12, fontWeight: '800', letterSpacing: 2 },
  title: { color: '#0F172A', fontSize: 32, fontWeight: '800', marginTop: 4 },
  subtitle: { color: '#64748B', marginTop: 6 },
  list: { paddingHorizontal: 20, paddingBottom: 24 },
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 16, padding: 18, marginBottom: 12, elevation: 2 },
  cardContent: { flex: 1 },
  movie: { color: '#0F172A', fontSize: 18, fontWeight: '700' },
  details: { color: '#64748B', marginTop: 5 },
  score: { color: '#475569', marginTop: 8, fontWeight: '700' },
  favorite: { color: '#E11D48', fontSize: 32, marginLeft: 16 },
  notFavorite: { color: '#94A3B8', fontSize: 32, marginLeft: 16 },
  center: { marginTop: 80 },
  error: { color: '#BE123C', paddingHorizontal: 24, marginTop: 30, textAlign: 'center' },
});
