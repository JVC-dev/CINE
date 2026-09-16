import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';

export default function AccesoPersonalScreen({ navigation }: any) {
  const [procesando, setProcesando] = useState(false);

  const autenticar = async () => {
    setProcesando(true);
    try {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      const inscrito = await LocalAuthentication.isEnrolledAsync();
      if (!compatible || !inscrito) {
        Alert.alert('Biometría no disponible', 'Configura huella o reconocimiento facial en el dispositivo.');
        return;
      }
      const resultado = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Acceso del personal',
        cancelLabel: 'Cancelar',
        fallbackLabel: 'Usar clave del dispositivo',
        disableDeviceFallback: false,
      });
      if (resultado.success) navigation.replace('PersonalInicio');
      else Alert.alert('Acceso denegado', 'No se pudo verificar la identidad.');
    } finally {
      setProcesando(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.icon}>🔐</Text>
      <Text style={styles.title}>Zona de Personal</Text>
      <Text style={styles.text}>Identifícate con la seguridad biométrica del dispositivo para continuar.</Text>
      <TouchableOpacity style={styles.button} onPress={autenticar} disabled={procesando}>
        <Text style={styles.buttonText}>{procesando ? 'Verificando...' : 'Autenticar acceso'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212', justifyContent: 'center', alignItems: 'center', padding: 28 },
  icon: { fontSize: 55, marginBottom: 18 },
  title: { color: '#fff', fontSize: 26, fontWeight: '700' },
  text: { color: '#aaa', textAlign: 'center', marginVertical: 16, lineHeight: 21 },
  button: { backgroundColor: '#e50914', paddingVertical: 14, paddingHorizontal: 30, borderRadius: 9 },
  buttonText: { color: '#fff', fontWeight: '700' },
});
