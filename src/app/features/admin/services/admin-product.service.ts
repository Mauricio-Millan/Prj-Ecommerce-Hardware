import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../enviroment/enviroment';
import { ProductModel } from '../../products/models/product.model';
import { 
  CreateProductDto, 
  UpdateProductDto, 
  UpdateStockDto,
  ImageUploadResponse,
  DeleteResponse,
  ProductImage,
  UpdateProductImageDto
} from '../models/admin.model';

/**
 * Servicio para operaciones administrativas de productos
 * Consume los endpoints REST de /api/productos y /api/productoimg
 */
@Injectable({
  providedIn: 'root'
})
export class AdminProductService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/productos`;
  private imageApiUrl = `${environment.apiUrl}/productoimg`;           // 🔧 Para subir archivos
  private productImageApiUrl = `${environment.apiUrl}/producto-imagenes`; // 🔧 Para registros JSON

  // ============================================
  // CRUD DE PRODUCTOS
  // ============================================

  /**
   * Obtener todos los productos
   * GET /api/productos
   */
  getAllProducts(): Observable<ProductModel[]> {
    return this.http.get<ProductModel[]>(this.apiUrl);
  }

  /**
   * Obtener un producto por ID
   * GET /api/productos/{id}
   */
  getProductById(id: number): Observable<ProductModel> {
    return this.http.get<ProductModel>(`${this.apiUrl}/${id}`);
  }

  /**
   * Crear un nuevo producto
   * POST /api/productos
   * Body: CreateProductDto
   */
  createProduct(product: CreateProductDto): Observable<ProductModel> {
    return this.http.post<ProductModel>(this.apiUrl, product, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }

  /**
   * Actualizar un producto existente
   * PUT /api/productos/{id}
   * Body: UpdateProductDto
   */
  updateProduct(id: number, product: UpdateProductDto): Observable<ProductModel> {
    return this.http.put<ProductModel>(`${this.apiUrl}/${id}`, product, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }

  /**
   * Actualizar solo el stock de un producto
   * PATCH /api/productos/{id}/stock
   * Body: { stock: number }
   */
  updateStock(id: number, stock: number): Observable<ProductModel> {
    const body: UpdateStockDto = { stock };
    return this.http.patch<ProductModel>(`${this.apiUrl}/${id}/stock`, body, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }

  /**
   * Eliminar un producto
   * DELETE /api/productos/{id}
   */
  deleteProduct(id: number): Observable<DeleteResponse> {
    return this.http.delete<DeleteResponse>(`${this.apiUrl}/${id}`);
  }

  // ============================================
  // GESTIÓN DE IMÁGENES
  // ============================================

  /**
   * ✅ Subir imagen a un producto
   * POST /api/producto-imagenes/producto/{idProducto}
   * Body: FormData con key 'file' únicamente
   * El backend asigna automáticamente el orden
   */
  uploadProductImageNew(productId: number, imageFile: File, orden: number): Observable<ProductImage> {
    const formData = new FormData();
    formData.append('file', imageFile);    // 🔧 Solo enviar el archivo

    // POST a /api/producto-imagenes/producto/{id}
    return this.http.post<ProductImage>(`${this.productImageApiUrl}/producto/${productId}`, formData);
  }

  /**
   * Crear imagen de producto (solo registro, sin archivo)
   * POST /api/producto-imagenes
   * Body: JSON con { idProducto: {id}, urlImagen, orden }
   */
  createProductImageRecord(productId: number, urlImagen: string, orden: number): Observable<ProductImage> {
    const body = {
      idProducto: { id: productId },
      urlImagen: urlImagen,
      orden: orden
    };
    
    return this.http.post<ProductImage>(this.productImageApiUrl, body, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }

  /**
   * Actualizar imagen de un producto
   * PUT /api/productoimg/{id}
   * Body: FormData con 'imagen'
   */
  updateProductImage(imageId: number, imageFile: File): Observable<ImageUploadResponse> {
    const formData = new FormData();
    formData.append('imagen', imageFile);

    return this.http.put<ImageUploadResponse>(`${this.productImageApiUrl}/${imageId}`, formData);
  }

  /**
   * Eliminar imagen de un producto
   * DELETE /api/productoimg/{id}
   */
  deleteProductImage(imageId: number): Observable<DeleteResponse> {
    return this.http.delete<DeleteResponse>(`${this.productImageApiUrl}/${imageId}`);
  }

  /**
   * Obtener todas las imágenes de un producto
   * GET /api/productoimg/producto/{idProducto}
   */
  getProductImages(productId: number): Observable<ImageUploadResponse[]> {
    return this.http.get<ImageUploadResponse[]>(`${this.productImageApiUrl}/producto/${productId}`);
  }

  // ============================================
  // GESTIÓN DE MÚLTIPLES IMÁGENES (NUEVO ENDPOINT)
  // ============================================

  /**
   * Obtener todas las imágenes ordenadas de un producto
   * GET /api/producto-imagenes/producto/{id}
   */
  getProductImagesOrdered(productId: number): Observable<ProductImage[]> {
    return this.http.get<ProductImage[]>(`${this.productImageApiUrl}/producto/${productId}`);
  }

  /**
   * Actualizar orden de imagen
   * PATCH /api/producto-imagenes/{id}/orden?nuevoOrden=X
   * Query param: nuevoOrden (número positivo)
   */
  updateImageOrder(imageId: number, newOrden: number): Observable<ProductImage> {
    return this.http.patch<ProductImage>(
      `${this.productImageApiUrl}/${imageId}/orden?nuevoOrden=${newOrden}`,
      null  // PATCH sin body, solo query param
    );
  }

  /**
   * Eliminar una imagen del producto
   * DELETE /api/producto-imagenes/{id}
   */
  deleteProductImageOrdered(imageId: number): Observable<DeleteResponse> {
    return this.http.delete<DeleteResponse>(`${this.productImageApiUrl}/${imageId}`);
  }

  // ============================================
  // MÉTODOS AUXILIARES
  // ============================================

  /**
   * Construir URL completa de imagen
   */
  getImageUrl(imagePath: string): string {
    if (!imagePath) return 'assets/placeholders/product-placeholder.png';
    if (imagePath.startsWith('http')) return imagePath;
    return `${environment.apiUrl}${imagePath}`;
  }

  /**
   * Validar archivo de imagen
   */
  validateImageFile(file: File): { valid: boolean; error?: string } {
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

    if (!allowedTypes.includes(file.type)) {
      return { 
        valid: false, 
        error: 'Formato no permitido. Solo JPEG, PNG y WEBP.' 
      };
    }

    if (file.size > maxSize) {
      return { 
        valid: false, 
        error: 'La imagen no debe superar 5MB.' 
      };
    }

    return { valid: true };
  }
}
