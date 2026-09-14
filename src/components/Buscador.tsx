import React from 'react';
import { TextInput, StyleSheet, View } from 'react-native';

interface BuscadorProps {
  valor: string;
  onChangeTexto: (texto: string) => void;
}

export default function Buscador({ valor, onChangeTexto }: BuscadorProps) {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Buscar por título, género o sala..."
        placeholderTextColor="#888"
        value={valor}
        onChangeText={onChangeTexto}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#1e1e1e',
    color: '#ffffff',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#333',
    fontSize: 14,
  },
});