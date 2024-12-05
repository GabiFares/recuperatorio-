import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { NavbarComponent } from '../../componentes/navbar/navbar.component';
import { AuthService } from '../../servicios/auth.service';
import { GetPedidosService } from '../../servicios/pedidos/get-pedidos.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';
import { GetDetallePedidosService } from '../../servicios/pedidos/get-detalle-pedidos.service';
import { PutPedidoService } from '../../servicios/pedidos/put-pedido.service';
import { WebSocketSubject, WebSocketSubjectConfig } from 'rxjs/webSocket';
import { VerPedido } from '../../interfaces/pedido';
import { JsonpInterceptor } from '@angular/common/http';

@Component({
  selector: 'app-ver-pedido-usuario',
  standalone: true,
  imports: [NavbarComponent, NgFor, NgIf],
  templateUrl: './ver-pedido-usuario.page.html',
})
export class VerPedidoUsuarioPage implements OnInit {
  userId: string = '';
  pedidos = signal<VerPedido[]>([]);
  pedidosFiltrados = signal<VerPedido[]>([]);
  detalle_pedidos: any[] = [];
  isAdmin: boolean = false;
  repartidor: boolean = false;
  authService: AuthService = inject(AuthService);
  getPedidos: GetPedidosService = inject(GetPedidosService);
  getDetalle_Pedido: GetDetallePedidosService = inject(
    GetDetallePedidosService,
  );
  putPedido: PutPedidoService = inject(PutPedidoService);
  private activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  router: Router = inject(Router);
  private wsSubject: WebSocketSubject<string>;

  constructor() {
    const config: WebSocketSubjectConfig<string> = {
      url: 'wss://localhost/backend/websocket',
      deserializer: (event: MessageEvent) => event.data,
    };

    this.wsSubject = new WebSocketSubject(config);
  }

  ngOnInit(): void {
    if (this.activatedRoute.snapshot.queryParams['id_usuario']) {
      this.userId = this.activatedRoute.snapshot.queryParams['id_usuario'];
      this.isAdmin = this.authService.isAdmin();
      this.cargarPedidos();
      this.setupWebSocket();
    }
  }

  setupWebSocket() {
    this.wsSubject.subscribe((message) => {
      if (message === 'Actualizacion_pedido') {
        if (this.repartidor) {
          this.cargarPedidosRepartidor();
        } else if (this.isAdmin == false) {
          const token = localStorage.getItem('token');
          if (token) {
            const idusuario = JSON.parse(atob(token.split('.')[1]));
            this.cargarPedidosbyID(idusuario.id);
          }
        } else {
          this.cargarPedidos();
        }
      }
    });
  }

  async cargarPedidos() {
    console.log('Useeeeer', this.userId);
    let pedidossinfiltrar = await this.getPedidos.getPedidoByUserId(
      this.userId,
    );
    console.log('console log despues de el await', pedidossinfiltrar);
    pedidossinfiltrar = pedidossinfiltrar.map(
      (pedido: VerPedido, index: number) => {
        return { ...pedido, nombre: 'Pedido ' + index };
      },
    );

    this.pedidos.set(
      pedidossinfiltrar.filter(
        (pedido: any) => !['PENDIENTE'].includes(pedido.estado),
      ),
    );
    this.pedidosFiltrados.set(this.pedidos());
    console.log('pedidos', pedidossinfiltrar);
  }

  async cargarPedidosRepartidor() {
    let pedidossinfiltrar = await this.getPedidos.getAllPedidos();
    pedidossinfiltrar = pedidossinfiltrar.map(
      (pedido: VerPedido, index: number) => {
        return { ...pedido, nombre: 'Pedido ' + index };
      },
    );
    this.pedidos.set(
      pedidossinfiltrar.filter(
        (pedido: any) =>
          ![
            'PENDIENTE',
            'CONFIRMADO',
            'EN_PREPARACION',
            'EN_CAMINO',
            'ENTREGADO',
            'CANCELADO',
          ].includes(pedido.estado),
      ),
    );
    this.pedidosFiltrados.set(this.pedidos());
  }
  // Método para cargar los pedidos por ID de usuario
  async cargarPedidosbyID(id_usuario: string) {
    let pedidossinfiltrar = await this.getPedidos.getPedidoByUserId(id_usuario);
    pedidossinfiltrar = pedidossinfiltrar.map(
      (pedido: VerPedido, index: number) => {
        return { ...pedido, nombre: 'Pedido ' + (index + 1) };
      },
    );
    this.pedidos.set(
      pedidossinfiltrar.filter(
        (pedido: any) =>
          !['PENDIENTE', 'ENTREGADO', 'CANCELADO'].includes(pedido.estado),
      ),
    );
    this.pedidosFiltrados.set(this.pedidos());
  }

  actualizarFiltroDePedidos(searchValue: string) {
    const filtrados = this.pedidos().filter((pedido: VerPedido) =>
      pedido.nombre.toLowerCase().includes(searchValue.toLowerCase()),
    );
    this.pedidosFiltrados.set(filtrados);
  }

  // Método para manejar el cambio de estado del pedido
  onChange(pedido: any, Eventochange: Event) {
    const Elemento = Eventochange.target as HTMLSelectElement;
    const estado = Elemento.value;
    pedido.estado = estado;
    this.putPedido.put(JSON.stringify(pedido), pedido.id_pedido); // Actualiza el estado del pedido
  }

  tomarPedido(pedido: any) {
    const estado = 'EN_CAMINO';
    pedido.estado = estado;
    this.putPedido.put(JSON.stringify(pedido), pedido.id_pedido); // Actualiza el estado del pedido
    this.router.navigate(['pedidos/detalles/'], {
      queryParams: {
        id_pedido: pedido.id_pedido,
        id_direccion: pedido.id_direccion,
      },
    });
  }

  // Método para ver los detalles del pedido
  verDetalles(id_pedido: string, id_direccion: string) {
    this.router.navigate(['pedidos/detalles/'], {
      queryParams: { id_pedido: id_pedido, id_direccion: id_direccion },
    });
  }

  Cancelar(pedido: any) {
    const estado = 'CANCELADO';
    pedido.estado = estado;
    this.putPedido.put(JSON.stringify(pedido), pedido.id_pedido);
  }
}
