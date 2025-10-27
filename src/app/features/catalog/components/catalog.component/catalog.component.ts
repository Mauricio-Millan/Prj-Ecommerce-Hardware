import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductListComponent } from '../../../products/components/product-list.component/product-list.component';
import { ProductService } from '../../../products/services/product.service';
import { CategoryService } from '../../../products/services/category.service';
import { BrandService } from '../../../products/services/brand.service';
import { ProductModel, SortOption } from '../../../products/models/product.model';
import { CategoryModel } from '../../../products/models/category.model';
import { BrandModel } from '../../../products/models/brand.model';
import { NavbarComponent } from "../../../../layout/navbar/component/navbar.component/navbar.component";

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [CommonModule, FormsModule, ProductListComponent, NavbarComponent],
  templateUrl: './catalog.component.html',
  styleUrl: './catalog.component.css'
})
export class CatalogComponent implements OnInit {
  private productService = inject(ProductService);
  private categoryService = inject(CategoryService);
  private brandService = inject(BrandService);

  // Estados
  allProducts = signal<ProductModel[]>([]);
  categories = signal<CategoryModel[]>([]);
  brands = signal<BrandModel[]>([]);
  loading = signal<boolean>(true);
  error = signal<string | null>(null);

  // Filtros
  selectedCategoryId = signal<number | null>(null);
  selectedBrandId = signal<number | null>(null);
  searchTerm = signal<string>('');
  sortOption = signal<SortOption>('nombre-asc');

  // Productos filtrados y ordenados (computed signal)
  filteredProducts = computed(() => {
    let products = this.allProducts();

    // Filtrar por categoría
    if (this.selectedCategoryId()) {
      products = products.filter(p => p.idCategoria === this.selectedCategoryId());
    }

    // Filtrar por marca
    if (this.selectedBrandId()) {
      products = products.filter(p => p.idMarca === this.selectedBrandId());
    }

    // Filtrar por búsqueda
    const search = this.searchTerm().toLowerCase();
    if (search) {
      products = products.filter(p => 
        p.nombre.toLowerCase().includes(search) ||
        p.descripcion.toLowerCase().includes(search) ||
        p.nombreCategoria.toLowerCase().includes(search) ||
        p.nombreMarca.toLowerCase().includes(search)
      );
    }

    // Ordenar
    const sort = this.sortOption();
    products = [...products].sort((a, b) => {
      switch (sort) {
        case 'nombre-asc':
          return a.nombre.localeCompare(b.nombre);
        case 'nombre-desc':
          return b.nombre.localeCompare(a.nombre);
        case 'precio-asc':
          return a.precio - b.precio;
        case 'precio-desc':
          return b.precio - a.precio;
        case 'stock-asc':
          return a.stock - b.stock;
        case 'stock-desc':
          return b.stock - a.stock;
        default:
          return 0;
      }
    });

    return products;
  });

  ngOnInit(): void {
    this.loadAll();
  }

  /**
   * Cargar productos, categorías y marcas
   */
  loadAll(): void {
    this.loading.set(true);
    this.error.set(null);

    // Cargar productos
    this.productService.getAllProducts().subscribe({
      next: (products) => {
        this.allProducts.set(products);
        console.log('✅ Productos cargados:', products.length);
      },
      error: (err) => {
        this.error.set('Error al cargar productos');
        console.error('❌ Error productos:', err);
      }
    });

    // Cargar categorías
    this.categoryService.getAllCategories().subscribe({
      next: (categories) => {
        this.categories.set(categories);
        console.log('✅ Categorías cargadas:', categories.length);
      },
      error: (err) => {
        console.error('❌ Error categorías:', err);
      }
    });

    // Cargar marcas
    this.brandService.getAllBrands().subscribe({
      next: (brands) => {
        this.brands.set(brands);
        this.loading.set(false);
        console.log('✅ Marcas cargadas:', brands.length);
      },
      error: (err) => {
        this.loading.set(false);
        console.error('❌ Error marcas:', err);
      }
    });
  }

  /**
   * Filtrar por categoría
   */
  filterByCategory(categoryId: number | null): void {
    this.selectedCategoryId.set(categoryId);
  }

  /**
   * Filtrar por marca
   */
  filterByBrand(brandId: number | null): void {
    this.selectedBrandId.set(brandId);
  }

  /**
   * Actualizar búsqueda
   */
  onSearchChange(value: string): void {
    this.searchTerm.set(value);
  }

  /**
   * Cambiar ordenamiento
   */
  onSortChange(value: SortOption): void {
    this.sortOption.set(value);
  }

  /**
   * Limpiar todos los filtros
   */
  clearFilters(): void {
    this.selectedCategoryId.set(null);
    this.selectedBrandId.set(null);
    this.searchTerm.set('');
    this.sortOption.set('nombre-asc');
  }

  /**
   * Obtener nombre de categoría seleccionada
   */
  getSelectedCategoryName(): string {
    const id = this.selectedCategoryId();
    if (!id) return '';
    return this.categories().find(c => c.id === id)?.nombre || '';
  }

  /**
   * Obtener nombre de marca seleccionada
   */
  getSelectedBrandName(): string {
    const id = this.selectedBrandId();
    if (!id) return '';
    return this.brands().find(b => b.id === id)?.nombre || '';
  }
}
