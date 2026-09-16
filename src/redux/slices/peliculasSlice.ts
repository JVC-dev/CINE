import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Pelicula } from '../../types/pelicula';

interface PeliculasState {
  peliculas: Pelicula[];
}

const initialState: PeliculasState = {
  peliculas: [
    {
      id: '1', codigo: 'PEL-001', titulo: 'Spider-Man: Beyond', sinopsis: 'Una aventura multiversal que desafía los límites del tiempo y el espacio.', genero: 'Acción', clasificacion: 'B', duracion: '145 min', sala: 'Sala 1', precio: 5.5, disponible: true,
      funciones: [{ id: 'f1', horario: '15:00', tipo: 'Estándar' }, { id: 'f2', horario: '18:30', tipo: 'IMAX' }],
    },
    {
      id: '2', codigo: 'PEL-002', titulo: 'Batman: El Despertar', sinopsis: 'Gotham enfrenta una nueva ola de caos y corrupción.', genero: 'Suspenso', clasificacion: 'C', duracion: '155 min', sala: 'Sala 2', precio: 5, disponible: true,
      funciones: [{ id: 'f3', horario: '16:00', tipo: 'Estándar' }, { id: 'f4', horario: '19:30', tipo: 'VIP' }],
    },
    {
      id: '3', codigo: 'PEL-003', titulo: 'Interstellar 2', sinopsis: 'Un viaje más allá de los agujeros negros.', genero: 'Ciencia ficción', clasificacion: 'B', duracion: '169 min', sala: 'Sala 3', precio: 4.5, disponible: false,
      funciones: [{ id: 'f5', horario: '17:00', tipo: 'IMAX' }],
    },
  ],
};

export const peliculasSlice = createSlice({
  name: 'peliculas',
  initialState,
  reducers: {
    agregarPelicula: (state, action: PayloadAction<Pelicula>) => {
      state.peliculas.push(action.payload);
    },
    editarPelicula: (state, action: PayloadAction<Pelicula>) => {
      const indice = state.peliculas.findIndex(p => p.id === action.payload.id);
      if (indice !== -1) state.peliculas[indice] = action.payload;
    },
    eliminarPelicula: (state, action: PayloadAction<string>) => {
      state.peliculas = state.peliculas.filter(p => p.id !== action.payload);
    },
    cambiarDisponibilidad: (state, action: PayloadAction<string>) => {
      const pelicula = state.peliculas.find(p => p.id === action.payload);
      if (pelicula) pelicula.disponible = !pelicula.disponible;
    },
    cargarPeliculas: (state, action: PayloadAction<PeliculasState>) => action.payload,
  },
});

export const { agregarPelicula, editarPelicula, eliminarPelicula, cambiarDisponibilidad, cargarPeliculas } = peliculasSlice.actions;
export default peliculasSlice.reducer;
