# 🧪 Ejemplos de Uso - Servicios Admin

## 📦 **PRODUCTOS**

### 1️⃣ Crear Producto Completo (con imagen)

```typescript
import { Component, inject, signal } from '@angular/core';
import { AdminProductService } from './services/admin-product.service';
import { CreateProductDto } from './models/admin.model';

export class ProductCreateComponent {
  private adminProductService = inject(AdminProductService);
  
  selectedImage = signal<File | null>(null);
  submitting = signal(false);

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      
      // Validar imagen
      const validation = this.adminProductService.validateImageFile(file);
      if (!validation.valid) {
        alert(validation.error);
        return;
      }
      
      this.selectedImage.set(file);
    }
  }

  createProduct(): void {
    this.submitting.set(true);

    // 1. Datos del producto
    const productData: CreateProductDto = {
      nombre: 'RTX 4090 Ti',
      descripcion: 'Tarjeta gráfica de última generación NVIDIA',
      precio: 8000,
      stock: 15,
      sku: 'GPU-RTX-4090',
      idMarca: 1,      // NVIDIA
      idCategoria: 2   // Tarjetas de Video
    };

    // 2. Crear producto
    this.adminProductService.createProduct(productData).subscribe({
      next: (product) => {
        console.log('✅ Producto creado:', product);
        
        // 3. Subir imagen si existe
        if (this.selectedImage()) {
          this.adminProductService.uploadProductImage(
            product.id, 
            this.selectedImage()!
          ).subscribe({
            next: (imageResponse) => {
              console.log('✅ Imagen subida:', imageResponse);
              this.submitting.set(false);
              alert('Producto creado exitosamente con imagen');
            },
            error: (err) => {
              console.error('❌ Error subiendo imagen:', err);
              this.submitting.set(false);
              alert('Producto creado pero falló la imagen');
            }
          });
        } else {
          this.submitting.set(false);
          alert('Producto creado exitosamente sin imagen');
        }
      },
      error: (err) => {
        console.error('❌ Error creando producto:', err);
        this.submitting.set(false);
        alert('Error al crear producto: ' + err.message);
      }
    });
  }
}
```

---

### 2️⃣ Actualizar Producto

```typescript
import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminProductService } from './services/admin-product.service';
import { ProductService } from './services/product.service';
import { UpdateProductDto } from './models/admin.model';

export class ProductEditComponent implements OnInit {
  private adminProductService = inject(AdminProductService);
  private productService = inject(ProductService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  productId = signal(0);
  loading = signal(true);
  product = signal<any>(null);

  ngOnInit(): void {
    this.productId.set(Number(this.route.snapshot.params['id']));
    this.loadProduct();
  }

  loadProduct(): void {
    this.productService.getProductById(this.productId()).subscribe({
      next: (product) => {
        this.product.set(product);
        this.loading.set(false);
        console.log('Producto cargado:', product);
      },
      error: (err) => {
        console.error('Error cargando producto:', err);
        this.loading.set(false);
      }
    });
  }

  updateProduct(): void {
    const updateData: UpdateProductDto = {
      nombre: 'RTX 4090 Ti SUPER',
      precio: 8500,
      stock: 20
      // Solo los campos que se actualizan
    };

    this.adminProductService.updateProduct(
      this.productId(), 
      updateData
    ).subscribe({
      next: (updated) => {
        console.log('✅ Producto actualizado:', updated);
        alert('Producto actualizado exitosamente');
        this.router.navigate(['/admin/productos']);
      },
      error: (err) => {
        console.error('❌ Error actualizando:', err);
        alert('Error al actualizar: ' + err.message);
      }
    });
  }
}
```

---

### 3️⃣ Actualizar Solo Stock (Rápido)

```typescript
export class QuickStockUpdateComponent {
  private adminProductService = inject(AdminProductService);

  updateStock(productId: number, newStock: number): void {
    this.adminProductService.updateStock(productId, newStock).subscribe({
      next: (product) => {
        console.log('✅ Stock actualizado:', product);
        alert(`Stock actualizado a ${product.stock} unidades`);
      },
      error: (err) => {
        console.error('❌ Error:', err);
        alert('Error al actualizar stock');
      }
    });
  }

  // Ejemplo de uso
  increaseStock(productId: number): void {
    this.updateStock(productId, 100);
  }
}
```

---

### 4️⃣ Eliminar Producto con Confirmación

```typescript
export class ProductListComponent {
  private adminProductService = inject(AdminProductService);
  
  products = signal<ProductModel[]>([]);

  deleteProduct(id: number, name: string): void {
    const confirmation = confirm(
      `¿Estás seguro de eliminar "${name}"?\n\nEsta acción no se puede deshacer.`
    );

    if (!confirmation) return;

    this.adminProductService.deleteProduct(id).subscribe({
      next: (response) => {
        console.log('✅ Producto eliminado:', response);
        
        // Actualizar lista local
        this.products.update(products => 
          products.filter(p => p.id !== id)
        );
        
        alert('Producto eliminado exitosamente');
      },
      error: (err) => {
        console.error('❌ Error eliminando:', err);
        alert('Error al eliminar producto: ' + err.message);
      }
    });
  }
}
```

