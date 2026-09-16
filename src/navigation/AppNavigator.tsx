import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Importamos las pantallas de nuestra app
import DashboardScreen from '../screens/DashboardScreen';
import PeliculasScreen from '../screens/PeliculasScreen';
import ReservaScreen from '../screens/ReservaScreen';
import MapaAsientosScreen from '../screens/MapaAsientosScreen';
import HistorialScreen from '../screens/HistorialScreen';
import AccesoPersonalScreen from '../screens/AccesoPersonalScreen';
import PersonalDashboardScreen from '../screens/PersonalDashboardScreen';
import GestionPeliculasScreen from '../screens/GestionPeliculasScreen';
import FormularioPeliculaScreen from '../screens/FormularioPeliculaScreen';
import EscanerScreen from '../screens/EscanerScreen';

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
        <Stack.Screen name="AccesoPersonal" component={AccesoPersonalScreen} options={{ title: 'Acceso restringido' }} />
        <Stack.Screen name="PersonalInicio" component={PersonalDashboardScreen} options={{ title: 'Zona de Personal', headerBackVisible: false }} />
        <Stack.Screen name="GestionPeliculas" component={GestionPeliculasScreen} options={{ title: 'Gestión de Películas' }} />
        <Stack.Screen name="FormularioPelicula" component={FormularioPeliculaScreen} options={{ title: 'Datos de la Película' }} />
        <Stack.Screen name="Escaner" component={EscanerScreen} options={{ title: 'Validar Boleto' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
