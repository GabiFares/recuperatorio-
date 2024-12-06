import { Component, inject, OnInit } from '@angular/core';
import { NavbarComponent } from '../../componentes/navbar/navbar.component';
import { AddToCartComponent } from '../../componentes/add-to-cart/add-to-cart.component';
import { FooterComponent } from '../../componentes/footer/footer.component';
import { NgFor, NgIf } from '@angular/common';
import { Producto } from '../../interfaces/producto';
import { PostRegaloService } from '../../servicios/regalo';
import { AuthService } from '../../servicios/auth.service';
import { ActivatedRoute } from '@angular/router';
import GetPedidosService from '../../servicios/pedidos/get-pedidos.service';
import { Pedido } from '../../interfaces/pedido';

@Component({
  selector: 'regalos',
  standalone: true,
  imports: [NavbarComponent, AddToCartComponent, FooterComponent, NgIf, NgFor],
  templateUrl: './regalos.page.html',
})
export class RegalosPage implements OnInit {
  regalos: any[] = [];
  regalosFiltrados: any[] = [];
  regaloSeleccionado: any = null;
  isAdmin: boolean = false;
  modalIsOpen: boolean = false;
  actualizar: boolean = false;

  private activatedRoute: ActivatedRoute = inject(ActivatedRoute);

  constructor(
    private regalosService: PostRegaloService,
    private authService: AuthService,
    private getPedidoService: GetPedidosService,
  ) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (token) {
      const idusuario = JSON.parse(atob(token.split('.')[1]));
      this.cargarRegalos(idusuario.id);
    }
  }

  cargarRegalos(id_usuario: string): void {
    this.regalosService.getPedidoByIdUsuario(id_usuario).then((data) => {
      this.regalos = data;
      this.regalosFiltrados = data;
    });
  }

  async agregarAlCarrito(producto: any) {
    this.regaloSeleccionado = producto;
    console.log('este regalo en regalo page' + JSON.stringify(producto));
    try {
      const pedidosUsuario = await this.getPedidoService.getPedidoByIdUsuario(
        this.authService.getUserId(),
      );

      if (pedidosUsuario.length > 0) {
        const pedidoPendiente = pedidosUsuario.find(
          (pedido: Pedido) => pedido.estado === 'PENDIENTE',
        );
        console.log(
          'pedido pendiente' + JSON.stringify(pedidoPendiente, null, 2),
        );
      }
      this.defaultAddToCart(producto);
    } catch (error) {
      console.error('Error al verificar el carrito:', error);
    }
  }

  defaultAddToCart(producto: Producto) {
    this.modalIsOpen = true;
    this.actualizar = false;
    this.regaloSeleccionado = { ...producto, cantidad: 1, nota: '' };
  }

  // Método para cerrar el modal
  closeModal() {
    this.regaloSeleccionado = null;
    this.modalIsOpen = false;
  }
}
