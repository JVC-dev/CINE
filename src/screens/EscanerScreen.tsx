import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { marcarReservaUtilizada } from '../redux/slices/reservasSlice';

export default function EscanerScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [bloqueado, setBloqueado] = useState(false);
  const reservas = useAppSelector(state => state.reservas.misReservas);
  const dispatch = useAppDispatch();

  const validar = ({ data }: { data: string }) => {
    if (bloqueado) return;
    setBloqueado(true);
    const reserva = reservas.find(item => item.codigo === data.trim());
    if (!reserva) {
      Alert.alert('Boleto inválido', 'El código no corresponde a ninguna compra registrada.', [{ text: 'Escanear otra vez', onPress: () => setBloqueado(false) }]);
      return;
    }
    if (reserva.utilizada) {
      Alert.alert('Boleto ya utilizado', `El boleto ${reserva.codigo} ya fue validado.`, [{ text: 'Escanear otra vez', onPress: () => setBloqueado(false) }]);
      return;
    }
    dispatch(marcarReservaUtilizada(reserva.codigo));
    Alert.alert('Boleto válido', `${reserva.peliculaTitulo}\nAsientos: ${reserva.asientos.join(', ')}`, [{ text: 'Continuar', onPress: () => setBloqueado(false) }]);
  };

  if (!permission) return <View style={styles.container} />;
  if (!permission.granted) {
    return <View style={styles.container}><Text style={styles.text}>Se necesita permiso para usar la cámara.</Text><TouchableOpacity style={styles.button} onPress={requestPermission}><Text style={styles.buttonText}>Conceder permiso</Text></TouchableOpacity></View>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Escanea el QR del boleto</Text>
      <View style={styles.cameraBox}>
        <CameraView style={styles.camera} facing="back" barcodeScannerSettings={{ barcodeTypes: ['qr'] }} onBarcodeScanned={bloqueado ? undefined : validar} />
        <View style={styles.frame} />
      </View>
      <Text style={styles.text}>El boleto quedará marcado como utilizado y no podrá validarse nuevamente.</Text>
      {bloqueado && <TouchableOpacity style={styles.button} onPress={() => setBloqueado(false)}><Text style={styles.buttonText}>Escanear nuevamente</Text></TouchableOpacity>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212', padding: 18, justifyContent: 'center' },
  title: { color: '#fff', fontSize: 22, fontWeight: '700', textAlign: 'center', marginBottom: 18 },
  cameraBox: { height: 390, borderRadius: 14, overflow: 'hidden', position: 'relative' },
  camera: { flex: 1 },
  frame: { position: 'absolute', width: 230, height: 230, borderWidth: 3, borderColor: '#46d369', alignSelf: 'center', top: 80, borderRadius: 12 },
  text: { color: '#bbb', textAlign: 'center', marginVertical: 18, lineHeight: 21 },
  button: { backgroundColor: '#e50914', padding: 14, borderRadius: 9, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: '700' },
});
