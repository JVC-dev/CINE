import { configureStore } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import peliculasReducer, { cargarPeliculas } from './slices/peliculasSlice';
import reservasReducer, { cargarEstadoGuardado } from './slices/reservasSlice';
import salasReducer, { cargarSalas } from './slices/salasSlice';

const STORAGE_KEY = '@cine_app_estado';

export const store = configureStore({
  reducer: {
    peliculas: peliculasReducer,
    reservas: reservasReducer,
    salas: salasReducer,
  },
});

let hidratado = false;

const cargarDatosLocales = async () => {
  try {
    const datos = await AsyncStorage.getItem(STORAGE_KEY);
    if (datos) {
      const estado = JSON.parse(datos);
      if (estado.peliculas) store.dispatch(cargarPeliculas(estado.peliculas));
      if (estado.reservas) store.dispatch(cargarEstadoGuardado(estado.reservas));
      if (estado.salas) store.dispatch(cargarSalas(estado.salas));
    }
  } finally {
    hidratado = true;
  }
};

store.subscribe(() => {
  if (hidratado) AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(store.getState()));
});

cargarDatosLocales();

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
