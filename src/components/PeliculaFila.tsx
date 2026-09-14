import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

interface PeliculaProps {
  pelicula: {
    id: string;
    titulo: string;
    genero?: string;
    duracion?: string;
    imagen?: string;
  };
  navigation: any; // Recibimos la navegación o una función de callback
}

export default function PeliculaFila({ pelicula, navigation }: PeliculaProps) {
  return (
    <TouchableOpacity 
      style={styles.cardContainer}
      activeOpacity={0.8}
      onPress={() => {
        // Al dar clic, navegamos a 'Reserva' enviando los datos de la película
        navigation.navigate('Reserva', {
          peliculaId: pelicula.id,
          tituloPelicula: pelicula.titulo,
        });
      }}
    >
      {/* Imagen o Póster de la Película */}
      <View style={styles.posterPlaceholder}>
        <Text style={styles.posterText}>🎬</Text>
      </View>

      {/* Información de la Película */}
      <View style={styles.infoContainer}>
        <Text style={styles.titulo} numberOfLines={1}>{pelicula.titulo}</Text>
        <Text style={styles.detalle}>{pelicula.genero || 'Estreno'} • {pelicula.duracion || '120 min'}</Text>
        
        <View style={styles.btnReservarContainer}>
          <Text style={styles.btnReservarText}>Ver funciones &gt;</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: 'row',
    backgroundColor: '#1e1e1e',
    borderRadius: 12,
    marginBottom: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#333',
  },
  posterPlaceholder: {
    width: 90,
    height: 120,
    backgroundColor: '#2a2a2a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  posterText: {
    fontSize: 28,
  },
  infoContainer: {
    flex: 1,
    padding: 12,
    justifyContent: 'center',
  },
  titulo: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 6,
  },
  detalle: {
    fontSize: 13,
    color: '#b3b3b3',
    marginBottom: 12,
  },
  btnReservarContainer: {
    alignSelf: 'flex-start',
  },
  btnReservarText: {
    color: '#e50914',
    fontWeight: 'bold',
    fontSize: 13,
  },
});