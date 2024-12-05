import { inject } from '@angular/core'; // Importa la función inject de Angular
import { CanActivateFn, Router } from '@angular/router'; // Importa CanActivateFn y Router de Angular Router
import { AuthService } from '../servicios/auth.service'; // Importa el servicio AuthService

// Define una función de guardia de ruta llamada checkTokenGuard
export const checkTokenGuard: CanActivateFn = (route, state) => {
  const router: Router = inject(Router); // Inyecta el servicio Router
  const authService: AuthService = inject(AuthService); // Inyecta el servicio AuthService

  // Verifica si el usuario tiene un token válido
  if (authService.isValidUser()) {
    return true; // Permite la navegación si el usuario es válido
  } else {
    router.navigate(['auth/login']); // Redirige al usuario a la página de inicio de sesión si el token no es válido
    return false; // Impide la navegación
  }
};
