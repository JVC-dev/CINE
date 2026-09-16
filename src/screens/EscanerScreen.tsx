import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { BarcodeScanningResult, CameraView, useCameraPermissions } from 'expo-camera';
import { useIsFocused } from '@react-navigation/native';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { marcarReservaUtilizada } from '../redux/slices/reservasSlice';

const obtenerCodigo = (contenido: string) => {
  const valor = contenido.trim();

  try {
    const datos = JSON.parse(valor);
    if (typeof datos === 'string') return datos.trim().toUpperCase();
    if (typeof datos?.codigo === 'string') return datos.codigo.trim().toUpperCase();
    if (typeof datos?.folio === 'string') return datos.folio.trim().toUpperCase();
  } catch {}

  const coincidencia = valor.toUpperCase().match(/CINE-[A-Z0-9]+/);
  return coincidencia?.[0] ?? valor.toUpperCase();
};

export default function EscanerScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [bloqueado, setBloqueado] = useState(false);
  const [codigoManual, setCodigoManual] = useState('');
  const [camaraLista, setCamaraLista] = useState(false);
  const reservas = useAppSelector(state => state.reservas.misReservas);
  const dispatch = useAppDispatch();
  const isFocused = useIsFocused();

  const validarCodigo = (contenido: string) => {
    if (bloqueado) return;

    const codigo = obtenerCodigo(contenido);
    if (!codigo) {
      Alert.alert('Código requerido', 'Escanea un QR o escribe el folio del boleto.');
      return;
    }

    setBloqueado(true);
    const reserva = reservas.find(item => item.codigo.trim().toUpperCase() === codigo);

    if (!reserva) {
      Alert.alert('Boleto inválido', `No existe una compra con el folio ${codigo}.`, [
        { text: 'Escanear otra vez', onPress: () => setBloqueado(false) },
      ]);
      return;
    }

    if (reserva.utilizada) {
      Alert.alert('Boleto ya utilizado', `El boleto ${reserva.codigo} ya fue validado.`, [
        { text: 'Escanear otra vez', onPress: () => setBloqueado(false) },
      ]);
      return;
    }

    dispatch(marcarReservaUtilizada(reserva.codigo));
    setCodigoManual('');
    Alert.alert(
      'Boleto válido',
      `${reserva.peliculaTitulo}\nFunción: ${reserva.funcion}\nAsientos: ${reserva.asientos.join(', ')}`,
      [{ text: 'Continuar', onPress: () => setBloqueado(false) }],
    );
  };

  const validarEscaneo = ({ data }: BarcodeScanningResult) => validarCodigo(data);

  if (!permission) return <View style={styles.container} />;

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Se necesita permiso para usar la cámara.</Text>
        <TouchableOpacity style={styles.button} onPress={requestPermission}>
          <Text style={styles.buttonText}>Conceder permiso</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Escanea el QR del boleto</Text>
      <View style={styles.cameraBox}>
        <CameraView
          active={isFocused}
          style={styles.camera}
          facing="back"
          barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
          onBarcodeScanned={bloqueado ? undefined : validarEscaneo}
          onCameraReady={() => setCamaraLista(true)}
          onMountError={({ message }) => Alert.alert('Error de cámara', message)}
        />
        <View pointerEvents="none" style={styles.frame} />
      </View>
      <Text style={styles.status}>{camaraLista ? 'Cámara lista para escanear' : 'Preparando cámara...'}</Text>
      <Text style={styles.text}>También puedes validar escribiendo el folio mostrado en la entrada.</Text>
      <View style={styles.manualRow}>
        <TextInput
          autoCapitalize="characters"
          autoCorrect={false}
          editable={!bloqueado}
          onChangeText={setCodigoManual}
          onSubmitEditing={() => validarCodigo(codigoManual)}
          placeholder="CINE-XXXXX"
          placeholderTextColor="#777"
          style={styles.input}
          value={codigoManual}
        />
        <TouchableOpacity style={styles.validateButton} onPress={() => validarCodigo(codigoManual)} disabled={bloqueado}>
          <Text style={styles.buttonText}>Validar</Text>
        </TouchableOpacity>
      </View>
      {bloqueado && (
        <TouchableOpacity style={styles.retryButton} onPress={() => setBloqueado(false)}>
          <Text style={styles.buttonText}>Escanear nuevamente</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212', padding: 18, justifyContent: 'center' },
  title: { color: '#fff', fontSize: 22, fontWeight: '700', textAlign: 'center', marginBottom: 18 },
  cameraBox: { height: 340, borderRadius: 14, overflow: 'hidden', position: 'relative' },
  camera: { flex: 1 },
  frame: { position: 'absolute', width: 230, height: 230, borderWidth: 3, borderColor: '#46d369', alignSelf: 'center', top: 55, borderRadius: 12 },
  status: { color: '#46d369', textAlign: 'center', marginTop: 10, fontSize: 12 },
  text: { color: '#bbb', textAlign: 'center', marginVertical: 12, lineHeight: 20 },
  manualRow: { flexDirection: 'row', gap: 10 },
  input: { flex: 1, backgroundColor: '#1e1e1e', color: '#fff', borderWidth: 1, borderColor: '#444', borderRadius: 9, paddingHorizontal: 14, paddingVertical: 12 },
  button: { backgroundColor: '#e50914', padding: 14, borderRadius: 9, alignItems: 'center' },
  validateButton: { backgroundColor: '#46d369', paddingHorizontal: 18, borderRadius: 9, justifyContent: 'center' },
  retryButton: { backgroundColor: '#e50914', padding: 12, borderRadius: 9, alignItems: 'center', marginTop: 12 },
  buttonText: { color: '#fff', fontWeight: '700' },
});
