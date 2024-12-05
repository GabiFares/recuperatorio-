import { inject, Injectable } from '@angular/core'; // Importa las funciones inject e Injectable de Angular
import { FetchService } from '../fetch.service'; // Importa el servicio FetchService

// Decorador Injectable para permitir que este servicio sea inyectable en otros componentes o servicios
@Injectable({
  providedIn: 'root', // Provee el servicio en el nivel raíz de la aplicación, haciéndolo disponible en todas partes
})
export class PutPedidoService {
  // Inyecta el servicio FetchService utilizando la función inject
  private fetchService: FetchService = inject(FetchService);

  // Método para actualizar un pedido existente
  put(body: string, id_pedido: string) {
    try {
      // Realiza una solicitud PUT a la API para actualizar un pedido existente
      return this.fetchService.put(`pedidos/${id_pedido}`, body);
    } catch (error) {
      console.log(error); // Maneja errores en la consola
      return null; // Retorna null en caso de error
    }
  }

  // Constructor del servicio
  constructor() {}
}
