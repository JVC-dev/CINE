export interface Funcion {
  id: string;
  horario: string;
  tipo: string;
}

export interface Pelicula {
  id: string;
  codigo: string;
  titulo: string;
  sinopsis: string;
  genero: string;
  duracion: string;
  clasificacion: string;
  sala: string;
  precio: number;
  disponible: boolean;
  funciones: Funcion[];
}
