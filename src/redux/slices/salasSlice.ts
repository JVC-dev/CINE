import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AsientoState {
  id: string; // Ej: 'A1'
  estado: 'disponible' | 'seleccionado' | 'ocupado';
}

interface SalasState {
  asientosPorSala: {
    [key: string]: AsientoState[]; // Clave: ID de sala o función, Valor: lista de asientos
  };
}

const initialState: SalasState = {
  asientosPorSala: {},
};

export const salasSlice = createSlice({
  name: 'salas',
  initialState,
  reducers: {
    inicializarSala: (state, action: PayloadAction<{ salaId: string; asientos: AsientoState[] }>) => {
      const { salaId, asientos } = action.payload;
      if (!state.asientosPorSala[salaId]) {
        state.asientosPorSala[salaId] = asientos;
      }
    },
    cambiarEstadoAsiento: (
      state,
      action: PayloadAction<{ salaId: string; asientoId: string; nuevoEstado: 'disponible' | 'seleccionado' | 'ocupado' }>
    ) => {
      const { salaId, asientoId, nuevoEstado } = action.payload;
      const sala = state.asientosPorSala[salaId];
      if (sala) {
        const asiento = sala.find((a) => a.id === asientoId);
        if (asiento) {
          asiento.estado = nuevoEstado;
        }
      }
    },
    cargarSalas: (state, action: PayloadAction<SalasState>) => action.payload,
  },
});

export const { inicializarSala, cambiarEstadoAsiento, cargarSalas } = salasSlice.actions;
export default salasSlice.reducer;
