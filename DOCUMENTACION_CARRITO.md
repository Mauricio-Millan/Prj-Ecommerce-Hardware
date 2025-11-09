# Sistema de Carrito de Compras

## Descripción General
Sistema completo para gestionar el carrito de compras de usuarios, incluyendo validación de usuario, creación automática de carrito, y gestión de items.

---

## Modelos (`carrito.model.ts`)

### `CarritoModel`
Representa un carrito de compras asociado a un usuario.
```typescript
{
  id: number;
  usuario: { id: number };
  creadoEn?: string; // Automático del backend
}
```

### `ItemCarritoModel`
Representa un producto dentro del carrito con su cantidad.
```typescript
{
  id: number;
  carrito: { id: number };
  producto: { 
    id: number;
    nombre?: string;
    precio?: number;
    imagenPortada?: string;
    stock?: number;
  };
  cantidad: number;
  precioUnitario: number;
}
```

### `CreateCarritoDto`
DTO para crear un nuevo carrito.
```typescript
{
  usuario: { id: number };
}
```

### `CreateItemCarritoDto`
DTO para agregar un producto al carrito.
```typescript
{
  idCarrito: { id: number };
  idProducto: { id: number };
  cantidad: number;
}
```

---

## Servicio (`carrito.service.ts`)

### Endpoints Utilizados

#### 1. **Obtener carrito de usuario**
```
GET /api/carritos/usuario/{usuarioId}
```
- Retorna el carrito del usuario o `null` si no existe
- Maneja error 404 como "sin carrito"

#### 2. **Crear carrito**
```
POST /api/carritos
Body: { usuario: { id: number } }
```
- Crea un nuevo carrito para el usuario
- `creadoEn` se genera automáticamente en el backend

#### 3. **Agregar item al carrito**
```
POST /api/items-carrito
Body: {
  carrito: { id: number },
  producto: { id: number },
  cantidad: number
}
```
- Agrega un producto con cantidad específica
- Calcula `precioUnitario` automáticamente

### Métodos Principales

#### `getCarritoByUsuario(usuarioId: number)`
- Obtiene o verifica existencia del carrito
- Actualiza estado local con signal
- Retorna `Observable<CarritoModel | null>`

#### `createCarrito(dto: CreateCarritoDto)`
- Crea nuevo carrito para usuario
- Guarda en estado local
- Retorna `Observable<CarritoModel>`

#### `addItemToCarrito(dto: CreateItemCarritoDto)`
- Agrega producto al carrito
- Incrementa contador de items
- Retorna `Observable<ItemCarritoModel>`

#### Signals de Estado
```typescript
carritoActual = signal<CarritoModel | null>(null);  // Carrito actual
itemsCount = signal<number>(0);                      // Total de items
```

---

## Componentes

### `ProductCardComponent`

#### Funcionalidad del Botón "Agregar al Carrito"

**Flujo de ejecución:**

1. **Validaciones iniciales**
   ```typescript
   - Verifica stock > 0
   - Verifica usuario autenticado
   - Muestra mensajes apropiados si falla
   ```

2. **Proceso asíncrono**
   ```typescript
   async onAddToCart() {
     // 1. Obtener carrito del usuario
     let carrito = await getCarritoByUsuario(usuarioId);
     
     // 2. Si no existe, crear carrito
     if (!carrito) {
       carrito = await createCarrito({ usuario: { id } });
     }
     
     // 3. Agregar producto (cantidad: 1)
     await addItemToCarrito({
       carrito: { id: carrito.id },
       producto: { id: producto.id },
       cantidad: 1
     });
   }
   ```

3. **Feedback visual**
   - Botón muestra spinner mientras procesa
   - Se deshabilita durante la operación
   - Alerta de éxito o error al terminar

#### Estado UI
```typescript
adding = signal<boolean>(false);  // Indica si está procesando
```

**HTML:**
```html
<button 
  (click)="onAddToCart()"
  [disabled]="product.stock === 0 || adding()"
>
  @if (adding()) {
    <spinner />
    <span>Agregando...</span>
  } @else {
    <span>Agregar al Carrito</span>
  }
</button>
```

---

### `ProductDetailsComponent`

#### Funcionalidad Mejorada

