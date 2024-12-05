import fp from "fastify-plugin";
import estatico from "@fastify/static";
import { join } from "node:path";

/**
 * Plugin para servir archivos estáticos desde un directorio.
 *
 * Este plugin utiliza @fastify/static para exponer recursos
 * estáticos (como imágenes, estilos, scripts) a través de un prefijo.
 */
export default fp(async (fastify) => {
  fastify.register(estatico, {
    root: join(process.cwd(), "Resources"), // Directorio raíz de recursos.
    prefix: "/Resources/", // Prefijo para acceder a los recursos.
  });
});
