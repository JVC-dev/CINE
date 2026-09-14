import React from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet } from 'react-native';

interface FiltrosProps {
  categorias: string[];
  categoriaSeleccionada: string;
  onSelectCategoria: (cat: string) => void;
}

export default function Filtros({ categorias, categoriaSeleccionada, onSelectCategoria }: FiltrosProps) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.container}>
      {categorias.map(cat => {
        const activo = categoriaSeleccionada === cat;
        return (
          <TouchableOpacity
            key={cat}
            style={[styles.chip, activo && styles.chipActivo]}
            onPress={() => onSelectCategoria(cat)}
          >
            <Text style={[styles.textoChip, activo && styles.textoChipActivo]}>{cat}</Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    maxHeight: 50,
    marginBottom: 15,
  },
  chip: {
    backgroundColor: '#1e1e1e',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#333',
    height: 36,
    justifyContent: 'center',
  },
  chipActivo: {
    backgroundColor: '#e50914',
    borderColor: '#e50914',
  },
  textoChip: {
    color: '#b3b3b3',
    fontSize: 13,
    fontWeight: '500',
  },
  textoChipActivo: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
});