import { inject, Injectable } from '@angular/core'; // Importa las funciones inject e Injectable de Angular
import { FetchService } from './fetch.service'; // Importa el servicio FetchService

// Decorador Injectable para permitir que este servicio sea inyectable en otros componentes o servicios
@Injectable({
  providedIn: 'root', // Provee el servicio en el nivel raíz de la aplicación, haciéndolo disponible en todas partes
})
export class PostRegaloService {
  // Inyecta el servicio FetchService utilizando la función inject
  private fetchService: FetchService = inject(FetchService);

  // Método para enviar un nuevo pedido al backend
  postRegalo(body: string) {
    try {
      // Realiza una solicitud POST a la API para crear un nuevo pedido
      return this.fetchService.post('regalos/', body);
    } catch (error) {
      console.log(error); // Maneja errores en la consola
      return null; // Retorna null en caso de error
    }
  }

  async getPedidoByIdUsuario(id_usuario: string) {
    try {
      // Realiza una solicitud GET a la API para obtener los pedidos por ID de usuario
      const response = await this.fetchService.get(`regalos/${id_usuario}`);
      return response; // Retorna la respuesta de la API
    } catch (error) {
      console.log(error); // Maneja errores en la consola
      return []; // Retorna un array vacío en caso de error
    }
  }
  // Constructor del servicio
  constructor() {}
}
