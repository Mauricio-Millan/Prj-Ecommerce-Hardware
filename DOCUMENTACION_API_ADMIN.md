# 📡 Referencia de APIs - Backend Spring Boot

## 🌐 URL Base
```
http://localhost:8080/REST-Ecommerce-Hardware
```

## 📚 Documentación Swagger
```
http://localhost:8080/REST-Ecommerce-Hardware/swagger-ui/index.html
```

---

## 🛍️ **PRODUCTOS** - `/api/productos`

### 📋 Obtener todos los productos
```http
GET /api/productos
```
**Response:** `ProductModel[]`

### 🔍 Obtener producto por ID
```http
GET /api/productos/{id}
```
**Response:** `ProductModel`

### 🎯 Obtener productos de portada
```http
GET /api/productos/portada
```
**Response:** `ProductModel[]`

### ➕ Crear producto
```http
POST /api/productos
Content-Type: application/json
```
**Request Body:**
```json
{
  "nombre": "RTX 4090 Ti",
  "descripcion": "Tarjeta gráfica de última generación",
  "precio": 8000,
  "stock": 15,
  "sku": "GPU-RTX-4090",
  "idMarca": 1,
  "idCategoria": 2
}
```
**Response:** `ProductModel`

### ✏️ Actualizar producto
```http
PUT /api/productos/{id}
Content-Type: application/json
```
**Request Body:** (Todos los campos opcionales)
```json
{
  "nombre": "RTX 4090 Ti Super",
  "descripcion": "Nueva descripción",
  "precio": 8500,
  "stock": 20,
  "sku": "GPU-RTX-4090-S",
  "idMarca": 1,
  "idCategoria": 2
}
```
**Response:** `ProductModel`

### 📦 Actualizar solo stock
```http
PATCH /api/productos/{id}/stock
Content-Type: application/json
```
**Request Body:**
```json
{
  "stock": 50
}
```
**Response:** `ProductModel`

### ❌ Eliminar producto
```http
DELETE /api/productos/{id}
```
**Response:**
```json
{
  "success": true,
  "message": "Producto eliminado exitosamente"
}
```

---

## 🖼️ **IMÁGENES DE PRODUCTOS** - `/api/productoimg`

### 📤 Subir imagen de producto
```http
POST /api/productoimg
Content-Type: multipart/form-data
```
**Request Body (FormData):**
```
imagen: [File]
idProducto: 1
```
**Response:**
```json
{
  "id": 1,
  "nombreArchivo": "producto_1.webp",
  "rutaArchivo": "/uploads/producto_1.webp",
  "tipoArchivo": "image/webp",
  "tamanio": 245678,
  "idProducto": 1,
  "mensaje": "Imagen subida exitosamente"
}
```

### 🔄 Actualizar imagen
```http
PUT /api/productoimg/{id}
Content-Type: multipart/form-data
```
**Request Body (FormData):**
```
imagen: [File]
```
**Response:** `ImageUploadResponse`

### 🗑️ Eliminar imagen
```http
DELETE /api/productoimg/{id}
```
**Response:**
```json
{
  "success": true,
  "message": "Imagen eliminada exitosamente"
}
```

### 📸 Obtener imágenes de un producto
```http
GET /api/productoimg/producto/{idProducto}
```
**Response:** `ImageUploadResponse[]`

---

## 🏷️ **CATEGORÍAS** - `/api/categorias`

### 📋 Obtener todas las categorías
```http
GET /api/categorias
```
**Response:**
```json
[
  {
    "id": 1,
    "nombre": "Tarjetas de Video",
    "descripcion": "Tarjetas gráficas para gaming y diseño"
  }
]
```

### 🔍 Obtener categoría por ID
```http
GET /api/categorias/{id}
```
**Response:** `CategoryModel`

### ➕ Crear categoría
```http
POST /api/categorias
Content-Type: application/json
```
**Request Body:**
```json
{
  "nombre": "Procesadores",
  "descripcion": "CPUs Intel y AMD"
}
```
**Response:** `CategoryModel`

### ✏️ Actualizar categoría
```http
PUT /api/categorias/{id}
Content-Type: application/json
```
**Request Body:** (Campos opcionales)
```json
{
  "nombre": "Procesadores Gaming",
  "descripcion": "CPUs de alta gama para gaming"
}
```
**Response:** `CategoryModel`

### ❌ Eliminar categoría
```http
DELETE /api/categorias/{id}
```
**Response:**
```json
{
  "success": true,
  "message": "Categoría eliminada exitosamente"
}
```

---

## 🏢 **MARCAS** - `/api/marcas`

### 📋 Obtener todas las marcas
```http
GET /api/marcas
```
**Response:**
```json
[
  {
    "id": 1,
    "nombre": "NVIDIA"
  },
  {
    "id": 2,
    "nombre": "AMD"
  }
]
```

### 🔍 Obtener marca por ID
```http
GET /api/marcas/{id}
```
**Response:** `BrandModel`

### ➕ Crear marca
```http
POST /api/marcas
Content-Type: application/json
```
**Request Body:**
```json
{
  "nombre": "Intel"
}
```
**Response:** `BrandModel`

### ✏️ Actualizar marca
```http
PUT /api/marcas/{id}
Content-Type: application/json
```
**Request Body:**
```json
{
  "nombre": "Intel Corporation"
}
```
**Response:** `BrandModel`

