import fp from "fastify-plugin";
import multipart from "@fastify/multipart";

/**
 * Plugin para manejar formularios multipart (archivos y datos).
 *
 * Este plugin utiliza @fastify/multipart para procesar formularios
 * que incluyen datos y archivos.
 */
export default fp(async (fastify) => {
  fastify.register(multipart, {
    limits: {
      fieldNameSize: 100, // Tamaño máximo del nombre del campo (en bytes).
      fieldSize: 100, // Tamaño máximo del valor del campo (en bytes).
      fields: 10, // Número máximo de campos no relacionados con archivos.
      fileSize: 1024 * 1024 * 10, // Tamaño máximo de archivos (10 MB).
      files: 1, // Número máximo de campos de archivo.
      headerPairs: 100, // Número máximo de pares clave-valor en el encabezado.
      parts: 1000, // Número máximo de partes en el formulario (campos + archivos).
    },
    attachFieldsToBody: "keyValues", // Adjunta los campos al cuerpo como clave-valor.
  });
});
