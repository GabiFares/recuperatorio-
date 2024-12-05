import { Component, EventEmitter, Output } from '@angular/core'; // Importa Component, EventEmitter y Output de Angular
import { FormsModule } from '@angular/forms'; // Importa FormsModule para el manejo de formularios
import { CommonModule } from '@angular/common'; // Importa CommonModule para el uso de directivas comunes de Angular

@Component({
  selector: 'app-search', // Define el selector del componente, que se utiliza en el HTML
  standalone: true, // Indica que el componente es autónomo
  imports: [FormsModule, CommonModule], // Importa módulos necesarios
  templateUrl: './search.component.html', // Especifica la ubicación del archivo de plantilla HTML del componente
  styleUrls: ['./search.component.css'], // Especifica la ubicación del archivo de estilos CSS del componente
})
export class SearchComponent {
  searchValue: string = ''; // Define una propiedad para almacenar el valor de búsqueda ingresado por el usuario
  @Output() searchTask = new EventEmitter<string>(); // Define un EventEmitter para emitir el valor de búsqueda al componente padre
  number = 0; // Define una propiedad de número (puede usarse en la lógica futura)

  // Método para manejar el evento de búsqueda
  onSearch() {
    this.searchTask.emit(this.searchValue); // Emite el valor de búsqueda al componente padre cuando se realiza la búsqueda
  }
}
