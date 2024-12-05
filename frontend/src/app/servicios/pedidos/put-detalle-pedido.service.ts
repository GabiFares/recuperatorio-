import { inject, Injectable } from '@angular/core';
import { FetchService } from '../fetch.service';

@Injectable({
  providedIn: 'root',
})
export class PutDetallePedidoService {
  private fetchService: FetchService = inject(FetchService);
  putDT(body: string, id_pedido: string, id_producto: string) {
    try {
      return this.fetchService.put(
        `pedidos/detalle_pedidos/${id_pedido}/${id_producto}`,
        body,
      );
    } catch (error) {
      console.log(error);
      return null;
    }
  }
  constructor() {}
}
