import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../enviroment/enviroment';
import { PedidoModel, CreatePedidoDto, ItemPedidoModel, CreateItemPedidoDto } from '../models/pedido.model';

@Injectable({
  providedIn: 'root'
})
export class PedidoService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/pedidos`;
  private itemsApiUrl = `${environment.apiUrl}/items-pedido`;

  /**
   * Crear un nuevo pedido
   * POST /api/pedidos
   */
  createPedido(pedido: CreatePedidoDto): Observable<PedidoModel> {
    return this.http.post<PedidoModel>(this.apiUrl, pedido);
  }

  /**
   * Obtener pedido por ID
   * GET /api/pedidos/{id}
   */
  getPedidoById(id: number): Observable<PedidoModel> {
    return this.http.get<PedidoModel>(`${this.apiUrl}/${id}`);
  }

  /**
   * Obtener pedidos de un usuario
   * GET /api/pedidos/usuario/{usuarioId}
   */
  getPedidosByUsuario(usuarioId: number): Observable<PedidoModel[]> {
    return this.http.get<PedidoModel[]>(`${this.apiUrl}/usuario/${usuarioId}`);
  }

  /**
   * Obtener todos los pedidos (Admin)
   * GET /api/pedidos
   */
  getAllPedidos(): Observable<PedidoModel[]> {
    return this.http.get<PedidoModel[]>(this.apiUrl);
  }

  /**
   * Actualizar un pedido
   * PUT /api/pedidos/{id}
   */
  updatePedido(id: number, pedido: Partial<PedidoModel>): Observable<PedidoModel> {
    return this.http.put<PedidoModel>(`${this.apiUrl}/${id}`, pedido);
  }

  /**
   * Crear un item de pedido
   * POST /api/items-pedido
   */
  createItemPedido(item: CreateItemPedidoDto): Observable<ItemPedidoModel> {
    return this.http.post<ItemPedidoModel>(this.itemsApiUrl, item);
  }

  /**
   * Obtener items de un pedido
   * GET /api/items-pedido/pedido/{pedidoId}
   */
  getItemsByPedido(pedidoId: number): Observable<ItemPedidoModel[]> {
    return this.http.get<ItemPedidoModel[]>(`${this.itemsApiUrl}/pedido/${pedidoId}`);
  }

  /**
   * Crear un pedido completo con sus items
   * Proceso en dos pasos: 1) Crear pedido, 2) Crear items
   */
  async createPedidoCompleto(
    pedidoData: CreatePedidoDto,
    items: CreateItemPedidoDto[]
  ): Promise<PedidoModel> {
    try {
      // 1. Crear el pedido
      const pedidoCreado = await this.createPedido(pedidoData).toPromise();
      
      if (!pedidoCreado) {
        throw new Error('No se pudo crear el pedido');
      }

      // 2. Crear los items del pedido
      const itemsPromises = items.map(item => {
        const itemConPedido: CreateItemPedidoDto = {
          ...item,
          idPedido: { id: pedidoCreado.id }
        };
        return this.createItemPedido(itemConPedido).toPromise();
      });

      await Promise.all(itemsPromises);

      console.log('✅ Pedido completo creado:', pedidoCreado.id);
      return pedidoCreado;
    } catch (error) {
      console.error('❌ Error al crear pedido completo:', error);
      throw error;
    }
  }
}
