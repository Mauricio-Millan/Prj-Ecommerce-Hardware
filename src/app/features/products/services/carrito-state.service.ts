import { Injectable, signal } from '@angular/core';
import { ItemCarritoModel } from '../models/carrito.model';

/**
 * Servicio para compartir estado del carrito entre componentes
 */
@Injectable({
  providedIn: 'root'
})
export class CarritoStateService {
  // Items seleccionados para checkout
  private selectedItemsForCheckout = signal<ItemCarritoModel[]>([]);

  /**
   * Establecer items seleccionados para el checkout
   */
  setSelectedItems(items: ItemCarritoModel[]): void {
    this.selectedItemsForCheckout.set(items);
    console.log('🔄 Items guardados para checkout:', items.length);
  }

  /**
   * Obtener items seleccionados para el checkout
   */
  getSelectedItems(): ItemCarritoModel[] {
    return this.selectedItemsForCheckout();
  }

  /**
   * Limpiar items seleccionados
   */
  clearSelectedItems(): void {
    this.selectedItemsForCheckout.set([]);
  }

  /**
   * Verificar si hay items seleccionados
   */
  hasSelectedItems(): boolean {
    return this.selectedItemsForCheckout().length > 0;
  }
}
