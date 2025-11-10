/**
 * Modelos para Pedidos y Items de Pedido
 */

/**
 * Modelo completo de Pedido
 */
export interface PedidoModel {
  id: number;
  idUsuario: {
    id: number;
    nombre: string;
    apellido: string;
    correoElectronico: string;
  };
  fechaPedido: string;
  montoTotal: number;
  estado: string;
  direccionEnvio: string;
  ciudadEnvio: string;
  paisEnvio: string;
  codigoPostalEnvio: string;
}

/**
 * DTO para crear un nuevo pedido
 * POST /api/pedidos
 */
export interface CreatePedidoDto {
  idUsuario: {
    id: number;
  };
  montoTotal: number;
  estado: string;
  direccionEnvio: string;
  ciudadEnvio: string;
  paisEnvio: string;
  codigoPostalEnvio: string;
  // fechaPedido se genera automáticamente en el backend
}

/**
 * Modelo completo de Item de Pedido
 */
export interface ItemPedidoModel {
  id: number;
  idPedido: {
    id: number;
  };
  idProducto: {
    id: number;
    nombre: string;
    precio: number;
  };
  cantidad: number;
  precioUnitario: number;
}

/**
 * DTO para crear un item de pedido
 * POST /api/items-pedido
 */
export interface CreateItemPedidoDto {
  idPedido: {
    id: number;
  };
  idProducto: {
    id: number;
  };
  cantidad: number;
  precioUnitario: number;
}
