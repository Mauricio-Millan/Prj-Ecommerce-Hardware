# 🔗 Configuración de Conexión Frontend-Backend

## ✅ Configuración Completada

### 📁 Archivos Creados/Modificados:

1. **`src/enviroment/enviroment.ts`** - Variables de entorno desarrollo
2. **`src/enviroment/enviroment.prod.ts`** - Variables de entorno producción
3. **`src/app/app.config.ts`** - HttpClient y interceptors configurados
4. **`src/app/features/products/models/product.model.ts`** - Interfaces y modelos
5. **`src/app/features/products/services/product.service.ts`** - Servicio HTTP completo
6. **`src/app/core/interceptors/error.interceptor.ts`** - Manejo de errores global
7. **`src/app/core/interceptors/logging.interceptor.ts`** - Logging de peticiones

---

## 🌐 URL del Backend Configurada:

```
http://localhost:8080/REST-Ecommerce-Hardware
```

---

## 🛠️ Configuración de CORS en Spring Boot

**IMPORTANTE:** Para que el frontend pueda comunicarse con el backend, necesitas configurar CORS en tu aplicación Spring Boot.

### Opción 1: Configuración Global (Recomendada)

Crea una clase de configuración en tu proyecto Spring:

```java
package com.tuempresa.ecommerce.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.Arrays;

@Configuration
public class CorsConfig {

    @Bean
    public CorsFilter corsFilter() {
        CorsConfiguration config = new CorsConfiguration();
        
        // Permitir requests desde el frontend Angular
        config.setAllowedOrigins(Arrays.asList("http://localhost:4200"));
        
        // Métodos HTTP permitidos
        config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        
        // Headers permitidos
        config.setAllowedHeaders(Arrays.asList("*"));
        
        // Permitir envío de cookies/credentials
        config.setAllowCredentials(true);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        
        return new CorsFilter(source);
    }
}
```

### Opción 2: Anotación @CrossOrigin en Controllers

```java
@RestController
@RequestMapping("/products")
@CrossOrigin(origins = "http://localhost:4200")
public class ProductController {
    // Tus endpoints aquí
}
```

---

## 🧪 Cómo Probar la Conexión

### 1. Asegúrate de que el backend está corriendo:

```bash
# Verifica que Spring Boot esté ejecutándose en:
http://localhost:8080/REST-Ecommerce-Hardware
```

### 2. Prueba un endpoint desde el navegador:

```
http://localhost:8080/REST-Ecommerce-Hardware/products
```

### 3. Desde Angular, usa el servicio:

```typescript
import { Component, OnInit, inject } from '@angular/core';
import { ProductService } from './features/products/services/product.service';

export class TestComponent implements OnInit {
  private productService = inject(ProductService);

  ngOnInit() {
    // Obtener todos los productos
    this.productService.getProducts().subscribe({
      next: (response) => {
        console.log('✅ Productos obtenidos:', response);
      },
      error: (error) => {
        console.error('❌ Error al obtener productos:', error);
      }
    });
  }
}
```

---

## 📋 Endpoints Disponibles en el Servicio

| Método | Descripción | Parámetros |
|--------|-------------|------------|
| `getProducts(page, size, filters)` | Obtener productos paginados | page, size, filtros opcionales |
| `getProductById(id)` | Obtener producto por ID | id |
| `getFeaturedProducts(limit)` | Obtener productos destacados | limit (default: 8) |
| `getProductsByCategory(category, page, size)` | Productos por categoría | category, page, size |
| `getProductsByBrand(brand, page, size)` | Productos por marca | brand, page, size |
| `searchProducts(search, page, size)` | Buscar productos | término de búsqueda |
| `createProduct(product)` | Crear producto (admin) | CreateProductDto |
| `updateProduct(id, product)` | Actualizar producto (admin) | id, datos |
| `deleteProduct(id)` | Eliminar producto (admin) | id |
| `getCategories()` | Obtener todas las categorías | - |
| `getBrands()` | Obtener todas las marcas | - |

---

## 🔍 Interceptors Configurados

### 1. **Error Interceptor**
- Maneja errores HTTP globalmente
- Muestra mensajes específicos por código de error
- Log en consola para debugging

### 2. **Logging Interceptor**
- Registra todas las peticiones HTTP
- Muestra tiempo de respuesta
- Útil para debugging y optimización

---

## 🚨 Solución de Problemas Comunes

### Error: "CORS policy: No 'Access-Control-Allow-Origin' header"

**Causa:** Backend no tiene CORS configurado

**Solución:** Agrega la configuración CORS en Spring Boot (ver arriba)

---

### Error: "Failed to fetch" o "ERR_CONNECTION_REFUSED"

**Causa:** Backend no está corriendo

**Solución:** 
```bash
# Verifica que Spring Boot esté corriendo
http://localhost:8080
```

---

### Error 404: "Not Found"

**Causa:** La ruta del endpoint no coincide

**Solución:** Verifica que las rutas en Spring coincidan con las del servicio:
```
Backend: /REST-Ecommerce-Hardware/products
Frontend: environment.apiUrl + '/products'
```

---

## ✅ Checklist de Verificación

- [ ] Backend Spring Boot corriendo en puerto 8080
- [ ] CORS configurado en Spring Boot
- [ ] Frontend Angular corriendo en puerto 4200
- [ ] `environment.apiUrl` apunta a `http://localhost:8080/REST-Ecommerce-Hardware`
- [ ] Interceptors registrados en `app.config.ts`
- [ ] ProductService inyectado en componentes

---

¡Tu frontend está listo para conectarse con el backend! 🚀
