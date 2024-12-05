import { Component } from '@angular/core'; // Importa el decorador Component de Angular
import { RouterOutlet } from '@angular/router'; // Importa RouterOutlet para la navegación de rutas

@Component({
  selector: 'app-root', // Define el selector del componente, que se utiliza en el HTML
  standalone: true, // Indica que el componente es autónomo
  imports: [RouterOutlet], // Importa RouterOutlet para la navegación de rutas
  templateUrl: './app.component.html', // Especifica la ubicación del archivo de plantilla HTML del componente
  styleUrl: './app.component.css', // Especifica la ubicación del archivo de estilos CSS del componente
})
export class AppComponent {
  title = 'frontend'; // Define una propiedad title para el componente, con el valor 'frontend'
}
