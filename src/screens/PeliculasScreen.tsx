import React, { useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Buscador from '../components/Buscador';
import Filtros from '../components/Filtros';
import { useAppSelector } from '../redux/hooks';
import { Pelicula } from '../types/pelicula';

export default function PeliculasScreen({ navigation }: any) {
  const peliculas = useAppSelector(state => state.peliculas.peliculas);
  const [busqueda, setBusqueda] = useState('');
  const [categoria, setCategoria] = useState('Todas');
  const categorias = useMemo(() => ['Todas', ...Array.from(new Set(peliculas.map(p => p.genero)))], [peliculas]);

  const peliculasFiltradas = useMemo(() => {
    const texto = busqueda.trim().toLowerCase();
    return peliculas.filter(p => {
      const coincide = [p.titulo, p.genero, p.clasificacion, p.sala].some(valor => valor.toLowerCase().includes(texto));
      return p.disponible && coincide && (categoria === 'Todas' || p.genero === categoria);
    });
  }, [busqueda, categoria, peliculas]);

  const seleccionarPelicula = (pelicula: Pelicula) => navigation.navigate('Reserva', { pelicula });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cartelera de Cine</Text>
      <Buscador valor={busqueda} onChangeTexto={setBusqueda} />
      <Filtros categorias={categorias} categoriaSeleccionada={categoria} onSelectCategoria={setCategoria} />
      <FlatList
        data={peliculasFiltradas}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Text style={styles.empty}>No hay películas disponibles con estos filtros.</Text>}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => seleccionarPelicula(item)}>
            <Text style={styles.movie}>{item.titulo}</Text>
            <Text style={styles.info}>{item.genero} · {item.clasificacion} · {item.duracion}</Text>
            <Text style={styles.info}>{item.sala} · ${item.precio.toFixed(2)}</Text>
            <Text style={styles.synopsis} numberOfLines={2}>{item.sinopsis}</Text>
            <Text style={styles.action}>Seleccionar película</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212', padding: 20 },
  title: { color: '#fff', fontSize: 24, fontWeight: '700', textAlign: 'center', marginBottom: 15 },
  list: { paddingBottom: 20 },
  card: { backgroundColor: '#1e1e1e', borderRadius: 12, padding: 16, marginBottom: 14, borderWidth: 1, borderColor: '#333' },
  movie: { color: '#fff', fontSize: 18, fontWeight: '700', marginBottom: 6 },
  info: { color: '#ff7777', fontSize: 12, marginBottom: 4 },
  synopsis: { color: '#b3b3b3', marginVertical: 8 },
  action: { color: '#46d369', fontWeight: '700', textAlign: 'right' },
  empty: { color: '#aaa', textAlign: 'center', marginTop: 30 },
});
