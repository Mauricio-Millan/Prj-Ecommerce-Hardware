# Documentación: Sistema de Selección de Productos en Carrito

## 📋 Resumen

Se actualizó el componente de carrito para soportar la nueva estructura plana de items del backend y se agregó funcionalidad de checkboxes para seleccionar qué productos comprar.

## 🔄 Cambios en la Estructura de Datos

### Antes (Estructura Anidada)
```typescript
interface ItemCarritoModel {
  id: number;
  idCarrito: number;
  idProducto: {
    id: number;
    nombre: string;
    precio: number;
    stock: number;
    imagenPortada: string;
  };
  cantidad: number;
}
```

### Después (Estructura Plana)
```typescript
interface ItemCarritoModel {
  id: number;
  idCarrito: number;
  idProducto: number;
  nombreProducto: string;
  precioProducto: number;
  stockProducto: number;
  cantidad: number;
  imagenPortada: string;
  subtotal: number;
  selected?: boolean; // ✨ NUEVO: para checkboxes
}
```

## ✅ Funcionalidades Implementadas

### 1. **Selección Individual de Productos**
- Cada item del carrito tiene un checkbox para marcarlo como seleccionado
- Solo los productos seleccionados se incluyen en el cálculo del total
- Los items no seleccionados se muestran con opacidad reducida

### 2. **Seleccionar/Deseleccionar Todos**
- Checkbox maestro en el encabezado de la lista
- Permite seleccionar o deseleccionar todos los productos de una vez
- Se actualiza automáticamente según el estado de los items

### 3. **Cálculo de Total Dinámico**
- El total solo suma los productos seleccionados
- Muestra contador de productos seleccionados vs total
- Mensaje de advertencia si no hay productos seleccionados

### 4. **Validación de Checkout**
- Botón "Proceder al Pago" deshabilitado si no hay productos seleccionados
- Indicador visual de productos seleccionados en el resumen

## 📝 Archivos Modificados

### `carrito.model.ts`
**Cambios:**
- Actualizó `ItemCarritoModel` de estructura anidada a plana
- Agregó campos: `nombreProducto`, `precioProducto`, `stockProducto`, `subtotal`
- Agregó campo opcional `selected?: boolean`

### `carrito.component.ts`
**Cambios:**

#### Imports
```typescript
import { FormsModule } from '@angular/forms'; // Para [(ngModel)]
```

#### Computed Properties
```typescript
// Total solo de items seleccionados
get total(): number {
  return this.items()
    .filter(item => item.selected)
    .reduce((sum, item) => sum + (item.subtotal || 0), 0);
}

// Contador de items seleccionados
get selectedItemsCount(): number {
  return this.items().filter(item => item.selected).length;
}

// Si todos están seleccionados
get allSelected(): boolean {
  const items = this.items();
  return items.length > 0 && items.every(item => item.selected);
}
```

#### Métodos de Selección
```typescript
// Marcar/desmarcar item individual
toggleItemSelection(item: ItemCarritoModel): void {
  item.selected = !item.selected;
  this.items.set([...this.items()]);
}

// Marcar/desmarcar todos
toggleAllSelection(): void {
  const newState = !this.allSelected;
  this.items.update(items => 
    items.map(item => ({ ...item, selected: newState }))
  );
}
```

#### loadCarrito()
```typescript
// Todos los items se cargan seleccionados por defecto
const itemsWithSelection = items.map(item => ({ 
  ...item, 
  selected: true 
}));
this.items.set(itemsWithSelection);
```

#### Métodos Actualizados
- `increaseQuantity()`: Usa `item.stockProducto` en lugar de `item.idProducto.stock`
- `removeItem()`: Usa `item.nombreProducto` en lugar de `item.idProducto.nombre`

### `carrito.component.html`
**Cambios:**

#### Checkbox "Seleccionar Todos"
```html
<div class="bg-white rounded-lg shadow-md p-4">
  <label class="flex items-center gap-3 cursor-pointer">
    <input
      type="checkbox"
      [checked]="allSelected"
      (change)="toggleAllSelection()"
      class="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
    />
    <span class="font-medium text-gray-700">Seleccionar todos los productos</span>
  </label>
</div>
```

