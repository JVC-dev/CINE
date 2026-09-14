import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Reserva } from '../../types/reserva';

interface ReservasState {
  misReservas: Reserva[];
  asientosOcupadosPorPelicula: Record<string, string[]>;
}

const initialState: ReservasState = {
  misReservas: [],
  asientosOcupadosPorPelicula: {},
};

export const reservasSlice = createSlice({
  name: 'reservas',
  initialState,
  reducers: {
    agregarReserva: (state, action: PayloadAction<Reserva>) => {
      state.misReservas.push(action.payload);
      
      const claveFuncion = `${action.payload.peliculaTitulo}-${action.payload.funcion}`;
      if (!state.asientosOcupadosPorPelicula[claveFuncion]) {
        state.asientosOcupadosPorPelicula[claveFuncion] = [];
      }
      state.asientosOcupadosPorPelicula[claveFuncion].push(...action.payload.asientos);
    },
    cargarEstadoGuardado: (state, action: PayloadAction<ReservasState>) => {
      if (action.payload) {
        state.misReservas = action.payload.misReservas || [];
        state.asientosOcupadosPorPelicula = action.payload.asientosOcupadosPorPelicula || {};
      }
    },
  },
});

export const { agregarReserva, cargarEstadoGuardado } = reservasSlice.actions;
export default reservasSlice.reducer;