---

### 5️⃣ Gestión de Múltiples Imágenes

```typescript
export class ProductImagesComponent {
  private adminProductService = inject(AdminProductService);

  productId = signal(1);
  images = signal<any[]>([]);
  uploading = signal(false);

  // Cargar todas las imágenes del producto
  loadImages(): void {
    this.adminProductService.getProductImages(this.productId()).subscribe({
      next: (images) => {
        this.images.set(images);
        console.log('Imágenes cargadas:', images);
      },
      error: (err) => console.error('Error:', err)
    });
  }

  // Subir nueva imagen
  uploadImage(file: File): void {
    this.uploading.set(true);
    
    this.adminProductService.uploadProductImage(
      this.productId(), 
      file
    ).subscribe({
      next: (response) => {
        console.log('✅ Imagen subida:', response);
        this.images.update(imgs => [...imgs, response]);
        this.uploading.set(false);
      },
      error: (err) => {
        console.error('❌ Error:', err);
        this.uploading.set(false);
      }
    });
  }

  // Eliminar imagen
  deleteImage(imageId: number): void {
    if (!confirm('¿Eliminar esta imagen?')) return;

    this.adminProductService.deleteProductImage(imageId).subscribe({
      next: () => {
        console.log('✅ Imagen eliminada');
        this.images.update(imgs => imgs.filter(img => img.id !== imageId));
      },
      error: (err) => console.error('❌ Error:', err)
    });
  }
}
```

---

## 🏷️ **CATEGORÍAS**

### 1️⃣ Crear Categoría

```typescript
export class CategoryCreateComponent {
  private adminCategoryService = inject(AdminCategoryService);

  createCategory(): void {
    const categoryData: CreateCategoryDto = {
      nombre: 'Procesadores',
      descripcion: 'CPUs Intel y AMD de última generación'
    };

    this.adminCategoryService.createCategory(categoryData).subscribe({
      next: (category) => {
        console.log('✅ Categoría creada:', category);
        alert('Categoría creada exitosamente');
      },
      error: (err) => {
        console.error('❌ Error:', err);
        alert('Error al crear categoría');
      }
    });
  }
}
```

---

### 2️⃣ Actualizar Categoría

```typescript
export class CategoryEditComponent {
  private adminCategoryService = inject(AdminCategoryService);

  updateCategory(id: number): void {
    const updateData: UpdateCategoryDto = {
      nombre: 'Procesadores Gaming',
      descripcion: 'CPUs de alta gama para gaming profesional'
    };

    this.adminCategoryService.updateCategory(id, updateData).subscribe({
      next: (category) => {
        console.log('✅ Categoría actualizada:', category);
        alert('Categoría actualizada');
      },
      error: (err) => {
        console.error('❌ Error:', err);
      }
    });
  }
}
```

---

### 3️⃣ Eliminar Categoría (con validación)

```typescript
export class CategoryListComponent {
  private adminCategoryService = inject(AdminCategoryService);

  deleteCategory(id: number, name: string): void {
    // Primero validar si se puede eliminar
    this.adminCategoryService.canDeleteCategory(id).subscribe({
      next: (validation) => {
        if (!validation.canDelete) {
          alert(
            `No se puede eliminar "${name}".\n` +
            `Tiene ${validation.productsCount} productos asociados.`
          );
          return;
        }

        // Si se puede eliminar, confirmar
        if (!confirm(`¿Eliminar categoría "${name}"?`)) return;

        this.adminCategoryService.deleteCategory(id).subscribe({
          next: () => {
            console.log('✅ Categoría eliminada');
            alert('Categoría eliminada exitosamente');
          },
          error: (err) => {
            console.error('❌ Error:', err);
          }
        });
      },
      error: (err) => {
        console.error('Error validando:', err);
        // Intentar eliminar de todas formas
        this.adminCategoryService.deleteCategory(id).subscribe({
          next: () => alert('Categoría eliminada'),
          error: (e) => alert('Error: ' + e.message)
        });
      }
    });
  }
}
```

---

## 🏢 **MARCAS**

### 1️⃣ Crear Marca

```typescript
export class BrandCreateComponent {
  private adminBrandService = inject(AdminBrandService);

  createBrand(): void {
    const brandData: CreateBrandDto = {
      nombre: 'Intel'
    };

    this.adminBrandService.createBrand(brandData).subscribe({
      next: (brand) => {
        console.log('✅ Marca creada:', brand);
        alert('Marca creada exitosamente');
      },
      error: (err) => {
        console.error('❌ Error:', err);
        if (err.status === 409) {
          alert('Esta marca ya existe');
        } else {
          alert('Error al crear marca');
        }
      }
    });
  }
}
```

---

### 2️⃣ Actualizar Marca

