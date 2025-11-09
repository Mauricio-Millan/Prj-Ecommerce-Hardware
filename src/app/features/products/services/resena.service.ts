import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../enviroment/enviroment';
import { ResenaModel, CreateResenaDto, ResenaStats } from '../models/resena.model';

@Injectable({
  providedIn: 'root'
})
export class ResenaService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/resenas`;

  /**
   * Obtener todas las reseñas de un producto
   * GET /api/resenas/producto/{idProducto}
   */
  getResenasByProducto(idProducto: number): Observable<ResenaModel[]> {
    return this.http.get<ResenaModel[]>(`${this.apiUrl}/producto/${idProducto}`);
  }

  /**
   * Obtener estadísticas de reseñas de un producto
   * GET /api/resenas/producto/{idProducto}/stats
   */
  getResenaStats(idProducto: number): Observable<ResenaStats> {
    return this.http.get<ResenaStats>(`${this.apiUrl}/producto/${idProducto}/stats`);
  }

  /**
   * Obtener reseña por ID
   * GET /api/resenas/{id}
   */
  getResenaById(id: number): Observable<ResenaModel> {
    return this.http.get<ResenaModel>(`${this.apiUrl}/${id}`);
  }

  /**
   * Crear una nueva reseña
   * POST /api/resenas
   */
  createResena(resena: CreateResenaDto): Observable<ResenaModel> {
    return this.http.post<ResenaModel>(this.apiUrl, resena);
  }

  /**
   * Actualizar una reseña
   * PUT /api/resenas/{id}
   */
  updateResena(id: number, resena: CreateResenaDto): Observable<ResenaModel> {
    return this.http.put<ResenaModel>(`${this.apiUrl}/${id}`, resena);
  }

  /**
   * Eliminar una reseña
   * DELETE /api/resenas/{id}
   */
  deleteResena(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  /**
   * Obtener reseñas de un usuario
   * GET /api/resenas/usuario/{idUsuario}
   */
  getResenasByUsuario(idUsuario: number): Observable<ResenaModel[]> {
    return this.http.get<ResenaModel[]>(`${this.apiUrl}/usuario/${idUsuario}`);
  }
}
