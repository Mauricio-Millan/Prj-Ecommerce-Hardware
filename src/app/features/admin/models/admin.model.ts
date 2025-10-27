/**
 * Modelos para el módulo de administración
 * Utilizados para crear y actualizar entidades
 */

// ============================================
// PRODUCTO - DTOs
// ============================================

/**
 * DTO para crear un producto
 * Se envía al endpoint POST /api/productos
 * Nota: idMarca e idCategoria deben ser objetos con propiedad 'id'
 */
export interface CreateProductDto {
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  sku: string;
  idMarca: { id: number };
  idCategoria: { id: number };
}

/**
 * DTO para actualizar un producto
 * Se envía al endpoint PUT /api/productos/{id}
 * Nota: idMarca e idCategoria deben ser objetos con propiedad 'id'
 * No incluir 'creadoEn' (es read-only)
 */
export interface UpdateProductDto {
  nombre?: string;
  descripcion?: string;
  precio?: number;
  stock?: number;
  sku?: string;
  idMarca?: { id: number };
  idCategoria?: { id: number };
}

/**
 * DTO para actualizar solo el stock
 * Se envía al endpoint PATCH /api/productos/{id}/stock
 */
export interface UpdateStockDto {
  stock: number;
}

// ============================================
// IMAGEN DE PRODUCTO - DTOs
// ============================================

/**
 * Modelo de imagen de producto
 * GET /api/producto-imagenes/producto/{id}
 */
export interface ProductImage {
  id: number;
  urlImagen: string;
  orden: number;
  idProducto: { id: number };
}

/**
 * DTO para actualizar imagen de producto
 * PUT /api/producto-imagenes/{id}
 * Requiere todos los campos según el backend
 */
export interface UpdateProductImageDto {
  id: number;
  idProducto: { id: number };
  urlImagen: string;
  orden: number;
}

/**
 * Respuesta al subir una imagen
 * Devuelta por POST /api/productoimg
 */
export interface ImageUploadResponse {
  id: number;
  nombreArchivo: string;
  rutaArchivo: string;
  tipoArchivo: string;
  tamanio: number;
  idProducto: number;
  mensaje?: string;
}

/**
 * DTO para asociar imagen a producto
 * Se envía al endpoint POST /api/productoimg
 */
export interface ProductImageDto {
  idProducto: number;
  imagen: File;
}

// ============================================
// CATEGORÍA - DTOs
// ============================================

/**
 * DTO para crear una categoría
 * Se envía al endpoint POST /api/categorias
 */
export interface CreateCategoryDto {
  nombre: string;
  descripcion: string;
}

/**
 * DTO para actualizar una categoría
 * Se envía al endpoint PUT /api/categorias/{id}
 */
export interface UpdateCategoryDto {
  nombre?: string;
  descripcion?: string;
}

// ============================================
// MARCA - DTOs
// ============================================

/**
 * DTO para crear una marca
 * Se envía al endpoint POST /api/marcas
 */
export interface CreateBrandDto {
  nombre: string;
}

/**
 * DTO para actualizar una marca
 * Se envía al endpoint PUT /api/marcas/{id}
 */
export interface UpdateBrandDto {
  nombre?: string;
}

// ============================================
// DASHBOARD - Estadísticas
// ============================================

/**
 * Estadísticas para el dashboard administrativo
 */
export interface DashboardStats {
  totalProductos: number;
  totalCategorias: number;
  totalMarcas: number;
  productosAgotados: number;
  totalStock: number;
  valorInventario: number;
}

// ============================================
// RESPUESTAS GENÉRICAS
// ============================================

/**
 * Respuesta estándar de la API
 */
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

/**
 * Respuesta de eliminación
 */
export interface DeleteResponse {
  success: boolean;
  message: string;
}
