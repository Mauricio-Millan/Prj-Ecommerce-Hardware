# 🛍️ Listado de Productos - Configuración Completa

## ✅ Estado Actual

### Archivos Configurados:

#### 1. **Modelos** (`src/app/features/products/models/product.model.ts`)
```typescript
export interface ProductModel {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  sku: string;
  imagenPortada: string;
  idMarca: number;
  nombreMarca: string;
  idCategoria: number;
  nombreCategoria: string;
}
```

#### 2. **Servicio** (`src/app/features/products/services/product.service.ts`)
- ✅ `getAllProducts()` - Endpoint: `/api/productos/portada`
- ✅ `getProductById(id)`
- ✅ `getProductsByCategory(idCategoria)`
- ✅ `getProductsByBrand(idMarca)`
- ✅ `searchProducts(busqueda)`
- ✅ `getCategories()` - Endpoint: `/api/categorias`
- ✅ `getBrands()` - Endpoint: `/api/marcas`
- ✅ `getImageUrl(imagenPortada)` - Construye URL completa de imagen

#### 3. **Componente de Listado** (`product-list.component`)
- ✅ Grid responsive (1-2-3-4 columnas)
- ✅ Estados: Loading, Error, Empty, Success
- ✅ Tarjetas de producto con:
  - Imagen con hover zoom
  - Badge de stock (En Stock / Agotado)
  - Categoría y marca
  - Nombre y descripción (limitado a 2 líneas)
  - Precio formateado
  - Botón "Agregar al Carrito"
  - Botón "Ver detalles"
  - SKU

#### 4. **Rutas** (`app.routes.ts`)
```typescript
{
  path: 'productos',
  component: ProductListComponent
}
```

#### 5. **Navegación**
- ✅ Navbar actualizado con enlace "Productos"
- ✅ Menú móvil actualizado

---

## 🌐 Estructura de la API

### Endpoint Principal:
```
GET http://localhost:8080/REST-Ecommerce-Hardware/api/productos/portada
```

### Respuesta Esperada:
```json
[
  {
    "id": 1,
    "nombre": "RTX 4090",
    "descripcion": "Tarjeta de video de Serie 5000 con 32 gb de ram",
    "precio": 8000,
    "stock": 12,
    "sku": "001",
    "imagenPortada": "/uploads/producto_1_5d8b6840-9d40-4b95-a63e-71a28001a17c.webp",
    "idMarca": 1,
    "nombreMarca": "NVIDIA",
    "idCategoria": 1,
    "nombreCategoria": "Tarjetas de Video"
  }
]
```

### Construcción de URL de Imagen:
```typescript
// imagenPortada del backend: "/uploads/producto_1_xxx.webp"
// URL completa: "http://localhost:8080/REST-Ecommerce-Hardware/uploads/producto_1_xxx.webp"
```

---

## 🚀 Cómo Probar

### 1. Asegúrate de que el backend esté corriendo:
```bash
# Spring Boot debe estar en:
http://localhost:8080/REST-Ecommerce-Hardware
```

### 2. Prueba el endpoint directamente:
```bash
# En el navegador o Postman:
http://localhost:8080/REST-Ecommerce-Hardware/api/productos/portada
```

### 3. Inicia el frontend:
```bash
ng serve
```

### 4. Navega a:
```
http://localhost:4200/productos
```

---

## 🔍 Debugging

### Ver logs en consola del navegador:

#### Si todo está bien:
```
🚀 HTTP Request: GET http://localhost:8080/REST-Ecommerce-Hardware/api/productos/portada
✅ HTTP Response: .../api/productos/portada - 150ms
✅ Productos cargados: (12) [{...}, {...}, ...]
```

#### Si hay error de conexión:
```
❌ No se pudo conectar con el servidor. Verifica que esté corriendo.
❌ Error al cargar productos: Error: No se pudo conectar con el servidor...
```

#### Si hay error 404:
```
❌ Recurso no encontrado: http://localhost:8080/REST-Ecommerce-Hardware/api/productos/portada
```

---

## 🎨 Características de la UI

