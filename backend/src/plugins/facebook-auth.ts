import fp from "fastify-plugin";
import oauthPlugin, { FastifyOAuth2Options } from "@fastify/oauth2";

/**
 * Plugin para configurar OAuth2 con Facebook.
 *
 * Este plugin utiliza @fastify/oauth2 para manejar la autenticación
 * con Facebook y registrar las rutas necesarias para el proceso de login.
 */
export default fp(async (fastify) => {
  const facebookOAuth2Options: FastifyOAuth2Options = {
    name: "facebookOAuth2", // Nombre del servicio OAuth2.
    scope: ["email", "public_profile"], // Permisos que se solicitan al usuario.
    credentials: {
      client: {
        id: process.env.FACEBOOK_ID || "", // ID del cliente obtenido desde Facebook.
        secret: process.env.FACEBOOK_SECRET || "", // Secreto del cliente obtenido desde Facebook.
      },
      auth: oauthPlugin.fastifyOauth2.FACEBOOK_CONFIGURATION, // Configuración predefinida para Facebook.
    },
    startRedirectPath: "/auth/login/facebook", // Ruta de inicio para redirigir al login.
    callbackUri: `https://${process.env.FRONT_URL}/backend/auth/login/facebook/callback`, // URI de redirección después del login.
  };

  // Registra el plugin OAuth2 con las opciones configuradas.
  fastify.register(oauthPlugin.fastifyOauth2, facebookOAuth2Options);
});
