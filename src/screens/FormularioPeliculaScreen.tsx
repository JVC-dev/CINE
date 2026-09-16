import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { agregarPelicula, editarPelicula } from '../redux/slices/peliculasSlice';
import { Pelicula } from '../types/pelicula';

export default function FormularioPeliculaScreen({ route, navigation }: any) {
  const original: Pelicula | undefined = route.params?.pelicula;
  const dispatch = useAppDispatch();
  const peliculas = useAppSelector(state => state.peliculas.peliculas);
  const [codigo, setCodigo] = useState(original?.codigo ?? '');
  const [titulo, setTitulo] = useState(original?.titulo ?? '');
  const [genero, setGenero] = useState(original?.genero ?? '');
  const [duracion, setDuracion] = useState(original?.duracion ?? '');
  const [clasificacion, setClasificacion] = useState(original?.clasificacion ?? '');
  const [sala, setSala] = useState(original?.sala ?? '');
  const [precio, setPrecio] = useState(original ? String(original.precio) : '');
  const [sinopsis, setSinopsis] = useState(original?.sinopsis ?? '');
  const [horarios, setHorarios] = useState(original?.funciones.map(f => f.horario).join(', ') ?? '');
  const [disponible, setDisponible] = useState(original?.disponible ?? true);

  const guardar = () => {
    const codigoLimpio = codigo.trim();
    const tituloLimpio = titulo.trim();
    const precioNumero = Number(precio);
    if (!codigoLimpio || !tituloLimpio || !genero.trim() || !duracion.trim() || !clasificacion.trim() || !sala.trim()) {
      Alert.alert('Datos incompletos', 'Completa todos los campos obligatorios.');
      return;
    }
    if (!Number.isFinite(precioNumero) || precioNumero < 0) {
      Alert.alert('Precio inválido', 'El precio debe ser un número mayor o igual a cero.');
      return;
    }
    if (peliculas.some(p => p.codigo.toLowerCase() === codigoLimpio.toLowerCase() && p.id !== original?.id)) {
      Alert.alert('Código duplicado', 'Ya existe una película con ese código.');
      return;
    }
    const listaHorarios = horarios.split(',').map(h => h.trim()).filter(Boolean);
    if (new Set(listaHorarios).size !== listaHorarios.length) {
      Alert.alert('Horario repetido', 'No repitas horarios para la misma película y sala.');
      return;
    }
    const choqueHorario = peliculas.some(p => p.id !== original?.id && p.sala.toLowerCase() === sala.trim().toLowerCase() && p.funciones.some(f => listaHorarios.includes(f.horario)));
    if (choqueHorario) {
      Alert.alert('Sala ocupada', 'Ya existe una función en esa sala con uno de los horarios indicados.');
      return;
    }
    const pelicula: Pelicula = {
      id: original?.id ?? Date.now().toString(),
      codigo: codigoLimpio,
      titulo: tituloLimpio,
      genero: genero.trim(),
      duracion: duracion.trim(),
      clasificacion: clasificacion.trim(),
      sala: sala.trim(),
      precio: precioNumero,
      sinopsis: sinopsis.trim(),
      disponible,
      funciones: listaHorarios.map((horario, index) => ({ id: `${Date.now()}-${index}`, horario, tipo: 'Estándar' })),
    };
    dispatch(original ? editarPelicula(pelicula) : agregarPelicula(pelicula));
    navigation.goBack();
  };

  const campos = [
    ['Código *', codigo, setCodigo], ['Nombre *', titulo, setTitulo], ['Género *', genero, setGenero],
    ['Duración *', duracion, setDuracion], ['Clasificación *', clasificacion, setClasificacion], ['Sala *', sala, setSala],
    ['Precio *', precio, setPrecio], ['Horarios separados por coma', horarios, setHorarios], ['Sinopsis', sinopsis, setSinopsis],
  ] as const;

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      {campos.map(([label, value, setter]) => (
        <View key={label} style={styles.field}>
          <Text style={styles.label}>{label}</Text>
          <TextInput style={styles.input} value={value} onChangeText={setter} placeholderTextColor="#777" keyboardType={label === 'Precio *' ? 'decimal-pad' : 'default'} multiline={label === 'Sinopsis'} />
        </View>
      ))}
      <View style={styles.switchRow}>
        <Text style={styles.label}>Disponible para compra</Text>
        <Switch value={disponible} onValueChange={setDisponible} trackColor={{ false: '#555', true: '#46d369' }} />
      </View>
      <TouchableOpacity style={styles.button} onPress={guardar}><Text style={styles.buttonText}>Guardar película</Text></TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: '#121212', padding: 18, flexGrow: 1 },
  field: { marginBottom: 13 },
  label: { color: '#ddd', fontWeight: '600', marginBottom: 6 },
  input: { backgroundColor: '#222', color: '#fff', borderWidth: 1, borderColor: '#444', borderRadius: 8, padding: 12, minHeight: 45 },
  switchRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 10 },
  button: { backgroundColor: '#e50914', padding: 14, borderRadius: 9, alignItems: 'center', marginTop: 10 },
  buttonText: { color: '#fff', fontWeight: '700' },
});
