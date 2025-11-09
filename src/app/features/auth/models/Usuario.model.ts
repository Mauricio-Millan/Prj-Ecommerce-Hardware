/**
 * Modelos para autenticación y usuario
 */

/**
 * Entidad completa del usuario (según Swagger)
 */
export interface Usuario {
  id: number;
  nombre: string;
  apellido: string;
  correoElectronico: string;
  numeroTelefono?: string;
  direccion?: string;
  ciudad?: string;
  pais?: string;
  codigoPostal?: string;
  rol: string;
  creadoEn?: string;
  actualizadoEn?: string;
}

/**
 * DTO para Login Request
 * POST /api/usuarios/login
 */
export interface LoginRequestDto {
  correoElectronico: string;
  contrasena: string;
}

/**
 * DTO para Login Response
 * Respuesta de POST /api/usuarios/login
 */
export interface LoginResponseDto {
  success: boolean;
  message: string;
  usuario: Usuario;
}

/**
 * DTO para Registro
 * POST /api/usuarios/register
 */
export interface RegisterDto {
  nombre: string;
  apellido: string;
  correoElectronico: string;
  hashContrasena: string;
  numeroTelefono?: string;
  direccion?: string;
  ciudad?: string;
  pais?: string;
  codigoPostal?: string;
  rol: string;
}

/**
 * Usuario en sesión (datos guardados en localStorage)
 */
export interface UserSession {
  id: number;
  nombre: string;
  apellido: string;
  correoElectronico: string;
  rol: string;
}
