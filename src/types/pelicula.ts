export interface Funcion {
  id: string;
  horario: string;
  tipo: string; // Ej: "Función Estándar", "IMAX", etc.
}

export interface Pelicula {
  id: string;
  titulo: string;
  sinopsis?: string;
  imagen?: string;
  duracion?: string;
  genero?: string;
  funciones?: Funcion[];
}