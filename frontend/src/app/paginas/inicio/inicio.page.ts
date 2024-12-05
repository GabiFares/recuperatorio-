import { Component, inject, OnInit } from '@angular/core'; // Importa las funciones Component, inject y OnInit de Angular
import { Router } from '@angular/router'; // Importa Router para la navegación de rutas
import { FooterComponent } from '../../componentes/footer/footer.component'; // Importa el componente FooterComponent
import { MapComponent } from '../../componentes/mapa-inicio/mapa.component'; // Importa el componente MapComponent
import { HeaderComponent } from '../../componentes/header/header.component';

@Component({
  selector: 'inicio', // Define el selector del componente, que se utiliza en el HTML
  standalone: true, // Indica que el componente es autónomo
  imports: [HeaderComponent, FooterComponent, MapComponent], // Importa componentes necesarios
  templateUrl: './inicio.page.html', // Especifica la ubicación del archivo de plantilla HTML del componente
  styleUrls: ['./inicio.page.css'], // Especifica la ubicación del archivo de estilos CSS del componente
})
export class InicioPage implements OnInit {
  // Inyecta el servicio Router utilizando la función inject
  private router: Router = inject(Router);

  // Método que se ejecuta al inicializar el componente
  ngOnInit(): void {
    // Cualquier lógica de inicialización, si es necesaria
  }

  // Método para navegar a una ruta específica
  navegarA(ruta: string) {
    this.router.navigate([ruta]);
  }
}
