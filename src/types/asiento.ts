export interface Asiento {
  id: string; // Ej: "A1", "B3"
  fila: string; // Ej: "A"
  numero: number; // Ej: 1
  estado: 'disponible' | 'seleccionado' | 'ocupado';
}