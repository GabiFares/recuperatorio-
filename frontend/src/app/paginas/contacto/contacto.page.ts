import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { FormularioContacto } from '../../interfaces/usuario'; // Importar la interfaz
import { CommonModule } from '@angular/common';
import { NgIf } from '@angular/common'; // Importar NgIf
import { HeaderComponent } from '../../componentes/header/header.component';
import { FooterComponent } from '../../componentes/footer/footer.component';

@Component({
  selector: 'app-contacto',
  standalone: true,
  imports: [
    HeaderComponent,
    FooterComponent,
    FormsModule,
    HttpClientModule,
    CommonModule,
    NgIf,
  ], // No necesita NgModel porque está incluido en FormsModule
  templateUrl: './contacto.page.html',
  styleUrls: ['./contacto.page.scss'],
})
export class ContactoPage {
  nombre: string = '';
  email: string = '';
  mensaje: string = '';
  emailInvalido: boolean = false; // Variable para controlar la validez del email

  constructor(private http: HttpClient) {}

  validarEmail(email: string): boolean {
    // Función para validar el formato del correo electrónico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  enviarFormulario(form: NgForm) {
    // Validar el email antes de enviar el formulario
    this.emailInvalido = !this.validarEmail(this.email);

    if (form.invalid || this.emailInvalido) {
      return; // No enviar si el formulario es inválido o el email no es válido
    }

    const formulario: FormularioContacto = {
      nombre: this.nombre,
      email: this.email,
      mensaje: this.mensaje,
    };

    this.http
      .post('/usuarios/contacto', formulario)
      .pipe(
        catchError((error) => {
          console.error('Error al enviar el formulario', error);
          return throwError(error);
        }),
      )
      .subscribe((response) => {
        console.log('Formulario enviado exitosamente', response);
        form.reset(); // Resetear el formulario después del envío
      });
  }
}