### Grid Responsive:
- **Mobile (< 640px):** 1 columna
- **Tablet (640px - 768px):** 2 columnas
- **Desktop (768px - 1024px):** 3 columnas
- **Large Desktop (> 1024px):** 4 columnas

### Efectos Visuales:
- ✅ Hover en tarjetas: sombra más grande
- ✅ Hover en imagen: zoom 1.1x
- ✅ Transiciones suaves (300ms)
- ✅ Badge de stock con colores semánticos
- ✅ Botón deshabilitado si stock = 0

### Estados de Carga:
1. **Loading:** Spinner animado
2. **Error:** Banner rojo con botón "Reintentar"
3. **Empty:** Mensaje "No hay productos disponibles"
4. **Success:** Grid de productos

---

## 📦 Dependencias Utilizadas

### Angular:
- `HttpClient` - Peticiones HTTP
- `CommonModule` - Directivas básicas
- `RouterLink` - Navegación
- `Signals` - Estado reactivo

### TailwindCSS:
- Grid system
- Hover effects
- Responsive utilities
- Color palette (blue/indigo)

---

## 🛠️ Próximos Pasos Sugeridos

### 1. **Filtros:**
```typescript
// Agregar en product-list.component
filterByCategory(idCategoria: number) {
  this.productService.getProductsByCategory(idCategoria).subscribe(...)
}

filterByBrand(idMarca: number) {
  this.productService.getProductsByBrand(idMarca).subscribe(...)
}
```

### 2. **Búsqueda:**
```html
<input 
  type="text" 
  (input)="searchProducts($event.target.value)"
  placeholder="Buscar productos..."
/>
```

### 3. **Detalle de Producto:**
```typescript
// Crear route
{
  path: 'productos/:id',
  component: ProductDetailComponent
}

// En la tarjeta
<button [routerLink]="['/productos', product.id]">Ver detalles</button>
```

### 4. **Agregar al Carrito:**
```typescript
// Crear CartService
addToCart(product: ProductModel) {
  this.cartService.addItem(product);
  this.navbar.updateCartCount();
}
```

### 5. **Paginación:**
```html
<div class="pagination">
  <button (click)="loadPage(currentPage - 1)">Anterior</button>
  <span>Página {{ currentPage }} de {{ totalPages }}</span>
  <button (click)="loadPage(currentPage + 1)">Siguiente</button>
</div>
```

---

## ⚠️ Checklist de Verificación

Antes de continuar, asegúrate de:

- [ ] Backend Spring Boot corriendo en puerto 8080
- [ ] Endpoint `/api/productos/portada` responde correctamente
- [ ] CORS configurado en Spring Boot
- [ ] Frontend corriendo en puerto 4200
- [ ] No hay errores en consola del navegador
- [ ] Las imágenes se cargan correctamente
- [ ] El navbar muestra el enlace "Productos"
- [ ] La navegación funciona

---

## 🐛 Problemas Comunes

### 1. **"Cannot find module '../services/product.service'"**
**Causa:** Ruta de importación incorrecta

**Solución:** Usa ruta relativa correcta:
```typescript
import { ProductService } from '../../services/product.service';
```

---

### 2. **"CORS policy: No 'Access-Control-Allow-Origin'"**
**Causa:** CORS no configurado en Spring Boot

**Solución:** Ver `CONFIGURACION_BACKEND.md`

---

### 3. **Imágenes no cargan (404)**
**Causa:** URL de imagen incorrecta

**Solución:** Verifica el método `getImageUrl()`:
```typescript
getImageUrl(imagenPortada: string): string {
  return `http://localhost:8080/REST-Ecommerce-Hardware${imagenPortada}`;
}
```

---

### 4. **"Failed to fetch"**
**Causa:** Backend no está corriendo

**Solución:** Inicia Spring Boot y verifica:
```
http://localhost:8080/REST-Ecommerce-Hardware
```

---

¡Tu listado de productos está listo! 🎉

**Autor:** GitHub Copilot  
**Fecha:** Octubre 2025  
**Proyecto:** Frontend E-commerce Hardware
