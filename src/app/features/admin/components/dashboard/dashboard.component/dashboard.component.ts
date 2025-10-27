import { Component, signal, inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../../../products/services/product.service';
import { CategoryService } from '../../../../products/services/category.service';
import { BrandService } from '../../../../products/services/brand.service';
import { forkJoin } from 'rxjs';

interface StatCard {
  icon: string;
  label: string;
  value: number;
  color: string;
  change?: string;
  bgColor?: string;
}

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent implements OnInit {
  private productService = inject(ProductService);
  private categoryService = inject(CategoryService);
  private brandService = inject(BrandService);

  loading = signal(true);
  stats = signal<StatCard[]>([]);

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    forkJoin({
      products: this.productService.getAllProducts(),
      categories: this.categoryService.getAllCategories(),
      brands: this.brandService.getAllBrands()
    }).subscribe({
      next: (data) => {
        const productsOutOfStock = data.products.filter(p => p.stock === 0).length;
        const totalStock = data.products.reduce((sum, p) => sum + p.stock, 0);
        const totalValue = data.products.reduce((sum, p) => sum + (p.precio * p.stock), 0);

        this.stats.set([
          {
            icon: '📦',
            label: 'Total Productos',
            value: data.products.length,
            color: 'text-blue-600',
            bgColor: 'bg-blue-500',
            change: '+12%'
          },
          {
            icon: '🏷️',
            label: 'Categorías',
            value: data.categories.length,
            color: 'text-green-600',
            bgColor: 'bg-green-500'
          },
          {
            icon: '🏢',
            label: 'Marcas',
            value: data.brands.length,
            color: 'text-purple-600',
            bgColor: 'bg-purple-500'
          },
          {
            icon: '⚠️',
            label: 'Productos Agotados',
            value: productsOutOfStock,
            color: 'text-red-600',
            bgColor: 'bg-red-500',
            change: '-5%'
          },
          {
            icon: '📊',
            label: 'Stock Total',
            value: totalStock,
            color: 'text-indigo-600',
            bgColor: 'bg-indigo-500'
          },
          {
            icon: '💰',
            label: 'Valor Inventario',
            value: totalValue,
            color: 'text-yellow-600',
            bgColor: 'bg-yellow-500'
          }
        ]);

        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error cargando dashboard:', err);
        this.loading.set(false);
      }
    });
  }
}
