import React, { useMemo, useState } from 'react';
import { Alert, Modal, ScrollView, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { agregarPelicula, editarPelicula } from '../redux/slices/peliculasSlice';
import { Pelicula } from '../types/pelicula';

const GENEROS = ['Acción', 'Animación', 'Aventura', 'Ciencia ficción', 'Comedia', 'Drama', 'Terror', 'Suspenso'];
const CLASIFICACIONES = ['A - Todo público', 'B - 12 años', 'C - 15 años', 'D - 18 años'];
const SALAS = [{ nombre: 'Sala 1', precio: 5 }, { nombre: 'Sala 2', precio: 6 }, { nombre: 'Sala 3', precio: 7 }];
const HORARIOS = ['2:00 p. m.', '5:00 p. m.', '8:00 p. m.'];

type CampoLista = 'genero' | 'clasificacion' | 'sala' | 'horarios' | null;

export default function FormularioPeliculaScreen({ route, navigation }: any) {
  const original: Pelicula | undefined = route.params?.pelicula;
  const dispatch = useAppDispatch();
  const peliculas = useAppSelector(state => state.peliculas.peliculas);
  const salaInicial = SALAS.find(item => item.nombre === original?.sala) ?? SALAS[0];
  const [listaAbierta, setListaAbierta] = useState<CampoLista>(null);
  const [titulo, setTitulo] = useState(original?.titulo ?? '');
  const [genero, setGenero] = useState(original?.genero ?? '');
  const [duracion, setDuracion] = useState(original?.duracion ?? '');
  const [clasificacion, setClasificacion] = useState(original?.clasificacion ?? '');
  const [sala, setSala] = useState(original?.sala ?? '');
  const [precio, setPrecio] = useState(original ? original.precio : salaInicial.precio);
  const [sinopsis, setSinopsis] = useState(original?.sinopsis ?? '');
  const [horarios, setHorarios] = useState<string[]>(original?.funciones.map(f => f.horario) ?? []);
  const [disponible, setDisponible] = useState(original?.disponible ?? true);

  const codigo = useMemo(() => {
    if (original) return original.codigo;
    let numero = peliculas.length + 1;
    let valor = `PEL-${String(numero).padStart(3, '0')}`;
    while (peliculas.some(p => p.codigo === valor)) {
      numero += 1;
      valor = `PEL-${String(numero).padStart(3, '0')}`;
    }
    return valor;
  }, [original, peliculas]);

  const datosLista = useMemo(() => {
    if (listaAbierta === 'genero') return { titulo: 'Seleccionar género', opciones: GENEROS };
    if (listaAbierta === 'clasificacion') return { titulo: 'Seleccionar clasificación', opciones: CLASIFICACIONES };
    if (listaAbierta === 'sala') return { titulo: 'Seleccionar sala', opciones: SALAS.map(item => `${item.nombre} · $${item.precio.toFixed(2)}`) };
    return { titulo: 'Seleccionar horarios', opciones: HORARIOS };
  }, [listaAbierta]);

  const seleccionar = (opcion: string) => {
    if (listaAbierta === 'genero') setGenero(opcion);
    if (listaAbierta === 'clasificacion') setClasificacion(opcion);
    if (listaAbierta === 'sala') {
      const seleccion = SALAS.find(item => opcion.startsWith(item.nombre));
      if (seleccion) {
        setSala(seleccion.nombre);
        setPrecio(seleccion.precio);
      }
    }
    if (listaAbierta === 'horarios') {
      setHorarios(actuales => actuales.includes(opcion) ? actuales.filter(item => item !== opcion) : [...actuales, opcion]);
      return;
    }
    setListaAbierta(null);
  };

  const estaSeleccionada = (opcion: string) => {
    if (listaAbierta === 'genero') return genero === opcion;
    if (listaAbierta === 'clasificacion') return clasificacion === opcion;
    if (listaAbierta === 'sala') return opcion.startsWith(sala);
    return horarios.includes(opcion);
  };

  const guardar = () => {
    if (!titulo.trim() || !duracion.trim() || !genero || !clasificacion || !sala) {
      Alert.alert('Datos incompletos', 'Completa todos los campos obligatorios.');
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
      id: original?.id ?? Date.now().toString(), codigo, titulo: titulo.trim(), genero, duracion: duracion.trim(), clasificacion,
      sala, precio, sinopsis: sinopsis.trim(), disponible,
      funciones: horarios.map((horario, index) => ({ id: `${Date.now()}-${index}`, horario, tipo: 'Estándar' })),
    };
    dispatch(original ? editarPelicula(pelicula) : agregarPelicula(pelicula));
    navigation.goBack();
  };

  const CampoSeleccion = ({ label, valor, campo }: { label: string; valor: string; campo: CampoLista }) => (
    <View>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity style={styles.select} onPress={() => setListaAbierta(campo)}>
        <Text style={valor ? styles.selectValue : styles.placeholder}>{valor || 'Toca para seleccionar'}</Text>
        <Text style={styles.arrow}>⌄</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.label}>Código</Text>
        <View style={styles.readOnly}><Text style={styles.code}>{codigo}</Text></View>
        <Text style={styles.label}>Nombre *</Text>
        <TextInput style={styles.input} value={titulo} onChangeText={setTitulo} placeholder="Nombre de la película" placeholderTextColor="#777" />
        <CampoSeleccion label="Género *" valor={genero} campo="genero" />
        <CampoSeleccion label="Clasificación *" valor={clasificacion} campo="clasificacion" />
        <CampoSeleccion label="Sala y precio *" valor={sala ? `${sala} · $${precio.toFixed(2)}` : ''} campo="sala" />
        <CampoSeleccion label="Horarios *" valor={horarios.join(', ')} campo="horarios" />
        <Text style={styles.label}>Duración *</Text>
        <TextInput style={styles.input} value={duracion} onChangeText={setDuracion} placeholder="Ejemplo: 120 min" placeholderTextColor="#777" />
        <Text style={styles.label}>Sinopsis</Text>
        <TextInput style={[styles.input, styles.area]} value={sinopsis} onChangeText={setSinopsis} placeholder="Descripción breve" placeholderTextColor="#777" multiline />
        <View style={styles.switchRow}><Text style={styles.label}>Disponible para compra</Text><Switch value={disponible} onValueChange={setDisponible} trackColor={{ false: '#555', true: '#46d369' }} /></View>
        <TouchableOpacity style={styles.button} onPress={guardar}><Text style={styles.buttonText}>Guardar película</Text></TouchableOpacity>
      </ScrollView>

      <Modal visible={listaAbierta !== null} transparent animationType="fade" onRequestClose={() => setListaAbierta(null)}>
        <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={() => setListaAbierta(null)}>
          <View style={styles.modal} onStartShouldSetResponder={() => true}>
            <Text style={styles.modalTitle}>{datosLista.titulo}</Text>
            {datosLista.opciones.map(opcion => {
              const activa = estaSeleccionada(opcion);
              return (
                <TouchableOpacity key={opcion} style={[styles.modalOption, activa && styles.modalOptionActive]} onPress={() => seleccionar(opcion)}>
                  <Text style={[styles.modalOptionText, activa && styles.modalOptionTextActive]}>{activa ? '✓  ' : ''}{opcion}</Text>
                </TouchableOpacity>
              );
            })}
            {listaAbierta === 'horarios' && <TouchableOpacity style={styles.done} onPress={() => setListaAbierta(null)}><Text style={styles.buttonText}>Aceptar horarios</Text></TouchableOpacity>}
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: '#121212', padding: 18, flexGrow: 1 },
  label: { color: '#ddd', fontWeight: '600', marginTop: 10, marginBottom: 7 },
  input: { backgroundColor: '#222', color: '#fff', borderWidth: 1, borderColor: '#444', borderRadius: 8, padding: 12, minHeight: 48 },
  area: { minHeight: 85, textAlignVertical: 'top' },
  readOnly: { backgroundColor: '#181818', borderWidth: 1, borderColor: '#333', borderRadius: 8, padding: 14 },
  code: { color: '#46d369', fontWeight: '700' },
  select: { backgroundColor: '#222', borderWidth: 1, borderColor: '#444', borderRadius: 8, minHeight: 48, paddingHorizontal: 13, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  selectValue: { color: '#fff', flex: 1 },
  placeholder: { color: '#777', flex: 1 },
  arrow: { color: '#aaa', fontSize: 24, marginLeft: 8 },
  switchRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 10 },
  button: { backgroundColor: '#e50914', padding: 14, borderRadius: 9, alignItems: 'center', marginTop: 10 },
  buttonText: { color: '#fff', fontWeight: '700' },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.75)', justifyContent: 'center', padding: 24 },
  modal: { backgroundColor: '#1e1e1e', borderRadius: 14, padding: 18, borderWidth: 1, borderColor: '#444' },
  modalTitle: { color: '#fff', fontSize: 19, fontWeight: '700', marginBottom: 12 },
  modalOption: { padding: 14, borderBottomWidth: 1, borderBottomColor: '#333' },
  modalOptionActive: { backgroundColor: '#312020', borderRadius: 7 },
  modalOptionText: { color: '#ccc', fontSize: 15 },
  modalOptionTextActive: { color: '#ff6565', fontWeight: '700' },
  done: { backgroundColor: '#e50914', padding: 13, borderRadius: 8, alignItems: 'center', marginTop: 16 },
});
