import fp from "fastify-plugin";

/**
 * Plugin de soporte genérico.
 *
 * Este plugin es un ejemplo de cómo agregar decoradores simples
 * a la instancia de Fastify.
 */
export interface SupportPluginOptions {
  // Opciones específicas del plugin.
}

export default fp<SupportPluginOptions>(async (fastify, opts) => {
  // Decora la instancia con un método de ejemplo.
  fastify.decorate("someSupport", function () {
    return "hugs"; // Devuelve un mensaje de soporte.
  });
});

// Declaración del tipo para TypeScript.
declare module "fastify" {
  export interface FastifyInstance {
    someSupport(): string; // Método de soporte agregado.
  }
}
