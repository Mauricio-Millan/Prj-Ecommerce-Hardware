import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../enviroment/enviroment';
import { CategoryModel } from '../../products/models/category.model';
import { 
  CreateCategoryDto, 
  UpdateCategoryDto,
  DeleteResponse 
} from '../models/admin.model';

/**
 * Servicio para operaciones administrativas de categorías
 * Consume los endpoints REST de /api/categorias
 */
@Injectable({
  providedIn: 'root'
})
export class AdminCategoryService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/categorias`;

  // ============================================
  // CRUD DE CATEGORÍAS
  // ============================================

  /**
   * Obtener todas las categorías
   * GET /api/categorias
   */
  getAllCategories(): Observable<CategoryModel[]> {
    return this.http.get<CategoryModel[]>(this.apiUrl);
  }

  /**
   * Obtener una categoría por ID
   * GET /api/categorias/{id}
   */
  getCategoryById(id: number): Observable<CategoryModel> {
    return this.http.get<CategoryModel>(`${this.apiUrl}/${id}`);
  }

  /**
   * Crear una nueva categoría
   * POST /api/categorias
   * Body: CreateCategoryDto
   */
  createCategory(category: CreateCategoryDto): Observable<CategoryModel> {
    return this.http.post<CategoryModel>(this.apiUrl, category, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }

  /**
   * Actualizar una categoría existente
   * PUT /api/categorias/{id}
   * Body: UpdateCategoryDto
   */
  updateCategory(id: number, category: UpdateCategoryDto): Observable<CategoryModel> {
    return this.http.put<CategoryModel>(`${this.apiUrl}/${id}`, category, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }

  /**
   * Eliminar una categoría
   * DELETE /api/categorias/{id}
   */
  deleteCategory(id: number): Observable<DeleteResponse> {
    return this.http.delete<DeleteResponse>(`${this.apiUrl}/${id}`);
  }

  // ============================================
  // MÉTODOS AUXILIARES
  // ============================================

  /**
   * Validar que una categoría no tenga productos asociados antes de eliminar
   */
  canDeleteCategory(id: number): Observable<{ canDelete: boolean; productsCount: number }> {
    // Este endpoint debería implementarse en el backend
    return this.http.get<{ canDelete: boolean; productsCount: number }>(
      `${this.apiUrl}/${id}/can-delete`
    );
  }

  /**
   * Obtener productos de una categoría
   */
  getCategoryProducts(id: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${id}/productos`);
  }
}
