import jwt, { FastifyJWTOptions } from "@fastify/jwt";
import { FastifyReply, FastifyRequest } from "fastify";
import fp from "fastify-plugin";

/**
 * Plugin para configurar JSON Web Tokens (JWT) en la aplicación.
 *
 * Este plugin utiliza @fastify/jwt para manejar la autenticación basada
 * en tokens. También incluye decoradores para verificar la autenticación
 * y la autorización de usuarios.
 */
const jwtOptions: FastifyJWTOptions = {
  secret: process.env.JWTSECRET || "defaultSecret", // Clave secreta para firmar los tokens.
};

export default fp<FastifyJWTOptions>(async (fastify) => {
  // Registra el plugin JWT con las opciones configuradas.
  fastify.register(jwt, jwtOptions);

  /**
   * Decorador `authenticate` para verificar si un usuario está autenticado.
   */
  fastify.decorate(
    "authenticate",
    async function (request: FastifyRequest, reply: FastifyReply) {
      try {
        await request.jwtVerify(); // Verifica el token JWT.
      } catch (err) {
        throw reply.unauthorized("Algo salió mal"); // Responde con un error 401 si falla.
      }
    }
  );

  /**
   * Decorador `verifyAdmin` para verificar si el usuario tiene privilegios de administrador.
   */
  fastify.decorate(
    "verifyAdmin",
    async function (request: FastifyRequest, reply: FastifyReply) {
      console.log("Verificando si es administrador.");
      const usuarioToken = request.user; // Datos del usuario extraídos del token.
      if (!usuarioToken.is_admin)
        throw reply.unauthorized("Tienes que ser admin para hacer eso."); // Responde con error 401 si no es admin.
    }
  );
});
