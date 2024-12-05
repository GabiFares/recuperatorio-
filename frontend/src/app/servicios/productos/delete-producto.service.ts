import { inject, Injectable } from '@angular/core'; // Importa las funciones inject e Injectable de Angular
import { FetchService } from '../fetch.service'; // Importa el servicio FetchService

// Decorador Injectable para permitir que este servicio sea inyectable en otros componentes o servicios
@Injectable({
  providedIn: 'root', // Provee el servicio en el nivel raíz de la aplicación, haciéndolo disponible en todas partes
})
export class DeleteProductoService {
  // Inyecta el servicio FetchService utilizando la función inject
  private fetchService: FetchService = inject(FetchService);

  // Método para eliminar un producto por su ID
  async deleteProducto(id_producto: string) {
    try {
      // Realiza una solicitud DELETE a la API para eliminar un producto por su ID
      await this.fetchService.delete(`productos/${id_producto}`);
    } catch (error) {
      console.log(error); // Maneja errores en la consola
    }
  }

  // Constructor del servicio
  constructor() {}
}
