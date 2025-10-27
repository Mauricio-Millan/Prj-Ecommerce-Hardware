import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductModel } from '../../models/product.model';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css'
})
export class ProductCardComponent {
  private productService = inject(ProductService);

  @Input({ required: true }) product!: ProductModel;
  @Output() addToCart = new EventEmitter<ProductModel>();

  /**
   * Obtener URL completa de la imagen del producto
   */
  getProductImage(): string {
    return this.productService.getImageUrl(this.product.imagenPortada);
  }

  /**
   * Formatear precio con separador de miles
   */
  formatPrice(price: number): string {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN'
    }).format(price);
  }

  /**
   * Emitir evento para agregar al carrito
   */
  onAddToCart(): void {
    if (this.product.stock > 0) {
      this.addToCart.emit(this.product);
    }
  }
}
