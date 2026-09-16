import React from 'react';
import { Alert, FlatList, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { cambiarDisponibilidad, eliminarPelicula } from '../redux/slices/peliculasSlice';

export default function GestionPeliculasScreen({ navigation }: any) {
  const dispatch = useAppDispatch();
  const peliculas = useAppSelector(state => state.peliculas.peliculas);

  const confirmarEliminacion = (id: string, titulo: string) => {
    Alert.alert('Eliminar película', `¿Deseas eliminar ${titulo}?`, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Eliminar', style: 'destructive', onPress: () => dispatch(eliminarPelicula(id)) },
    ]);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('FormularioPelicula')}>
        <Text style={styles.addText}>+ Agregar película</Text>
      </TouchableOpacity>
      <FlatList
        data={peliculas}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.row}>
              <View style={styles.details}>
                <Text style={styles.title}>{item.titulo}</Text>
                <Text style={styles.meta}>{item.codigo} · {item.sala} · ${item.precio.toFixed(2)}</Text>
              </View>
              <Switch value={item.disponible} onValueChange={() => { dispatch(cambiarDisponibilidad(item.id)); }} trackColor={{ false: '#555', true: '#46d369' }} />
            </View>
            <View style={styles.actions}>
              <TouchableOpacity style={styles.edit} onPress={() => navigation.navigate('FormularioPelicula', { pelicula: item })}>
                <Text style={styles.actionText}>Editar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.delete} onPress={() => confirmarEliminacion(item.id, item.titulo)}>
                <Text style={styles.actionText}>Eliminar</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212', padding: 16 },
  addButton: { backgroundColor: '#e50914', borderRadius: 9, padding: 14, alignItems: 'center', marginBottom: 16 },
  addText: { color: '#fff', fontWeight: '700' },
  card: { backgroundColor: '#1e1e1e', borderRadius: 12, padding: 15, marginBottom: 12, borderWidth: 1, borderColor: '#333' },
  row: { flexDirection: 'row', alignItems: 'center' },
  details: { flex: 1 },
  title: { color: '#fff', fontSize: 17, fontWeight: '700' },
  meta: { color: '#aaa', marginTop: 5 },
  actions: { flexDirection: 'row', gap: 10, marginTop: 14 },
  edit: { flex: 1, backgroundColor: '#2f69bf', padding: 10, borderRadius: 7, alignItems: 'center' },
  delete: { flex: 1, backgroundColor: '#a82727', padding: 10, borderRadius: 7, alignItems: 'center' },
  actionText: { color: '#fff', fontWeight: '700' },
});
