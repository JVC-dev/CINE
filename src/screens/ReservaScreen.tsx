import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Funcion } from '../types/pelicula';

export default function ReservaScreen({ route, navigation }: any) {
  const { pelicula } = route.params; // Recibe la película de la cartelera
  
  const [cantidadAsientos, setCantidadAsientos] = useState<number>(1);
  const [funcionElegida, setFuncionElegida] = useState<string>(
    pelicula.funciones && pelicula.funciones.length > 0 ? pelicula.funciones[0].tipo : 'Estándar'
  );

  const irAlMapaAsientos = () => {
    navigation.navigate('MapaAsientos', {
      peliculaTitulo: pelicula.titulo,
      funcion: funcionElegida,
      cantidad: cantidadAsientos,
    });
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.titulo}>{pelicula.titulo}</Text>
      <Text style={styles.sub}>{pelicula.genero} • {pelicula.duracion}</Text>
      <Text style={styles.sinopsis}>{pelicula.sinopsis}</Text>

      <Text style={styles.seccionLabel}>Selecciona cantidad de boletos:</Text>
      <View style={styles.botonesCantidad}>
        {[1, 2, 3, 4, 5].map(num => (
          <TouchableOpacity
            key={num}
            style={[styles.btnNumero, cantidadAsientos === num && styles.btnNumeroActivo]}
            onPress={() => setCantidadAsientos(num)}
          >
            <Text style={[styles.textoNumero, cantidadAsientos === num && styles.textoNumeroActivo]}>{num}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.seccionLabel}>Selecciona la Función:</Text>
      <View style={styles.funcionesContainer}>
        {pelicula.funciones?.map((fun: Funcion) => {
          const esActiva = funcionElegida === fun.tipo;
          return (
            <TouchableOpacity
              key={fun.id}
              style={[styles.funcionChip, esActiva && styles.funcionChipActiva]}
              onPress={() => setFuncionElegida(fun.tipo)}
            >
              <Text style={[styles.funcionChipTexto, esActiva && styles.funcionChipTextoActivo]}>
                {fun.horario} - {fun.tipo}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <TouchableOpacity style={styles.btnConfirmar} onPress={irAlMapaAsientos}>
        <Text style={styles.btnConfirmarText}>Continuar al Mapa de Asientos</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212', padding: 20 },
  titulo: { fontSize: 22, fontWeight: 'bold', color: '#ffffff', marginBottom: 4 },
  sub: { fontSize: 13, color: '#ff5555', marginBottom: 10 },
  sinopsis: { fontSize: 13, color: '#b3b3b3', marginBottom: 20 },
  seccionLabel: { fontSize: 14, color: '#b3b3b3', fontWeight: 'bold', marginBottom: 10, marginTop: 10 },
  botonesCantidad: { flexDirection: 'row', marginBottom: 15 },
  btnNumero: { width: 45, height: 45, borderRadius: 22.5, backgroundColor: '#2a2a2a', justifyContent: 'center', alignItems: 'center', marginRight: 10, borderWidth: 1, borderColor: '#444' },
  btnNumeroActivo: { backgroundColor: '#e50914', borderColor: '#e50914' },
  textoNumero: { color: '#b3b3b3', fontWeight: 'bold' },
  textoNumeroActivo: { color: '#ffffff' },
  funcionesContainer: { marginBottom: 30 },
  funcionChip: { backgroundColor: '#2a2a2a', padding: 12, borderRadius: 8, marginBottom: 8, borderWidth: 1, borderColor: '#333' },
  funcionChipActiva: { backgroundColor: '#333', borderColor: '#46d369' },
  funcionChipTexto: { color: '#b3b3b3', fontSize: 14 },
  funcionChipTextoActivo: { color: '#46d369', fontWeight: 'bold' },
  btnConfirmar: { backgroundColor: '#46d369', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 10 },
  btnConfirmarText: { color: '#121212', fontWeight: 'bold', fontSize: 15 },
});