```typescript
export class BrandEditComponent {
  private adminBrandService = inject(AdminBrandService);

  updateBrand(id: number): void {
    const updateData: UpdateBrandDto = {
      nombre: 'Intel Corporation'
    };

    this.adminBrandService.updateBrand(id, updateData).subscribe({
      next: (brand) => {
        console.log('✅ Marca actualizada:', brand);
      },
      error: (err) => {
        console.error('❌ Error:', err);
      }
    });
  }
}
```

---

### 3️⃣ Ver Estadísticas de Marca

```typescript
export class BrandStatsComponent {
  private adminBrandService = inject(AdminBrandService);

  stats = signal<any>(null);

  loadStats(brandId: number): void {
    this.adminBrandService.getBrandStats(brandId).subscribe({
      next: (stats) => {
        this.stats.set(stats);
        console.log('Estadísticas:', stats);
        // stats.totalProducts
        // stats.totalStock
        // stats.totalValue
      },
      error: (err) => {
        console.error('Error cargando stats:', err);
      }
    });
  }
}
```

---

## 🔄 **OPERACIONES EN LOTE**

### 1️⃣ Crear Múltiples Productos

```typescript
export class BulkProductCreateComponent {
  private adminProductService = inject(AdminProductService);

  products: CreateProductDto[] = [
    {
      nombre: 'RTX 4090',
      descripcion: 'GPU high-end',
      precio: 8000,
      stock: 10,
      sku: 'GPU-001',
      idMarca: 1,
      idCategoria: 2
    },
    {
      nombre: 'RTX 4080',
      descripcion: 'GPU mid-high',
      precio: 5000,
      stock: 15,
      sku: 'GPU-002',
      idMarca: 1,
      idCategoria: 2
    }
  ];

  createAll(): void {
    const requests = this.products.map(product => 
      this.adminProductService.createProduct(product)
    );

    forkJoin(requests).subscribe({
      next: (results) => {
        console.log('✅ Todos los productos creados:', results);
        alert(`${results.length} productos creados`);
      },
      error: (err) => {
        console.error('❌ Error en lote:', err);
      }
    });
  }
}
```

---

### 2️⃣ Actualizar Stock de Múltiples Productos

```typescript
export class BulkStockUpdateComponent {
  private adminProductService = inject(AdminProductService);

  stockUpdates = [
    { id: 1, stock: 50 },
    { id: 2, stock: 30 },
    { id: 3, stock: 100 }
  ];

  updateAllStock(): void {
    const requests = this.stockUpdates.map(update => 
      this.adminProductService.updateStock(update.id, update.stock)
    );

    forkJoin(requests).subscribe({
      next: (results) => {
        console.log('✅ Stock actualizado:', results);
        alert('Stock actualizado en lote');
      },
      error: (err) => {
        console.error('❌ Error:', err);
      }
    });
  }
}
```

---

## 🎯 **MANEJO DE ERRORES AVANZADO**

### 1️⃣ Error Handler Personalizado

```typescript
export class ProductFormComponent {
  private adminProductService = inject(AdminProductService);

  handleError(error: any, operation: string): void {
    console.error(`Error en ${operation}:`, error);

    let userMessage = 'Ha ocurrido un error';

    switch (error.status) {
      case 400:
        userMessage = 'Datos inválidos. Verifica el formulario.';
        break;
      case 404:
        userMessage = 'Producto no encontrado.';
        break;
      case 409:
        if (error.error?.message?.includes('SKU')) {
          userMessage = 'El SKU ya existe. Usa uno diferente.';
        } else {
          userMessage = 'Ya existe un registro similar.';
        }
        break;
      case 500:
        userMessage = 'Error del servidor. Intenta más tarde.';
        break;
      default:
        userMessage = error.error?.message || error.message;
    }

    alert(userMessage);
  }

  createProduct(data: CreateProductDto): void {
    this.adminProductService.createProduct(data).subscribe({
      next: (product) => console.log('✅ Creado:', product),
      error: (err) => this.handleError(err, 'crear producto')
    });
  }
}
```

---

### 2️⃣ Retry con Reintentos

```typescript
import { retry, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

export class RobustProductService {
  private adminProductService = inject(AdminProductService);

  createProductWithRetry(data: CreateProductDto): void {
    this.adminProductService.createProduct(data).pipe(
      retry(3), // Reintentar 3 veces
      catchError(err => {
        console.error('Error después de 3 intentos:', err);
        return of(null); // Retornar null en caso de fallo
      })
    ).subscribe({
      next: (product) => {
        if (product) {
          console.log('✅ Producto creado:', product);
        } else {
          console.log('❌ Falló después de 3 intentos');
        }
      }
    });
  }
}
```

---

## 📊 **RESUMEN DE PATRONES COMUNES**

### ✅ **Pattern 1: Create + Upload**
```typescript
createProduct() → uploadImage() → navigate()
```

### ✅ **Pattern 2: Load + Update**
```typescript
getById() → patchForm() → update() → navigate()
```

### ✅ **Pattern 3: Validate + Delete**
```typescript
canDelete() → confirm() → delete() → updateList()
```

### ✅ **Pattern 4: Bulk Operations**
```typescript
forkJoin([...requests]) → handleResults()
```

---

**¿Necesitas ayuda implementando algún componente específico?** 🚀
