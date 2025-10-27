# 🏗️ Arquitectura del Catálogo de Productos

## 📐 Estructura de Componentes

```
┌─────────────────────────────────────────────────┐
│           CATALOG COMPONENT                      │
│  (Contenedor con Filtros y Lógica)             │
│                                                  │
│  ┌──────────────┐  ┌──────────────────────────┐│
│  │   SIDEBAR    │  │    MAIN CONTENT          ││
│  │              │  │                           ││
│  │ - Búsqueda   │  │  ┌────────────────────┐  ││
│  │ - Categorías │  │  │  PRODUCT-LIST      │  ││
│  │ - Marcas     │  │  │                    │  ││
│  │ - Ordenar    │  │  │  ┌──────┐ ┌──────┐ │  ││
│  │              │  │  │  │ CARD │ │ CARD │ │  ││
│  └──────────────┘  │  │  └──────┘ └──────┘ │  ││
│                    │  │  ┌──────┐ ┌──────┐ │  ││
│                    │  │  │ CARD │ │ CARD │ │  ││
│                    │  │  └──────┘ └──────┘ │  ││
│                    │  └────────────────────┘  ││
│                    └──────────────────────────┘│
└─────────────────────────────────────────────────┘
```

---

## 🧩 Componentes

### 1. **`product-card.component`**
**Responsabilidad:** Renderizar tarjeta individual de un producto

**Props (Inputs):**
- `@Input() product: ProductModel` - Datos del producto

**Events (Outputs):**
- `@Output() addToCart: EventEmitter<ProductModel>` - Evento al agregar al carrito

**Características:**
- Imagen con hover zoom
- Badge de stock
- Categoría y marca
- Precio formateado
- Botón "Agregar al Carrito"
- Botón "Ver detalles" con routerLink

**Ubicación:** `features/products/components/product-card.component/`

---

### 2. **`product-list.component`**
**Responsabilidad:** Renderizar colección de tarjetas de productos

**Props (Inputs):**
- `@Input() products: ProductModel[]` - Array de productos a mostrar
- `@Input() loading: boolean` - Estado de carga

**Características:**
- Grid responsive (1-4 columnas)
- Loading spinner
- Estado vacío
- Itera sobre productos y renderiza `product-card`

**Ubicación:** `features/products/components/product-list.component/`

---

### 3. **`catalog.component`** 
**Responsabilidad:** Contenedor principal con filtros, búsqueda y ordenamiento

**Servicios Inyectados:**
- `ProductService` - Obtener productos
- `CategoryService` - Obtener categorías
- `BrandService` - Obtener marcas

**Signals (Estado Reactivo):**
```typescript
// Datos
allProducts = signal<ProductModel[]>([]);
categories = signal<CategoryModel[]>([]);
brands = signal<BrandModel[]>([]);

// Estados
loading = signal<boolean>(true);
error = signal<string | null>(null);

// Filtros
selectedCategoryId = signal<number | null>(null);
selectedBrandId = signal<number | null>(null);
searchTerm = signal<string>('');
sortOption = signal<SortOption>('nombre-asc');

// Computed Signal (Productos Filtrados)
filteredProducts = computed(() => {
  // Lógica de filtrado y ordenamiento
});
```

**Características:**
- **Búsqueda:** Por nombre, descripción, categoría o marca
- **Filtro por Categoría:** Selección de categoría
- **Filtro por Marca:** Selección de marca
- **Ordenamiento:** 6 opciones
  - Nombre (A-Z / Z-A)
  - Precio (Menor a Mayor / Mayor a Menor)
  - Stock (Menor a Mayor / Mayor a Menor)
- **Badges de Filtros Activos:** Con botón para remover
- **Botón "Limpiar Filtros"**
- **Contador de Resultados**

**Ubicación:** `features/catalog/components/catalog.component/`

---

## 🔄 Flujo de Datos

