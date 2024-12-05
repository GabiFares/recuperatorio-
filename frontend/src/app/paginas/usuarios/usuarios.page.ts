import { Component, inject, OnInit, signal } from '@angular/core';
import { NavbarComponent } from '../../componentes/navbar/navbar.component';
import { NgFor, NgIf } from '@angular/common';
import { VerPedido } from '../../interfaces/pedido';
import { AuthService } from '../../servicios/auth.service';
import GetPedidosService from '../../servicios/pedidos/get-pedidos.service';
import { GetDetallePedidosService } from '../../servicios/pedidos/get-detalle-pedidos.service';
import { WebSocketSubject, WebSocketSubjectConfig } from 'rxjs/webSocket';
import { Router } from '@angular/router';
import { CRUDUsuariosService } from '../../servicios/crud-usuarios.service';
@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [NavbarComponent, NgFor],
  templateUrl: './usuarios.page.html',
})
export class UsuariosPage implements OnInit {
  pedidos = signal<VerPedido[]>([]);
  pedidosFiltrados = signal<VerPedido[]>([]);
  detalle_pedidos: any[] = [];
  usuarios: any[] = [];
  authService: AuthService = inject(AuthService);
  usuariosService: CRUDUsuariosService = inject(CRUDUsuariosService);
  getPedidos: GetPedidosService = inject(GetPedidosService);
  getDetalle_Pedido: GetDetallePedidosService = inject(
    GetDetallePedidosService,
  );

  private router: Router = inject(Router);

  constructor() {}

  async ngOnInit() {
    await this.listadoUsuarios();
  }

  async listadoUsuarios() {
    this.usuarios = await this.usuariosService.getUsers();
    console.log('listado usuarios', JSON.stringify(this.usuarios, null, 2));
  }

  async verHistorialUsuario(userId: number) {
    this.router.navigate(['pedidos/pedidosUsuario/'], {
      queryParams: { id_usuario: userId },
    });
  }
}
