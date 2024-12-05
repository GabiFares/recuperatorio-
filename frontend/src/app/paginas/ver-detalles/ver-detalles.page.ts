import { Component, inject, OnInit } from '@angular/core'; // Importa las funciones Component, inject y OnInit de Angular
import { NavbarComponent } from '../../componentes/navbar/navbar.component'; // Importa el componente NavbarComponent
import { GetProductosService } from '../../servicios/productos/get-productos.service'; // Importa el servicio GetProductosService
import { ActivatedRoute, Router } from '@angular/router'; // Importa ActivatedRoute y Router para la navegación de rutas
import { NgIf } from '@angular/common'; // Importa NgIf para directivas de Angular
import { FooterComponent } from '../../componentes/footer/footer.component'; // Importa el componente FooterComponent

@Component({
  selector: 'app-ver-detalles', // Define el selector del componente, que se utiliza en el HTML
  templateUrl: './ver-detalles.page.html', // Especifica la ubicación del archivo de plantilla HTML del componente
  imports: [FooterComponent, NavbarComponent, NgIf], // Importa componentes y directivas necesarias
  standalone: true, // Indica que el componente es autónomo
})
export class VerDetallesPage implements OnInit {
  // Inyecta los servicios y rutas necesarias utilizando la función inject
  private cargarProducto: GetProductosService = inject(GetProductosService);
  private activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  private router: Router = inject(Router);
  producto: any; // Define una propiedad para almacenar el producto

  // Constructor del componente
  constructor() {}

  // Método que se ejecuta al inicializar el componente
  async ngOnInit() {
    // Verifica si hay un ID de producto en los parámetros de la ruta
    if (this.activatedRoute.snapshot.queryParams['id']) {
      // Obtiene el producto por su ID
      this.producto = await this.cargarProducto.getProductoById(
        this.activatedRoute.snapshot.queryParams['id'],
      );
      console.log(this.producto); // Muestra el producto en la consola
    } else {
      // Navega a la ruta de inicio si no hay un ID de producto en los parámetros de la ruta
      this.router.navigate(['']);
    }
  }
}
