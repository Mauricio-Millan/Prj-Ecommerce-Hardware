import { HttpInterceptorFn } from '@angular/common/http';
import { finalize } from 'rxjs';

/**
 * Interceptor HTTP para logging de peticiones
 * Registra todas las peticiones HTTP y sus respuestas para debugging
 */
export const loggingInterceptor: HttpInterceptorFn = (req, next) => {
  const startTime = Date.now();
  
  console.log('🚀 HTTP Request:', {
    method: req.method,
    url: req.url,
    headers: req.headers.keys()
  });

  return next(req).pipe(
    finalize(() => {
      const elapsed = Date.now() - startTime;
      console.log(`✅ HTTP Response: ${req.url} - ${elapsed}ms`);
    })
  );
};
