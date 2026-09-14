import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Importamos las pantallas de nuestra app
import DashboardScreen from '../screens/DashboardScreen';
import PeliculasScreen from '../screens/PeliculasScreen';
import ReservaScreen from '../screens/ReservaScreen';
import MapaAsientosScreen from '../screens/MapaAsientosScreen';
import HistorialScreen from '../screens/HistorialScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Dashboard"
        screenOptions={{
          headerStyle: { backgroundColor: '#121212' },
          headerTintColor: '#ffffff',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      >
        <Stack.Screen 
          name="Dashboard" 
          component={DashboardScreen} 
          options={{ title: 'Inicio - Cine' }} 
        />
        <Stack.Screen 
          name="Peliculas" 
          component={PeliculasScreen} 
          options={{ title: 'Cartelera' }} 
        />
        <Stack.Screen 
          name="Reserva" 
          component={ReservaScreen} 
          options={{ title: 'Seleccionar Función' }} 
        />
        <Stack.Screen 
          name="MapaAsientos" 
          component={MapaAsientosScreen} 
          options={{ title: 'Mapa de Asientos' }} 
        />
        <Stack.Screen 
          name="Historial" 
          component={HistorialScreen} 
          options={{ title: 'Mis Entradas' }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}