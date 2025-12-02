import { Component, ChangeDetectionStrategy, ElementRef, OnInit, ViewChild, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BannerComponent } from '../Banner/banner.component/banner.component';
import { BrandComponent } from '../brand/brand.component/brand.component';
import { ProductCardComponent } from '../../features/products/components/product-card.component/product-card.component';
import { ProductService } from '../../features/products/services/product.service';
import { ProductModel } from '../../features/products/models/product.model';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-home',
  imports: [CommonModule, BannerComponent, BrandComponent, ProductCardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements OnInit {
  private productService = inject(ProductService);

  @ViewChild('productCarousel') productCarousel?: ElementRef<HTMLDivElement>;

  productosDestacados = signal<ProductModel[]>([]);
  loadingProductos = signal<boolean>(false);
  errorProductos = signal<string | null>(null);

  async ngOnInit(): Promise<void> {
    await this.loadFeaturedProducts();
  }

  private async loadFeaturedProducts(): Promise<void> {
    this.loadingProductos.set(true);
    this.errorProductos.set(null);

    try {
      const productos = await firstValueFrom(this.productService.getAllProducts());
      if (!productos || productos.length === 0) {
        this.productosDestacados.set([]);
        return;
      }

      const aleatorios = [...productos]
        .sort(() => Math.random() - 0.5)
        .slice(0, 10);

      this.productosDestacados.set(aleatorios);
    } catch (error) {
      console.error('Error al cargar productos destacados:', error);
      this.errorProductos.set('No se pudieron cargar los productos destacados.');
    } finally {
      this.loadingProductos.set(false);
    }
  }

  scrollCarousel(direction: 'left' | 'right'): void {
    const container = this.productCarousel?.nativeElement;
    if (!container) return;

    const scrollAmount = 320;
    container.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    });
  }

}
