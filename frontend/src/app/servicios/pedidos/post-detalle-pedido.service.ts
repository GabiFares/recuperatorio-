import { inject, Injectable } from '@angular/core'; // Importa las funciones inject e Injectable de Angular
import { FetchService } from '../fetch.service'; // Importa el servicio FetchService

// Decorador Injectable para permitir que este servicio sea inyectable en otros componentes o servicios
@Injectable({
  providedIn: 'root', // Provee el servicio en el nivel raíz de la aplicación, haciéndolo disponible en todas partes
})
export class PostDetallePedidoService {
  // Inyecta el servicio FetchService utilizando la función inject
  private fetchService: FetchService = inject(FetchService);

  // Método para enviar un nuevo detalle de pedido al backend
  postDetallePedido(body: string) {
    try {
      // Realiza una solicitud POST a la API para crear un nuevo detalle de pedido
      return this.fetchService.post('pedidos/detalle_pedidos', body);
    } catch (error) {
      console.log(error); // Maneja errores en la consola
      return null; // Retorna null en caso de error
    }
  }

  // Constructor del servicio
  constructor() {}
}
