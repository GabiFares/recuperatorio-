import { inject, Injectable } from '@angular/core'; // Importa las funciones inject e Injectable de Angular
import { FetchMultipartService } from '../fetch-multipart.service'; // Importa el servicio FetchMultipartService

// Decorador Injectable para permitir que este servicio sea inyectable en otros componentes o servicios
@Injectable({
  providedIn: 'root', // Provee el servicio en el nivel raíz de la aplicación, haciéndolo disponible en todas partes
})
export class PostProductoService {
  // Inyecta el servicio FetchMultipartService utilizando la función inject
  private fetchMultipartService: FetchMultipartService = inject(
    FetchMultipartService,
  );

  // Método para enviar datos multipart/form-data para crear un nuevo producto
  postProducto(body: FormData) {
    try {
      // Realiza una solicitud POST a la API para crear un nuevo producto
      return this.fetchMultipartService.post('productos/', body);
    } catch (error) {
      console.log(error); // Maneja errores en la consola
      return null; // Retorna null en caso de error
    }
  }

  // Constructor del servicio
  constructor() {}
}
