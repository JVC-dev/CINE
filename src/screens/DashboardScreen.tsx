import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';

export default function DashboardScreen({ navigation }: any) {
  const peliculas = useSelector((state: RootState) => state.peliculas.peliculas);
  const misReservas = useSelector((state: RootState) => state.reservas.misReservas);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Bienvenido de nuevo</Text>
        <Text style={styles.subtitleText}>¿Qué película quieres ver hoy?</Text>
      </View>

      {/* Tarjeta de Resumen / Accesos Rápidos */}
      <View style={styles.cardResumen}>
        <Text style={styles.cardTitle}>🎬 Cartelera Activa</Text>
        <Text style={styles.cardDesc}>Tenemos {peliculas.filter(p => p.disponible).length} películas disponibles en este momento.</Text>
        <TouchableOpacity
          style={styles.btnPrimary}
          onPress={() => {
           navigation.navigate('Peliculas');
          }}
        >
          <Text style={styles.btnText}>Explorar Cartelera</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.cardResumen}>
        <Text style={styles.cardTitle}>🎟️ Mis Reservas</Text>
        <Text style={styles.cardDesc}>Tienes {misReservas.length} reserva(s) activa(s) registrada(s).</Text>
        <TouchableOpacity
          style={styles.btnSecondary}
          onPress={() => {
            navigation.navigate('Historial');
          }}
        >
          <Text style={styles.btnSecondaryText}>Ver Mis Entradas</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.staffButton} onPress={() => navigation.navigate('AccesoPersonal')}>
        <Text style={styles.staffText}>Acceso del personal</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#121212',
    padding: 20,
    paddingTop: 60,
  },
  header: {
    marginBottom: 24,
  },
  welcomeText: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  subtitleText: {
    fontSize: 14,
    color: '#b3b3b3',
    marginTop: 4,
  },
  cardResumen: {
    backgroundColor: '#1e1e1e',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#333',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  cardDesc: {
    fontSize: 14,
    color: '#b3b3b3',
    marginBottom: 16,
  },
  btnPrimary: {
    backgroundColor: '#e50914',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  btnText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  btnSecondary: {
    backgroundColor: 'transparent',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#46d369',
  },
  btnSecondaryText: {
    color: '#46d369',
    fontWeight: 'bold',
    fontSize: 14,
  },
  staffButton: { alignItems: 'center', padding: 14, marginTop: 8 },
  staffText: { color: '#777', fontSize: 12 },
});
