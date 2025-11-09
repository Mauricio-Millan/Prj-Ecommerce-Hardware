// Modelo de Carrito
export interface CarritoModel {
  id: number;
  idUsuario: {
    id: number;
    nombre?: string;
    apellido?: string;
    correoElectronico?: string;
  };
  creadoEn?: string; // Fecha ISO 8601, automático del backend
}

// DTO para crear un carrito - El backend espera el objeto Usuario completo
export interface CreateCarritoDto {
  idUsuario: {
    id: number;
  };
}

// Modelo de Item de Carrito - Estructura plana del backend
export interface ItemCarritoModel {
  id: number;
  idCarrito: number;
  idProducto: number;
  nombreProducto: string;
  descripcionProducto: string;
  precioProducto: number;
  stockProducto: number;
  skuProducto: string;
  cantidad: number;
  imagenPortada: string;
  subtotal: number;
  selected?: boolean; // Para el checkbox
}

// DTO para crear un item de carrito
export interface CreateItemCarritoDto {
  idCarrito: {
    id: number;
  };
  idProducto: {
    id: number;
  };
  cantidad: number;
}

// Respuesta completa del carrito con items
export interface CarritoConItemsModel {
  id: number;
  usuario: {
    id: number;
    nombre?: string;
    apellido?: string;
  };
  items: ItemCarritoModel[];
  total: number;
  creadoEn?: string;
}
