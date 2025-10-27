import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';

/**
 * Interceptor HTTP para manejo de errores globales
 * Intercepta todas las peticiones HTTP y maneja errores de forma centralizada
 */
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = '';

      if (error.error instanceof ErrorEvent) {
        // Error del lado del cliente
        errorMessage = `Error: ${error.error.message}`;
        console.error('❌ Error del cliente:', error.error.message);
      } else {
        // Error del lado del servidor
        errorMessage = `Error ${error.status}: ${error.message}`;
        
        switch (error.status) {
          case 400:
            console.error('❌ Bad Request:', error.error);
            break;
          case 401:
            console.error('❌ No autorizado. Por favor inicia sesión.');
            // Aquí podrías redirigir al login
            break;
          case 403:
            console.error('❌ Acceso prohibido.');
            break;
          case 404:
            console.error('❌ Recurso no encontrado:', error.url);
            break;
          case 500:
            console.error('❌ Error interno del servidor.');
            break;
          case 0:
            console.error('❌ No se pudo conectar con el servidor. Verifica que el backend esté corriendo en:', req.url);
            errorMessage = 'No se pudo conectar con el servidor. Verifica que esté corriendo.';
            break;
          default:
            console.error('❌ Error desconocido:', error);
        }
      }

      return throwError(() => new Error(errorMessage));
    })
  );
};
