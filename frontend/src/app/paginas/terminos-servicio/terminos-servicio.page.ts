import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FooterComponent } from '../../componentes/footer/footer.component';
import { HeaderComponent } from '../../componentes/header/header.component';

@Component({
  selector: 'app-terminos-servicio',
  standalone: true,
  imports: [HeaderComponent, FooterComponent],
  templateUrl: './terminos-servicio.page.html',
})
export class TerminosServicioPage implements OnInit {
  private router: Router = inject(Router);
  constructor() {}

  ngOnInit() {}

  navegarA(ruta: string) {
    this.router.navigate([ruta]);
  }
}
