import { NgClass, NgIf } from '@angular/common'; // Importa las directivas NgClass y NgIf de Angular
import { Component, inject } from '@angular/core'; // Importa las funciones Component e inject de Angular
import { FormsModule } from '@angular/forms'; // Importa FormsModule para el manejo de formularios
import { DomSanitizer, SafeUrl } from '@angular/platform-browser'; // Importa DomSanitizer y SafeUrl para manejo seguro de URLs
import {
  ImageCroppedEvent,
  ImageCropperComponent,
  LoadedImage,
} from 'ngx-image-cropper'; // Importa los eventos y componentes del cropper de imágenes
import { PostProductoService } from '../../servicios/productos/post-producto.service'; // Importa el servicio PostProductoService
import { Router } from '@angular/router'; // Importa Router para la navegación de rutas
import { ProductoPost } from '../../interfaces/producto'; // Importa la interfaz ProductoPost

@Component({
  selector: 'app-post-producto', // Define el selector del componente, que se utiliza en el HTML
  templateUrl: './post-producto.page.html', // Especifica la ubicación del archivo de plantilla HTML del componente
  imports: [FormsModule, NgIf, NgClass, ImageCropperComponent], // Importa módulos y componentes necesarios
  standalone: true, // Indica que el componente es autónomo
})
export class PostProductoPage {
  // Inyecta los servicios PostProductoService y Router utilizando la función inject
  private postProducto: PostProductoService = inject(PostProductoService);
  private router: Router = inject(Router);

  // Define un objeto producto inicializado con valores predeterminados
  producto: ProductoPost = {
    nombre: '',
    descripcion: '',
    precio_unidad: 0,
    id_categoria: 0,
    foto: null,
  };

  // Variables para el manejo de la imagen
  imageChangedEvent: Event | null = null;
  croppedImage: SafeUrl = '';
  temporaryCroppedImage: SafeUrl = '';
  temporaryBlob: Blob | undefined | null = null;
  mostrarCropper: boolean = true;

  // Inyecta el servicio DomSanitizer para el manejo seguro de URLs
  constructor(private sanitizer: DomSanitizer) {}

  // Método para manejar el cambio de archivo
  fileChangeEvent(event: Event): void {
    this.imageChangedEvent = event;
    this.mostrarCropper = true;
  }

  // Método para manejar el recorte de la imagen
  imageCropped(event: ImageCroppedEvent) {
    if (event.objectUrl) {
      this.temporaryCroppedImage = this.sanitizer.bypassSecurityTrustUrl(
        event.objectUrl,
      );
    }
    this.temporaryBlob = event.blob;
  }

  // Método para manejar la carga de la imagen
  imageLoaded(image: LoadedImage) {
    // mostrar el cropper
  }

  // Método para manejar cuando el cropper esté listo
  cropperReady() {
    // cropper listo
  }

  // Método para manejar cuando la carga de la imagen falla
  loadImageFailed() {
    alert('No se pudo cargar la imágen, intente otra vez.');
  }

  // Método para manejar el envío del formulario
  onSubmit() {
    const formData = new FormData(
      document.getElementById('formPost') as HTMLFormElement,
    );
    if (this.producto.foto) {
      formData.delete('foto');
      formData.append('foto', this.producto.foto, 'imagen.png');
    }
    if (this.postProducto.postProducto(formData) != null) {
      this.router.navigate(['']);
    } else {
      alert('Hubo un error al crear su producto.');
    }
  }

  // Método para aplicar el recorte a la imagen
  cropImage() {
    this.croppedImage = this.temporaryCroppedImage;
    this.producto.foto = this.temporaryBlob;
    this.mostrarCropper = false;
    this.temporaryCroppedImage = '';
  }
}
