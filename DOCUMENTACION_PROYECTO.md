# 📚 Documentación del Proyecto - Frontend E-commerce Hardware

## 📋 Tabla de Contenidos
1. [Introducción](#introducción)
2. [Tecnologías Utilizadas](#tecnologías-utilizadas)
3. [Arquitectura del Proyecto](#arquitectura-del-proyecto)
4. [Configuración de Assets en Angular](#configuración-de-assets-en-angular)
5. [Mejores Prácticas de Angular 20](#mejores-prácticas-de-angular-20)
6. [Componentes Desarrollados](#componentes-desarrollados)
7. [Conceptos Técnicos Aplicados](#conceptos-técnicos-aplicados)
8. [Patrones de Diseño](#patrones-de-diseño)
9. [Guía de Estudio](#guía-de-estudio)
10. [Troubleshooting](#troubleshooting)

---

## 🎯 Introducción

Este proyecto es un **E-commerce de Hardware** desarrollado con **Angular 20** (standalone components) y **TailwindCSS**. Se enfoca en aplicar las últimas mejores prácticas y características modernas de Angular.

**Fecha de desarrollo:** Octubre 2025  
**Framework:** Angular 20  
**Estilos:** TailwindCSS  
**TypeScript:** Strict mode

---

## 🚀 Tecnologías Utilizadas

### Frontend Framework
- **Angular 20**
  - Standalone Components (sin NgModules)
  - Signals API
  - Control Flow Syntax (`@if`, `@for`, `@switch`)
  - OnPush Change Detection Strategy

### Estilos
- **TailwindCSS 3.x**
  - Utility-first CSS
  - Responsive design
  - Custom animations
  - JIT compiler

### TypeScript
- **Strict mode** habilitado
- Type inference
- Interfaces para modelos de datos
- Typed signals

---

## 🏗️ Arquitectura del Proyecto

```
src/
├── app/
│   ├── core/                    # Servicios singleton, guards, interceptors
│   ├── features/                # Módulos de características
│   │   └── products/
│   │       ├── components/      # Componentes de productos
│   │       ├── models/          # Interfaces y tipos
│   │       └── services/        # Servicios de productos
│   ├── home/                    # Componentes del home
│   │   ├── Banner/             
│   │   │   └── banner.component/
│   │   ├── brand/              
│   │   │   └── brand.component/
│   │   └── home.component/
│   ├── layout/                  # Componentes de layout
│   │   ├── navbar/
│   │   └── footer/
│   └── shared/                  # Componentes compartidos
├── assets/                      # Recursos estáticos
│   ├── banners/                 # Imágenes de banners
│   └── marcas/                  # Logos de marcas
└── environment/                 # Configuraciones de entorno
```

### Principios Arquitectónicos Aplicados

1. **Separation of Concerns (SoC)**
   - Layout separado de features
   - Componentes reutilizables en `shared/`
   - Servicios en carpeta dedicada

2. **Feature-Based Structure**
   - Cada feature tiene su propia carpeta
   - Modelos, servicios y componentes agrupados

3. **Component-Based Architecture**
   - Componentes pequeños y enfocados
   - Single Responsibility Principle

---

## 📦 Configuración de Assets en Angular

### ¿Qué son los Assets?

Los **assets** son recursos estáticos (imágenes, fuentes, archivos JSON, videos, etc.) que tu aplicación necesita. Angular debe saber dónde encontrar estos archivos para incluirlos en el build.

### Configuración en angular.json

**Problema común:** Error 404 al cargar imágenes aunque existan en la carpeta.

**Causa:** Angular no está configurado para copiar los assets desde `src/assets` al build.

#### ✅ Configuración Correcta:

```json
{
  "architect": {
    "build": {
      "options": {
        "assets": [
          {
            "glob": "**/*",
            "input": "public"
          },
          {
            "glob": "**/*",
            "input": "src/assets",
            "output": "assets"
          }
        ]
      }
    }
  }
}
```

#### Explicación de las propiedades:

**`glob`:** Patrón de archivos a incluir
- `**/*` = Todos los archivos en todas las subcarpetas
- `*.jpg` = Solo archivos JPG
- `images/**/*.{jpg,png}` = JPG y PNG en carpeta images

**`input`:** Carpeta de origen (donde están los archivos)
- `"src/assets"` = Carpeta fuente
- Ruta relativa al proyecto

**`output`:** Carpeta de destino en el build
- `"assets"` = Se copiarán a `dist/assets/`
- Si se omite, usa el mismo nombre que input

#### Ejemplo de configuración múltiple:

```json
"assets": [
  // Carpeta public (favicon, robots.txt, etc.)
  {
    "glob": "**/*",
    "input": "public"
  },
  // Todas las imágenes y archivos estáticos
  {
    "glob": "**/*",
    "input": "src/assets",
    "output": "assets"
  },
  // Solo imágenes específicas
  {
    "glob": "**/*.{png,jpg,jpeg,webp,svg}",
    "input": "src/assets/images",
    "output": "assets/images"
  },
  // Archivos de traducción
  {
    "glob": "**/*.json",
    "input": "src/i18n",
    "output": "i18n"
  }
]
```

### Estructura de Assets Recomendada

```
src/
├── assets/
│   ├── images/
│   │   ├── banners/      ← Banners e imágenes hero
│   │   ├── products/     ← Fotos de productos
│   │   ├── brands/       ← Logos de marcas
│   │   └── icons/        ← Iconos SVG
│   ├── fonts/            ← Fuentes custom
│   ├── data/             ← JSON de datos mock
│   └── videos/           ← Videos promocionales
└── public/
    ├── favicon.ico
    ├── robots.txt
    └── manifest.json
```

### Cómo referenciar Assets en el código

#### En Templates (HTML):
```html
<!-- ✅ Correcto - Ruta relativa desde assets/ -->
<img src="assets/images/banners/banner1.webp" alt="Banner">

<!-- ❌ Incorrecto -->
<img src="/images/banners/banner1.webp" alt="Banner">
<img src="src/assets/images/banner1.webp" alt="Banner">
```

#### En TypeScript:
```typescript
export class BannerComponent {
  banners = [
    {
      id: 1,
      // ✅ Correcto
      image: 'assets/banners/banner1.webp',
      alt: 'Banner 1'
    }
  ];
}
```

#### En CSS/SCSS:
```css
.hero {
  /* ✅ Correcto */
  background-image: url('/assets/images/hero-bg.jpg');
}

/* Con variables de Tailwind */
@layer utilities {
  .bg-hero {
    background-image: url('/assets/images/hero.jpg');
  }
}
```

### Troubleshooting de Assets

#### 🔴 Error: "404 Not Found" para imágenes

**Causa 1:** Assets no configurados en `angular.json`
```json
// ❌ Falta configuración
"assets": []

// ✅ Agregar
"assets": [
  {
    "glob": "**/*",
    "input": "src/assets",
    "output": "assets"
  }
]
```

**Causa 2:** Ruta incorrecta en el código
```typescript
// ❌ Incorrecto
image: 'src/assets/banner.jpg'
image: '/banner.jpg'

// ✅ Correcto
image: 'assets/banner.jpg'
```

**Causa 3:** Nombre de archivo con espacios
```bash
# ❌ Evitar
banner 1.webp

# ✅ Usar
banner1.webp
banner-1.webp
```

**Causa 4:** Servidor no reiniciado después de cambiar `angular.json`
```bash
# Solución: Reiniciar el servidor
Ctrl + C (detener)
ng serve (iniciar)
```

#### 🔴 Error: Imágenes funcionan en desarrollo pero no en producción

**Causa:** Rutas absolutas que funcionan localmente pero no en servidor

```typescript
// ❌ Puede fallar en producción
image: '/images/banner.jpg'

// ✅ Siempre funciona
image: 'assets/images/banner.jpg'
```

### Optimización de Assets

#### 1. **Lazy Loading de Imágenes**
```html
<img 
  src="assets/images/product.jpg" 
  alt="Product"
  loading="lazy">  <!-- Carga solo cuando sea visible -->
```

#### 2. **NgOptimizedImage** (Angular 15+)
```typescript
import { NgOptimizedImage } from '@angular/common';

@Component({
  imports: [NgOptimizedImage]
})
```

```html
<img 
  ngSrc="assets/images/hero.jpg"
  alt="Hero"
  width="1920"
  height="600"
  priority>  <!-- Precarga imágenes importantes -->
```

#### 3. **Formatos Modernos**
- **WebP:** Mejor compresión que JPG/PNG
- **AVIF:** Aún mejor que WebP (pero menos compatible)
- **SVG:** Para logos e iconos (escalable)

```html
<!-- Picture con fallback -->
<picture>
  <source srcset="assets/images/hero.avif" type="image/avif">
  <source srcset="assets/images/hero.webp" type="image/webp">
  <img src="assets/images/hero.jpg" alt="Hero">
</picture>
```

### Mejores Prácticas de Assets

✅ **DO:**
- Usar nombres descriptivos sin espacios
- Organizar en subcarpetas lógicas
- Optimizar imágenes antes de subirlas
- Usar formatos modernos (WebP, SVG)
- Configurar correctamente `angular.json`
- Usar lazy loading para imágenes below-the-fold

❌ **DON'T:**
- No usar espacios en nombres de archivo
- No poner assets fuera de `src/assets` o `public`
- No olvidar reiniciar servidor después de cambiar config
- No usar rutas absolutas desde root
- No subir imágenes sin optimizar

### Comandos Útiles

```bash
# Verificar que assets se copian correctamente
ng build
# Revisar carpeta dist/browser/assets

# Build de producción
ng build --configuration production

# Analizar tamaño del bundle
ng build --stats-json
npx webpack-bundle-analyzer dist/stats.json
```

---

## ⚡ Mejores Prácticas de Angular 20

### 1. **Standalone Components**

**¿Qué son?**  
Componentes que no requieren NgModules para funcionar. Son auto-contenidos.

**Ventajas:**
- Menor boilerplate
- Lazy loading más simple
- Tree-shaking mejorado
- Más fácil de entender

**Implementación:**
```typescript
@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive, CommonModule], // ✅ Importaciones directas
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavbarComponent {
  // ...
}
```

**⚠️ Nota importante:** En Angular 20, `standalone: true` es el valor por defecto, NO se debe especificar.

---

### 2. **Signals API**

**¿Qué son los Signals?**  
Sistema de reactividad de Angular que reemplaza RxJS en muchos casos. Permiten gestionar estado de forma más simple y eficiente.

**Ventajas:**
- Más simple que Observables para estado local
- Mejor rendimiento
- Detección de cambios automática
- API más intuitiva

**Métodos principales:**

#### `signal()` - Crear un signal
```typescript
import { signal } from '@angular/core';

// Signal primitivo
currentSlide = signal(0);
cartItemsCount = signal(0);
isMobileMenuOpen = signal(false);
```

#### `set()` - Establecer un valor nuevo
```typescript
// Reemplaza el valor completamente
closeMobileMenu(): void {
  this.isMobileMenuOpen.set(false);
}
```

#### `update()` - Actualizar basado en valor anterior
```typescript
// Modifica el valor basándose en el actual
nextSlide(): void {
  this.currentSlide.update(current => 
    current === this.banners.length - 1 ? 0 : current + 1
  );
}
```

#### `computed()` - Valores derivados
```typescript
import { computed } from '@angular/core';

firstName = signal('John');
lastName = signal('Doe');

// Se recalcula automáticamente cuando firstName o lastName cambian
fullName = computed(() => `${this.firstName()} ${this.lastName()}`);
```

#### `effect()` - Efectos secundarios
```typescript
import { effect } from '@angular/core';

constructor() {
  // Se ejecuta cuando count cambia
  effect(() => {
    console.log(`Count is: ${this.count()}`);
  });
}
```

**Leer valores de signals:**
```typescript
// En el template (HTML)
<p>{{ currentSlide() }}</p>  // ✅ Con paréntesis

// En TypeScript
const value = this.currentSlide();  // ✅ Con paréntesis
```

---

### 3. **Control Flow Syntax**

Nueva sintaxis nativa de Angular que reemplaza directivas estructurales.

#### `@if` - Condicionales
```html
<!-- ❌ Forma antigua -->
<div *ngIf="isLoggedIn">Welcome</div>

<!-- ✅ Forma nueva (Angular 20) -->
@if (isLoggedIn) {
  <div>Welcome</div>
}

<!-- Con else -->
@if (cartItemsCount() > 0) {
  <span class="badge">{{ cartItemsCount() }}</span>
} @else {
  <span>Empty</span>
}
```

#### `@for` - Bucles
```html
<!-- ❌ Forma antigua -->
<div *ngFor="let item of items; trackBy: trackByFn">{{ item.name }}</div>

<!-- ✅ Forma nueva (Angular 20) -->
@for (item of items; track item.id) {
  <div>{{ item.name }}</div>
}

<!-- Con índice -->
@for (banner of banners; track banner.id) {
  <div>Banner {{ $index + 1 }}</div>
}
```

**Variables especiales en @for:**
- `$index` - Índice actual (0-based)
- `$first` - Es el primer elemento
- `$last` - Es el último elemento
- `$even` - Índice par
- `$odd` - Índice impar
- `$count` - Total de elementos

#### `@switch` - Múltiples condiciones
```html
@switch (status) {
  @case ('loading') {
    <p>Cargando...</p>
  }
  @case ('success') {
    <p>Éxito!</p>
  }
  @case ('error') {
    <p>Error!</p>
  }
  @default {
    <p>Estado desconocido</p>
  }
}
```

---

### 4. **Change Detection Strategy: OnPush**

**¿Qué es?**  
Estrategia de detección de cambios que mejora el rendimiento al verificar cambios solo cuando es necesario.

**Cuándo se ejecuta:**
- Cuando cambian los `@Input()`
- Cuando se dispara un evento en el template
- Cuando cambia un signal usado en el template
- Cuando se ejecuta un Observable con async pipe

**Implementación:**
```typescript
import { ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-navbar',
  changeDetection: ChangeDetectionStrategy.OnPush  // ✅
})
```

**Ventajas:**
- Mejor rendimiento
- Menos re-renders innecesarios
- Fuerza código más limpio y predecible

---

### 5. **Inject Function vs Constructor Injection**

#### ❌ Forma antigua (Constructor Injection)
```typescript
constructor(
  private productService: ProductService,
  private router: Router
) {}
```

#### ✅ Forma nueva (inject function)
```typescript
import { inject } from '@angular/core';

export class ProductComponent {
  private productService = inject(ProductService);
  private router = inject(Router);
}
```

**Ventajas:**
- Más limpio y legible
- Funciona en funciones helper
- Mejor para testing

---

### 6. **Input/Output Functions**

#### ❌ Forma antigua
```typescript
@Input() productName!: string;
@Output() productClick = new EventEmitter<string>();
```

#### ✅ Forma nueva
```typescript
import { input, output } from '@angular/core';

export class ProductCard {
  productName = input.required<string>();  // Input requerido
  price = input<number>(0);                // Input con valor default
  
  productClick = output<string>();         // Output
}
```

**Uso en template:**
```html
<!-- Leer input -->
<p>{{ productName() }}</p>

<!-- Emitir output -->
<button (click)="productClick.emit(productName())">Click</button>
```

---

### 7. **Host Bindings**

#### ❌ Forma antigua
```typescript
@HostBinding('class.active') isActive = true;
@HostListener('click') onClick() { }
```

#### ✅ Forma nueva
```typescript
@Component({
  host: {
    '[class.active]': 'isActive',
    '(click)': 'onClick()'
  }
})
```

---

### 8. **NgOptimizedImage**

Para mejorar el rendimiento de imágenes.

```typescript
import { NgOptimizedImage } from '@angular/common';

@Component({
  imports: [NgOptimizedImage]
})
```

```html
<!-- ❌ Forma antigua -->
<img src="assets/product.jpg" alt="Product">

<!-- ✅ Forma optimizada -->
<img 
  ngSrc="assets/product.jpg" 
  alt="Product"
  width="800"
  height="600"
  priority>  <!-- Para imágenes above the fold -->
```

**Características:**
- Lazy loading automático
- Preconnect a CDN
- Previene layout shift
- Genera srcset automático

---

## 🧩 Componentes Desarrollados

### 1. Navbar Component

**Ubicación:** `src/app/layout/navbar/component/navbar.component/`

**Responsabilidades:**
- Navegación principal del sitio
- Carrito de compras con badge
- Menú responsive (móvil/desktop)
- Links activos con RouterLinkActive

**Características técnicas:**

#### Signals utilizados:
```typescript
cartItemsCount = signal(0);        // Contador de items en carrito
isMobileMenuOpen = signal(false);  // Estado del menú móvil
```

#### Métodos principales:
```typescript
toggleMobileMenu(): void {
  // Alterna entre abierto/cerrado
  this.isMobileMenuOpen.update(isOpen => !isOpen);
}

closeMobileMenu(): void {
  // Cierra el menú (útil al hacer click en un link)
  this.isMobileMenuOpen.set(false);
}
```

#### RouterLinkActive
Aplica clases CSS automáticamente cuando una ruta está activa:

```html
<a 
  routerLink="/catalogo" 
  routerLinkActive="nav-active"
  class="nav-link">
  Catálogo
</a>
```

**CSS para link activo:**
```css
.nav-active {
  @apply text-indigo-600 bg-indigo-100;
}
```

#### Responsive Design
```html
<!-- Desktop -->
<div class="hidden md:flex items-center space-x-1">
  <!-- Links de navegación -->
</div>

<!-- Mobile -->
@if (isMobileMenuOpen()) {
  <div class="md:hidden">
    <!-- Menú móvil -->
  </div>
}
```

**Clases TailwindCSS clave:**
- `hidden md:flex` - Oculto en móvil, visible en desktop
- `md:hidden` - Visible en móvil, oculto en desktop
- `sticky top-0` - Navbar fijo en la parte superior
- `z-50` - Z-index alto para estar sobre otros elementos

---

### 2. Footer Component

**Ubicación:** `src/app/layout/footer/component/footer.component/`

**Responsabilidades:**
- Información de la empresa
- Links a páginas importantes
- Categorías de productos
- Información de contacto
- Redes sociales

**Características técnicas:**

#### Año dinámico
```typescript
currentYear = new Date().getFullYear();
```

```html
<p>&copy; {{ currentYear }} TechHardware. Todos los derechos reservados.</p>
```

#### Grid Responsive
```html
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
  <!-- 1 columna en móvil, 2 en tablet, 4 en desktop -->
</div>
```

#### Gradiente de fondo
```html
<footer class="bg-gradient-to-r from-blue-900 via-indigo-900 to-blue-900">
```

**SVG Icons inline:**
- Evita dependencias externas
- Customizable con CSS
- Mejor rendimiento

---

### 3. Banner Component (Carrusel Automático)

**Ubicación:** `src/app/home/Banner/banner.component/`

**Responsabilidades:**
- Mostrar banners promocionales
- Cambio automático cada 5 segundos
- Navegación manual (flechas y dots)
- Transiciones suaves

**Conceptos aplicados:**

#### 1. Interface para tipado fuerte
```typescript
interface Banner {
  id: number;
  image: string;
  alt: string;
}
```

**Beneficios:**
- TypeScript valida la estructura
- Autocompletado en el IDE
- Previene errores en tiempo de compilación

#### 2. Signal para estado reactivo
```typescript
currentSlide = signal(0);
```

#### 3. Lifecycle Hook: OnDestroy
```typescript
import { OnDestroy } from '@angular/core';

export class BannerComponent implements OnDestroy {
  private intervalId?: number;

  ngOnDestroy(): void {
    this.stopAutoplay();  // ✅ Limpia el interval
  }
}
```

**¿Por qué es importante?**
- Previene memory leaks
- Detiene timers cuando el componente se destruye
- Buena práctica de gestión de recursos

#### 4. setInterval para autoplay
```typescript
startAutoplay(): void {
  this.intervalId = window.setInterval(() => {
    this.nextSlide();
  }, 5000);
}

stopAutoplay(): void {
  if (this.intervalId) {
    clearInterval(this.intervalId);
  }
}
```

#### 5. Lógica circular para slides
```typescript
nextSlide(): void {
  this.currentSlide.update(current => 
    current === this.banners.length - 1 ? 0 : current + 1
    // Si está en el último, vuelve al primero
  );
}

prevSlide(): void {
  this.currentSlide.update(current => 
    current === 0 ? this.banners.length - 1 : current - 1
    // Si está en el primero, va al último
  );
}
```

#### 6. Reiniciar autoplay al interactuar
```typescript
goToSlide(index: number): void {
  this.currentSlide.set(index);
  this.stopAutoplay();    // Detiene el actual
  this.startAutoplay();   // Inicia uno nuevo (reinicia el timer)
}
```

#### 7. Transiciones CSS
```html
<div 
  [class.opacity-100]="currentSlide() === $index"
  [class.opacity-0]="currentSlide() !== $index"
  class="transition-all duration-700 ease-in-out">
```

**Class Bindings:**
- `[class.nombre]="condicion"` - Aplica clase si condición es true
- Múltiples bindings pueden coexistir
- Clases estáticas + dinámicas se combinan

#### 8. Dots indicator interactivo
```html
@for (banner of banners; track banner.id) {
  <button
    (click)="goToSlide($index)"
    [class.bg-white]="currentSlide() === $index"
    [class.bg-white/50]="currentSlide() !== $index"
    [class.w-12]="currentSlide() === $index"
    [class.w-3]="currentSlide() !== $index">
  </button>
}
```

**Efecto visual:**
- El dot activo es más ancho (w-12) y opaco (bg-white)
- Los inactivos son pequeños (w-3) y transparentes (bg-white/50)

---

### 4. Brand Component (Carrusel Infinito)

**Ubicación:** `src/app/home/brand/brand.component/`

**Responsabilidades:**
- Mostrar logos de marcas
- Animación continua e infinita
- Pausa al hacer hover
- Efecto de loop seamless

**Conceptos aplicados:**

#### 1. Getter para computed values
```typescript
get duplicatedBrands(): Brand[] {
  return [...this.brands, ...this.brands];
}
```

**¿Por qué duplicar?**
- El carrusel muestra 8 marcas + 8 marcas (16 total)
- Cuando termina de mostrar las primeras 8, las segundas 8 ya están visibles
- Al llegar al 50% de la animación, se reinicia sin que se note el corte

**Spread operator (`...`):**
```typescript
const original = [1, 2, 3];
const duplicado = [...original, ...original];
// Resultado: [1, 2, 3, 1, 2, 3]
```

#### 2. Animación CSS personalizada
```css
@keyframes scroll {
  0% {
    transform: translateX(0);      /* Posición inicial */
  }
  100% {
    transform: translateX(-50%);   /* Se mueve 50% (una copia completa) */
  }
}
```

**TailwindCSS config:**
```javascript
module.exports = {
  theme: {
    extend: {
      keyframes: {
        scroll: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        scroll: 'scroll 30s linear infinite',
        //      nombre  duración timing loop
      },
    },
  },
}
```

#### 3. Pause on hover
```css
.carousel-track:hover .carousel-content {
  animation-play-state: paused;
}
```

**Estados de animación:**
- `running` - Animación activa (default)
- `paused` - Animación pausada

#### 4. Gradientes para fade effect
```html
<div class="absolute left-0 bg-gradient-to-r from-white to-transparent"></div>
<div class="absolute right-0 bg-gradient-to-l from-white to-transparent"></div>
```

**Efecto visual:**
- Los logos aparecen gradualmente desde los lados
- Oculta el "corte" donde la animación hace loop

#### 5. Grayscale hover effect
```html
<img class="grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100">
```

**TailwindCSS filters:**
- `grayscale` - Imagen en blanco y negro
- `grayscale-0` - Color normal
- `opacity-70` - 70% de opacidad
- `group-hover:` - Aplica al hacer hover en el padre

#### 6. Track en @for con ID compuesto
```html
@for (brand of duplicatedBrands; track brand.id + '-' + $index) {
```

**¿Por qué track compuesto?**
- `duplicatedBrands` tiene IDs duplicados (1,2,3...1,2,3)
- `brand.id + '-' + $index` crea claves únicas: "1-0", "2-1", "1-8", "2-9"
- Angular puede trackear cada elemento correctamente

---

### 5. Home Component

**Ubicación:** `src/app/home/home.component/`

**Responsabilidades:**
- Orquestar componentes del home
- Layout de página principal

**Composición:**
```
Home
├── Navbar (sticky)
├── Banner (carrusel automático)
├── Hero Section
├── Featured Categories
├── Brand Carousel (infinito)
├── Why Choose Us
└── Footer
```

**Imports:**
```typescript
import { NavbarComponent } from '../../layout/navbar/...';
import { FooterComponent } from '../../layout/footer/...';
import { BannerComponent } from '../Banner/...';
import { BrandComponent } from '../brand/...';

@Component({
  imports: [
    NavbarComponent, 
    FooterComponent, 
    BannerComponent, 
    BrandComponent
  ]
})
```

---

## 🎨 TailwindCSS - Conceptos y Técnicas

### 1. Utility-First CSS

**Filosofía:**
En lugar de crear clases custom, usas clases utilitarias directamente en el HTML.

```html
<!-- ❌ Forma tradicional -->
<style>
  .card {
    padding: 1rem;
    background: white;
    border-radius: 0.5rem;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  }
</style>
<div class="card">Content</div>

<!-- ✅ Utility-first (Tailwind) -->
<div class="p-4 bg-white rounded-lg shadow">Content</div>
```

**Ventajas:**
- No hay naming conflicts
- Menos CSS para cargar
- Más rápido de escribir
- Fácil de mantener

### 2. Responsive Design

**Breakpoints de Tailwind:**
```css
/* Sin prefijo = todos los tamaños (mobile-first) */
/* sm: 640px */
/* md: 768px */
/* lg: 1024px */
/* xl: 1280px */
/* 2xl: 1536px */
```

**Ejemplos:**
```html
<!-- 1 columna en móvil, 2 en tablet, 4 en desktop -->
<div class="grid-cols-1 md:grid-cols-2 lg:grid-cols-4">

<!-- Oculto en móvil, visible en desktop -->
<div class="hidden md:block">

<!-- Padding pequeño en móvil, grande en desktop -->
<div class="px-4 lg:px-8">
```

### 3. Flexbox & Grid

#### Flexbox
```html
<!-- Centrar contenido -->
<div class="flex items-center justify-center">

<!-- Space between -->
<div class="flex justify-between">

<!-- Dirección columna -->
<div class="flex flex-col">

<!-- Gap entre items -->
<div class="flex gap-4">
```

#### Grid
```html
<!-- Grid de 3 columnas -->
<div class="grid grid-cols-3 gap-4">

<!-- Grid responsive -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
```

### 4. Spacing

**Escala de Tailwind:**
```
0 = 0px
1 = 0.25rem (4px)
2 = 0.5rem (8px)
3 = 0.75rem (12px)
4 = 1rem (16px)
6 = 1.5rem (24px)
8 = 2rem (32px)
12 = 3rem (48px)
16 = 4rem (64px)
```

**Propiedades:**
- `p-4` = padding: 1rem
- `px-4` = padding-left y padding-right: 1rem
- `py-4` = padding-top y padding-bottom: 1rem
- `m-4` = margin: 1rem
- `space-x-4` = gap horizontal entre hijos

### 5. Colores

**Sintaxis:** `{property}-{color}-{shade}`

```html
<!-- Texto -->
<p class="text-blue-600">Texto azul</p>
<p class="text-gray-900">Texto gris oscuro</p>

<!-- Fondo -->
<div class="bg-indigo-500">Fondo indigo</div>
<div class="bg-white">Fondo blanco</div>

<!-- Borde -->
<div class="border-blue-300">Borde azul claro</div>
```

**Shades:** 50, 100, 200, 300, 400, 500, 600, 700, 800, 900

### 6. Hover, Focus, Active States

```html
<!-- Hover -->
<button class="bg-blue-500 hover:bg-blue-700">

<!-- Focus -->
<input class="border-gray-300 focus:border-blue-500">

<!-- Active -->
<button class="active:scale-95">

<!-- Combinados -->
<a class="text-gray-700 hover:text-indigo-600 hover:bg-indigo-50">
```

### 7. Transitions & Animations

```html
<!-- Transición básica -->
<div class="transition-all duration-200">

<!-- Durations -->
duration-75   = 75ms
duration-100  = 100ms
duration-200  = 200ms
duration-300  = 300ms
duration-500  = 500ms

<!-- Timing functions -->
ease-linear
ease-in
ease-out
ease-in-out

<!-- Ejemplo completo -->
<button class="transition-all duration-300 ease-in-out hover:scale-110">
```

### 8. Shadows

```html
shadow-sm   = Sombra pequeña
shadow      = Sombra normal
shadow-md   = Sombra mediana
shadow-lg   = Sombra grande
shadow-xl   = Sombra extra grande
shadow-2xl  = Sombra enorme

<!-- Ejemplo -->
<div class="shadow-lg hover:shadow-xl transition-shadow">
```

### 9. Positioning

```html
<!-- Relative/Absolute -->
<div class="relative">
  <div class="absolute top-0 right-0">Badge</div>
</div>

<!-- Fixed -->
<nav class="fixed top-0 left-0 right-0">

<!-- Sticky -->
<nav class="sticky top-0">

<!-- Z-index -->
<div class="z-10">Encima</div>
<div class="z-50">Más encima</div>
```

### 10. Arbitrary Values

Cuando necesitas un valor específico no en la escala:

```html
<!-- Tamaño custom -->
<div class="w-[137px]">

<!-- Color custom -->
<div class="bg-[#1da1f2]">

<!-- Grid columns custom -->
<div class="grid-cols-[200px_1fr_200px]">
```

### 11. Group & Peer

#### Group
Aplicar estilos a hijos cuando se hace hover en el padre:

```html
<div class="group">
  <img class="group-hover:scale-110">
  <p class="group-hover:text-blue-600">
</div>
```

#### Peer
Aplicar estilos basados en el estado de un sibling:

```html
<input type="checkbox" class="peer">
<div class="peer-checked:bg-blue-500">
  Se vuelve azul cuando el checkbox está marcado
</div>
```

### 12. Gradientes

```html
<!-- Linear gradients -->
<div class="bg-gradient-to-r from-blue-500 to-indigo-600">

<!-- Direcciones -->
to-r  = →  (right)
to-l  = ←  (left)
to-t  = ↑  (top)
to-b  = ↓  (bottom)
to-br = ↘  (bottom-right)

<!-- Con via (punto medio) -->
<div class="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
```

---

## 🧠 Conceptos Técnicos Avanzados

### 1. Reactive Programming con Signals

**Conceptos fundamentales:**

#### Reactividad
Los valores se actualizan automáticamente cuando sus dependencias cambian.

```typescript
// ❌ Imperativo (manual)
let total = 0;
function updateTotal() {
  total = price * quantity;
}
// Tienes que llamar updateTotal() cada vez que cambie algo

// ✅ Reactivo (automático)
price = signal(10);
quantity = signal(2);
total = computed(() => price() * quantity());
// total se actualiza automáticamente
```

#### Signals vs Observables

| Característica | Signals | Observables (RxJS) |
|----------------|---------|-------------------|
| Complejidad | Simple | Complejo |
| Curva de aprendizaje | Baja | Alta |
| Casos de uso | Estado local | Streams, HTTP, eventos complejos |
| Rendimiento | Excelente | Bueno |
| Change Detection | Automática | Requiere async pipe o subscribe |

**Cuándo usar cada uno:**
- **Signals:** Estado local, valores derivados simples
- **Observables:** HTTP requests, WebSockets, eventos complejos, operadores avanzados

### 2. Change Detection Deep Dive

**Default Strategy:**
```typescript
// Angular verifica TODO el árbol de componentes en cada evento
@Component({
  changeDetection: ChangeDetectionStrategy.Default
})
```

**OnPush Strategy:**
```typescript
// Angular SOLO verifica cuando:
// - Cambian los @Input()
// - Se dispara un evento en el template
// - Cambia un signal usado en el template
// - Un Observable emite con async pipe
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush
})
```

**Ejemplo práctico:**
```typescript
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductCard {
  // ❌ NO dispara change detection
  items: Product[] = [];
  
  addItem() {
    this.items.push(newProduct);  // Mutación no detectada
  }
  
  // ✅ SÍ dispara change detection
  items = signal<Product[]>([]);
  
  addItem() {
    this.items.update(current => [...current, newProduct]);
  }
}
```

### 3. TypeScript Advanced Features

#### Type Inference
```typescript
// TypeScript infiere el tipo automáticamente
const count = signal(0);  // Infiere: WritableSignal<number>
const name = signal('John');  // Infiere: WritableSignal<string>

// No necesitas:
const count: WritableSignal<number> = signal(0);
```

#### Interfaces vs Types
```typescript
// Interface (preferido para objetos)
interface Banner {
  id: number;
  image: string;
  alt: string;
}

// Type (para uniones, aliases)
type Status = 'loading' | 'success' | 'error';
type ID = string | number;
```

#### Optional Properties
```typescript
interface Product {
  id: number;
  name: string;
  description?: string;  // Opcional
}

// Uso
const product: Product = { id: 1, name: 'CPU' };  // ✅ OK
```

#### Array Types
```typescript
// Forma 1
brands: Brand[] = [];

// Forma 2
brands: Array<Brand> = [];
```

#### Readonly
```typescript
interface Config {
  readonly apiUrl: string;
}

const config: Config = { apiUrl: 'https://api.com' };
config.apiUrl = 'new-url';  // ❌ Error: readonly property
```

### 4. Memory Management

#### Memory Leaks comunes:

**❌ BAD - Interval sin limpiar:**
```typescript
export class BadComponent {
  constructor() {
    setInterval(() => {
      console.log('Leak!');
    }, 1000);
    // Se sigue ejecutando después de destruir el componente
  }
}
```

**✅ GOOD - Con cleanup:**
```typescript
export class GoodComponent implements OnDestroy {
  private intervalId?: number;
  
  constructor() {
    this.intervalId = window.setInterval(() => {
      console.log('Safe!');
    }, 1000);
  }
  
  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
}
```

**❌ BAD - Observable sin unsubscribe:**
```typescript
export class BadComponent {
  ngOnInit() {
    this.service.getData().subscribe(data => {
      console.log(data);
    });
    // Subscription sigue activa después de destruir
  }
}
```

**✅ GOOD - Con async pipe:**
```typescript
export class GoodComponent {
  data$ = this.service.getData();
  // async pipe se desuscribe automáticamente
}
```

```html
<div>{{ data$ | async }}</div>
```

### 5. CSS Animations Performance

**Propiedades que disparan reflow (lentas):**
- width, height
- margin, padding
- top, left, right, bottom
- font-size

**Propiedades que solo disparan repaint (rápidas):**
- opacity
- transform (translate, scale, rotate)
- filter

**✅ Mejores prácticas:**
```css
/* ❌ Lento */
.slow {
  transition: width 0.3s;
}
.slow:hover {
  width: 200px;
}

/* ✅ Rápido */
.fast {
  transition: transform 0.3s;
}
.fast:hover {
  transform: scaleX(1.2);
}
```

---

## 🎨 Patrones de Diseño Aplicados

### 1. Component Pattern

**Definición:**  
Dividir la UI en componentes pequeños, reutilizables e independientes.

**Ejemplo en el proyecto:**
```
Home (Container)
├── Navbar (Presentational)
├── Banner (Smart)
├── Brand (Smart)
└── Footer (Presentational)
```

**Tipos de componentes:**

#### Smart (Container) Components
- Manejan lógica y estado
- Se conectan a servicios
- Pasan datos a componentes presentacionales

```typescript
// Banner es "Smart" porque maneja su propio estado
export class BannerComponent {
  currentSlide = signal(0);
  
  nextSlide() {
    // Lógica de negocio
  }
}
```

#### Presentational Components
- Solo reciben datos via @Input
- Emiten eventos via @Output
- No tienen lógica de negocio
- Puramente visuales

```typescript
// Footer es "Presentational"
export class FooterComponent {
  currentYear = new Date().getFullYear();
  // Solo presenta información, no maneja estado complejo
}
```

### 2. Composition Pattern

Construir componentes complejos combinando componentes simples.

```html
<!-- Home compone varios componentes -->
<app-navbar></app-navbar>
<app-banner></app-banner>
<main>
  <app-categories></app-categories>
  <app-brand></app-brand>
</main>
<app-footer></app-footer>
```

### 3. Single Responsibility Principle

Cada componente tiene UNA responsabilidad clara:

- **Navbar:** Solo navegación
- **Banner:** Solo mostrar banners
- **Brand:** Solo carrusel de marcas
- **Footer:** Solo información de pie de página

### 4. DRY (Don't Repeat Yourself)

**Ejemplo - Duplicación de marcas:**
```typescript
// ❌ Repetir manualmente
brands = [marca1, marca2, marca3, marca1, marca2, marca3];

// ✅ DRY con getter
get duplicatedBrands() {
  return [...this.brands, ...this.brands];
}
```

### 5. Separation of Concerns

**Separación clara:**
- **HTML:** Estructura (template)
- **CSS:** Presentación (estilos)
- **TypeScript:** Lógica (comportamiento)

### 6. Factory Pattern (implícito)

Crear objetos de forma centralizada:

```typescript
// Array de banners = "factory" de objetos Banner
banners: Banner[] = [
  { id: 1, image: '...', alt: '...' },
  { id: 2, image: '...', alt: '...' },
];
```

---

## 📖 Guía de Estudio

### Nivel 1: Fundamentos (Semana 1-2)

**Temas a dominar:**
1. ✅ TypeScript básico
   - Tipos primitivos
   - Interfaces
   - Type inference
   
2. ✅ Angular básico
   - Componentes
   - Templates
   - Data binding

3. ✅ TailwindCSS
   - Utility classes
   - Responsive design
   - Flexbox & Grid

**Ejercicios:**
- Crear un componente simple con input/output
- Hacer un card de producto responsive
- Aplicar hover effects con Tailwind

### Nivel 2: Intermedio (Semana 3-4)

**Temas a dominar:**
1. ✅ Signals API
   - signal(), set(), update()
   - computed()
   - effect()

2. ✅ Control Flow
   - @if, @for, @switch
   - Track function en loops

3. ✅ Change Detection
   - OnPush strategy
   - Cuándo se dispara

**Ejercicios:**
- Crear un contador con signals
- Implementar un todo list con @for
- Optimizar un componente con OnPush

### Nivel 3: Avanzado (Semana 5-6)

**Temas a dominar:**
1. ✅ Lifecycle Hooks
   - OnInit, OnDestroy
   - Memory management
   - Cleanup de subscriptions

2. ✅ Routing
   - RouterLink, RouterLinkActive
   - Lazy loading
   - Route params

3. ✅ Animaciones
   - CSS transitions
   - Keyframe animations
   - Performance optimization

**Ejercicios:**
- Implementar un carrusel desde cero
- Crear animaciones custom con Tailwind
- Optimizar rendimiento de una lista larga

### Nivel 4: Experto (Semana 7-8)

**Temas a dominar:**
1. ✅ Architecture
   - Feature modules
   - Core vs Shared
   - Folder structure

2. ✅ Performance
   - OnPush everywhere
   - Lazy loading
   - Bundle optimization

3. ✅ Best Practices
   - Code organization
   - Naming conventions
   - Testing strategies

**Proyecto final:**
- Implementar un e-commerce completo
- Con carrito funcional
- Checkout process
- Admin panel

---

## 🔗 Recursos Adicionales

### Documentación Oficial
- [Angular Docs](https://angular.dev)
- [TailwindCSS Docs](https://tailwindcss.com)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)

### Cursos Recomendados
- Angular University
- Ultimate Angular
- Frontend Masters

### Blogs y Tutoriales
- Angular Blog (blog.angular.io)
- Dev.to #angular
- Medium Angular Stories

### Tools
- Angular DevTools (Chrome Extension)
- Tailwind IntelliSense (VS Code Extension)
- Prettier + ESLint

---

## 📝 Glosario de Términos

**Signal:** Valor reactivo que notifica cambios automáticamente

**Computed:** Signal derivado que se recalcula cuando sus dependencias cambian

**Effect:** Función que se ejecuta cuando un signal usado dentro cambia

**OnPush:** Estrategia de detección de cambios que optimiza rendimiento

**Standalone:** Componente que no requiere NgModule

**Utility-first:** Filosofía de CSS usando clases utilitarias en lugar de custom CSS

**Change Detection:** Proceso de Angular para detectar y renderizar cambios

**Lifecycle Hook:** Métodos que se ejecutan en momentos específicos del ciclo de vida

**Memory Leak:** Memoria que no se libera correctamente y consume recursos

**Reflow:** Recalcular layout (costoso en rendimiento)

**Repaint:** Redibujar píxeles (menos costoso que reflow)

---

## ✅ Checklist de Mejores Prácticas

### Angular
- [ ] Usar standalone components
- [ ] Aplicar OnPush change detection
- [ ] Usar signals para estado local
- [ ] Implementar cleanup en OnDestroy
- [ ] Usar control flow syntax (@if, @for)
- [ ] Tipado fuerte en TypeScript
- [ ] No usar any
- [ ] Nombres descriptivos de variables

### TailwindCSS
- [ ] Mobile-first design
- [ ] Usar utility classes
- [ ] Aprovechar responsive breakpoints
- [ ] Optimizar con PurgeCSS (automático)
- [ ] Hover/focus states claros
- [ ] Transiciones suaves

### Performance
- [ ] Lazy loading de rutas
- [ ] Optimizar imágenes
- [ ] Evitar memory leaks
- [ ] Usar track en @for
- [ ] Minimizar watchers
- [ ] Code splitting

### Accesibilidad
- [ ] Alt text en imágenes
- [ ] aria-label en botones
- [ ] Keyboard navigation
- [ ] Contraste de colores adecuado
- [ ] Focus visible

---

## 🔧 Troubleshooting - Problemas Comunes

### 1. ❌ Error 404: "Failed to load resource" para imágenes

**Síntomas:**
```
GET http://localhost:4200/assets/banners/banner2.webp 404 (Not Found)
Failed to load resource: the server responded with a status of 404
```

**Causas posibles:**

#### A) Assets no configurados en angular.json ⚠️ **CAUSA MÁS COMÚN**

**Solución:**
```json
// En angular.json, sección architect.build.options
"assets": [
  {
    "glob": "**/*",
    "input": "public"
  },
  {
    "glob": "**/*",
    "input": "src/assets",
    "output": "assets"
  }
]
```

**Pasos:**
1. Abre `angular.json`
2. Busca `architect.build.options.assets`
3. Agrega la configuración de `src/assets`
4. **IMPORTANTE:** Reinicia el servidor (`ng serve`)

#### B) Nombre de archivo con espacios

**Problema:**
```typescript
image: 'assets/banners/banner 1.webp'  // ❌ Espacio en el nombre
```

**Solución:**
```bash
# Renombrar archivo
banner 1.webp  →  banner1.webp

# Actualizar código
image: 'assets/banners/banner1.webp'  // ✅
```

#### C) Ruta incorrecta en el código

**Problema:**
```typescript
// ❌ Rutas incorrectas
image: '/banners/banner1.webp'
image: 'src/assets/banners/banner1.webp'
image: '../assets/banners/banner1.webp'
```

**Solución:**
```typescript
// ✅ Ruta correcta
image: 'assets/banners/banner1.webp'
```

#### D) Servidor no reiniciado después de cambios en angular.json

**Problema:** Cambios en `angular.json` requieren reiniciar el servidor.

**Solución:**
```bash
# Terminal
Ctrl + C  (detener servidor)
ng serve  (reiniciar)
```

---

### 2. ❌ Errores de compilación en CSS con @apply

**Síntomas:**
```
Unknown at rule @apply
```

**Causa:** El linter de CSS no reconoce directivas de Tailwind.

**Solución:** Es solo un warning del linter, no afecta la funcionalidad. Puedes:

**Opción 1:** Ignorar (no afecta el build)

**Opción 2:** Configurar VS Code
```json
// En settings.json
{
  "css.lint.unknownAtRules": "ignore"
}
```

**Opción 3:** Usar PostCSS IntelliSense
```bash
# Instalar extensión
VS Code → Extensions → "PostCSS Language Support"
```

---

### 3. ❌ Componentes no se actualizan (Change Detection)

**Síntomas:**
- Cambios en signals no se reflejan en la UI
- Template no se actualiza

**Causas:**

#### A) Olvidaste los paréntesis al leer un signal

**Problema:**
```html
<!-- ❌ Sin paréntesis -->
<p>{{ count }}</p>

<!-- ✅ Con paréntesis -->
<p>{{ count() }}</p>
```

#### B) Mutaste un objeto en lugar de crear uno nuevo

**Problema:**
```typescript
// ❌ Mutación directa (no detectada por OnPush)
this.items.push(newItem);

// ✅ Crear nuevo array
this.items.update(current => [...current, newItem]);
```

---

### 4. ❌ Rutas (RouterLink) no funcionan

**Síntomas:**
- Click en link no navega
- Error en consola

**Solución:**
```typescript
// Verificar que RouterLink esté importado
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  imports: [RouterLink, RouterLinkActive]  // ✅
})
```

---

### 5. ❌ Animaciones CSS no funcionan

**Problema:**
```html
<div class="animate-scroll">  <!-- No funciona -->
```

**Causa:** Animación custom no configurada en Tailwind.

**Solución:**
```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      keyframes: {
        scroll: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' }
        }
      },
      animation: {
        scroll: 'scroll 30s linear infinite'
      }
    }
  }
}
```

---

### 6. ❌ Build falla en producción

**Síntomas:**
```
ng build --configuration production
✘ [ERROR] ...
```

**Causas comunes:**

#### A) Variables sin tipo o usando `any`

**Problema:**
```typescript
let data: any;  // ❌ Strict mode no permite any
```

**Solución:**
```typescript
let data: Product[];  // ✅ Tipo específico
```

#### B) Archivos CSS muy grandes

**Problema:**
```
Error: budgets, maximum exceeded for anyComponentStyle
```

**Solución:**
```json
// En angular.json
"budgets": [
  {
    "type": "anyComponentStyle",
    "maximumWarning": "4kB",
    "maximumError": "8kB"  // ← Aumentar si es necesario
  }
]
```

---

### 7. ❌ Memory Leaks (Consumo excesivo de memoria)

**Síntomas:**
- Aplicación se vuelve lenta con el tiempo
- Memoria RAM aumenta constantemente

**Causa:** Subscriptions o intervals sin limpiar

**Problema:**
```typescript
export class BadComponent {
  ngOnInit() {
    setInterval(() => {
      console.log('Leak!');
    }, 1000);
    // ❌ Se sigue ejecutando después de destruir el componente
  }
}
```

**Solución:**
```typescript
export class GoodComponent implements OnDestroy {
  private intervalId?: number;

  ngOnInit() {
    this.intervalId = window.setInterval(() => {
      console.log('Safe');
    }, 1000);
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);  // ✅ Limpieza
    }
  }
}
```

---

### 8. ❌ Tailwind classes no funcionan

**Problema:**
```html
<div class="bg-blue-500">  <!-- Sin fondo azul -->
```

**Causas:**

#### A) Tailwind no configurado correctamente

**Verificar `tailwind.config.js`:**
```javascript
module.exports = {
  content: [
    "./src/**/*.{html,ts}"  // ✅ Debe incluir html y ts
  ]
}
```

#### B) Clases dinámicas no detectadas

**Problema:**
```typescript
// ❌ Tailwind no detecta clases construidas dinámicamente
class="bg-" + color + "-500"
```

**Solución:**
```typescript
// ✅ Usar clases completas
[class]="color === 'blue' ? 'bg-blue-500' : 'bg-red-500'"

// O usar safelist en tailwind.config.js
safelist: [
  'bg-blue-500',
  'bg-red-500',
  'bg-green-500'
]
```

---

### 9. ❌ Puerto 4200 ya está en uso

**Síntomas:**
```
Port 4200 is already in use.
Would you like to use port 4201 instead? (Y/n)
```

**Solución:**

**Opción 1:** Usar otro puerto
```bash
ng serve --port 4201
```

**Opción 2:** Matar el proceso
```bash
# Windows
netstat -ano | findstr :4200
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:4200 | xargs kill
```

---

### 10. ❌ Changes not detected after file save

**Síntomas:**
- Guardas archivo pero no se recarga
- Hot reload no funciona

**Solución:**

**Opción 1:** Reiniciar servidor
```bash
Ctrl + C
ng serve
```

**Opción 2:** Limpiar caché
```bash
rm -rf .angular
ng serve
```

**Opción 3:** Verificar watchOptions
```json
// angular.json
"options": {
  "watch": true,
  "poll": 2000  // Verificar cada 2 segundos
}
```

---

### ✅ Comandos Útiles de Diagnóstico

```bash
# Verificar versión de Angular
ng version

# Limpiar caché
rm -rf node_modules .angular
npm install

# Build y ver errores detallados
ng build --verbose

# Analizar bundle size
ng build --stats-json
npx webpack-bundle-analyzer dist/stats.json

# Verificar configuración
ng config

# Lista de rutas
ng generate @angular/core:routes-list
```

---

**Autor:** GitHub Copilot  
**Fecha:** Octubre 2025  
**Versión:** 1.1  
**Proyecto:** Frontend E-commerce Hardware

---

¡Feliz aprendizaje! 🚀
