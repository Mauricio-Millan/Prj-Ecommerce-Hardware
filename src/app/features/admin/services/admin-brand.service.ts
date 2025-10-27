import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../enviroment/enviroment';
import { BrandModel } from '../../products/models/brand.model';
import { 
  CreateBrandDto, 
  UpdateBrandDto,
  DeleteResponse 
} from '../models/admin.model';

/**
 * Servicio para operaciones administrativas de marcas
 * Consume los endpoints REST de /api/marcas
 */
@Injectable({
  providedIn: 'root'
})
export class AdminBrandService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/marcas`;

  // ============================================
  // CRUD DE MARCAS
  // ============================================

  /**
   * Obtener todas las marcas
   * GET /api/marcas
   */
  getAllBrands(): Observable<BrandModel[]> {
    return this.http.get<BrandModel[]>(this.apiUrl);
  }

  /**
   * Obtener una marca por ID
   * GET /api/marcas/{id}
   */
  getBrandById(id: number): Observable<BrandModel> {
    return this.http.get<BrandModel>(`${this.apiUrl}/${id}`);
  }

  /**
   * Crear una nueva marca
   * POST /api/marcas
   * Body: CreateBrandDto
   */
  createBrand(brand: CreateBrandDto): Observable<BrandModel> {
    return this.http.post<BrandModel>(this.apiUrl, brand, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }

  /**
   * Actualizar una marca existente
   * PUT /api/marcas/{id}
   * Body: UpdateBrandDto
   */
  updateBrand(id: number, brand: UpdateBrandDto): Observable<BrandModel> {
    return this.http.put<BrandModel>(`${this.apiUrl}/${id}`, brand, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }

  /**
   * Eliminar una marca
   * DELETE /api/marcas/{id}
   */
  deleteBrand(id: number): Observable<DeleteResponse> {
    return this.http.delete<DeleteResponse>(`${this.apiUrl}/${id}`);
  }

  // ============================================
  // MÉTODOS AUXILIARES
  // ============================================

  /**
   * Validar que una marca no tenga productos asociados antes de eliminar
   */
  canDeleteBrand(id: number): Observable<{ canDelete: boolean; productsCount: number }> {
    // Este endpoint debería implementarse en el backend
    return this.http.get<{ canDelete: boolean; productsCount: number }>(
      `${this.apiUrl}/${id}/can-delete`
    );
  }

  /**
   * Obtener productos de una marca
   */
  getBrandProducts(id: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${id}/productos`);
  }

  /**
   * Obtener estadísticas de una marca
   */
  getBrandStats(id: number): Observable<{ totalProducts: number; totalStock: number; totalValue: number }> {
    return this.http.get<{ totalProducts: number; totalStock: number; totalValue: number }>(
      `${this.apiUrl}/${id}/stats`
    );
  }
}
