// Modelo de Reseña - Coincide con la respuesta del backend
export interface ResenaModel {
  id: number;
  producto: {
    id: number;
  };
  usuario: {
    id: number;
    nombre: string;
    apellido: string;
  };
  calificacion: number;        // 1-5 estrellas
  comentario: string;
  fechaCreacion: string;       // ISO 8601 date string
}

// DTO para crear reseña (lo que el backend espera)
export interface CreateResenaDto {
  idProducto: {
    id: number;
  };
  idUsuario: {
    id: number;
  };
  calificacion: number;        // 1-5
  comentario: string;
  // creadoEn se genera automáticamente en el backend
}

// Respuesta con estadísticas de reseñas
export interface ResenaStats {
  promedioCalificacion: number;
  totalResenas: number;
  distribucion: {
    estrellas5: number;
    estrellas4: number;
    estrellas3: number;
    estrellas2: number;
    estrellas1: number;
  };
}
