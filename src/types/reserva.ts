export interface Reserva {
  id: string;
  codigo: string;
  peliculaTitulo: string;
  funcion: string;
  asientos: string[];
  total: number;
  fecha: string;
  utilizada: boolean;
}
