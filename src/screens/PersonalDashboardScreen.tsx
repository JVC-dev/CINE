import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAppSelector } from '../redux/hooks';

export default function PersonalDashboardScreen({ navigation }: any) {
  const peliculas = useAppSelector(state => state.peliculas.peliculas);
  const reservas = useAppSelector(state => state.reservas.misReservas);

  const estadisticas = useMemo(() => {
    const boletos = reservas.reduce((total, reserva) => total + reserva.asientos.length, 0);
    const ingresos = reservas.reduce((total, reserva) => total + reserva.total, 0);
    const funciones = peliculas.reduce((total, pelicula) => total + pelicula.funciones.length, 0);
    const ocupados = boletos;
    const capacidad = Math.max(funciones, 1) * 20;
    const conteo = reservas.reduce<Record<string, number>>((acc, reserva) => {
      acc[reserva.peliculaTitulo] = (acc[reserva.peliculaTitulo] ?? 0) + reserva.asientos.length;
      return acc;
    }, {});
    const masReservada = Object.entries(conteo).sort((a, b) => b[1] - a[1])[0]?.[0] ?? 'Sin reservas';
    return { boletos, ingresos, funciones, ocupados, disponibles: Math.max(capacidad - ocupados, 0), masReservada };
  }, [peliculas, reservas]);

  const tarjetas = [
    ['Películas', peliculas.length], ['Funciones', estadisticas.funciones], ['Boletos vendidos', estadisticas.boletos],
    ['Asientos disponibles', estadisticas.disponibles], ['Asientos ocupados', estadisticas.ocupados], ['Ingresos', `$${estadisticas.ingresos.toFixed(2)}`],
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Panel administrativo</Text>
      <View style={styles.grid}>
        {tarjetas.map(([label, value]) => <View style={styles.card} key={label}><Text style={styles.value}>{value}</Text><Text style={styles.label}>{label}</Text></View>)}
      </View>
      <View style={styles.highlight}><Text style={styles.label}>Película más reservada</Text><Text style={styles.movie}>{estadisticas.masReservada}</Text></View>
      <TouchableOpacity style={styles.primary} onPress={() => navigation.navigate('GestionPeliculas')}><Text style={styles.buttonText}>Gestionar películas</Text></TouchableOpacity>
      <TouchableOpacity style={styles.secondary} onPress={() => navigation.navigate('Escaner')}><Text style={styles.buttonText}>Validar boleto con QR</Text></TouchableOpacity>
      <TouchableOpacity style={styles.exit} onPress={() => navigation.popToTop()}><Text style={styles.exitText}>Cerrar sesión del personal</Text></TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: '#121212', padding: 18 },
  title: { color: '#fff', fontSize: 25, fontWeight: '700', marginBottom: 18 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  card: { width: '48%', backgroundColor: '#1e1e1e', padding: 16, borderRadius: 10, marginBottom: 12, borderWidth: 1, borderColor: '#333' },
  value: { color: '#46d369', fontSize: 23, fontWeight: '700' },
  label: { color: '#aaa', marginTop: 5 },
  highlight: { backgroundColor: '#292019', borderColor: '#bb7c26', borderWidth: 1, padding: 17, borderRadius: 10, marginBottom: 16 },
  movie: { color: '#fff', fontWeight: '700', fontSize: 18, marginTop: 5 },
  primary: { backgroundColor: '#e50914', padding: 14, alignItems: 'center', borderRadius: 9, marginBottom: 11 },
  secondary: { backgroundColor: '#2f69bf', padding: 14, alignItems: 'center', borderRadius: 9 },
  buttonText: { color: '#fff', fontWeight: '700' },
  exit: { padding: 15, alignItems: 'center', marginTop: 12 },
  exitText: { color: '#aaa' },
});
