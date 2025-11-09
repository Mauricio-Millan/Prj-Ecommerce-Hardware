import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { LoginService } from '../../features/auth/services/login.service';

/**
 * Guard para rutas que requieren autenticación
 * Redirige a /login si el usuario no está autenticado
 */
export const authGuard: CanActivateFn = (route, state) => {
  const loginService = inject(LoginService);
  const router = inject(Router);

  if (loginService.isLoggedIn()) {
    return true;
  }

  // Guardar la URL intentada para redirigir después del login
  router.navigate(['/login'], { 
    queryParams: { returnUrl: state.url }
  });
  return false;
};

/**
 * Guard para rutas de administrador
 * Redirige a /login si no está autenticado
 * Redirige a / si no es admin
 */
export const adminGuard: CanActivateFn = (route, state) => {
  const loginService = inject(LoginService);
  const router = inject(Router);

  // Verificar si está autenticado
  if (!loginService.isLoggedIn()) {
    router.navigate(['/login'], {
      queryParams: { returnUrl: state.url }
    });
    return false;
  }

  // Verificar si es admin
  if (loginService.isAdmin()) {
    return true;
  }

  // Si está autenticado pero no es admin, redirigir a home
  alert('⚠️ Acceso denegado. Solo administradores pueden acceder a esta sección.');
  router.navigate(['/']);
  return false;
};