**Diferencias con ProductCard:**
- Permite seleccionar **cantidad** antes de agregar
- Valida que cantidad no exceda stock
- Resetea cantidad a 1 después de agregar

**Flujo de ejecución:**

1. **Validaciones adicionales**
   ```typescript
   - Stock disponible
   - Usuario autenticado
   - Cantidad <= stock disponible
   ```

2. **Proceso de agregado**
   ```typescript
   async addToCart() {
     // 1-2. Igual que ProductCard
     
     // 3. Agregar con cantidad seleccionada
     await addItemToCarrito({
       carrito: { id: carrito.id },
       producto: { id: producto.id },
       cantidad: this.quantity()  // ← Diferencia clave
     });
     
     // 4. Resetear cantidad
     this.quantity.set(1);
   }
   ```

3. **Selector de cantidad**
   ```html
   <button (click)="decreaseQuantity()">-</button>
   <span>{{ quantity() }}</span>
   <button (click)="increaseQuantity()">+</button>
   ```

#### Estado UI
```typescript
quantity = signal<number>(1);           // Cantidad seleccionada
addingToCart = signal<boolean>(false);  // Procesando
```

---

## Flujo Completo de Uso

### Escenario 1: Usuario sin carrito

```
1. Usuario hace clic en "Agregar al Carrito"
   ↓
2. Sistema verifica autenticación → ✅
   ↓
3. Sistema busca carrito del usuario → ❌ No existe
   ↓
4. Sistema crea carrito automáticamente
   POST /api/carritos
   { usuario: { id: 2 } }
   ↓
5. Sistema agrega producto al nuevo carrito
   POST /api/items-carrito
   { carrito: { id: 1 }, producto: { id: 5 }, cantidad: 1 }
   ↓
6. Mensaje: "✅ Producto agregado al carrito"
```

### Escenario 2: Usuario con carrito existente

```
1. Usuario hace clic en "Agregar al Carrito"
   ↓
2. Sistema verifica autenticación → ✅
   ↓
3. Sistema busca carrito del usuario → ✅ Existe (id: 1)
   ↓
4. Sistema agrega producto directamente
   POST /api/items-carrito
   { carrito: { id: 1 }, producto: { id: 8 }, cantidad: 2 }
   ↓
5. Mensaje: "✅ 2x Producto agregado al carrito"
```

### Escenario 3: Usuario no autenticado

```
1. Usuario hace clic en "Agregar al Carrito"
   ↓
2. Sistema verifica autenticación → ❌
   ↓
3. Mensaje: "Debes iniciar sesión para agregar productos al carrito"
```

### Escenario 4: Producto sin stock

```
1. Usuario intenta agregar producto agotado
   ↓
2. Botón deshabilitado (no se puede hacer clic)
   ó
   Mensaje: "Este producto está agotado"
```

---

## Validaciones Implementadas

### Frontend
- ✅ Usuario autenticado antes de agregar
- ✅ Stock disponible del producto
- ✅ Cantidad no excede stock (ProductDetails)
- ✅ Botones deshabilitados durante procesamiento
- ✅ Feedback visual con spinners

### Backend (esperado)
- Validación de stock al agregar item
- Cálculo automático de precioUnitario
- Generación automática de creadoEn
- Validación de duplicados (sumar cantidad si existe)

---

## Manejo de Errores

```typescript
try {
  // Lógica de carrito
} catch (error) {
  console.error('Error al agregar producto:', error);
  alert('❌ Error. Intenta de nuevo.');
} finally {
  adding.set(false);  // Siempre resetear estado
}
```

**Casos manejados:**
- Error de red
- Error 404 en carrito (se crea automáticamente)
- Error 500 del servidor
- Timeout de solicitud

---

## Estado Global (Signals)

El servicio mantiene estado reactivo:

```typescript
carritoActual()  // Carrito del usuario actual
itemsCount()     // Total de items en el carrito
```

**Uso futuro:** Navbar puede mostrar badge con `itemsCount()`

```html
<nav>
  <a routerLink="/carrito">
    🛒 Carrito
    <span class="badge">{{ carritoService.getItemsCount()() }}</span>
  </a>
</nav>
```

---

## Próximos Pasos

### Funcionalidades Pendientes
1. **Página de Carrito** (`/carrito`)
   - Listar todos los items
   - Editar cantidades
   - Eliminar items
   - Calcular total

