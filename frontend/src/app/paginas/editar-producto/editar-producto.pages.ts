import { NgClass, NgIf } from '@angular/common'; // Importa las directivas NgClass y NgIf de Angular
import { Component, inject, OnInit } from '@angular/core'; // Importa las funciones Component, inject y OnInit de Angular
import { FormsModule } from '@angular/forms'; // Importa FormsModule para el manejo de formularios
import { DomSanitizer, SafeUrl } from '@angular/platform-browser'; // Importa DomSanitizer y SafeUrl para manejo seguro de URLs
import {
  ImageCroppedEvent,
  ImageCropperComponent,
  LoadedImage,
} from 'ngx-image-cropper'; // Importa los eventos y componentes del cropper de imágenes
import { Router } from '@angular/router'; // Importa Router para la navegación de rutas
import { Producto } from '../../interfaces/producto'; // Importa la interfaz Producto
import { GetProductosService } from '../../servicios/productos/get-productos.service'; // Importa el servicio GetProductosService
import { ActivatedRoute } from '@angular/router'; // Importa ActivatedRoute para obtener parámetros de la ruta
import { PutProductoService } from '../../servicios/productos/edit-producto.service'; // Importa el servicio PutProductoService

@Component({
  selector: 'editar-producto', // Define el selector del componente, que se utiliza en el HTML
  standalone: true, // Indica que el componente es autónomo
  templateUrl: './editar-producto.pages.html', // Especifica la ubicación del archivo de plantilla HTML del componente
  imports: [FormsModule, NgIf, NgClass, ImageCropperComponent], // Importa módulos y componentes necesarios
})
export class EditarProductoPages implements OnInit {
  // Inyecta los servicios utilizando la función inject
  private putProducto: PutProductoService = inject(PutProductoService);
  private cargarTabla: GetProductosService = inject(GetProductosService);
  private router: Router = inject(Router);
  private sanitizer: DomSanitizer = inject(DomSanitizer);
  private route: ActivatedRoute = inject(ActivatedRoute);

  // Variables para almacenar los datos del producto
  productId: string | null = null;
  producto: Producto | undefined;
  nombre: string = '';
  descripcion: string = '';
  precio_unidad: number = 0;
  categoria: number = 0;
  foto: Blob | undefined | null;

  // Variables para el manejo de la imagen
  imageChangedEvent: Event | null = null;
  croppedImage: SafeUrl = '';
  temporaryCroppedImage: SafeUrl = '';
  temporaryBlob: Blob | undefined | null = null;
  mostrarCropper: boolean = true;

  // Método que se ejecuta al inicializar el componente
  async ngOnInit(): Promise<void> {
    this.productId = this.route.snapshot.paramMap.get('id');
    console.log(this.productId);
    if (this.productId) {
      this.producto = await this.cargarTabla.getProductoById(this.productId);
      if (this.producto) {
        this.nombre = this.producto.nombre;
        this.descripcion = this.producto.descripcion;
        this.precio_unidad = this.producto.precio_unidad;
        this.categoria = this.producto.id_categoria;
      }
    }
  }

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
    if (this.foto) {
      formData.delete('foto');
      formData.append('foto', this.foto, 'imagen.png');
    }
    if (this.putProducto.putProducto(formData, this.productId!) != null) {
      this.router.navigate(['comidas']);
    } else {
      alert('Hubo un error al crear su producto.');
    }
  }

  // Método para aplicar el recorte a la imagen
  cropImage() {
    this.croppedImage = this.temporaryCroppedImage;
    this.foto = this.temporaryBlob;
    this.mostrarCropper = false;
    this.temporaryCroppedImage = '';
  }
}
