# 📸 Changelog: Sistema de Múltiples Imágenes para Productos

## Fecha: 26 de Octubre 2025

### ✅ Funcionalidades Implementadas

#### 1. **Pre-selección de Categoría y Marca en Edición**
- Al editar un producto, los `<select>` ahora muestran la categoría y marca actuales
- Se extrae el ID correctamente del objeto anidado: `idCategoria.id` y `idMarca.id`

#### 2. **Carga de Imágenes Existentes**
- Se integra el endpoint `GET /api/producto-imagenes/producto/{id}`
- Las imágenes se ordenan automáticamente por el campo `orden`
- Se muestran en una grilla visual con thumbnails

#### 3. **Subida de Múltiples Imágenes**
- Input `<input type="file" multiple>` para seleccionar varias imágenes a la vez
- Validación individual por imagen (formato, tamaño)
- Preview instantáneo con FileReader API
- Subida asíncrona con feedback de progreso

#### 4. **Reordenamiento con Drag & Drop**
- Interfaz visual para arrastrar y soltar imágenes
- Actualización automática del orden en el backend vía `PUT /api/producto-imagenes/{id}`
- Badges numéricos (#1, #2, #3...) para indicar el orden

#### 5. **Eliminación de Imágenes**
- Botón de eliminar con confirmación
- Para imágenes existentes: `DELETE /api/producto-imagenes/{id}`
- Para imágenes nuevas (no subidas): eliminación local del array

---

## 📦 Archivos Modificados

### 1. **admin.model.ts**
```typescript
// Nuevos modelos agregados:
export interface ProductImage {
  id: number;
  urlImagen: string;
  orden: number;
  idProducto: { id: number };
}

export interface UpdateProductImageDto {
  orden: number;
  urlImagen?: string;
}

// Modelos corregidos:
export interface CreateProductDto {
  idMarca: { id: number };       // ✅ Objeto anidado
  idCategoria: { id: number };   // ✅ Objeto anidado
}
```

### 2. **admin-product.service.ts**
```typescript
// Nuevos métodos:
getProductImagesOrdered(productId: number): Observable<ProductImage[]>
updateImageOrder(imageId: number, orden: number): Observable<ProductImage>
deleteProductImageOrdered(imageId: number): Observable<DeleteResponse>
```

### 3. **products-edit.component.ts**
```typescript
// Nueva interfaz local:
interface ImageItem {
  id?: number;          // ID si ya existe en BD
  file?: File;          // Archivo si es nueva
  preview: string;      // URL de preview
  orden: number;        // Orden de visualización
  uploading?: boolean;  // Estado de carga
}

// Nuevos signals:
images = signal<ImageItem[]>([]);
draggedIndex = signal<number | null>(null);

// Métodos refactorizados:
- loadFormData() → Ahora carga imágenes y pre-selecciona FK
- onFileSelected() → Soporta múltiples archivos
- onSubmit() → Subida masiva de imágenes

// Nuevos métodos:
- removeImage(index: number)
- onDragStart(index: number)
- onDragOver(event: DragEvent)
- onDrop(event: DragEvent, dropIndex: number)
- reorderImages(items: ImageItem[])
- uploadNewImages(productId: number)
- finishUpload(uploaded: number, failed: number)
```

### 4. **products-edit.component.html**
- Grid de imágenes responsive (2 cols móvil, 4 cols desktop)
- Badges de orden visual (#1, #2, #3...)
- Botones de eliminar con hover
- Drag & Drop nativo HTML5
- Spinner de carga por imagen
- Input file con atributo `multiple`

---

## 🔧 Integración con Backend

### Endpoints Utilizados

#### ✅ Producto
- `POST /api/productos` - Crear producto
- `PUT /api/productos/{id}` - Actualizar producto
- `GET /api/productos/{id}` - Obtener producto

#### ✅ Imágenes
- `GET /api/producto-imagenes/producto/{id}` - Obtener imágenes ordenadas
- `POST /api/productoimg` - Subir imagen nueva
- `PUT /api/producto-imagenes/{id}` - Actualizar orden
- `DELETE /api/producto-imagenes/{id}` - Eliminar imagen

### Payload Corregido (POST/PUT Producto)
```json
{
  "nombre": "RTX 4090",
  "descripcion": "Tarjeta gráfica...",
  "precio": 25000,
  "stock": 10,
  "sku": "GPU-RTX-4090",
  "idMarca": { "id": 1 },         // ✅ Objeto anidado
  "idCategoria": { "id": 2 }      // ✅ Objeto anidado
}
```

---

## 🎨 Experiencia de Usuario

### Crear Producto
1. Llenar formulario
2. Seleccionar múltiples imágenes
3. Ver preview instantáneo
4. Ajustar orden (drag & drop)
5. Guardar → se suben todas las imágenes

### Editar Producto
1. Formulario pre-cargado con datos actuales
2. Categoría y marca pre-seleccionadas ✅
3. Imágenes existentes mostradas en orden ✅
4. Agregar más imágenes
5. Eliminar imágenes no deseadas
6. Reordenar con drag & drop
7. Guardar → solo se suben imágenes nuevas

---

## 🧪 Testing Recomendado

### Casos de Prueba

#### ✅ Crear Producto
- [ ] Subir 1 imagen
- [ ] Subir 5+ imágenes simultáneas
- [ ] Validar formato inválido (.pdf, .txt)
- [ ] Validar tamaño > 5MB
- [ ] Verificar orden inicial (#1, #2, #3...)

#### ✅ Editar Producto
- [ ] Verificar pre-selección de categoría
- [ ] Verificar pre-selección de marca
- [ ] Cargar imágenes existentes
- [ ] Eliminar imagen existente
- [ ] Agregar nuevas imágenes
- [ ] Reordenar imágenes (drag & drop)
- [ ] Verificar actualización de orden en BD

#### ✅ Validaciones
- [ ] Formulario inválido → botón deshabilitado
- [ ] Imagen > 5MB → alerta y rechazo
- [ ] Formato no permitido → alerta y rechazo
- [ ] Error de red → mensaje amigable

---

## 🚀 Próximos Pasos Sugeridos

1. **Optimización de Imágenes**
   - Compresión automática antes de subir
   - Generación de thumbnails en backend
   - Lazy loading de imágenes grandes

2. **Mejoras UX**
   - Progress bar global de subida
   - Crop de imágenes antes de subir
   - Vista previa en lightbox/modal

3. **Performance**
   - CDN para servir imágenes
   - WebP automático
   - Cache de imágenes en frontend

4. **Accesibilidad**
   - Alt text personalizado por imagen
   - Teclado para reordenar (Tab + Arrow keys)
   - Screen reader friendly

---

## 📚 Tecnologías Usadas

- **Angular 20**: Signals, Control Flow, OnPush
- **RxJS**: forkJoin, Observables
- **HTML5 Drag & Drop API**: draggable, dragstart, drop
- **FileReader API**: Preview de imágenes
- **FormData**: Subida multipart/form-data
- **TailwindCSS**: Grid responsive, hover states

---

## 🐛 Problemas Conocidos Resueltos

### ❌ Error 400 Bad Request (RESUELTO)
**Problema**: Backend esperaba `{ idMarca: { id: 1 } }` pero recibía `{ idMarca: 1 }`

**Solución**:
```typescript
const productData = {
  ...formValue,
  idMarca: { id: formValue.idMarca },
  idCategoria: { id: formValue.idCategoria }
};
```

### ❌ Categoría/Marca no pre-seleccionadas (RESUELTO)
**Problema**: Al editar, los `<select>` mostraban "Selecciona..."

**Solución**:
```typescript
this.productForm.patchValue({
  idCategoria: data.product.idCategoria?.id || data.product.idCategoria,
  idMarca: data.product.idMarca?.id || data.product.idMarca
});
```

---

## ✅ Checklist de Implementación

- [x] Modelos TypeScript actualizados
- [x] Servicios HTTP implementados
- [x] Componente refactorizado (Signals)
- [x] HTML con drag & drop
- [x] Pre-selección de categoría/marca
- [x] Carga de imágenes existentes
- [x] Subida múltiple
- [x] Reordenamiento
- [x] Eliminación
- [x] Validaciones
- [x] Feedback de carga
- [x] Manejo de errores

---

## 👨‍💻 Autor
**Proyecto**: Frontend E-commerce Hardware  
**Framework**: Angular 20 + TailwindCSS  
**Backend**: Spring Boot REST API  
**Fecha**: Octubre 2025
