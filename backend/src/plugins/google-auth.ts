import fp from "fastify-plugin";
import oauthPlugin, { FastifyOAuth2Options } from "@fastify/oauth2";

/**
 * Plugin para configurar OAuth2 con Google.
 *
 * Este plugin utiliza @fastify/oauth2 para manejar la autenticación
 * con Google y configurar las rutas necesarias para el proceso de login.
 */
export default fp(async (fastify) => {
  const googleOAuth2Options: FastifyOAuth2Options = {
    name: "googleOAuth2", // Nombre del servicio OAuth2.
    scope: ["profile", "email"], // Permisos que se solicitan al usuario.
    credentials: {
      client: {
        id: process.env.GOOGLE_ID || "", // ID del cliente obtenido desde Google.
        secret: process.env.GOOGLE_SECRET || "", // Secreto del cliente obtenido desde Google.
      },
      auth: oauthPlugin.fastifyOauth2.GOOGLE_CONFIGURATION, // Configuración predefinida para Google.
    },
    startRedirectPath: "/auth/login/google", // Ruta de inicio para redirigir al login.
    callbackUri: `https://${process.env.FRONT_URL}/backend/auth/login/google/callback`, // URI de redirección después del login.
    callbackUriParams: {
      access_type: "offline", // Solicita un token de actualización (refreshToken).
    },
    pkce: "S256", // Habilita PKCE para mayor seguridad.
  };

  // Registra el plugin OAuth2 con las opciones configuradas.
  fastify.register(oauthPlugin.fastifyOauth2, googleOAuth2Options);
});
