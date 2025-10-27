import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../enviroment/enviroment';
import { CategoryModel } from '../models/category.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/categorias`;

  /**
   * Obtener todas las categorías
   * Endpoint: GET /api/categorias
   */
  getAllCategories(): Observable<CategoryModel[]> {
    return this.http.get<CategoryModel[]>(this.apiUrl);
  }

  /**
   * Obtener una categoría por ID
   * @param id - ID de la categoría
   */
  getCategoryById(id: number): Observable<CategoryModel> {
    return this.http.get<CategoryModel>(`${this.apiUrl}/${id}`);
  }
}
