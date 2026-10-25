import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native';

const API_URL = 'http://TU_IP_LOCAL:3000';

type Cancion = {
  id: number;
  titulo: string;
  artista: string;
};

type Playlist = {
  id: number;
  nombre: string;
  canciones: Cancion[];
};

export default function App() {
  const [playlist, setPlaylist] = useState<Playlist | null>(null);
  const [titulo, setTitulo] = useState('');
  const [artista, setArtista] = useState('');
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState('');

  const cargar = useCallback(async (): Promise<void> => {
    try {
      const response = await fetch(`${API_URL}/playlists/1`);
      if (!response.ok) {
        throw new Error(`Error HTTP ${response.status}`);
      }
      setPlaylist((await response.json()) as Playlist);
    } catch (error) {
      setMensaje(error instanceof Error ? error.message : 'No se pudo cargar la playlist');
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    void cargar();
  }, [cargar]);

  async function anadirCancion(): Promise<void> {
    if (!titulo.trim() || !artista.trim()) {
      setMensaje('Escribe título y artista.');
      return;
    }

    setGuardando(true);
    setMensaje('');
    try {
      const response = await fetch(`${API_URL}/canciones`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ titulo: titulo.trim(), artista: artista.trim(), playlistId: 1 }),
      });
      if (!response.ok) {
        throw new Error(`Error HTTP ${response.status}`);
      }
      setTitulo('');
      setArtista('');
      await cargar();
      setMensaje('✓ Canción añadida');
    } catch (error) {
      setMensaje(error instanceof Error ? error.message : 'No se pudo añadir la canción');
    } finally {
      setGuardando(false);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      {cargando && !playlist ? <ActivityIndicator size="large" color="#2563eb" /> : (
        <>
          <Text style={styles.title}>🎵 {playlist?.nombre ?? 'My Playlists'}</Text>
          <FlatList
            data={playlist?.canciones ?? []}
            keyExtractor={(item) => String(item.id)}
            contentContainerStyle={styles.list}
            ListEmptyComponent={<Text style={styles.empty}>Todavía no hay canciones.</Text>}
            renderItem={({ item }) => (
              <View style={styles.songCard}>
                <Text style={styles.songTitle}>🎵 {item.titulo}</Text>
                <Text style={styles.artist}>{item.artista}</Text>
              </View>
            )}
          />
          <Text style={styles.formTitle}>＋ Añadir canción</Text>
          <TextInput placeholder="Título" value={titulo} onChangeText={setTitulo} style={styles.input} />
          <TextInput placeholder="Artista" value={artista} onChangeText={setArtista} style={styles.input} />
          <Pressable style={styles.button} onPress={() => void anadirCancion()} disabled={guardando}>
            {guardando ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Añadir</Text>}
          </Pressable>
        </>
      )}
      {!!mensaje && <Text style={styles.message}>{mensaje}</Text>}
      <Text style={styles.endpoint}>GET /playlists/1 · POST /canciones</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#f4f7fb' },
  title: { fontSize: 30, fontWeight: '700', marginBottom: 20, color: '#17233c' },
  list: { gap: 12, paddingBottom: 18 },
  songCard: { backgroundColor: '#fff', borderRadius: 14, padding: 16, elevation: 2 },
  songTitle: { fontSize: 20, fontWeight: '700', color: '#17233c' },
  artist: { fontSize: 16, marginTop: 6, color: '#526078' },
  formTitle: { fontSize: 20, fontWeight: '700', marginBottom: 12, color: '#17233c' },
  input: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#ccd5e4', borderRadius: 10, padding: 12, marginBottom: 12 },
  button: { alignItems: 'center', backgroundColor: '#2563eb', borderRadius: 10, padding: 14 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  message: { textAlign: 'center', marginTop: 14, color: '#176b3a', fontWeight: '700' },
  endpoint: { textAlign: 'center', marginTop: 12, color: '#6b7280' },
  empty: { textAlign: 'center', color: '#6b7280' },
});

