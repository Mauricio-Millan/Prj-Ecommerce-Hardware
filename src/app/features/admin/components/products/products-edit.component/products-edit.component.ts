import { Component, signal, computed, inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AdminProductService } from '../../../services/admin-product.service';
import { ProductService } from '../../../../products/services/product.service';
import { CategoryService } from '../../../../products/services/category.service';
import { BrandService } from '../../../../products/services/brand.service';
import { CategoryModel } from '../../../../products/models/category.model';
import { BrandModel } from '../../../../products/models/brand.model';
import { ProductImage } from '../../../models/admin.model';
import { forkJoin } from 'rxjs';

interface ImageItem {
  id?: number;                    // ID si ya existe en BD
  file?: File;                    // Archivo si es nueva
  preview: string;                // URL de preview
  orden: number;                  // Orden de visualización
  uploading?: boolean;            // Estado de carga
  idProducto?: { id: number };    // 🆕 Relación con producto
  urlImagen?: string;             // 🆕 URL de la imagen en servidor
}

@Component({
  selector: 'app-product-form',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './products-edit.component.html',
  styleUrl: './products-edit.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductsEditComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private adminProductService = inject(AdminProductService);
  private productService = inject(ProductService);
  private categoryService = inject(CategoryService);
  private brandService = inject(BrandService);

  productForm!: FormGroup;
  categories = signal<CategoryModel[]>([]);
  brands = signal<BrandModel[]>([]);
  loading = signal(false);
  submitting = signal(false);
  
  // 🆕 Gestión de múltiples imágenes
  images = signal<ImageItem[]>([]);
  deletedImageIds = signal<number[]>([]);  // 🆕 IDs de imágenes eliminadas
  draggedIndex = signal<number | null>(null);
  
  isEditMode = computed(() => !!this.route.snapshot.params['id']);
  productId = computed(() => Number(this.route.snapshot.params['id']));

  ngOnInit(): void {
    this.initForm();
    this.loadFormData();
  }

  initForm(): void {
    this.productForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      descripcion: ['', [Validators.required, Validators.minLength(10)]],
      precio: [0, [Validators.required, Validators.min(0)]],
      stock: [0, [Validators.required, Validators.min(0)]],
      sku: ['', [Validators.required, Validators.pattern(/^[A-Z0-9-]+$/)]],
      idCategoria: [null, Validators.required],
      idMarca: [null, Validators.required]
    });
  }

  loadFormData(): void {
    this.loading.set(true);

    const requests: any = {
      categories: this.categoryService.getAllCategories(),
      brands: this.brandService.getAllBrands()
    };

    if (this.isEditMode()) {
      requests.product = this.adminProductService.getProductById(this.productId());
      requests.images = this.adminProductService.getProductImagesOrdered(this.productId());
    }

    forkJoin(requests).subscribe({
      next: (data: any) => {
        this.categories.set(data.categories);
        this.brands.set(data.brands);

        if (this.isEditMode() && data.product) {
          // ✅ Pre-seleccionar categoría y marca
          this.productForm.patchValue({
            nombre: data.product.nombre,
            descripcion: data.product.descripcion,
            precio: data.product.precio,
            stock: data.product.stock,
            sku: data.product.sku,
            idCategoria: data.product.idCategoria?.id || data.product.idCategoria,
            idMarca: data.product.idMarca?.id || data.product.idMarca
          });

          // ✅ Cargar imágenes existentes
          if (data.images && data.images.length > 0) {
            const existingImages: ImageItem[] = data.images.map((img: ProductImage) => ({
              id: img.id,
              preview: this.getFullImageUrl(img.urlImagen), // 🔧 URL completa del backend
              orden: img.orden,
              idProducto: img.idProducto,                   // 🆕 Guardar relación
              urlImagen: img.urlImagen                      // 🆕 Guardar URL original
            }));
            this.images.set(existingImages);
          }
        }

        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error cargando datos:', err);
        this.loading.set(false);
        alert('Error al cargar datos del formulario');
      }
    });
  }

  // ============================================
  // 🆕 GESTIÓN DE MÚLTIPLES IMÁGENES
  // ============================================

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files) return;

    const files = Array.from(input.files);
    const currentImages = this.images();

    files.forEach(file => {
      // Validar imagen
      const validation = this.adminProductService.validateImageFile(file);
      if (!validation.valid) {
        alert(`${file.name}: ${validation.error}`);
        return;
      }

      // Crear preview
      const reader = new FileReader();
      reader.onload = (e) => {
        const newImage: ImageItem = {
          file: file,
          preview: e.target?.result as string,
          orden: currentImages.length + 1,
          uploading: false
        };
        this.images.set([...this.images(), newImage]);
      };
      reader.readAsDataURL(file);
    });

    input.value = ''; // Limpiar input para permitir re-selección
  }

  removeImage(index: number): void {
    const imageToRemove = this.images()[index];
    
    if (imageToRemove.id) {
      // 🔧 Si tiene ID, marcar para eliminar después (NO eliminar ahora)
      if (confirm('¿Eliminar esta imagen del producto?')) {
        // Agregar ID a la lista de eliminados
        this.deletedImageIds.set([...this.deletedImageIds(), imageToRemove.id]);
        
        // Remover del array local
        const updated = this.images().filter((_, i) => i !== index);
        this.reorderImages(updated);
      }
    } else {
      // Si no tiene ID (imagen nueva no guardada), solo remover del array
      const updated = this.images().filter((_, i) => i !== index);
      this.reorderImages(updated);
    }
  }

  // Drag & Drop
  onDragStart(index: number): void {
    this.draggedIndex.set(index);
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  onDrop(event: DragEvent, dropIndex: number): void {
    event.preventDefault();
    const dragIndex = this.draggedIndex();
    
    if (dragIndex === null || dragIndex === dropIndex) return;

    const items = [...this.images()];
    const [draggedItem] = items.splice(dragIndex, 1);
    items.splice(dropIndex, 0, draggedItem);
    
    this.reorderImages(items);
    this.draggedIndex.set(null);
  }

  private reorderImages(items: ImageItem[]): void {
    const reordered = items.map((img, index) => ({
      ...img,
      orden: index + 1
    }));
    this.images.set(reordered);

    // Actualizar orden en servidor para imágenes existentes
    reordered.forEach(img => {
      if (img.id && img.idProducto && img.urlImagen) {
        // Solo necesitamos el id y el nuevo orden para el PATCH
        this.adminProductService.updateImageOrder(img.id, img.orden).subscribe({
          error: (err) => console.error('Error actualizando orden:', err)
        });
      }
    });
  }

  onSubmit(): void {
    if (this.productForm.invalid) {
      Object.keys(this.productForm.controls).forEach(key => {
        this.productForm.controls[key].markAsTouched();
      });
      return;
    }

    this.submitting.set(true);
    const formValue = this.productForm.value;

    // ⚠️ Transformar datos: el backend espera objetos anidados para FK
    const productData = {
      nombre: formValue.nombre,
      descripcion: formValue.descripcion,
      precio: formValue.precio,
      stock: formValue.stock,
      sku: formValue.sku,
      idMarca: { id: formValue.idMarca },      // 🔧 Convertir a objeto
      idCategoria: { id: formValue.idCategoria } // 🔧 Convertir a objeto
    };

    if (this.isEditMode()) {
      // Actualizar producto existente
      this.adminProductService.updateProduct(this.productId(), productData).subscribe({
        next: (product) => {
          console.log('✅ Producto actualizado:', product);
          
          // 🔧 Procesar TODAS las operaciones de imágenes (crear, eliminar, actualizar)
          this.processImages(product.id);
        },
        error: (err) => {
          console.error('❌ Error actualizando producto:', err);
          this.submitting.set(false);
          alert('Error: ' + (err.error?.message || err.message));
        }
      });
    } else {
      // Crear nuevo producto
      this.adminProductService.createProduct(productData).subscribe({
        next: (product) => {
          console.log('✅ Producto creado:', product);
          
          // 🔧 Procesar TODAS las operaciones de imágenes (solo subir nuevas)
          this.processImages(product.id);
        },
        error: (err) => {
          console.error('❌ Error creando producto:', err);
          this.submitting.set(false);
          alert('Error: ' + (err.error?.message || err.message));
        }
      });
    }
  }

  // 🆕 Procesar todas las operaciones de imágenes (crear, eliminar, actualizar orden)
  processImages(productId: number): void {
    const deletedIds = this.deletedImageIds();
    const newImages = this.images().filter(img => img.file);
    const existingImages = this.images().filter(img => img.id && !img.file);

    // Contadores para tracking
    let operations = {
      deleted: 0,
      uploaded: 0,
      updated: 0,
      failed: 0,
      total: deletedIds.length + newImages.length + existingImages.length
    };

    // Si no hay operaciones, finalizar
    if (operations.total === 0) {
      this.submitting.set(false);
      this.router.navigate(['/admin/productos']);
      return;
    }

    // 1️⃣ ELIMINAR imágenes marcadas
    deletedIds.forEach(id => {
      this.adminProductService.deleteProductImageOrdered(id).subscribe({
        next: () => {
          console.log(`✅ Imagen ${id} eliminada`);
          operations.deleted++;
          this.checkCompletion(operations);
        },
        error: (err) => {
          console.error(`❌ Error eliminando imagen ${id}:`, err);
          operations.failed++;
          this.checkCompletion(operations);
        }
      });
    });

    // 2️⃣ SUBIR imágenes nuevas
    newImages.forEach((img, index) => {
      img.uploading = true;
      
      this.adminProductService.uploadProductImageNew(productId, img.file!, img.orden).subscribe({
        next: (imageRecord) => {
          console.log(`✅ Imagen nueva ${index + 1} subida:`, imageRecord);
          operations.uploaded++;
          this.checkCompletion(operations);
        },
        error: (err) => {
          console.error(`❌ Error subiendo imagen ${index + 1}:`, err);
          operations.failed++;
          this.checkCompletion(operations);
        }
      });
    });

    // 3️⃣ ACTUALIZAR orden de imágenes existentes
    existingImages.forEach(img => {
      if (img.id && img.idProducto && img.urlImagen) {
        // Solo necesitamos el id y el nuevo orden para el PATCH
        this.adminProductService.updateImageOrder(img.id, img.orden).subscribe({
          next: () => {
            console.log(`✅ Orden actualizado para imagen ${img.id}`);
            operations.updated++;
            this.checkCompletion(operations);
          },
          error: (err) => {
            console.error(`❌ Error actualizando orden:`, err);
            operations.failed++;
            this.checkCompletion(operations);
          }
        });
      }
    });
  }

  private checkCompletion(operations: any): void {
    const completed = operations.deleted + operations.uploaded + operations.updated + operations.failed;
    
    if (completed === operations.total) {
      this.submitting.set(false);
      
      if (operations.failed > 0) {
        alert(`Producto guardado.\n✅ ${operations.deleted} eliminadas, ${operations.uploaded} subidas, ${operations.updated} actualizadas.\n❌ ${operations.failed} fallaron.`);
      }
      
      this.router.navigate(['/admin/productos']);
    }
  }

  cancel(): void {
    this.router.navigate(['/admin/productos']);
  }

  // ============================================
  // 🔧 HELPERS
  // ============================================

  /**
   * Construir URL completa de imagen desde el backend
   * Las URLs vienen como "/uploads/..." y necesitan el prefijo del servidor
   */
  private getFullImageUrl(imagePath: string): string {
    if (!imagePath) return '';
    
    // Si ya es una URL completa, retornarla tal cual
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    
    // Construir URL completa con el backend
    // Remover la barra inicial si existe para evitar doble barra
    const path = imagePath.startsWith('/') ? imagePath.substring(1) : imagePath;
    return `http://localhost:8080/REST-Ecommerce-Hardware/${path}`;
  }
}