#### Checkbox Individual por Item
```html
<div class="flex items-start pt-1">
  <input
    type="checkbox"
    [(ngModel)]="item.selected"
    (change)="toggleItemSelection(item)"
    class="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
  />
</div>
```

#### Indicador Visual
```html
<div [class.opacity-60]="!item.selected">
  <!-- Item no seleccionado tiene opacidad reducida -->
</div>
```

#### Referencias Actualizadas
- `item.idProducto.nombre` → `item.nombreProducto`
- `item.idProducto.precio` → `item.precioProducto`
- `item.idProducto.stock` → `item.stockProducto`
- `item.idProducto.imagenPortada` → `item.imagenPortada`
- Usa `item.subtotal` para el cálculo del subtotal

#### Resumen de Pedido
```html
<span>Subtotal ({{ selectedItemsCount }} de {{ items().length }} productos)</span>

@if (selectedItemsCount === 0) {
  <p class="text-sm text-orange-600 bg-orange-50 p-2 rounded">
    Selecciona al menos un producto para continuar
  </p>
}

<button
  (click)="proceedToCheckout()"
  [disabled]="selectedItemsCount === 0"
  class="...disabled:bg-gray-300 disabled:cursor-not-allowed"
>
  Proceder al Pago
</button>
```

## 🔗 Integración con Backend

### Endpoint Utilizado
```
GET http://localhost:8080/REST-Ecommerce-Hardware/api/items-carrito/carrito/{idCarrito}
```

### Respuesta del Backend (Ejemplo)
```json
[
  {
    "id": 9,
    "idCarrito": 6,
    "idProducto": 12,
    "nombreProducto": "Asus Zenbok 14 Pro OLED",
    "precioProducto": 4500,
    "stockProducto": 3,
    "cantidad": 1,
    "imagenPortada": "/uploads/1734754002733-asus-zenbook-14.jpg",
    "subtotal": 4500
  }
]
```

## 🎯 Comportamiento de Usuario

### Escenario 1: Carga Inicial
1. Usuario accede al carrito
2. Todos los productos aparecen seleccionados por defecto (✅)
3. Total muestra la suma de todos los productos
4. Botón "Proceder al Pago" habilitado

### Escenario 2: Deseleccionar Producto
1. Usuario desmarca un checkbox
2. Item se muestra con opacidad reducida
3. Total se actualiza automáticamente
4. Contador muestra "X de Y productos"

### Escenario 3: Deseleccionar Todos
1. Usuario desmarca "Seleccionar todos"
2. Todos los checkboxes se desmarcan
3. Total = S/ 0.00
4. Aparece mensaje de advertencia
5. Botón "Proceder al Pago" deshabilitado

### Escenario 4: Modificar Cantidad
1. Usuario aumenta/disminuye cantidad de un producto seleccionado
2. Backend actualiza el subtotal
3. Al recargar, el total refleja el nuevo subtotal

## 🚀 Próximos Pasos Sugeridos

1. **Persistir Selección**: Guardar en localStorage qué items están seleccionados
2. **Operaciones en Lote**: Eliminar múltiples productos seleccionados
3. **Guardar para Después**: Mover items no seleccionados a una lista de deseos
4. **Cupones de Descuento**: Aplicar solo a productos seleccionados
5. **Checkout**: Enviar al backend solo los items seleccionados

## 📊 Estado Final

✅ Estructura de datos migrada a formato plano  
✅ Sistema de checkboxes implementado  
✅ Selección individual funcional  
✅ Selección masiva funcional  
✅ Cálculo dinámico de totales  
✅ Validación de checkout  
✅ Indicadores visuales  
✅ Sin errores de compilación  

---

**Fecha de Actualización**: Diciembre 2024  
**Versión de Angular**: 20  
**Backend**: Spring Boot REST API