```
┌──────────────────────────────────────────────────────────┐
│                    BACKEND (Spring Boot)                  │
│  http://localhost:8080/REST-Ecommerce-Hardware/api/      │
│                                                           │
│  GET /productos/portada  → ProductModel[]                │
│  GET /categorias         → CategoryModel[]               │
│  GET /marcas             → BrandModel[]                  │
└─────────────────┬────────────────────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────────────────────┐
│                      SERVICES                             │
│                                                           │
│  ProductService   → getAllProducts()                     │
│  CategoryService  → getAllCategories()                   │
│  BrandService     → getAllBrands()                       │
└─────────────────┬────────────────────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────────────────────┐
│               CATALOG COMPONENT                           │
│                                                           │
│  1. Carga datos (ngOnInit):                             │
│     - allProducts.set(productos)                         │
│     - categories.set(categorias)                         │
│     - brands.set(marcas)                                 │
│                                                           │
│  2. Usuario aplica filtros:                              │
│     - selectedCategoryId.set(id)                         │
│     - selectedBrandId.set(id)                            │
│     - searchTerm.set(texto)                              │
│     - sortOption.set(orden)                              │
│                                                           │
│  3. Computed Signal reacciona:                           │
│     filteredProducts = computed(() => {                  │
│       let products = allProducts()                       │
│       // Filtrar por categoría                           │
│       // Filtrar por marca                               │
│       // Filtrar por búsqueda                            │
│       // Ordenar                                         │
│       return products                                    │
│     })                                                   │
└─────────────────┬────────────────────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────────────────────┐
│              PRODUCT-LIST COMPONENT                       │
│                                                           │
│  Recibe: [products]="filteredProducts()"                │
│                                                           │
│  @for (product of products; track product.id) {         │
│    <app-product-card [product]="product" />             │
│  }                                                       │
└─────────────────┬────────────────────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────────────────────┐
│              PRODUCT-CARD COMPONENT                       │
│                                                           │
│  Recibe: @Input() product: ProductModel                 │
│                                                           │
│  Renderiza:                                              │
│  - Imagen del producto                                   │
│  - Información del producto                              │
│  - Botones de acción                                     │
│                                                           │
│  Emite: (addToCart)="onAddToCart($event)"              │
└──────────────────────────────────────────────────────────┘
```

---

## 📊 Modelos de Datos

### ProductModel
```typescript
{
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

### CategoryModel
```typescript
{
  id: number;
  nombre: string;
  descripcion: string;
}
```

### BrandModel
```typescript
{
  id: number;
  nombre: string;
}
```

### SortOption
```typescript
type SortOption = 
  | 'nombre-asc' 
  | 'nombre-desc' 
  | 'precio-asc' 
  | 'precio-desc' 
  | 'stock-asc' 
  | 'stock-desc';
