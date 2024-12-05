import { FastifyPluginAsync } from "fastify";
import { pool, query } from "../../services/database.js";
import {
  IdLocalSchema,
  LocalPostSchema,
  LocalSchema,
} from "../../types/locales.js";
import { join } from "path";
import { writeFileSync } from "fs";

const localesRoute: FastifyPluginAsync = async (
  fastify,
  opts
): Promise<void> => {
  // ################################################### GET ###################################################
  // Ruta para obtener un listado de todos los locales
  fastify.get("/", {
    schema: {
      summary: "Listado de todos los locales",
      description: " ",
      tags: ["Locales"],
      security: [{ BearerAuth: [] }],
      response: {
        200: {
          description: "Proporciona todos los locales y sus datos",
          type: "array",
          properties: {
            ...IdLocalSchema.properties,
            ...LocalSchema.properties,
          },
          examples: [{}],
        },
      },
    },
    onRequest: [fastify.authenticate], // Middleware para autenticar
    handler: async function (request, reply) {
      const response = await query("SELECT * FROM local");
      if (response.rows.length == 0 || !response.rows) {
        return reply.status(404).send("No se encontró ningún local");
      }
      reply.code(200);
      return response.rows;
    },
  });

  // ################################################### PUT ###################################################
  // Ruta para actualizar un local existente por ID
  fastify.put("/:id", {
    schema: {
      summary: "Actualización de un local",
      tags: ["Locales"],
      description: "Actualización de un local existente",
      security: [{ BearerAuth: [] }],
      params: {
        type: "object",
        required: ["id"],
        properties: {
          id: { type: "string" },
        },
      },
      body: LocalPostSchema,
      response: {
        200: {
          description: "Muestra el objeto resultante del local actualizado",
          type: "object",
          properties: {
            ...LocalSchema.properties,
          },
        },
      },
    },
    onRequest: [fastify.authenticate], // Middleware para autenticar
    handler: async function (request, reply) {
      const localId = (request.params as { id: string }).id;
      const updateLocal = request.body as LocalPostSchema;
      const client = await pool.connect();

      if (updateLocal.foto && Object.keys(updateLocal.foto).length > 0) {
        try {
          const fileBuffer = updateLocal.foto as Buffer;
          const fileName = join(
            process.cwd(),
            "Resources",
            updateLocal.nombre + ".jpg"
          );
          writeFileSync(fileName, fileBuffer); // Guarda la imagen en el servidor
        } catch (error) {
          console.error("Error al intentar actualizar la imagen:", error);
          return reply
            .status(500)
            .send("Hubo un error al intentar actualizar la imagen");
        }
      }

      try {
        await client.query("BEGIN");

        // Primero verificamos si el local existe
        const localExists = await client.query(
          "SELECT id_direccion, id_telefono FROM local WHERE id_local = $1",
          [localId]
        );

        if (localExists.rows.length === 0) {
          await client.query("ROLLBACK");
          return reply.status(404).send("Local no encontrado");
        }

        const { id_direccion, id_telefono } = localExists.rows[0];

        // Actualiza la dirección
        await client.query(
          `UPDATE direccion 
           SET numero = $1, calle = $2
           WHERE id = $3`,
          [updateLocal.numero, updateLocal.calle, id_direccion]
        );

        // Actualiza el teléfono
        await client.query(
          `UPDATE telefono 
           SET numeroTel = $1
           WHERE id = $2`,
          [updateLocal.telefono, id_telefono]
        );

        // Actualiza el local
        const result = await client.query(
          `UPDATE local 
           SET nombre = $1
           WHERE id_local = $2
           RETURNING id_local`,
          [updateLocal.nombre, localId]
        );

        await client.query("COMMIT");

        return reply.status(200).send({
          id: result.rows[0].id_local,
          ...updateLocal,
        });
      } catch (error) {
        await client.query("ROLLBACK");
        console.error("Error en la transacción:", error);
        return reply.status(500).send("Error al actualizar el local");
      } finally {
        client.release();
      }
    },
  });

  // ################################################### DELETE ##################################################
  // Ruta para borrar un local por ID
  fastify.delete("/:id", {
    schema: {
      summary: "Borrar un local",
      description: " ",
      tags: ["Locales"],
      security: [{ BearerAuth: [] }],
      params: {
        type: "object",
        properties: {
          id: { type: "string" },
        },
        required: ["id"],
      },
      response: {
        200: {},
      },
    },
    onRequest: [fastify.authenticate], // Middleware para autenticar
    handler: async function (request, reply) {
      const id = (request.params as { id: string }).id;
      try {
        await query("DELETE FROM local WHERE id_local = $1", [id]);
      } catch (error) {
        return reply.status(500).send(error);
      }
      return reply.status(204).send();
    },
  });

  // ################################################### POST ###################################################
  // Ruta para crear un nuevo local
  fastify.post("/", {
    schema: {
      summary: "Creación de un local",
      tags: ["Locales"],
      description: "Creación de un local",
      security: [{ BearerAuth: [] }],
      body: LocalPostSchema,
      response: {
        201: {
          description: "Muestra el objeto resultante del local creado",
          type: "object",
          properties: {
            ...LocalSchema.properties,
          },
        },
      },
    },
    onRequest: [fastify.authenticate], // Middleware para autenticar
    handler: async function (request, reply) {
      const postLocal = request.body as LocalPostSchema;
      const client = await pool.connect();

      if (postLocal.foto && Object.keys(postLocal.foto).length > 0) {
        try {
          const fileBuffer = postLocal.foto as Buffer;
          const fileName = join(
            process.cwd(),
            "Resources",
            postLocal.nombre + ".jpg"
          );
          writeFileSync(fileName, fileBuffer); // Guarda la imagen en el servidor
        } catch (error) {
          console.error("Error al intentar crear la imagen:", error);
          return reply
            .status(500)
            .send("Hubo un error al intentar crear la imagen");
        }
      }
      try {
        await client.query("BEGIN");

        const result = await client.query(
          `
          WITH direccion_insert AS (
            INSERT INTO direccion (numero, calle) 
            VALUES ($1, $2) 
            RETURNING id
          ),
          telefono_insert AS (
            INSERT INTO telefono (numeroTel) 
            VALUES ($3) 
            RETURNING id
          ),
          local_insert AS (
            INSERT INTO local (nombre, id_direccion, id_telefono) 
            VALUES ($4, (SELECT id FROM direccion_insert), (SELECT id FROM telefono_insert))
            RETURNING id_local
          )
          SELECT id_local FROM local_insert;`,
          [
            postLocal.numero,
            postLocal.calle,
            postLocal.telefono,
            postLocal.nombre,
          ]
        );

        await client.query("COMMIT");

        return reply.status(201).send({
          id: result.rows[0].id_local,
          ...postLocal,
        });
      } catch (error) {
        await client.query("ROLLBACK");
        console.error("Error en la transacción:", error);
        return reply.status(500).send("Error al crear el local");
      } finally {
        client.release();
      }
    },
  });
};

export default localesRoute;
