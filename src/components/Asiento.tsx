import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

interface AsientoProps {
  id: string;
  estado: 'disponible' | 'seleccionado' | 'ocupado';
  onPress: () => void;
}

export default function Asiento({ id, estado, onPress }: AsientoProps) {
  let estiloBoton: any = styles.asientoDisponible;
  if (estado === 'seleccionado') estiloBoton = styles.asientoSeleccionado;
  if (estado === 'ocupado') estiloBoton = styles.asientoOcupado;

  return (
    <TouchableOpacity
      style={[styles.asiento, estiloBoton]}
      onPress={onPress}
      disabled={estado === 'ocupado'} // Si está ocupado, no se puede presionar
    >
      <Text style={styles.asientoTexto}>{id}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  asiento: {
    width: 50,
    height: 50,
    margin: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  asientoDisponible: {
    backgroundColor: '#1e1e1e',
    borderWidth: 1,
    borderColor: '#46d369',
  },
  asientoSeleccionado: {
    backgroundColor: '#e50914',
  },
  asientoOcupado: {
    backgroundColor: '#333333',
    borderColor: '#222',
  },
  asientoTexto: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 12,
  },
});