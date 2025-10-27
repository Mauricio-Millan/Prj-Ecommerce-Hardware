import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../enviroment/enviroment';
import { BrandModel } from '../models/brand.model';

@Injectable({
  providedIn: 'root'
})
export class BrandService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/marcas`;

  /**
   * Obtener todas las marcas
   * Endpoint: GET /api/marcas
   */
  getAllBrands(): Observable<BrandModel[]> {
    return this.http.get<BrandModel[]>(this.apiUrl);
  }

  /**
   * Obtener una marca por ID
   * @param id - ID de la marca
   */
  getBrandById(id: number): Observable<BrandModel> {
    return this.http.get<BrandModel>(`${this.apiUrl}/${id}`);
  }
}