2. **Badge de Carrito en Navbar**
   - Mostrar cantidad de items
   - Actualización reactiva

3. **Validación de Duplicados**
   - Si producto ya está en carrito, incrementar cantidad
   - No crear item duplicado

4. **Persistencia**
   - Cargar carrito al iniciar sesión
   - Sincronizar con backend

5. **Checkout**
   - Proceso de pago
   - Creación de orden desde carrito

---

## Endpoints Backend Requeridos

### Implementados ✅
```
POST   /api/carritos
GET    /api/carritos/usuario/{id}
POST   /api/items-carrito
```

### Adicionales (próximamente) 🔜
```
GET    /api/items-carrito/carrito/{id}      // Listar items
PUT    /api/items-carrito/{id}              // Actualizar cantidad
DELETE /api/items-carrito/{id}              // Eliminar item
DELETE /api/carritos/{id}                   // Vaciar carrito
GET    /api/carritos/{id}/total             // Calcular total
```

---

## Dependencias

### Services
- `CarritoService` - Gestión de carrito e items
- `LoginService` - Obtener usuario actual
- `ProductService` - Información de productos

### Models
- `CarritoModel` - Estructura de carrito
- `ItemCarritoModel` - Estructura de item
- DTOs para creación

### RxJS
- `firstValueFrom` - Convertir Observable a Promise
- `forkJoin` - Peticiones paralelas (futuro)

---

## Notas Técnicas

1. **Async/Await vs Observables**
   - Se usa `firstValueFrom` para simplificar el código en componentes
   - Mantiene compatibilidad con RxJS en servicios

2. **Signals vs Observables**
   - Estado local con Signals (más moderno)
   - HTTP con Observables (estándar Angular)

3. **Validación de Usuario**
   - Se requiere usuario completo (`currentUser()`)
   - No solo verificar `isLoggedIn`

4. **Manejo de 404**
   - No es error: usuario sin carrito
   - Se captura y retorna `null`
   - Trigger para creación automática

---

## Testing Manual

### Prueba 1: Crear carrito y agregar producto
```
1. Logout (si está logueado)
2. Login como usuario nuevo
3. Ir a catálogo
4. Clic en "Agregar al Carrito"
5. Verificar en logs:
   - "ℹ️ Usuario no tiene carrito"
   - "✅ Carrito creado"
   - "✅ Item agregado"
```

### Prueba 2: Agregar a carrito existente
```
1. Usar mismo usuario de Prueba 1
2. Agregar otro producto
3. Verificar en logs:
   - "✅ Carrito encontrado"
   - "✅ Item agregado"
   - NO debe crear nuevo carrito
```

### Prueba 3: Cantidad en ProductDetails
```
1. Ir a detalles de un producto
2. Aumentar cantidad a 3
3. Agregar al carrito
4. Verificar mensaje: "✅ 3x [Nombre] agregado"
5. Verificar cantidad resetea a 1
```

### Prueba 4: Validaciones
```
1. Intentar agregar sin login → Mensaje de error
2. Intentar agregar producto agotado → Botón deshabilitado
3. Intentar cantidad > stock → Mensaje de error
```

---

## Logs de Consola

El servicio genera logs informativos:

```
ℹ️ Usuario no tiene carrito, se debe crear uno
✅ Carrito creado: { id: 1, usuario: { id: 2 } }
✅ Item agregado al carrito: { id: 1, cantidad: 1, ... }
✅ Carrito encontrado: { id: 1, usuario: { id: 2 } }
❌ Error al agregar item al carrito: [error]
```

---

## Resumen

### ✅ Implementado
- Modelos completos (Carrito, Item, DTOs)
- Servicio con todos los endpoints básicos
- Integración en ProductCard
- Integración en ProductDetails
- Validaciones de usuario y stock
- Feedback visual (spinners, alerts)
- Manejo de errores robusto
- Estado reactivo con Signals

### 🔜 Pendiente
- Página de carrito completa
- Badge en navbar
- Edición/eliminación de items
- Cálculo de totales
- Checkout

---

**Fecha:** 2 de Noviembre, 2025  
**Estado:** ✅ Funcionalidad básica completa  
**Próximo:** Implementar página de visualización del carrito
