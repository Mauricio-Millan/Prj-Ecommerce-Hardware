import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CarritoService } from '../../../products/services/carrito.service';
import { CarritoStateService } from '../../../products/services/carrito-state.service';
import { ProductService } from '../../../products/services/product.service';
import { LoginService } from '../../../auth/services/login.service';
import { ItemCarritoModel, CarritoModel } from '../../../products/models/carrito.model';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './carrito.component.html',
  styleUrl: './carrito.component.css'
})
export class CarritoComponent implements OnInit {
  private carritoService = inject(CarritoService);
  private carritoStateService = inject(CarritoStateService);
  private productService = inject(ProductService);
  private loginService = inject(LoginService);
  private router = inject(Router);

  // Estado
  carrito = signal<CarritoModel | null>(null);
  items = signal<ItemCarritoModel[]>([]);
  loading = signal<boolean>(true);
  error = signal<string | null>(null);

  // Usuario actual
  get currentUser() {
    return this.loginService.currentUser();
  }

  get isLoggedIn() {
    return this.loginService.isLoggedIn();
  }

  // Calcular total solo de items seleccionados
  get total(): number {
    return this.items().reduce((sum, item) => {
      if (item.selected) {
        return sum + item.subtotal;
      }
      return sum;
    }, 0);
  }

  // Contar items seleccionados
  get selectedItemsCount(): number {
    return this.items().filter(item => item.selected).length;
  }

  // Verificar si todos están seleccionados
  get allSelected(): boolean {
    return this.items().length > 0 && this.items().every(item => item.selected);
  }

  ngOnInit(): void {
    if (!this.isLoggedIn || !this.currentUser) {
      this.router.navigate(['/login']);
      return;
    }
    this.loadCarrito();
  }

  /**
   * Cargar el carrito del usuario
   */
  async loadCarrito(): Promise<void> {
    this.loading.set(true);
    this.error.set(null);

    try {
      const usuarioId = this.currentUser!.id;
      console.log('🛒 Cargando carrito del usuario:', usuarioId);

      // 1. Obtener el carrito del usuario
      const carrito = await firstValueFrom(this.carritoService.getCarritoByUsuario(usuarioId));

      if (!carrito) {
        console.log('ℹ️ Usuario no tiene carrito todavía');
        this.items.set([]);
        this.loading.set(false);
        return;
      }

      this.carrito.set(carrito);
      console.log('✅ Carrito encontrado:', carrito);

      // 2. Obtener los items del carrito
      const items = await firstValueFrom(this.carritoService.getItemsByCarrito(carrito.id));
      console.log('✅ Items del carrito:', items);
      
      // Marcar todos los items como seleccionados por defecto
      const itemsWithSelection = items.map(item => ({ ...item, selected: true }));
      this.items.set(itemsWithSelection);
    } catch (error) {
      console.error('❌ Error al cargar carrito:', error);
      this.error.set('Error al cargar el carrito. Intenta de nuevo.');
    } finally {
      this.loading.set(false);
    }
  }

  /**
   * Obtener URL de imagen del producto
   */
  getProductImage(urlImagen?: string): string {
    if (!urlImagen) {
      return 'assets/placeholders/product-placeholder.png';
    }
    return this.productService.getImageUrl(urlImagen);
  }

  /**
   * Toggle selección de un item
   */
  toggleItemSelection(item: ItemCarritoModel): void {
    this.items.update(items =>
      items.map(i => i.id === item.id ? { ...i, selected: !i.selected } : i)
    );
  }

  /**
   * Seleccionar/Deseleccionar todos los items
   */
  toggleAllSelection(): void {
    const newValue = !this.allSelected;
    this.items.update(items =>
      items.map(item => ({ ...item, selected: newValue }))
    );
  }

  /**
   * Formatear precio
   */
  formatPrice(price: number): string {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN'
    }).format(price);
  }

  /**
   * Actualizar cantidad de un item
   */
  async updateQuantity(item: ItemCarritoModel, newQuantity: number): Promise<void> {
    if (newQuantity < 1) return;

    try {
      await firstValueFrom(this.carritoService.updateItemQuantity(item.id, newQuantity));
      
      // Actualizar localmente con nuevo subtotal
      this.items.update(items => 
        items.map(i => {
          if (i.id === item.id) {
            const nuevoSubtotal = i.precioProducto * newQuantity;
            return { ...i, cantidad: newQuantity, subtotal: nuevoSubtotal };
          }
          return i;
        })
      );
      
      console.log('✅ Cantidad actualizada');
    } catch (error) {
      console.error('❌ Error al actualizar cantidad:', error);
      alert('Error al actualizar la cantidad');
    }
  }

  /**
   * Incrementar cantidad
   */
  increaseQuantity(item: ItemCarritoModel): void {
    const maxStock = item.stockProducto || 999;
    if (item.cantidad < maxStock) {
      this.updateQuantity(item, item.cantidad + 1);
    }
  }

  /**
   * Decrementar cantidad
   */
  decreaseQuantity(item: ItemCarritoModel): void {
    if (item.cantidad > 1) {
      this.updateQuantity(item, item.cantidad - 1);
    }
  }

  /**
   * Eliminar item del carrito
   */
  async removeItem(item: ItemCarritoModel): Promise<void> {
    if (!confirm(`¿Eliminar ${item.nombreProducto} del carrito?`)) {
      return;
    }

    try {
      await firstValueFrom(this.carritoService.removeItemFromCarrito(item.id));
      
      // Actualizar localmente
      this.items.update(items => items.filter(i => i.id !== item.id));
      
      console.log('✅ Item eliminado');
    } catch (error) {
      console.error('❌ Error al eliminar item:', error);
      alert('Error al eliminar el producto');
    }
  }

  /**
   * Vaciar todo el carrito
   */
  async clearCarrito(): Promise<void> {
    if (!confirm('¿Estás seguro de vaciar todo el carrito?')) {
      return;
    }

    const carrito = this.carrito();
    if (!carrito) return;

    try {
      await firstValueFrom(this.carritoService.clearCarrito(carrito.id));
      
      this.items.set([]);
      this.carrito.set(null);
      
      console.log('✅ Carrito vaciado');
    } catch (error) {
      console.error('❌ Error al vaciar carrito:', error);
      alert('Error al vaciar el carrito');
    }
  }

  /**
   * Ir al checkout
   */
  proceedToCheckout(): void {
    const selectedItems = this.items().filter(item => item.selected);
    
    if (selectedItems.length === 0) {
      alert('Por favor selecciona al menos un producto para continuar');
      return;
    }
    
    // Guardar items seleccionados en el servicio compartido
    this.carritoStateService.setSelectedItems(selectedItems);
    
    // Navegar a la página de pago
    this.router.navigate(['/pago']);
  }
}
