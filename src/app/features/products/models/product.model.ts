// Modelo de Producto - Coincide con la respuesta de Spring Boot
export interface ProductModel {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  sku: string;
  imagenPortada: string;
  idMarca: number;
  nombreMarca: string;
  idCategoria: number;
  nombreCategoria: string;
}

// DTO para crear/actualizar productos (sin id)
export interface CreateProductDto {
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  sku: string;
  imagenPortada: string;
  idMarca: number;
  idCategoria: number;
}

// Filtros para búsqueda de productos
export interface ProductFilters {
  idCategoria?: number;
  idMarca?: number;
  minPrecio?: number;
  maxPrecio?: number;
  busqueda?: string;
}

// Tipo para ordenamiento
export type SortOption = 'nombre-asc' | 'nombre-desc' | 'precio-asc' | 'precio-desc' | 'stock-asc' | 'stock-desc';

