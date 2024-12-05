// Importamos los tipos necesarios y el servicio de base de datos
import { FastifyPluginAsync } from "fastify";
import {
  IdCategoriaSchema,
  CategoriaPostSchema,
  Categoria,
} from "../../types/categoria.js"; // Esquemas relacionados con las categorías
import { query } from "../../services/database.js"; // Servicio de base de datos para ejecutar consultas

// Definición del plugin de Fastify para las rutas de categorías
const categoriasRoute: FastifyPluginAsync = async (
  fastify, // Instancia de Fastify
  opts // Opciones para el plugin
): Promise<void> => {
  // ################################################### GET ###################################################

  fastify.get("/", {
    schema: {
      summary: "Listado de categorías completo", // Descripción corta
      description: "### Implementa y valida: \n " + "- token", // Descripción extendida
      tags: ["Categorias"], // Etiquetas para categorizar la ruta
      security: [{ BearerAuth: [] }], // Seguridad mediante token Bearer
      response: {
        // Definimos cómo será la respuesta
        200: {
          description: "Proporciona todas las categorías y sus datos", // Descripción de la respuesta
          type: "array", // Respuesta tipo array
          properties: {
            // Propiedades de la categoría
            ...IdCategoriaSchema.properties, // Incluimos el esquema de id_categoria
            ...Categoria.properties, // Incluimos el esquema de la categoría
          },
          examples: [
            // Ejemplo de una respuesta válida
            {
              id_categoria: 1,
              nombre: "COMIDA",
            },
          ],
        },
      },
    },
    onRequest: [fastify.authenticate], // Middleware para autenticación
    handler: async function (request, reply) {
      // Handler de la ruta
      const response = await query("SELECT * FROM categoria"); // Consulta SQL para obtener todas las categorías
      if (response.rows.length == 0 || !response.rows) {
        // Verificamos si no hay categorías
        return reply.status(404).send("No se encontró ninguna categoría"); // Respuesta 404 si no hay categorías
      }
      reply.code(200); // Código 200 si hay categorías
      return response.rows; // Retornamos las categorías
    },
  });

  // ################################################### PUT ###################################################

  fastify.put("/:id_categoria", {
    schema: {
      summary: "Modificación de una categoría por su id", // Descripción corta
      description:
        "### Implementa y valida: \n " +
        " - token \n " +
        " - params \n " +
        " - body \n " +
        " - response. \n ", // Descripción extendida
      tags: ["Categorias"], // Etiquetas para categorizar la ruta
      security: [{ BearerAuth: [] }], // Seguridad mediante token Bearer
      params: {
        // Parámetros de la URL
        type: "object",
        properties: {
          id_categoria: { type: "string" }, // El parámetro id_categoria es un string
        },
        required: ["id_categoria"], // El parámetro es obligatorio
      },
      body: CategoriaPostSchema, // Esquema para el cuerpo de la solicitud (modificación de categoría)
      response: {
        // Respuesta de la ruta
        200: {
          description:
            "Muestra los cambios que tiene las propiedades de la categoría.", // Descripción de la respuesta
          type: "object", // Tipo de la respuesta
          properties: {
            ...Categoria.properties, // Propiedades de la categoría
          },
        },
      },
    },
    onRequest: [fastify.authenticate], // Middleware para autenticación
    handler: async function (request, reply) {
      // Handler de la ruta
      const bodyCategoria = request.body as CategoriaPostSchema; // Extraemos el cuerpo de la solicitud
      const id_categoria = (request.params as { id_categoria: string })
        .id_categoria; // Extraemos el id_categoria de los parámetros

      try {
        // Realizamos la actualización en la base de datos
        await query(`UPDATE categoria SET nombre=$1 WHERE id_categoria=$2`, [
          bodyCategoria.nombre.toUpperCase(), // Convertimos el nombre a mayúsculas
          id_categoria, // ID de la categoría que se va a actualizar
        ]);
        // Enviamos la respuesta con los cambios realizados
        reply.code(200).send({
          id_categoria: parseInt(id_categoria),
          ...bodyCategoria, // Incluimos el nuevo nombre
        });
      } catch (error) {
        // Manejo de errores
        return reply.status(500).send(error); // Enviamos un error 500 si algo falla
      }
    },
  });

  // ################################################### DELETE #################################################

  fastify.delete("/:id_categoria", {
    schema: {
      summary: "Eliminación de una categoría por su id", // Descripción corta
      description:
        "### Implementa y valida: \n " +
        " - token \n " +
        " - params \n " +
        " - que el usuario que ejecuta es administrador \n " +
        " - response. \n ", // Descripción extendida
      tags: ["Categorias"], // Etiquetas para categorizar la ruta
      security: [{ BearerAuth: [] }], // Seguridad mediante token Bearer
      params: {
        // Parámetros de la URL
        type: "object",
        properties: {
          id_categoria: { type: "string" }, // El parámetro id_categoria es un string
        },
        required: ["id_categoria"], // El parámetro es obligatorio
      },
      response: {
        // Respuesta de la ruta
        204: {
          description: "Categoría eliminada correctamente", // Descripción de la respuesta
          type: "null", // Tipo de la respuesta
        },
      },
    },
    onRequest: [fastify.authenticate], // Middleware para autenticación
    handler: async function (request, reply) {
      // Handler de la ruta
      const id_categoria = (request.params as { id_categoria: string })
        .id_categoria; // Extraemos el id_categoria de los parámetros

      try {
        // Realizamos la eliminación en la base de datos
        await query("DELETE FROM categoria WHERE id_categoria = $1", [
          id_categoria, // ID de la categoría que se va a eliminar
        ]);
      } catch (error) {
        // Manejo de errores
        return reply.status(500).send(error); // Enviamos un error 500 si algo falla
      }
      reply.code(204); // Respuesta 204 si la eliminación fue exitosa
    },
  });

  // ################################################### POST ###################################################

  fastify.post("/", {
    schema: {
      summary: "Creación de una categoría", // Descripción corta
      tags: ["Categorias"], // Etiquetas para categorizar la ruta
      description: "Creación de una nueva categoría", // Descripción extendida
      security: [{ BearerAuth: [] }], // Seguridad mediante token Bearer
      body: CategoriaPostSchema, // Esquema para el cuerpo de la solicitud (nueva categoría)
      response: {
        // Respuesta de la ruta
        201: {
          description: "Muestra el objeto resultante de la categoría creada", // Descripción de la respuesta
          type: "object", // Tipo de la respuesta
          properties: {
            ...Categoria.properties, // Propiedades de la categoría
          },
        },
      },
    },
    onRequest: [fastify.authenticate], // Middleware para autenticación
    handler: async function (request, reply) {
      // Handler de la ruta
      const bodyCategoria = request.body as CategoriaPostSchema; // Extraemos el cuerpo de la solicitud
      try {
        // Realizamos la inserción en la base de datos
        const result = await query(
          `INSERT INTO categoria (nombre) VALUES($1) RETURNING *`,
          [bodyCategoria.nombre.toUpperCase()] // Convertimos el nombre a mayúsculas
        );
        reply.code(201).send(result.rows[0]); // Enviamos la respuesta con la categoría creada
      } catch (error) {
        // Manejo de errores
        return reply.status(500).send(error); // Enviamos un error 500 si algo falla
      }
    },
  });
};

export default categoriasRoute; // Exportamos las rutas para que puedan ser usadas en la aplicación
