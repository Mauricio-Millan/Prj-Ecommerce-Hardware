import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../enviroment/enviroment';
import { Usuario, RegisterDto } from '../../auth/models/Usuario.model';

/**
 * Servicio para gestión de usuarios (Admin)
 * CRUD completo de usuarios
 */
@Injectable({
  providedIn: 'root'
})
export class AdminUserService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/usuarios`;

  /**
   * Obtener todos los usuarios
   * GET /api/usuarios
   */
  getAllUsers(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.apiUrl);
  }

  /**
   * Obtener usuario por ID
   * GET /api/usuarios/{id}
   */
  getUserById(id: number): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.apiUrl}/${id}`);
  }

  /**
   * Obtener usuario por email
   * GET /api/usuarios/email/{correo}
   */
  getUserByEmail(email: string): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.apiUrl}/email/${email}`);
  }

  /**
   * Crear nuevo usuario (Admin puede asignar cualquier rol)
   * POST /api/usuarios/register
   */
  createUser(userData: RegisterDto): Observable<Usuario> {
    return this.http.post<Usuario>(`${this.apiUrl}/register`, userData, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }

  /**
   * Actualizar usuario
   * PUT /api/usuarios/{id}
   */
  updateUser(id: number, userData: Partial<Usuario>): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.apiUrl}/${id}`, userData, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }

  /**
   * Eliminar usuario
   * DELETE /api/usuarios/{id}
   */
  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  /**
   * Verificar si email existe
   * GET /api/usuarios/exists/{correo}
   */
  checkEmailExists(email: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/exists/${email}`);
  }
}