### ❌ Eliminar marca
```http
DELETE /api/marcas/{id}
```
**Response:**
```json
{
  "success": true,
  "message": "Marca eliminada exitosamente"
}
```

---

## 🔐 **Códigos de Estado HTTP**

| Código | Significado | Descripción |
|--------|-------------|-------------|
| `200` | OK | Operación exitosa |
| `201` | Created | Recurso creado exitosamente |
| `204` | No Content | Operación exitosa sin contenido |
| `400` | Bad Request | Datos de entrada inválidos |
| `404` | Not Found | Recurso no encontrado |
| `409` | Conflict | Conflicto (ej: SKU duplicado) |
| `500` | Internal Server Error | Error del servidor |

---

## 📝 **Notas Importantes**

### ✅ Validaciones del Backend

**Productos:**
- `nombre`: Requerido, mínimo 3 caracteres
- `descripcion`: Requerido, mínimo 10 caracteres
- `precio`: Requerido, mayor a 0
- `stock`: Requerido, mayor o igual a 0
- `sku`: Requerido, único, patrón alfanumérico
- `idMarca`: Requerido, debe existir
- `idCategoria`: Requerido, debe existir

**Imágenes:**
- Formatos permitidos: JPG, JPEG, PNG, WEBP
- Tamaño máximo: 5MB
- Se almacenan en: `/uploads/`

**Categorías:**
- `nombre`: Requerido, único, mínimo 3 caracteres
- `descripcion`: Requerido

**Marcas:**
- `nombre`: Requerido, único, mínimo 2 caracteres

### 🔗 Relaciones

- Un **Producto** pertenece a una **Categoría**
- Un **Producto** pertenece a una **Marca**
- Una **Categoría** puede tener múltiples **Productos**
- Una **Marca** puede tener múltiples **Productos**
- Un **Producto** puede tener múltiples **Imágenes**

### 🚨 Errores Comunes

```json
// SKU duplicado
{
  "error": "El SKU ya existe",
  "status": 409
}

// Producto no encontrado
{
  "error": "Producto no encontrado",
  "status": 404
}

// Categoría con productos asociados
{
  "error": "No se puede eliminar. Existen productos asociados a esta categoría",
  "status": 409
}

// Imagen muy grande
{
  "error": "La imagen supera el tamaño máximo permitido (5MB)",
  "status": 400
}
```

---

## 🧪 **Ejemplos de Uso con cURL**

### Crear producto
```bash
curl -X POST "http://localhost:8080/REST-Ecommerce-Hardware/api/productos" \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "RTX 4090",
    "descripcion": "Tarjeta gráfica de última generación",
    "precio": 8000,
    "stock": 10,
    "sku": "GPU-001",
    "idMarca": 1,
    "idCategoria": 2
  }'
```

### Subir imagen
```bash
curl -X POST "http://localhost:8080/REST-Ecommerce-Hardware/api/productoimg" \
  -F "imagen=@/ruta/a/imagen.jpg" \
  -F "idProducto=1"
```

### Actualizar stock
```bash
curl -X PATCH "http://localhost:8080/REST-Ecommerce-Hardware/api/productos/1/stock" \
  -H "Content-Type: application/json" \
  -d '{"stock": 25}'
```

---

## 🎯 **Flujo Completo: Crear Producto con Imagen**

```typescript
// 1. Crear el producto
const productData: CreateProductDto = {
  nombre: 'RTX 4090',
  descripcion: 'GPU de alta gama',
  precio: 8000,
  stock: 10,
  sku: 'GPU-RTX-4090',
  idMarca: 1,
  idCategoria: 2
};

this.adminProductService.createProduct(productData).subscribe({
  next: (product) => {
    console.log('Producto creado:', product);
    
    // 2. Subir imagen para el producto creado
    const imageFile: File = this.selectedFile;
    
    this.adminProductService.uploadProductImage(product.id, imageFile).subscribe({
      next: (response) => {
        console.log('Imagen subida:', response);
        // 3. Producto completamente registrado
      },
      error: (err) => console.error('Error subiendo imagen:', err)
    });
  },
  error: (err) => console.error('Error creando producto:', err)
});
```

---

## 📊 **Modelo de Datos**

### ProductModel
```typescript
interface ProductModel {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  sku: string;
  imagenPortada: string;          // Ruta de la imagen principal
  idMarca: number;
  nombreMarca: string;
  idCategoria: number;
  nombreCategoria: string;
}
```

### CategoryModel
```typescript
interface CategoryModel {
  id: number;
  nombre: string;
  descripcion: string;
}
```

### BrandModel
```typescript
interface BrandModel {
  id: number;
  nombre: string;
}
```

---

## 🔄 **Estado de Implementación**

### ✅ Completado
- [x] AdminProductService - CRUD completo
- [x] AdminProductService - Gestión de imágenes
- [x] AdminCategoryService - CRUD completo
- [x] AdminBrandService - CRUD completo
- [x] Modelos TypeScript (DTOs)
- [x] Validaciones de archivos
- [x] Documentación de API

### ⏳ Pendiente
- [ ] Componentes de UI para Admin
- [ ] Formularios reactivos
- [ ] Guards de autenticación
- [ ] Interceptores de errores específicos
- [ ] Testing unitario de servicios
