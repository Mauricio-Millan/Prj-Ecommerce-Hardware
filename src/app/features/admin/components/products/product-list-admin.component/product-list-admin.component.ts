import { Component, signal, inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../../products/services/product.service';
import { AdminProductService } from '../../../services/admin-product.service';
import { ProductModel } from '../../../../products/models/product.model';

@Component({
  selector: 'app-product-list-admin',
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './product-list-admin.component.html',
  styleUrl: './product-list-admin.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductListAdminComponent implements OnInit {
  private productService = inject(ProductService);
  private adminProductService = inject(AdminProductService);

  products = signal<ProductModel[]>([]);
  filteredProducts = signal<ProductModel[]>([]);
  loading = signal(true);
  searchTerm = signal('');

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading.set(true);
    this.productService.getAllProducts().subscribe({
      next: (data) => {
        this.products.set(data);
        this.filteredProducts.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error cargando productos:', err);
        this.loading.set(false);
      }
    });
  }

  onSearchChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const term = input.value.toLowerCase();
    this.searchTerm.set(term);

    if (!term) {
      this.filteredProducts.set(this.products());
      return;
    }

    const filtered = this.products().filter(p =>
      p.nombre.toLowerCase().includes(term) ||
      p.descripcion.toLowerCase().includes(term) ||
      p.sku.toLowerCase().includes(term) ||
      p.nombreCategoria.toLowerCase().includes(term) ||
      p.nombreMarca.toLowerCase().includes(term)
    );
    this.filteredProducts.set(filtered);
  }

  deleteProduct(id: number, name: string): void {
    if (!confirm(`¿Estás seguro de eliminar "${name}"?\n\nEsta acción no se puede deshacer.`)) {
      return;
    }

    this.adminProductService.deleteProduct(id).subscribe({
      next: () => {
        console.log('✅ Producto eliminado');
        this.loadProducts();
      },
      error: (err) => {
        console.error('❌ Error eliminando producto:', err);
        alert('Error al eliminar producto: ' + (err.error?.message || err.message));
      }
    });
  }

  getImageUrl(imagenPortada: string): string {
    return this.productService.getImageUrl(imagenPortada);
  }
}
