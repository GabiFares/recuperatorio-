import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core'; // Importa la configuración de la aplicación y la detección de cambios de zona de Angular
import { provideRouter } from '@angular/router'; // Importa la provisión de enrutador de Angular

import { routes } from './app.routes'; // Importa las rutas definidas en el archivo de rutas de la aplicación
import { provideIonicAngular } from '@ionic/angular/standalone'; // Importa la provisión de Ionic Angular para la integración de Ionic

// Define la configuración de la aplicación
export const appConfig: ApplicationConfig = {
  providers: [
    // Habilita la detección de cambios de zona con consolidación de eventos para mejorar el rendimiento
    provideZoneChangeDetection({ eventCoalescing: true }),
    // Provee las rutas definidas para la aplicación
    provideRouter(routes),
    // Provee las configuraciones necesarias para la integración con Ionic Angular
    provideIonicAngular({}),
  ],
};