```

---

## 🎯 Características Implementadas

### ✅ Funcionalidades del Catálogo

1. **Carga de Datos:**
   - ✅ Productos desde `/api/productos/portada`
   - ✅ Categorías desde `/api/categorias`
   - ✅ Marcas desde `/api/marcas`

2. **Búsqueda:**
   - ✅ Por nombre de producto
   - ✅ Por descripción
   - ✅ Por nombre de categoría
   - ✅ Por nombre de marca

3. **Filtros:**
   - ✅ Por categoría (solo una a la vez)
   - ✅ Por marca (solo una a la vez)
   - ✅ Badges visuales de filtros activos
   - ✅ Botón para limpiar filtros

4. **Ordenamiento:**
   - ✅ Nombre (A-Z / Z-A)
   - ✅ Precio (↑ / ↓)
   - ✅ Stock (↑ / ↓)

5. **UI/UX:**
   - ✅ Grid responsive
   - ✅ Loading states
   - ✅ Empty states
   - ✅ Error handling
   - ✅ Contador de resultados
   - ✅ Sidebar sticky

### ✅ Funcionalidades de Product Card

1. **Visualización:**
   - ✅ Imagen con hover zoom
   - ✅ Badge de stock (En Stock / Agotado)
   - ✅ Categoría y marca en badges
   - ✅ Nombre y descripción (limitados a 2 líneas)
   - ✅ Precio formateado en MXN
   - ✅ Stock disponible
   - ✅ SKU

2. **Interacciones:**
   - ✅ Botón "Agregar al Carrito"
   - ✅ Botón "Ver detalles" (con routerLink)
   - ✅ Deshabilitado si stock = 0
   - ✅ Evento `addToCart` emitido

---

## 🛠️ Servicios HTTP

### ProductService
```typescript
getAllProducts(): Observable<ProductModel[]>
getProductById(id): Observable<ProductModel>
getProductsByCategory(idCategoria): Observable<ProductModel[]>
getProductsByBrand(idMarca): Observable<ProductModel[]>
searchProducts(busqueda): Observable<ProductModel[]>
getImageUrl(imagenPortada): string
```

### CategoryService
```typescript
getAllCategories(): Observable<CategoryModel[]>
getCategoryById(id): Observable<CategoryModel>
```

### BrandService
```typescript
getAllBrands(): Observable<BrandModel[]>
getBrandById(id): Observable<BrandModel>
```

---

## 🎨 Estilos y Responsive

### Grid Breakpoints
```css
grid-cols-1          /* Mobile: < 640px   */
sm:grid-cols-2       /* Tablet: 640px+    */
md:grid-cols-3       /* Desktop: 768px+   */
lg:grid-cols-4       /* Large: 1024px+    */
```

### Sidebar
```css
lg:w-64              /* Width en desktop  */
sticky top-20        /* Sticky position   */
```

---

## 🔗 Rutas Configuradas

```typescript
{
  path: '',
  component: HomeComponent
},
{
  path: 'catalogo',
  component: CatalogComponent
}
```

---

## 🧪 Cómo Probar

### 1. Iniciar Backend:
```bash
# Spring Boot debe estar corriendo
http://localhost:8080/REST-Ecommerce-Hardware
```

### 2. Iniciar Frontend:
```bash
ng serve
```

### 3. Navegar a:
```
http://localhost:4200/catalogo
```

### 4. Verificar Consola del Navegador:
```
✅ Productos cargados: 12
✅ Categorías cargadas: 5
✅ Marcas cargadas: 8
```

### 5. Probar Funcionalidades:
- [ ] Seleccionar una categoría
- [ ] Seleccionar una marca
- [ ] Buscar un producto
- [ ] Cambiar ordenamiento
- [ ] Limpiar filtros
- [ ] Agregar al carrito (ver log en consola)

---

## 📝 Próximos Pasos

### 1. **Detalle de Producto:**
```typescript
// Crear componente product-detail
{
  path: 'productos/:id',
  component: ProductDetailComponent
}
```

### 2. **Carrito de Compras:**
```typescript
// Crear CartService
class CartService {
  cartItems = signal<CartItem[]>([]);
  
  addItem(product: ProductModel, quantity: number)
  removeItem(productId: number)
  updateQuantity(productId: number, quantity: number)
  clearCart()
  getTotal(): number
}
```

### 3. **Filtros Avanzados:**
- Rango de precios (slider)
- Múltiples categorías (checkboxes)
- Múltiples marcas (checkboxes)
- Solo productos en stock

### 4. **Paginación:**
```typescript
currentPage = signal(1);
itemsPerPage = signal(12);

paginatedProducts = computed(() => {
  const products = filteredProducts();
  const start = (currentPage() - 1) * itemsPerPage();
  return products.slice(start, start + itemsPerPage());
});
```

---

**Autor:** GitHub Copilot  
**Fecha:** Octubre 2025  
**Proyecto:** Frontend E-commerce Hardware  
**Versión:** 1.0
