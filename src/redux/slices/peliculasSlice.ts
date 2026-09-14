import { createSlice } from '@reduxjs/toolkit';

interface Pelicula {
  id: string;
  titulo: string;
  genero: string;
  clasificacion: string;
  duracion: string;
  sala: string;
  precio: number;
  disponible: boolean;
}

interface PeliculasState {
  peliculas: Pelicula[];
}

const initialState: PeliculasState = {
  peliculas: [
    { id: '1', titulo: 'Spider-Man: Beyond', genero: 'Acción', clasificacion: 'PG-13', duracion: '140 min', sala: 'Sala 1', precio: 5.50, disponible: true },
    { id: '2', titulo: 'El Camino del Código', genero: 'Drama', clasificacion: 'R', duracion: '120 min', sala: 'Sala 2', precio: 5.00, disponible: true },
    { id: '3', titulo: 'Misterio en la Red', genero: 'Suspenso', clasificacion: 'PG', duracion: '110 min', sala: 'Sala 3', precio: 4.50, disponible: false },
  ],
};

export const peliculasSlice = createSlice({
  name: 'peliculas',
  initialState,
  reducers: {},
});

export default peliculasSlice.reducer;