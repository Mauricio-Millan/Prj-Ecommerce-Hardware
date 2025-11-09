import { Component, Input, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductModel } from '../../models/product.model';
import { ProductService } from '../../services/product.service';
import { CarritoService } from '../../services/carrito.service';
import { LoginService } from '../../../auth/services/login.service';
import { CreateCarritoDto, CreateItemCarritoDto } from '../../models/carrito.model';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css'
})
export class ProductCardComponent {
  private productService = inject(ProductService);
  private carritoService = inject(CarritoService);
  private loginService = inject(LoginService);

  @Input({ required: true }) product!: ProductModel;
  
  // Estado
  adding = signal<boolean>(false);

  /**
   * Obtener usuario actual
   */
  get currentUser() {
    return this.loginService.currentUser();
  }

  get isLoggedIn() {
    return this.loginService.isLoggedIn();
  }

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
   * Agregar producto al carrito
   */
  async onAddToCart(): Promise<void> {
    // Validar que el producto tenga stock
    if (this.product.stock === 0) {
      alert('Este producto está agotado');
      return;
    }

    // Validar que el usuario esté logueado
    if (!this.isLoggedIn || !this.currentUser) {
      alert('Debes iniciar sesión para agregar productos al carrito');
      return;
    }

    this.adding.set(true);

    try {
      // Obtener usuario actual del signal
      const user = this.currentUser;
      console.log('👤 Usuario actual completo:', user);
      console.log('👤 Tipo de usuario:', typeof user);
      console.log('👤 Usuario es null?:', user === null);
      
      if (!user || !user.id) {
        alert('❌ Error: No se pudo obtener el usuario. Intenta iniciar sesión nuevamente.');
        this.adding.set(false);
        return;
      }
      
      const usuarioId = user.id;
      console.log('🆔 ID del usuario:', usuarioId);

      // 1. Verificar si el usuario tiene un carrito
      let carrito = await firstValueFrom(this.carritoService.getCarritoByUsuario(usuarioId));

      // 2. Si no tiene carrito, crear uno
      if (!carrito) {
        console.log('🛒 Creando nuevo carrito para usuario ID:', usuarioId);
        const createCarritoDto: CreateCarritoDto = {
          idUsuario: { id: usuarioId }
        };
        console.log('📦 DTO de creación:', JSON.stringify(createCarritoDto));
        carrito = await firstValueFrom(this.carritoService.createCarrito(createCarritoDto));
        console.log('✅ Carrito creado:', carrito);
      }

      // 3. Agregar el producto al carrito
      const createItemDto: CreateItemCarritoDto = {
        idCarrito: { id: carrito.id },
        idProducto: { id: this.product.id },
        cantidad: 1
      };

      await firstValueFrom(this.carritoService.addItemToCarrito(createItemDto));

      alert('✅ Producto agregado al carrito');
    } catch (error) {
      console.error('Error al agregar producto al carrito:', error);
      alert('❌ Error al agregar el producto al carrito. Intenta de nuevo.');
    } finally {
      this.adding.set(false);
    }
  }
}
