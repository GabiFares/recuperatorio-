export interface PedidoItem {
  id_producto: number;
  producto: string;
  cantidad: number;
  indicaciones: string;
}

export interface Pedido {
  id_usuario: number;
  estado:
  | 'PENDIENTE'
  | 'CONFIRMADO'
  | 'EN_PREPARACION'
  | 'LISTO'
  | 'EN_CAMINO'
  | 'ENTREGADO'
  | 'COMPLETADO'
  | 'CANCELADO';
  fecha: string;
  items: PedidoItem[];
}

export interface VerPedido {
  id_pedido: string;
  id_direccion: string;
  nombre: string;
  fecha_hora: string;
  id_local: number;
  id_usuario: number;
  importe_total: string;
  estado: string;
}
