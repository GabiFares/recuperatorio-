import { CanActivateFn, Router } from '@angular/router'; // Importa CanActivateFn y Router de Angular Router
import { AuthService } from '../servicios/auth.service'; // Importa el servicio AuthService
import { inject } from '@angular/core'; // Importa la función inject de Angular

// Define una función de guardia de ruta llamada checkAdminGuard
export const checkAdminGuard: CanActivateFn = (route, state) => {
  const authService: AuthService = inject(AuthService); // Inyecta el servicio AuthService
  const router: Router = inject(Router); // Inyecta el servicio Router

  // Verifica si el usuario tiene privilegios de administrador
  if (authService.isAdmin()) {
    return true; // Permite la navegación si el usuario es administrador
  }

  router.navigate(['']); // Redirige al usuario a la página principal si no es administrador
  return false; // Impide la navegación
};
