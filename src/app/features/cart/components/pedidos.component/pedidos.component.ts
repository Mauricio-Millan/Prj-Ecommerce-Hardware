import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PedidoService } from '../../../products/services/pedido.service';
import { LoginService } from '../../../auth/services/login.service';
import { ProductoImagenService } from '../../../products/services/producto-imagen.service';
import { PedidoModel, ItemPedidoModel } from '../../../products/models/pedido.model';
import { ProductoImagenModel } from '../../../products/models/producto-imagen.model';
import { firstValueFrom } from 'rxjs';

interface ItemPedidoConImagen extends ItemPedidoModel {
  imagenUrl?: string;
}

@Component({
  selector: 'app-pedidos.component',
  imports: [CommonModule],
  templateUrl: './pedidos.component.html',
  styleUrl: './pedidos.component.css'
})
export class PedidosComponent implements OnInit {
  private pedidoService = inject(PedidoService);
  private loginService = inject(LoginService);
  private productoImagenService = inject(ProductoImagenService);
  private router = inject(Router);

  // Signals
  pedidos = signal<PedidoModel[]>([]);
  loading = signal<boolean>(true);
  isLoggedIn = signal<boolean>(false);
  selectedPedido = signal<PedidoModel | null>(null);
  detallesPedido = signal<ItemPedidoConImagen[]>([]);
  loadingDetalles = signal<boolean>(false);
  showDetalles = signal<boolean>(false);

  async ngOnInit(): Promise<void> {
    // Verificar si el usuario está logueado
    const usuario = this.loginService.getCurrentUser();
    this.isLoggedIn.set(!!usuario);

    if (!usuario) {
      this.loading.set(false);
      return;
    }

    // Cargar pedidos del usuario
    await this.loadPedidos(usuario.id);
  }

  /**
   * Cargar pedidos del usuario
   */
  async loadPedidos(usuarioId: number): Promise<void> {
    try {
      this.loading.set(true);
      const pedidos = await firstValueFrom(
        this.pedidoService.getPedidosByUsuario(usuarioId)
      );
      this.pedidos.set(pedidos);
    } catch (error) {
      console.error('Error al cargar pedidos:', error);
      alert('Error al cargar tus pedidos');
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

      // Obtener items del pedido
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
            console.warn(`No se pudo cargar imagen del producto ${item.idProducto.id}`);
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
   * Cerrar modal de detalles
   */
  cerrarDetalles(): void {
    this.showDetalles.set(false);
    this.selectedPedido.set(null);
    this.detallesPedido.set([]);
  }

  /**
   * Ir a login
   */
  irALogin(): void {
    this.router.navigate(['/login']);
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
   * Calcular subtotal del pedido en detalles
   */
  get subtotalDetalles(): number {
    return this.detallesPedido().reduce(
      (sum, item) => sum + (item.precioUnitario * item.cantidad),
      0
    );
  }

  /**
   * Calcular IGV incluido en el precio
   */
  get igvIncluido(): number {
    const total = this.selectedPedido()?.montoTotal || 0;
    // IGV incluido: total - (total / 1.18)
    return total - (total / 1.18);
  }

  /**
   * Procesar URL de imagen del producto
   */
  getProductImage(imagePath: string | undefined): string {
    if (!imagePath) return '/assets/placeholder.png';
    // Si la URL ya es completa (empieza con http), usarla tal cual
    if (imagePath.startsWith('http')) return imagePath;
    // Si no, construir la URL completa
    return `http://localhost:8080/REST-Ecommerce-Hardware${imagePath}`;
  }

  /**
   * Obtener clase de estado
   */
  getEstadoClass(estado: string): string {
    const estadoLower = estado.toLowerCase();
    if (estadoLower.includes('pendiente')) return 'bg-yellow-100 text-yellow-800';
    if (estadoLower.includes('procesando')) return 'bg-blue-100 text-blue-800';
    if (estadoLower.includes('enviado')) return 'bg-purple-100 text-purple-800';
    if (estadoLower.includes('entregado')) return 'bg-green-100 text-green-800';
    if (estadoLower.includes('cancelado')) return 'bg-red-100 text-red-800';
    return 'bg-gray-100 text-gray-800';
  }
}
