import React, { useMemo, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { agregarPelicula, editarPelicula } from '../redux/slices/peliculasSlice';
import { Pelicula } from '../types/pelicula';

const GENEROS = ['Acción', 'Animación', 'Aventura', 'Ciencia ficción', 'Comedia', 'Drama', 'Terror', 'Suspenso'];
const CLASIFICACIONES = ['A - Todo público', 'B - 12 años', 'C - 15 años', 'D - 18 años'];
const SALAS = [
  { nombre: 'Sala 1', precio: 5 },
  { nombre: 'Sala 2', precio: 6 },
  { nombre: 'Sala 3', precio: 7 },
];
const HORARIOS = ['2:00 p. m.', '5:00 p. m.', '8:00 p. m.'];

interface OpcionesProps {
  opciones: string[];
  seleccionadas: string[];
  onPress: (opcion: string) => void;
  multiple?: boolean;
}

function Opciones({ opciones, seleccionadas, onPress, multiple = false }: OpcionesProps) {
  return (
    <View style={styles.options}>
      {opciones.map(opcion => {
        const activa = seleccionadas.includes(opcion);
        return (
          <TouchableOpacity key={opcion} style={[styles.option, activa && styles.optionActive]} onPress={() => onPress(opcion)}>
            <Text style={[styles.optionText, activa && styles.optionTextActive]}>{multiple && activa ? '✓ ' : ''}{opcion}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export default function FormularioPeliculaScreen({ route, navigation }: any) {
  const original: Pelicula | undefined = route.params?.pelicula;
  const dispatch = useAppDispatch();
  const peliculas = useAppSelector(state => state.peliculas.peliculas);

  const codigoGenerado = useMemo(() => {
    if (original) return original.codigo;
    let numero = peliculas.length + 1;
    let codigo = `PEL-${String(numero).padStart(3, '0')}`;
    while (peliculas.some(p => p.codigo === codigo)) {
      numero += 1;
      codigo = `PEL-${String(numero).padStart(3, '0')}`;
    }
    return codigo;
  }, [original, peliculas]);

  const salaInicial = SALAS.find(s => s.nombre === original?.sala) ?? SALAS[0];
  const [titulo, setTitulo] = useState(original?.titulo ?? '');
  const [genero, setGenero] = useState(original?.genero ?? GENEROS[0]);
  const [duracion, setDuracion] = useState(original?.duracion ?? '');
  const [clasificacion, setClasificacion] = useState(original?.clasificacion ?? CLASIFICACIONES[0]);
  const [sala, setSala] = useState(salaInicial.nombre);
  const [precio, setPrecio] = useState(salaInicial.precio);
  const [sinopsis, setSinopsis] = useState(original?.sinopsis ?? '');
  const [horarios, setHorarios] = useState<string[]>(original?.funciones.map(f => f.horario) ?? []);
  const [disponible, setDisponible] = useState(original?.disponible ?? true);

  const seleccionarSala = (nombre: string) => {
    const seleccion = SALAS.find(item => item.nombre === nombre);
    if (!seleccion) return;
    setSala(seleccion.nombre);
    setPrecio(seleccion.precio);
  };

  const alternarHorario = (horario: string) => {
    setHorarios(actuales => actuales.includes(horario) ? actuales.filter(item => item !== horario) : [...actuales, horario]);
  };

  const guardar = () => {
    if (!titulo.trim() || !duracion.trim()) {
      Alert.alert('Datos incompletos', 'Ingresa el nombre y la duración de la película.');
      return;
    }
    if (horarios.length === 0) {
      Alert.alert('Horario requerido', 'Selecciona al menos un horario.');
      return;
    }
    const choque = peliculas.some(p => p.id !== original?.id && p.sala === sala && p.funciones.some(f => horarios.includes(f.horario)));
    if (choque) {
      Alert.alert('Sala ocupada', 'Uno de los horarios seleccionados ya está asignado en esta sala.');
      return;
    }
    const pelicula: Pelicula = {
      id: original?.id ?? Date.now().toString(),
      codigo: codigoGenerado,
      titulo: titulo.trim(),
      genero,
      duracion: duracion.trim(),
      clasificacion,
      sala,
      precio,
      sinopsis: sinopsis.trim(),
      disponible,
      funciones: horarios.map((horario, index) => ({ id: `${Date.now()}-${index}`, horario, tipo: 'Estándar' })),
    };
    dispatch(original ? editarPelicula(pelicula) : agregarPelicula(pelicula));
    navigation.goBack();
  };

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <Text style={styles.label}>Código</Text>
      <View style={styles.readOnly}><Text style={styles.readOnlyText}>{codigoGenerado}</Text></View>

      <Text style={styles.label}>Nombre *</Text>
      <TextInput style={styles.input} value={titulo} onChangeText={setTitulo} placeholder="Nombre de la película" placeholderTextColor="#777" />

      <Text style={styles.label}>Género</Text>
      <Opciones opciones={GENEROS} seleccionadas={[genero]} onPress={setGenero} />

      <Text style={styles.label}>Clasificación</Text>
      <Opciones opciones={CLASIFICACIONES} seleccionadas={[clasificacion]} onPress={setClasificacion} />

      <Text style={styles.label}>Sala y precio</Text>
      <Opciones opciones={SALAS.map(item => `${item.nombre} · $${item.precio.toFixed(2)}`)} seleccionadas={[`${sala} · $${precio.toFixed(2)}`]} onPress={opcion => seleccionarSala(opcion.split(' · ')[0])} />

      <Text style={styles.label}>Horarios *</Text>
      <Opciones opciones={HORARIOS} seleccionadas={horarios} onPress={alternarHorario} multiple />

      <Text style={styles.label}>Duración *</Text>
      <TextInput style={styles.input} value={duracion} onChangeText={setDuracion} placeholder="Ejemplo: 120 min" placeholderTextColor="#777" />

      <Text style={styles.label}>Sinopsis</Text>
      <TextInput style={[styles.input, styles.textArea]} value={sinopsis} onChangeText={setSinopsis} placeholder="Descripción breve" placeholderTextColor="#777" multiline />

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
  label: { color: '#ddd', fontWeight: '600', marginTop: 10, marginBottom: 7 },
  input: { backgroundColor: '#222', color: '#fff', borderWidth: 1, borderColor: '#444', borderRadius: 8, padding: 12, minHeight: 45 },
  textArea: { minHeight: 85, textAlignVertical: 'top' },
  readOnly: { backgroundColor: '#181818', borderWidth: 1, borderColor: '#333', borderRadius: 8, padding: 13 },
  readOnlyText: { color: '#46d369', fontWeight: '700' },
  options: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 5 },
  option: { backgroundColor: '#252525', borderWidth: 1, borderColor: '#444', borderRadius: 18, paddingVertical: 9, paddingHorizontal: 13 },
  optionActive: { backgroundColor: '#e50914', borderColor: '#e50914' },
  optionText: { color: '#bbb', fontSize: 13 },
  optionTextActive: { color: '#fff', fontWeight: '700' },
  switchRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 10 },
  button: { backgroundColor: '#e50914', padding: 14, borderRadius: 9, alignItems: 'center', marginTop: 10 },
  buttonText: { color: '#fff', fontWeight: '700' },
});
