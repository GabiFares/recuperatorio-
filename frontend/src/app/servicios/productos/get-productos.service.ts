import { inject, Injectable } from '@angular/core'; // Importa las funciones inject e Injectable de Angular
import { FetchService } from '../fetch.service'; // Importa el servicio FetchService

// Decorador Injectable para permitir que este servicio sea inyectable en otros componentes o servicios
@Injectable({
  providedIn: 'root', // Provee el servicio en el nivel raíz de la aplicación, haciéndolo disponible en todas partes
})
export class GetProductosService {
  // Inyecta el servicio FetchService utilizando la función inject
  private apiService: FetchService = inject(FetchService);

  // Método para obtener todos los productos
  async getProductos() {
    try {
      // Realiza una solicitud GET a la API para obtener todos los productos
      const response = await this.apiService.get('/productos');
      return response; // Retorna la respuesta de la API
    } catch (error) {
      console.log(error); // Maneja errores en la consola
    }
  }

  // Método para obtener productos por categoría
  async getProductosByCategoria(id_categoria: string) {
    try {
      // Realiza una solicitud GET a la API para obtener productos por categoría
      const response = await this.apiService.get(
        `/productos/categoria/${id_categoria}`,
      );
      return response; // Retorna la respuesta de la API
    } catch (error) {
      console.log(error); // Maneja errores en la consola
    }
  }

  // Método para obtener un producto por su ID
  async getProductoById(id_producto: string) {
    try {
      // Realiza una solicitud GET a la API para obtener un producto por su ID
      const response = await this.apiService.get(`/productos/${id_producto}`);
      return response; // Retorna la respuesta de la API
    } catch (error) {
      console.log(error); // Maneja errores en la consola
    }
  }
}
