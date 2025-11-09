// Modelo de Imagen de Producto - Coincide con la respuesta del backend
export interface ProductoImagenModel {
  id: number;
  producto: {
    id: number;
  };
  urlImagen: string;
  esPrincipal: boolean;
  orden: number;
}

// DTO para crear/actualizar imagen
export interface CreateProductoImagenDto {
  producto: {
    id: number;
  };
  urlImagen: string;
  esPrincipal: boolean;
  orden: number;
}
