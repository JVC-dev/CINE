import { configureStore } from '@reduxjs/toolkit';
import reservasReducer, { cargarEstadoGuardado } from './slices/reservasSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import peliculasReducer from './slices/peliculasSlice';

const STORAGE_KEY = '@cine_app_estado_reservas';

export const store = configureStore({
  reducer: {
    reservas: reservasReducer,
    peliculas: peliculasReducer,
  },
});

// Guardar en AsyncStorage automáticamente cuando el estado cambie
store.subscribe(async () => {
  try {
    const estadoActual = store.getState().reservas;
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(estadoActual));
  } catch (error) {
    console.log('Error al guardar en AsyncStorage:', error);
  }
});

// Cargar los datos almacenados al iniciar la aplicación
const cargarDatosLocales = async () => {
  try {
    const datosGuardados = await AsyncStorage.getItem(STORAGE_KEY);
    if (datosGuardados) {
      const estadoParseado = JSON.parse(datosGuardados);
      store.dispatch(cargarEstadoGuardado(estadoParseado));
    }
  } catch (error) {
    console.log('Error al cargar de AsyncStorage:', error);
  }
};

cargarDatosLocales();

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;