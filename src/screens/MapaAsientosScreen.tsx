import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Modal } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { agregarReserva } from '../redux/slices/reservasSlice';
import { RootState } from '../redux/store';
import { Reserva } from '../types/reserva';

// Definimos un arreglo vacío constante fuera del componente para mantener la misma referencia en memoria
const ARREGLO_VACIO: string[] = [];

const generarCodigoUnico = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let resultado = 'CINE-';
  for (let i = 0; i < 5; i++) {
    resultado += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return resultado;
};

export default function MapaAsientosScreen({ route, navigation }: any) {
  const dispatch = useDispatch();

  const { peliculaTitulo = 'Spider-Man: Beyond', funcion = 'Función Estándar', cantidad = 1, precio = 5.5 } = route?.params || {};
  
  const claveFuncion = `${peliculaTitulo}-${funcion}`;

  // Selector optimizado utilizando la referencia estática ARREGLO_VACIO
  const asientosOcupadosGlobales = useSelector((state: RootState) => {
    return state.reservas.asientosOcupadosPorPelicula[claveFuncion] || ARREGLO_VACIO;
  });

  const maxAsientos = Number(cantidad) || 1;
  const precioUnitario = Number(precio) || 0;

  const [asientosSeleccionados, setAsientosSeleccionados] = useState<string[]>([]);
  
  // Estados para el Modal de éxito
  const [modalVisible, setModalVisible] = useState(false);
  const [codigoGenerado, setCodigoGenerado] = useState('');

  const filas = ['A', 'B', 'C', 'D'];
  const columnas = [1, 2, 3, 4, 5];

  const toggleAsiento = (idAsiento: string) => {
    if (asientosOcupadosGlobales.includes(idAsiento)) return;

    if (asientosSeleccionados.includes(idAsiento)) {
      setAsientosSeleccionados(asientosSeleccionados.filter(a => a !== idAsiento));
    } else {
      if (asientosSeleccionados.length < maxAsientos) {
        setAsientosSeleccionados([...asientosSeleccionados, idAsiento]);
      } else {
        Alert.alert('Límite alcanzado', `Solo puedes seleccionar ${maxAsientos} asiento(s).`);
      }
    }
  };

  const totalPagar = asientosSeleccionados.length * precioUnitario;

  const handleConfirmarPago = () => {
    if (asientosSeleccionados.length < maxAsientos) {
      Alert.alert('Faltan asientos', `Por favor selecciona tus ${maxAsientos} asiento(s) antes de continuar.`);
      return;
    }

    const codigoUnico = generarCodigoUnico();
    setCodigoGenerado(codigoUnico);

    const nuevaReserva: Reserva = {
      id: Date.now().toString(),
      codigo: codigoUnico,
      peliculaTitulo: peliculaTitulo,
      funcion: funcion,
      asientos: asientosSeleccionados,
      total: totalPagar,
      fecha: new Date().toLocaleDateString(),
      utilizada: false,
    };

    dispatch(agregarReserva(nuevaReserva));

    // Mostramos nuestro modal personalizado
    setModalVisible(true);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Selección de Asientos</Text>
      <Text style={styles.subtitle}>
        Película: <Text style={styles.boldWhite}>{peliculaTitulo}</Text>
      </Text>
      <Text style={styles.subtext}>
        Selecciona <Text style={styles.boldText}>{maxAsientos}</Text> asiento(s) ({asientosSeleccionados.length}/{maxAsientos})
      </Text>

      <View style={styles.pantallaContainer}>
        <Text style={styles.pantallaText}>PANTALLA</Text>
      </View>

      <View style={styles.matrizContainer}>
        {filas.map(fila => (
          <View key={fila} style={styles.fila}>
            {columnas.map(col => {
              const idAsiento = `${fila}${col}`;
              const ocupado = asientosOcupadosGlobales.includes(idAsiento);
              const seleccionado = asientosSeleccionados.includes(idAsiento);

              return (
                <TouchableOpacity
                  key={idAsiento}
                  style={[
                    styles.asiento,
                    ocupado && styles.asientoOcupado,
                    seleccionado && styles.asientoSeleccionado,
                  ]}
                  onPress={() => toggleAsiento(idAsiento)}
                  disabled={ocupado}
                >
                  <Text style={[styles.asientoTexto, (ocupado || seleccionado) && styles.textoBlanco]}>
                    {idAsiento}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
      </View>

      <TouchableOpacity 
        style={[
          styles.btnPagar, 
          asientosSeleccionados.length < maxAsientos && styles.btnDeshabilitado
        ]} 
        onPress={handleConfirmarPago}
      >
        <Text style={styles.btnText}>Confirmar y Pagar (${totalPagar.toFixed(2)})</Text>
      </TouchableOpacity>

      {/* --- MODAL DE ÉXITO --- */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>¡Compra Completada! 🎉</Text>
            
            <View style={styles.infoBox}>
              <Text style={styles.modalText}>Tus asientos han sido reservados con éxito para:</Text>
              <Text style={styles.movieText}>{peliculaTitulo}</Text>
              <Text style={styles.detailText}>Asientos: <Text style={styles.boldWhite}>{asientosSeleccionados.join(', ')}</Text></Text>
              <Text style={styles.folioText}>Folio: {codigoGenerado}</Text>
            </View>

            <TouchableOpacity 
              style={styles.btnAceptar}
              onPress={() => {
                setModalVisible(false);
                navigation.popToTop(); // Regresa al inicio
              }}
            >
              <Text style={styles.btnAceptarText}>Aceptar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#121212',
    padding: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 15,
    color: '#ff5555',
    marginBottom: 2,
    textAlign: 'center',
  },
  subtext: {
    fontSize: 13,
    color: '#b3b3b3',
    marginBottom: 20,
  },
  boldText: {
    color: '#46d369',
    fontWeight: 'bold',
  },
  boldWhite: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  pantallaContainer: {
    width: '80%',
    backgroundColor: '#2a2a2a',
    paddingVertical: 6,
    alignItems: 'center',
    borderRadius: 4,
    marginBottom: 20,
    borderBottomWidth: 3,
    borderBottomColor: '#e50914',
  },
  pantallaText: {
    color: '#888',
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  matrizContainer: {
    marginBottom: 20,
  },
  fila: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  asiento: {
    width: 45,
    height: 45,
    backgroundColor: '#1e1e1e',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#46d369',
  },
  asientoOcupado: {
    backgroundColor: '#333',
    borderColor: '#444',
  },
  asientoSeleccionado: {
    backgroundColor: '#e50914',
    borderColor: '#e50914',
  },
  asientoTexto: {
    fontSize: 12,
    color: '#46d369',
    fontWeight: 'bold',
  },
  textoBlanco: {
    color: '#ffffff',
  },
  btnPagar: {
    backgroundColor: '#46d369',
    width: '100%',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  btnDeshabilitado: {
    backgroundColor: '#2a2a2a',
  },
  btnText: {
    color: '#121212',
    fontWeight: 'bold',
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#1e1e1e',
    width: '100%',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#46d369',
    marginBottom: 15,
  },
  infoBox: {
    backgroundColor: '#121212',
    padding: 16,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalText: {
    fontSize: 14,
    color: '#b3b3b3',
    textAlign: 'center',
    marginBottom: 8,
  },
  movieText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 12,
  },
  detailText: {
    fontSize: 15,
    color: '#b3b3b3',
    marginBottom: 6,
  },
  folioText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#e50914',
    marginTop: 10,
  },
  btnAceptar: {
    backgroundColor: '#46d369',
    width: '100%',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  btnAceptarText: {
    color: '#121212',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
