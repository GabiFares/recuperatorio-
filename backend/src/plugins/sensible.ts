import fp from "fastify-plugin";
import sensible, { FastifySensibleOptions } from "@fastify/sensible";

/**
 * Plugin para manejar errores HTTP de manera más eficiente.
 *
 * Este plugin agrega utilidades para devolver respuestas de error
 * con códigos HTTP y mensajes consistentes.
 *
 * @see https://github.com/fastify/fastify-sensible
 */
export default fp<FastifySensibleOptions>(async (fastify) => {
  fastify.register(sensible);
});
