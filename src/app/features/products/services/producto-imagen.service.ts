import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../enviroment/enviroment';
import { ProductoImagenModel, CreateProductoImagenDto } from '../models/producto-imagen.model';

@Injectable({
  providedIn: 'root'
})
export class ProductoImagenService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/producto-imagenes`;

  /**
   * Obtener todas las imágenes de un producto
   * GET /api/producto-imagenes/producto/{idProducto}
   */
  getImagenesByProducto(idProducto: number): Observable<ProductoImagenModel[]> {
    return this.http.get<ProductoImagenModel[]>(`${this.apiUrl}/producto/${idProducto}`);
  }

  /**
   * Obtener imagen por ID
   * GET /api/producto-imagenes/{id}
   */
  getImagenById(id: number): Observable<ProductoImagenModel> {
    return this.http.get<ProductoImagenModel>(`${this.apiUrl}/${id}`);
  }

  /**
   * Crear una nueva imagen
   * POST /api/producto-imagenes
   */
  createImagen(imagen: CreateProductoImagenDto): Observable<ProductoImagenModel> {
    return this.http.post<ProductoImagenModel>(this.apiUrl, imagen);
  }

  /**
   * Actualizar una imagen
   * PUT /api/producto-imagenes/{id}
   */
  updateImagen(id: number, imagen: CreateProductoImagenDto): Observable<ProductoImagenModel> {
    return this.http.put<ProductoImagenModel>(`${this.apiUrl}/${id}`, imagen);
  }

  /**
   * Eliminar una imagen
   * DELETE /api/producto-imagenes/{id}
   */
  deleteImagen(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  /**
   * Obtener URL completa de la imagen
   */
  getImageUrl(urlImagen: string): string {
    if (!urlImagen) {
      return 'assets/placeholders/product-placeholder.png';
    }
    // Si la URL ya es completa (http/https), retornarla tal cual
    if (urlImagen.startsWith('http://') || urlImagen.startsWith('https://')) {
      return urlImagen;
    }
    // Si es una ruta relativa, construir la URL completa con el contexto del backend
    // La URL del backend viene sin el dominio, por ejemplo: /uploads/producto1.jpg
    return `http://localhost:8080/REST-Ecommerce-Hardware${urlImagen}`;
  }
}
