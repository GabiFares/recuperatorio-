import { inject, Injectable } from '@angular/core'; // Importa las funciones inject e Injectable de Angular
import { FetchMultipartService } from '../fetch-multipart.service'; // Importa el servicio FetchMultipartService

// Decorador Injectable para permitir que este servicio sea inyectable en otros componentes o servicios
@Injectable({
  providedIn: 'root', // Provee el servicio en el nivel raíz de la aplicación, haciéndolo disponible en todas partes
})
export class PutProductoService {
  // Inyecta el servicio FetchMultipartService utilizando la función inject
  private fetchMultipartService: FetchMultipartService = inject(
    FetchMultipartService,
  );

  // Método para actualizar datos multipart/form-data de un producto existente
  putProducto(body: FormData, id_producto: string) {
    try {
      // Realiza una solicitud PUT a la API para actualizar un producto existente
      return this.fetchMultipartService.put(`productos/${id_producto}`, body);
    } catch (error) {
      console.log(error); // Maneja errores en la consola
      return null; // Retorna null en caso de error
    }
  }

  // Constructor del servicio
  constructor() {}
}
