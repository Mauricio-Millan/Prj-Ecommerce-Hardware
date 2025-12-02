import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PedidoService } from '../../../products/services/pedido.service';
import { PedidoModel, ItemPedidoModel } from '../../../products/models/pedido.model';
import { ProductoImagenService } from '../../../products/services/producto-imagen.service';
import { firstValueFrom } from 'rxjs';

interface ItemPedidoConImagen extends ItemPedidoModel {
  imagenUrl?: string;
}

type EstadoPedido = 'PENDIENTE' | 'PROCESANDO' | 'ENVIADO' | 'ENTREGADO' | 'CANCELADO';

@Component({
  selector: 'app-pedidos',
  imports: [CommonModule, FormsModule],
  templateUrl: './pedidos.html',
  styleUrl: './pedidos.css'
})
export class Pedidos implements OnInit {
  private pedidoService = inject(PedidoService);
  private productoImagenService = inject(ProductoImagenService);

  // Signals
  pedidos = signal<PedidoModel[]>([]);
  loading = signal<boolean>(true);
  selectedPedido = signal<PedidoModel | null>(null);
  detallesPedido = signal<ItemPedidoConImagen[]>([]);
  loadingDetalles = signal<boolean>(false);
  showDetalles = signal<boolean>(false);
  editingEstado = signal<number | null>(null);

  // Estados disponibles
  estadosDisponibles: EstadoPedido[] = [
    'PENDIENTE',
    'PROCESANDO',
    'ENVIADO',
    'ENTREGADO',
    'CANCELADO'
  ];

  async ngOnInit(): Promise<void> {
    await this.loadPedidos();
  }

  /**
   * Cargar todos los pedidos
   */
  async loadPedidos(): Promise<void> {
    try {
      this.loading.set(true);
      const pedidos = await firstValueFrom(this.pedidoService.getAllPedidos());
      // Ordenar por fecha más reciente
      const pedidosOrdenados = pedidos.sort((a, b) => 
        new Date(b.fechaPedido).getTime() - new Date(a.fechaPedido).getTime()
      );
      this.pedidos.set(pedidosOrdenados);
    } catch (error) {
      console.error('Error al cargar pedidos:', error);
      alert('Error al cargar los pedidos');
    } finally {
      this.loading.set(false);
    }
  }

  /**
   * Ver detalles de un pedido
   */
  async verDetalle(pedido: PedidoModel): Promise<void> {
    try {
      this.selectedPedido.set(pedido);
      this.loadingDetalles.set(true);
      this.showDetalles.set(true);

      const detalles = await firstValueFrom(
        this.pedidoService.getItemsByPedido(pedido.id)
      );

      // Cargar imágenes de cada producto
      const detallesConImagenes = await Promise.all(
        detalles.map(async (item) => {
          try {
            const imagenes = await firstValueFrom(
              this.productoImagenService.getImagenesByProducto(item.idProducto.id)
            );
            const imagenPrincipal = imagenes.find(img => img.esPrincipal) || imagenes[0];
            return {
              ...item,
              imagenUrl: imagenPrincipal?.urlImagen || '/assets/placeholder.png'
            };
          } catch (error) {
            return {
              ...item,
              imagenUrl: '/assets/placeholder.png'
            };
          }
        })
      );

      this.detallesPedido.set(detallesConImagenes);
    } catch (error) {
      console.error('Error al cargar detalles del pedido:', error);
      alert('Error al cargar los detalles del pedido');
    } finally {
      this.loadingDetalles.set(false);
    }
  }

  /**
   * Cambiar estado de un pedido
   */
  async cambiarEstado(pedido: PedidoModel, nuevoEstado: EstadoPedido): Promise<void> {
    try {
      const confirmed = confirm(
        `¿Está seguro de cambiar el estado del pedido #${pedido.id} a "${nuevoEstado}"?`
      );

      if (!confirmed) return;

      await firstValueFrom(
        this.pedidoService.updatePedido(pedido.id, { ...pedido, estado: nuevoEstado })
      );

      // Actualizar en la lista local
      const pedidosActualizados = this.pedidos().map(p => 
        p.id === pedido.id ? { ...p, estado: nuevoEstado } : p
      );
      this.pedidos.set(pedidosActualizados);

      // Si el modal está abierto con este pedido, actualizar también
      if (this.selectedPedido()?.id === pedido.id) {
        this.selectedPedido.set({ ...pedido, estado: nuevoEstado });
      }

      this.editingEstado.set(null);
      alert('Estado actualizado correctamente');
    } catch (error) {
      console.error('Error al cambiar estado:', error);
      alert('Error al actualizar el estado del pedido');
    }
  }

  /**
   * Cerrar modal de detalles
   */
  cerrarDetalles(): void {
    this.showDetalles.set(false);
    this.selectedPedido.set(null);
    this.detallesPedido.set([]);
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
   * Formatear fecha
   */
  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('es-PE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  /**
   * Procesar URL de imagen
   */
  getProductImage(imagePath: string | undefined): string {
    if (!imagePath) return '/assets/placeholder.png';
    if (imagePath.startsWith('http')) return imagePath;
    return `http://localhost:8080/REST-Ecommerce-Hardware${imagePath}`;
  }

  /**
   * Calcular IGV incluido
   */
  get igvIncluido(): number {
    const total = this.selectedPedido()?.montoTotal || 0;
    return total - (total / 1.18);
  }

  /**
   * Obtener clase de estado
   */
  getEstadoClass(estado: string): string {
    const estadoUpper = estado.toUpperCase();
    switch (estadoUpper) {
      case 'PENDIENTE': return 'bg-yellow-100 text-yellow-800';
      case 'PROCESANDO': return 'bg-blue-100 text-blue-800';
      case 'ENVIADO': return 'bg-purple-100 text-purple-800';
      case 'ENTREGADO': return 'bg-green-100 text-green-800';
      case 'CANCELADO': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  /**
   * Activar edición de estado
   */
  activarEdicionEstado(pedidoId: number): void {
    this.editingEstado.set(pedidoId);
  }

  /**
   * Cancelar edición de estado
   */
  cancelarEdicionEstado(): void {
    this.editingEstado.set(null);
  }
}
