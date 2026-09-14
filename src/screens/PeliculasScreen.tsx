import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Pelicula } from '../types/pelicula';
import Buscador from '../components/Buscador';
import Filtros from '../components/Filtros';

const PELICULAS_EJEMPLO: Pelicula[] = [
  {
    id: '1',
    titulo: 'Spider-Man: Beyond',
    sinopsis: 'Una aventura multiversal épica que desafía los límites del tiempo y el espacio.',
    duracion: '145 min',
    genero: 'Acción',
    funciones: [
      { id: 'f1', horario: '15:00 hrs', tipo: 'Función Estándar' },
      { id: 'f2', horario: '18:30 hrs', tipo: 'Función IMAX' },
      { id: 'f3', horario: '21:45 hrs', tipo: 'Función VIP' },
    ],
  },
  {
    id: '2',
    titulo: 'Batman: El Despertar',
    sinopsis: 'Gotham se enfrenta a una nueva ola de caos y corrupción en las sombras.',
    duracion: '155 min',
    genero: 'Suspenso',
    funciones: [
      { id: 'f4', horario: '16:00 hrs', tipo: 'Función Estándar' },
      { id: 'f5', horario: '19:30 hrs', tipo: 'Función VIP' },
    ],
  },
  {
    id: '3',
    titulo: 'Interstellar 2',
    sinopsis: 'Un viaje más allá de los agujeros negros en busca de un nuevo hogar para la humanidad.',
    duracion: '169 min',
    genero: 'Ciencia Ficción',
    funciones: [
      { id: 'f6', horario: '17:00 hrs', tipo: 'Función IMAX' },
      { id: 'f7', horario: '20:30 hrs', tipo: 'Función Estándar' },
    ],
  },
];

const CATEGORIAS = ['Todas', 'Acción', 'Suspenso', 'Ciencia Ficción'];

export default function PeliculasScreen({ navigation }: any) {
  const [busqueda, setBusqueda] = useState('');
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('Todas');

  // Filtrado optimizado
  const peliculasFiltradas = useMemo(() => {
    return PELICULAS_EJEMPLO.filter(p => {
      const texto = busqueda.toLowerCase();
      const coincideTexto = p.titulo.toLowerCase().includes(texto) || (p.genero && p.genero.toLowerCase().includes(texto));
      const coincideCategoria = categoriaSeleccionada === 'Todas' || p.genero === categoriaSeleccionada;
      return coincideTexto && coincideCategoria;
    });
  }, [busqueda, categoriaSeleccionada]);

  const seleccionarPelicula = (pelicula: Pelicula) => {
    // Te manda directo a la pantalla de Reserva pasando la película seleccionada
    navigation.navigate('Reserva', { pelicula });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Cartelera de Cine</Text>

      {/* Buscador Modular */}
      <Buscador valor={busqueda} onChangeTexto={setBusqueda} />

      {/* Filtros Modulares */}
      <Filtros
        categorias={CATEGORIAS}
        categoriaSeleccionada={categoriaSeleccionada}
        onSelectCategoria={setCategoriaSeleccionada}
      />

      {/* Lista de Películas limpia */}
      <FlatList
        data={peliculasFiltradas}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listaContainer}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.card}
            activeOpacity={0.8}
            onPress={() => seleccionarPelicula(item)}
          >
            <View>
              <Text style={styles.peliculaTitulo}>{item.titulo}</Text>
              <Text style={styles.peliculaInfo}>{item.genero} • {item.duracion}</Text>
              <Text style={styles.peliculaSinopsis} numberOfLines={2}>{item.sinopsis}</Text>
            </View>
            <View style={styles.cardFooter}>
              <Text style={styles.verFuncionesText}>Seleccionar película 🎟️</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 15,
    textAlign: 'center',
  },
  listaContainer: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#1e1e1e',
    borderRadius: 12,
    padding: 16,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#2a2a2a',
    justifyContent: 'space-between',
  },
  peliculaTitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  peliculaInfo: {
    fontSize: 12,
    color: '#ff5555',
    marginBottom: 8,
  },
  peliculaSinopsis: {
    fontSize: 13,
    color: '#b3b3b3',
    marginBottom: 12,
  },
  cardFooter: {
    borderTopWidth: 1,
    borderTopColor: '#2a2a2a',
    paddingTop: 10,
    alignItems: 'flex-end',
  },
  verFuncionesText: {
    color: '#46d369',
    fontSize: 12,
    fontWeight: 'bold',
  },
});