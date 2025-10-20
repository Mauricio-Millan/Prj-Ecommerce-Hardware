# 🎓 Guía de Ejercicios Prácticos - Angular 20

## 📚 Índice
1. [Signals - Ejercicios](#signals---ejercicios)
2. [Control Flow - Ejercicios](#control-flow---ejercicios)
3. [Components - Ejercicios](#components---ejercicios)
4. [TailwindCSS - Ejercicios](#tailwindcss---ejercicios)
5. [Proyectos Completos](#proyectos-completos)

---

## 🎯 Signals - Ejercicios

### Ejercicio 1: Contador Simple
**Objetivo:** Crear un contador con incremento, decremento y reset.

```typescript
import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-counter',
  template: `
    <div class="p-4">
      <h2>Contador: {{ count() }}</h2>
      <button (click)="increment()">+</button>
      <button (click)="decrement()">-</button>
      <button (click)="reset()">Reset</button>
    </div>
  `
})
export class CounterComponent {
  count = signal(0);

  increment() {
    this.count.update(n => n + 1);
  }

  decrement() {
    this.count.update(n => n - 1);
  }

  reset() {
    this.count.set(0);
  }
}
```

**Desafío adicional:**
- Agregar un límite máximo y mínimo
- Mostrar si el número es par o impar
- Agregar un input para incrementar por valor custom

---

### Ejercicio 2: Carrito de Compras
**Objetivo:** Usar `computed()` para calcular totales automáticamente.

```typescript
import { Component, signal, computed } from '@angular/core';

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

@Component({
  selector: 'app-cart',
  template: `
    <div class="p-4">
      <h2>Carrito de Compras</h2>
      
      @for (item of items(); track item.id) {
        <div class="flex justify-between items-center p-2 border-b">
          <span>{{ item.name }}</span>
          <div class="flex gap-2 items-center">
            <button (click)="decreaseQuantity(item.id)">-</button>
            <span>{{ item.quantity }}</span>
            <button (click)="increaseQuantity(item.id)">+</button>
            <span>\${{ item.price * item.quantity }}</span>
          </div>
        </div>
      }
      
      <div class="mt-4 font-bold">
        <p>Total Items: {{ totalItems() }}</p>
        <p>Total Price: \${{ totalPrice() }}</p>
      </div>
    </div>
  `
})
export class CartComponent {
  items = signal<CartItem[]>([
    { id: 1, name: 'CPU Intel i7', price: 300, quantity: 1 },
    { id: 2, name: 'RAM 16GB', price: 80, quantity: 2 },
    { id: 3, name: 'SSD 1TB', price: 100, quantity: 1 }
  ]);

  // Computed signals - se actualizan automáticamente
  totalItems = computed(() => {
    return this.items().reduce((sum, item) => sum + item.quantity, 0);
  });

  totalPrice = computed(() => {
    return this.items().reduce((sum, item) => sum + (item.price * item.quantity), 0);
  });

  increaseQuantity(id: number) {
    this.items.update(items =>
      items.map(item =>
        item.id === id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  }

  decreaseQuantity(id: number) {
    this.items.update(items =>
      items.map(item =>
        item.id === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  }
}
```

**Desafío adicional:**
- Agregar funcionalidad para eliminar items
- Agregar descuentos por cantidad
- Implementar códigos promocionales
- Guardar carrito en localStorage

---

### Ejercicio 3: Todo List con Filtros
**Objetivo:** Combinar signals y computed para filtrado reactivo.

```typescript
import { Component, signal, computed } from '@angular/core';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

type Filter = 'all' | 'active' | 'completed';

@Component({
  selector: 'app-todo',
  template: `
    <div class="max-w-2xl mx-auto p-4">
      <h1 class="text-2xl font-bold mb-4">Todo List</h1>
      
      <!-- Input -->
      <div class="flex gap-2 mb-4">
        <input
          #todoInput
          type="text"
          (keyup.enter)="addTodo(todoInput.value); todoInput.value=''"
          placeholder="Nueva tarea..."
          class="flex-1 px-3 py-2 border rounded">
        <button
          (click)="addTodo(todoInput.value); todoInput.value=''"
          class="px-4 py-2 bg-blue-500 text-white rounded">
          Agregar
        </button>
      </div>
      
      <!-- Filtros -->
      <div class="flex gap-2 mb-4">
        <button
          (click)="currentFilter.set('all')"
          [class.bg-blue-500]="currentFilter() === 'all'"
          [class.text-white]="currentFilter() === 'all'"
          class="px-3 py-1 border rounded">
          Todas ({{ todos().length }})
        </button>
        <button
          (click)="currentFilter.set('active')"
          [class.bg-blue-500]="currentFilter() === 'active'"
          [class.text-white]="currentFilter() === 'active'"
          class="px-3 py-1 border rounded">
          Activas ({{ activeTodos().length }})
        </button>
        <button
          (click)="currentFilter.set('completed')"
          [class.bg-blue-500]="currentFilter() === 'completed'"
          [class.text-white]="currentFilter() === 'completed'"
          class="px-3 py-1 border rounded">
          Completadas ({{ completedTodos().length }})
        </button>
      </div>
      
      <!-- Lista -->
      @for (todo of filteredTodos(); track todo.id) {
        <div class="flex items-center gap-2 p-2 border-b">
          <input
            type="checkbox"
            [checked]="todo.completed"
            (change)="toggleTodo(todo.id)">
          <span [class.line-through]="todo.completed">
            {{ todo.text }}
          </span>
          <button
            (click)="deleteTodo(todo.id)"
            class="ml-auto text-red-500">
            Eliminar
          </button>
        </div>
      } @empty {
        <p class="text-gray-500 text-center py-8">No hay tareas</p>
      }
    </div>
  `
})
export class TodoComponent {
  todos = signal<Todo[]>([]);
  currentFilter = signal<Filter>('all');
  nextId = signal(1);

  // Computed signals para filtros
  activeTodos = computed(() => 
    this.todos().filter(t => !t.completed)
  );

  completedTodos = computed(() => 
    this.todos().filter(t => t.completed)
  );

  filteredTodos = computed(() => {
    const filter = this.currentFilter();
    const todos = this.todos();

    switch (filter) {
      case 'active':
        return todos.filter(t => !t.completed);
      case 'completed':
        return todos.filter(t => t.completed);
      default:
        return todos;
    }
  });

  addTodo(text: string) {
    if (text.trim()) {
      this.todos.update(todos => [
        ...todos,
        { id: this.nextId(), text: text.trim(), completed: false }
      ]);
      this.nextId.update(id => id + 1);
    }
  }

  toggleTodo(id: number) {
    this.todos.update(todos =>
      todos.map(todo =>
        todo.id === id
          ? { ...todo, completed: !todo.completed }
          : todo
      )
    );
  }

  deleteTodo(id: number) {
    this.todos.update(todos => todos.filter(t => t.id !== id));
  }
}
```

---

## 🔄 Control Flow - Ejercicios

### Ejercicio 4: Sistema de Calificaciones
**Objetivo:** Usar `@if`, `@else`, y `@switch`.

```typescript
@Component({
  selector: 'app-grade',
  template: `
    <div class="p-4">
      <input
        type="number"
        [(ngModel)]="score"
        min="0"
        max="100"
        class="border p-2 rounded">

      <!-- @if con @else -->
      @if (score >= 70) {
        <p class="text-green-600">✅ Aprobado</p>
      } @else {
        <p class="text-red-600">❌ Reprobado</p>
      }

      <!-- @switch para calificación letra -->
      @switch (letterGrade()) {
        @case ('A') {
          <p class="text-blue-600">🌟 Excelente</p>
        }
        @case ('B') {
          <p class="text-green-600">👍 Muy Bien</p>
        }
        @case ('C') {
          <p class="text-yellow-600">⚠️ Regular</p>
        }
        @case ('D') {
          <p class="text-orange-600">⚠️ Necesita mejorar</p>
        }
        @case ('F') {
          <p class="text-red-600">❌ Insuficiente</p>
        }
      }
    </div>
  `
})
export class GradeComponent {
  score = signal(0);

  letterGrade = computed(() => {
    const s = this.score();
    if (s >= 90) return 'A';
    if (s >= 80) return 'B';
    if (s >= 70) return 'C';
    if (s >= 60) return 'D';
    return 'F';
  });
}
```

---

### Ejercicio 5: Galería de Productos
**Objetivo:** Usar `@for` con track y variables especiales.

```typescript
interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  stock: number;
}

@Component({
  selector: 'app-product-gallery',
  template: `
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
      @for (product of products; track product.id) {
        <div class="border rounded-lg p-4"
             [class.bg-yellow-50]="$first"
             [class.bg-blue-50]="$last">
          
          <!-- Badges -->
          @if ($first) {
            <span class="bg-yellow-500 text-white px-2 py-1 rounded text-sm">
              Destacado
            </span>
          }
          @if ($last) {
            <span class="bg-blue-500 text-white px-2 py-1 rounded text-sm">
              Nuevo
            </span>
          }

          <img [src]="product.image" [alt]="product.name" class="w-full h-48 object-cover">
          
          <h3 class="font-bold mt-2">{{ product.name }}</h3>
          <p class="text-lg text-blue-600">\${{ product.price }}</p>
          
          <!-- Stock -->
          @if (product.stock > 0) {
            <p class="text-green-600">✅ En stock ({{ product.stock }})</p>
          } @else {
            <p class="text-red-600">❌ Agotado</p>
          }

          <p class="text-sm text-gray-500">
            Producto {{ $index + 1 }} de {{ $count }}
          </p>
        </div>
      } @empty {
        <div class="col-span-3 text-center text-gray-500 py-8">
          No hay productos disponibles
        </div>
      }
    </div>
  `
})
export class ProductGalleryComponent {
  products = signal<Product[]>([
    { id: 1, name: 'CPU Intel i9', price: 500, image: 'cpu.jpg', stock: 5 },
    { id: 2, name: 'RTX 4090', price: 1500, image: 'gpu.jpg', stock: 0 },
    { id: 3, name: 'RAM 32GB', price: 150, image: 'ram.jpg', stock: 10 },
  ]);
}
```

---

## 🎨 TailwindCSS - Ejercicios

### Ejercicio 6: Card con Efectos
**Objetivo:** Dominar hover states y transitions.

```html
<div class="max-w-sm rounded-xl overflow-hidden shadow-lg hover:shadow-2xl 
            transition-all duration-300 transform hover:-translate-y-2 
            bg-white border border-gray-200 hover:border-blue-500">
  
  <!-- Image -->
  <div class="relative overflow-hidden">
    <img 
      src="product.jpg" 
      alt="Product"
      class="w-full h-64 object-cover transform hover:scale-110 transition-transform duration-500">
    
    <!-- Badge -->
    <div class="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
      -20%
    </div>
  </div>

  <!-- Content -->
  <div class="p-6">
    <h3 class="text-xl font-bold text-gray-900 mb-2 hover:text-blue-600 transition-colors">
      Producto Destacado
    </h3>
    
    <p class="text-gray-600 mb-4">
      Descripción del producto con todas sus características principales.
    </p>

    <!-- Price -->
    <div class="flex items-center justify-between mb-4">
      <div>
        <span class="text-gray-400 line-through text-sm">\$199</span>
        <span class="text-2xl font-bold text-blue-600 ml-2">\$159</span>
      </div>
      <span class="text-green-600 text-sm font-semibold">Ahorra \$40</span>
    </div>

    <!-- Button -->
    <button class="w-full bg-gradient-to-r from-blue-500 to-indigo-600 
                   text-white font-bold py-3 px-4 rounded-lg
                   hover:from-blue-600 hover:to-indigo-700
                   transform hover:scale-105 active:scale-95
                   transition-all duration-200 shadow-md hover:shadow-xl">
      Agregar al Carrito
    </button>
  </div>
</div>
```

---

### Ejercicio 7: Navbar Responsive
**Objetivo:** Mobile-first design con breakpoints.

```html
<nav class="bg-white shadow-lg sticky top-0 z-50">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex justify-between items-center h-16">
      
      <!-- Logo -->
      <div class="flex-shrink-0">
        <span class="text-2xl font-bold text-blue-600">Logo</span>
      </div>

      <!-- Desktop Menu -->
      <div class="hidden md:flex space-x-8">
        <a href="#" class="text-gray-700 hover:text-blue-600 transition-colors">
          Inicio
        </a>
        <a href="#" class="text-gray-700 hover:text-blue-600 transition-colors">
          Productos
        </a>
        <a href="#" class="text-gray-700 hover:text-blue-600 transition-colors">
          Contacto
        </a>
      </div>

      <!-- Mobile Menu Button -->
      <button class="md:hidden p-2 rounded-lg hover:bg-gray-100">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                d="M4 6h16M4 12h16M4 18h16"/>
        </svg>
      </button>
    </div>
  </div>

  <!-- Mobile Menu (hidden by default) -->
  <div class="md:hidden border-t border-gray-200">
    <div class="px-2 pt-2 pb-3 space-y-1">
      <a href="#" class="block px-3 py-2 rounded-md text-base font-medium 
                         text-gray-700 hover:text-blue-600 hover:bg-gray-50">
        Inicio
      </a>
      <a href="#" class="block px-3 py-2 rounded-md text-base font-medium 
                         text-gray-700 hover:text-blue-600 hover:bg-gray-50">
        Productos
      </a>
      <a href="#" class="block px-3 py-2 rounded-md text-base font-medium 
                         text-gray-700 hover:text-blue-600 hover:bg-gray-50">
        Contacto
      </a>
    </div>
  </div>
</nav>
```

---

### Ejercicio 8: Grid Responsive
**Objetivo:** Layouts adaptativos con Tailwind Grid.

```html
<!-- 1 col mobile, 2 tablet, 3 desktop, 4 large screens -->
<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
  @for (item of items; track item.id) {
    <div class="bg-white rounded-lg shadow p-4">
      <h3>{{ item.name }}</h3>
    </div>
  }
</div>

<!-- Sidebar + Content Layout -->
<div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
  <!-- Sidebar: Full width en móvil, 1/4 en desktop -->
  <aside class="lg:col-span-1 bg-gray-100 rounded-lg p-4">
    <h2>Filtros</h2>
  </aside>

  <!-- Content: Full width en móvil, 3/4 en desktop -->
  <main class="lg:col-span-3">
    <h1>Contenido Principal</h1>
  </main>
</div>

<!-- Masonry-like Grid -->
<div class="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-4 p-4">
  @for (item of items; track item.id) {
    <div class="break-inside-avoid mb-4 bg-white rounded-lg shadow p-4">
      <img [src]="item.image" class="w-full rounded">
      <h3>{{ item.title }}</h3>
    </div>
  }
</div>
```

---

## 🚀 Proyectos Completos

### Proyecto 1: Sistema de Login con Validación

```typescript
import { Component, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
      <div class="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        
        <!-- Header -->
        <div class="text-center mb-8">
          <h1 class="text-3xl font-bold text-gray-900">Bienvenido</h1>
          <p class="text-gray-600 mt-2">Inicia sesión en tu cuenta</p>
        </div>

        <!-- Form -->
        <form (ngSubmit)="handleSubmit()" class="space-y-6">
          
          <!-- Email -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              [(ngModel)]="email"
              name="email"
              class="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 
                     focus:border-transparent transition-all"
              [class.border-red-500]="emailError()"
              placeholder="tu@email.com">
            @if (emailError()) {
              <p class="text-red-500 text-sm mt-1">{{ emailError() }}</p>
            }
          </div>

          <!-- Password -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Contraseña
            </label>
            <input
              [type]="showPassword() ? 'text' : 'password'"
              [(ngModel)]="password"
              name="password"
              class="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 
                     focus:border-transparent transition-all"
              [class.border-red-500]="passwordError()"
              placeholder="••••••••">
            @if (passwordError()) {
              <p class="text-red-500 text-sm mt-1">{{ passwordError() }}</p>
            }
          </div>

          <!-- Show Password Toggle -->
          <div class="flex items-center">
            <input
              type="checkbox"
              [checked]="showPassword()"
              (change)="showPassword.set(!showPassword())"
              id="show-password"
              class="mr-2">
            <label for="show-password" class="text-sm text-gray-600">
              Mostrar contraseña
            </label>
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            [disabled]="!isFormValid()"
            class="w-full bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg
                   hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed
                   transform hover:scale-105 active:scale-95 transition-all duration-200">
            @if (isLoading()) {
              <span>Cargando...</span>
            } @else {
              <span>Iniciar Sesión</span>
            }
          </button>
        </form>

        <!-- Success Message -->
        @if (successMessage()) {
          <div class="mt-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
            {{ successMessage() }}
          </div>
        }
      </div>
    </div>
  `
})
export class LoginComponent {
  email = signal('');
  password = signal('');
  showPassword = signal(false);
  isLoading = signal(false);
  successMessage = signal('');

  // Validaciones con computed
  emailError = computed(() => {
    const value = this.email();
    if (!value) return '';
    if (!value.includes('@')) return 'Email inválido';
    return '';
  });

  passwordError = computed(() => {
    const value = this.password();
    if (!value) return '';
    if (value.length < 6) return 'Mínimo 6 caracteres';
    return '';
  });

  isFormValid = computed(() => {
    return this.email() && 
           this.password() && 
           !this.emailError() && 
           !this.passwordError();
  });

  handleSubmit() {
    if (!this.isFormValid()) return;

    this.isLoading.set(true);

    // Simular API call
    setTimeout(() => {
      this.isLoading.set(false);
      this.successMessage.set('¡Inicio de sesión exitoso!');
      console.log('Login:', this.email(), this.password());
    }, 2000);
  }
}
```

---

### Proyecto 2: Buscador con Filtros en Tiempo Real

```typescript
import { Component, signal, computed } from '@angular/core';

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
}

@Component({
  selector: 'app-product-search',
  template: `
    <div class="max-w-6xl mx-auto p-4">
      
      <!-- Search Bar -->
      <div class="mb-6">
        <input
          type="text"
          [value]="searchTerm()"
          (input)="searchTerm.set($any($event.target).value)"
          placeholder="Buscar productos..."
          class="w-full px-4 py-3 border border-gray-300 rounded-lg 
                 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
      </div>

      <!-- Filters -->
      <div class="flex gap-4 mb-6 flex-wrap">
        <!-- Category Filter -->
        <select
          [value]="selectedCategory()"
          (change)="selectedCategory.set($any($event.target).value)"
          class="px-4 py-2 border rounded-lg">
          <option value="">Todas las categorías</option>
          @for (cat of categories(); track cat) {
            <option [value]="cat">{{ cat }}</option>
          }
        </select>

        <!-- Price Range -->
        <div class="flex items-center gap-2">
          <label>Precio máx:</label>
          <input
            type="range"
            min="0"
            max="2000"
            step="50"
            [value]="maxPrice()"
            (input)="maxPrice.set(+$any($event.target).value)"
            class="w-48">
          <span class="font-semibold">\${{ maxPrice() }}</span>
        </div>

        <!-- Stock Filter -->
        <label class="flex items-center gap-2">
          <input
            type="checkbox"
            [checked]="inStockOnly()"
            (change)="inStockOnly.set(!inStockOnly())">
          <span>Solo en stock</span>
        </label>
      </div>

      <!-- Results Count -->
      <div class="mb-4 text-gray-600">
        Mostrando {{ filteredProducts().length }} de {{ products.length }} productos
      </div>

      <!-- Products Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        @for (product of filteredProducts(); track product.id) {
          <div class="border rounded-lg p-4 hover:shadow-lg transition-shadow">
            <h3 class="font-bold text-lg">{{ product.name }}</h3>
            <p class="text-sm text-gray-600">{{ product.category }}</p>
            <p class="text-2xl text-blue-600 font-bold mt-2">\${{ product.price }}</p>
            
            @if (product.stock > 0) {
              <p class="text-green-600 text-sm">✅ Stock: {{ product.stock }}</p>
            } @else {
              <p class="text-red-600 text-sm">❌ Agotado</p>
            }
          </div>
        } @empty {
          <div class="col-span-3 text-center text-gray-500 py-12">
            No se encontraron productos
          </div>
        }
      </div>
    </div>
  `
})
export class ProductSearchComponent {
  // Estado
  searchTerm = signal('');
  selectedCategory = signal('');
  maxPrice = signal(2000);
  inStockOnly = signal(false);

  // Datos
  products: Product[] = [
    { id: 1, name: 'CPU Intel i9', category: 'Procesadores', price: 500, stock: 5 },
    { id: 2, name: 'RTX 4090', category: 'Tarjetas Gráficas', price: 1500, stock: 0 },
    { id: 3, name: 'RAM 32GB DDR5', category: 'Memorias', price: 200, stock: 10 },
    { id: 4, name: 'SSD 2TB NVMe', category: 'Almacenamiento', price: 250, stock: 8 },
    { id: 5, name: 'Motherboard Z790', category: 'Placas', price: 300, stock: 3 },
    // ... más productos
  ];

  // Categorías únicas
  categories = computed(() => {
    return [...new Set(this.products.map(p => p.category))];
  });

  // Filtrado reactivo
  filteredProducts = computed(() => {
    let result = this.products;

    // Filtro por búsqueda
    const search = this.searchTerm().toLowerCase();
    if (search) {
      result = result.filter(p => 
        p.name.toLowerCase().includes(search) ||
        p.category.toLowerCase().includes(search)
      );
    }

    // Filtro por categoría
    const category = this.selectedCategory();
    if (category) {
      result = result.filter(p => p.category === category);
    }

    // Filtro por precio
    const price = this.maxPrice();
    result = result.filter(p => p.price <= price);

    // Filtro por stock
    if (this.inStockOnly()) {
      result = result.filter(p => p.stock > 0);
    }

    return result;
  });
}
```

---

## 📝 Notas de Estudio

### Tips para Dominar Signals

1. **Siempre lee con paréntesis:** `count()` no `count`
2. **Usa `update()` para cambios basados en valor anterior**
3. **Usa `set()` para valores completamente nuevos**
4. **`computed()` es read-only, no puedes hacer `.set()` o `.update()`**
5. **Los signals se actualizan sincrónicamente**

### Tips para Control Flow

1. **Siempre usa `track` en @for**
2. **Prefiere `track item.id` sobre `track $index`**
3. **Usa `@empty` para mostrar estado vacío**
4. **Las variables especiales empiezan con `$`:** `$index`, `$first`, etc.

### Tips para TailwindCSS

1. **Mobile-first:** Escribe estilos para móvil primero, luego agrega breakpoints
2. **Usa `group` para hover effects padre-hijo**
3. **Prefiere `transition-all` para efectos suaves**
4. **Usa `arbitrary values` cuando no exista la clase: `w-[137px]`**
5. **Combina múltiples utilities en lugar de CSS custom**

---

**¡Sigue practicando y experimentando! 🚀**
