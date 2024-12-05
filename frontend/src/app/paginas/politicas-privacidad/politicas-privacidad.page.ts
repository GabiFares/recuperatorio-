import { Component, inject, OnInit } from '@angular/core';
import { FooterComponent } from '../../componentes/footer/footer.component';
import { Router } from '@angular/router';
import { HeaderComponent } from '../../componentes/header/header.component';

@Component({
  selector: 'app-politicas-privacidad',
  templateUrl: './politicas-privacidad.page.html',
  standalone: true,
  imports: [HeaderComponent, FooterComponent]
})
export class PoliticasPrivacidadPage implements OnInit {
  private router: Router = inject(Router);
  constructor() { }

  ngOnInit() { }

  navegarA(ruta: string) {
    this.router.navigate([ruta]);
  }
}
