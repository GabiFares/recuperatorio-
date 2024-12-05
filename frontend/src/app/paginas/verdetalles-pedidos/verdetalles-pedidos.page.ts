import { Component, inject, OnInit, signal } from '@angular/core'; // Importa las funciones Component, inject y OnInit de Angular
import { NavbarComponent } from '../../componentes/navbar/navbar.component'; // Importa el componente NavbarComponent
import { ActivatedRoute, Router } from '@angular/router'; // Importa ActivatedRoute y Router para la navegación de rutas
import { GetDetallePedidosService } from '../../servicios/pedidos/get-detalle-pedidos.service'; // Importa el servicio GetDetallePedidosService
import { GetProductosService } from '../../servicios/productos/get-productos.service'; // Importa el servicio GetProductosService
import { CommonModule, JsonPipe, NgFor } from '@angular/common'; // Importa CommonModule y NgFor para directivas de Angular
import { MapaPedidosComponent } from '../../componentes/mapa-pedidos/mapa-pedidos.component';
import { CRUDdireccionesService } from '../../servicios/direcciones/cruddirecciones.service';
import { AuthService } from '../../servicios/auth.service';
import { PutPedidoService } from '../../servicios/pedidos/put-pedido.service';
import GetPedidosService from '../../servicios/pedidos/get-pedidos.service';
import { AddToCartComponent } from '../../componentes/add-to-cart/add-to-cart.component';
import { Producto } from '../../interfaces/producto';
import { Pedido, PedidoItem } from '../../interfaces/pedido';

@Component({
  selector: 'app-verdetalles-pedidos', // Define el selector del componente, que se utiliza en el HTML
  templateUrl: './verdetalles-pedidos.page.html', // Especifica la ubicación del archivo de plantilla HTML del componente
  standalone: true, // Indica que el componente es autónomo
  imports: [
    MapaPedidosComponent,
    NavbarComponent,
    NgFor,
    CommonModule,
    AddToCartComponent,
  ], // Importa componentes y directivas necesarias
})
export class VerdetallesPedidosPage implements OnInit {
  // Inyecta los servicios y rutas necesarias utilizando la función inject
  private cargarProducto: GetProductosService = inject(GetProductosService);
  private repartidorCheck: AuthService = inject(AuthService);
  private activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  private router: Router = inject(Router);
  getDetalle_Pedido: GetDetallePedidosService = inject(
    GetDetallePedidosService,
  );
  private getDireccionID: CRUDdireccionesService = inject(
    CRUDdireccionesService,
  );

  // Inicializa las propiedades para almacenar los detalles de los pedidos y productos
  detalle_pedidos: any[] = [];
  productos: any[] = [];
  address = signal<string>('');
  repartidor = signal<boolean>(false);
  putPedido: PutPedidoService = inject(PutPedidoService);

  productoSeleccionado: any = null;
  actualizar: boolean = false;
  modalIsOpen: boolean = false;
  constructor(
    private authService: AuthService,
    private getPedidoService: GetPedidosService,
  ) {}

  // Método para obtener el nombre del producto por su ID
  getProducto(id_producto: string) {
    const producto = this.productos.find(
      (producto) => producto.id_producto == id_producto,
    );
    return producto.nombre;
  }

  // Método que se ejecuta al inicializar el componente
  async ngOnInit() {
    // Verifica si hay un ID de pedido en los parámetros de la ruta
    if (this.activatedRoute.snapshot.queryParams['id_pedido']) {
      // Obtiene los detalles del pedido por su ID
      this.detalle_pedidos = await this.getDetalle_Pedido.getDetallePedidoByID(
        this.activatedRoute.snapshot.queryParams['id_pedido'],
      );
      // Mapea los detalles del pedido para obtener los productos correspondientes
      const productoslista = this.detalle_pedidos.map((detalle) =>
        this.cargarProducto.getProductoById(detalle.id_producto),
      );
      // Espera a que se resuelvan todas las promesas de productos
      this.productos = await Promise.all(productoslista);

      let direccion = await this.getDireccionID.getDireccionesByID(
        this.activatedRoute.snapshot.queryParams['id_direccion'],
      );
      this.address.set(`${direccion.calle} ${direccion.numero}`);
      this.repartidor.set(this.repartidorCheck.isRepartidor());
    } else {
      // Navega a la ruta de inicio si no hay un ID de pedido en los parámetros de la ruta
      this.router.navigate(['']);
    }
  }
  async entregarPedido() {
    const pedido = await this.getPedidoService.getPedidoById(
      this.activatedRoute.snapshot.queryParams['id_pedido'],
    );
    const estado = 'ENTREGADO';
    pedido.estado = estado;
    pedido.id_direccion =
      this.activatedRoute.snapshot.queryParams['id_direccion'];
    this.putPedido.put(JSON.stringify(pedido), pedido.id_pedido);
    this.router.navigate(['pedidos/ver']);
  }

  async agregarAlCarrito(detallePedido: any) {
    const productoId = detallePedido.id_producto;
    console.log('id', productoId);
    const producto = await this.cargarProducto.getProductoById(productoId);
    console.log('productooo', producto);
    try {
      const pedidosUsuario = await this.getPedidoService.getPedidoByUserId(
        this.authService.getUserId(),
      );
      console.log('pedidoUsuarioooo', pedidosUsuario);
      if (pedidosUsuario) {
        console.log('entré al ifffffffffffffff');
        console.log('es array', Array.isArray(pedidosUsuario));
        const pedidoPendiente = pedidosUsuario.find(
          (pedido: Pedido) => pedido.estado === 'PENDIENTE',
        );
        console.log(
          'pedido pendiente' + JSON.stringify(pedidoPendiente, null, 2),
        );
        if (pedidoPendiente && pedidoPendiente.items) {
          console.log('entra en el if del producto');
          const productoExistente = pedidoPendiente.items.find(
            (item: PedidoItem) =>
              item.id_producto === detallePedido.id_producto,
          );
          console.log(
            'producto existente ' + JSON.stringify(productoExistente),
          );
          if (productoExistente) {
            // Pasa los datos del producto existente al modal
            console.log('llega al true');
            this.modalIsOpen = true;
            this.productoSeleccionado = {
              ...producto,
              cantidad: productoExistente.cantidad,
              nota: productoExistente.indicaciones,
            };
            console.log(
              'producto seleccionadopppppppppppppppp',
              JSON.stringify(this.productoSeleccionado),
            );
            this.actualizar = true;
            return;
          }
        }
      }
      this.defaultAddToCart(
        producto,
        detallePedido.cantidad,
        detallePedido.nota,
      );
    } catch (error) {
      console.error('Error al verificar el carrito:', error);
    }
  }
  defaultAddToCart(producto: any, cantidad: any, nota: any) {
    this.modalIsOpen = true;
    this.actualizar = false;
    this.productoSeleccionado = { ...producto, cantidad, nota };
  }
  closeModal() {
    this.productoSeleccionado = null;
    this.modalIsOpen = false;
  }
}
