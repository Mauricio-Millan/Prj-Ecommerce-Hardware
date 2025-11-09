import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../../enviroment/enviroment';
import { 
  LoginRequestDto, 
  LoginResponseDto, 
  RegisterDto, 
  Usuario,
  UserSession 
} from '../models/Usuario.model';

/**
 * Servicio de autenticación
 * Maneja login, registro, logout y sesión de usuario
 */
@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/usuarios`;
  
  // Señal reactiva con el usuario actual
  currentUser = signal<UserSession | null>(null);
  
  // Key para localStorage
  private readonly STORAGE_KEY = 'userSession';

  constructor() {
    // Cargar usuario desde localStorage al iniciar
    this.loadUserFromStorage();
  }

  /**
   * Login - POST /api/usuarios/login
   */
  login(credentials: LoginRequestDto): Observable<LoginResponseDto> {
    return this.http.post<LoginResponseDto>(
      `${this.apiUrl}/login`, 
      credentials,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      }
    ).pipe(
      tap(response => {
        if (response.success && response.usuario) {
          this.saveUserSession(response.usuario);
        }
      })
    );
  }

  /**
   * Registro - POST /api/usuarios/register
   */
  register(userData: RegisterDto): Observable<Usuario> {
    return this.http.post<Usuario>(
      `${this.apiUrl}/register`, 
      userData,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      }
    );
  }

  /**
   * Verificar si email existe - GET /api/usuarios/exists/{correo}
   */
  checkEmailExists(email: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/exists/${email}`);
  }

  /**
   * Cerrar sesión
   */
  logout(): void {
    this.clearUserSession();
  }

  /**
   * Verificar si hay sesión activa
   */
  isLoggedIn(): boolean {
    return this.currentUser() !== null;
  }

  /**
   * Obtener usuario actual
   */
  getCurrentUser(): UserSession | null {
    return this.currentUser();
  }

  /**
   * Verificar si el usuario es admin
   */
  isAdmin(): boolean {
    const user = this.currentUser();
    return user?.rol === 'ADMIN' || user?.rol === 'admin';
  }

  // ============================================
  // GESTIÓN DE SESIÓN EN LOCALSTORAGE
  // ============================================

  /**
   * Guardar sesión del usuario
   */
  private saveUserSession(usuario: Usuario): void {
    console.log('💾 Guardando sesión de usuario:', usuario);
    const userSession: UserSession = {
      id: usuario.id,
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      correoElectronico: usuario.correoElectronico,
      rol: usuario.rol
    };
    console.log('📦 UserSession creado:', userSession);

    // Guardar datos completos en localStorage (opcional, para perfil)
    localStorage.setItem('fullUserData', JSON.stringify(usuario));
    
    // Guardar sesión mínima
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(userSession));
    console.log('✅ Sesión guardada en localStorage con key:', this.STORAGE_KEY);
    
    // Actualizar señal
    this.currentUser.set(userSession);
    console.log('✅ Signal currentUser actualizado:', this.currentUser());
  }

  /**
   * Cargar usuario desde localStorage
   */
  private loadUserFromStorage(): void {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    console.log('🔍 Cargando usuario desde localStorage...', stored);
    if (stored) {
      try {
        const userSession: UserSession = JSON.parse(stored);
        console.log('✅ Usuario cargado desde localStorage:', userSession);
        this.currentUser.set(userSession);
      } catch (error) {
        console.error('❌ Error al cargar sesión:', error);
        this.clearUserSession();
      }
    } else {
      console.log('ℹ️ No hay sesión guardada en localStorage');
    }
  }

  /**
   * Limpiar sesión
   */
  private clearUserSession(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    localStorage.removeItem('fullUserData');
    this.currentUser.set(null);
  }

  /**
   * Obtener datos completos del usuario (si existen en storage)
   */
  getFullUserData(): Usuario | null {
    const stored = localStorage.getItem('fullUserData');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (error) {
        console.error('Error al cargar datos completos:', error);
        return null;
      }
    }
    return null;
  }
}
