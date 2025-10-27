import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductCardComponent } from '../product-card.component/product-card.component';
import { ProductModel } from '../../models/product.model';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, ProductCardComponent],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent {
  @Input({ required: true }) products: ProductModel[] = [];
  @Input() loading: boolean = false;

  /**
   * Manejar evento de agregar al carrito
   */
  onAddToCart(product: ProductModel): void {
    console.log('🛒 Agregar al carrito:', product);
    // TODO: Implementar lógica del carrito
  }
}
