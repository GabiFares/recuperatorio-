import { inject, Injectable, signal } from '@angular/core'; // Importa las funciones inject, Injectable y signal de Angular
import { FetchService } from './fetch.service'; // Importa el servicio FetchService

// Decorador Injectable para permitir que este servicio sea inyectable en otros componentes o servicios
@Injectable({
  providedIn: 'root', // Provee el servicio en el nivel raíz de la aplicación, haciéndolo disponible en todas partes
})
export class CarritoService {
  // Inyecta el servicio FetchService utilizando la función inject
  private fetchService: FetchService = inject(FetchService);

  // Signal para el número de productos en el carrito
  cartCount = signal(0);

  // #####################################

  // Método para eliminar un detalle de pedido por ID de pedido e ID de producto
  async eliminarDetallePedido(idPedido: string, idProducto: string) {
    try {
      // Realiza una solicitud DELETE a la API para eliminar el detalle del pedido
      await this.fetchService.delete(
        `pedidos/detalle_pedidos/${idPedido}/${idProducto}`,
      );
    } catch (error) {
      console.log(error); // Maneja errores en la consola
    }
  }
}
