import { FastifyPluginAsync } from "fastify";
import { query } from "../../services/database.js";
import {
  IdRegaloSchema,
  regaloPost,
  regaloPostType,
  regaloSchema,
} from "../../types/regalo.js";

const regalosRoute: FastifyPluginAsync = async (
  fastify,
  opts
): Promise<void> => {
  // ################################################### GET ###################################################
  // Ruta para obtener un listado completo de productos
  fastify.get("/", {
    schema: {
      summary: "Listado de regalos completo",
      description: "### Implementa y valida: \n " + "- token",
      tags: ["Regalos"],
      security: [{ BearerAuth: [] }],
      response: {
        200: {
          description: "Proporciona todos los regalos y sus datos",
          type: "array",
          properties: {
            ...IdRegaloSchema.properties,
            ...regaloSchema.properties,
          },
        },
      },
    },
    onRequest: [fastify.authenticate], // Middleware para autenticar
    handler: async function (request, reply) {
      const response = await query("SELECT * FROM regalo");
      if (response.rows.length == 0 || !response.rows) {
        return reply.status(404).send("No se encontro ningun regalo");
      }
      reply.code(200);
      return response.rows;
    },
  });

  fastify.get("/:id_usuario", {
    schema: {
      summary: "Listado de regalo por usuario",
      description: "### Implementa y valida: \n " + "- token",
      tags: ["Regalos"],
      security: [{ BearerAuth: [] }],
      response: {
        200: {
          description: "Proporciona los regalos del usuario y sus datos",
          type: "array",
          properties: {
            ...IdRegaloSchema.properties,
            ...regaloSchema.properties,
          },
        },
      },
    },
    onRequest: [fastify.authenticate], // Middleware para autenticar
    handler: async function (request, reply) {
      const id_usuario = (request.params as { id_usuario: string }).id_usuario;

      const response = await query(
        "SELECT * FROM regalo WHERE id_usuario = $1",
        [id_usuario]
      );
      if (response.rows.length == 0 || !response.rows) {
        return reply.status(404).send("No se encontro ningun regalo");
      }
      reply.code(200);
      return response.rows;
    },
  });

  // ################################################### POST ###################################################
  // Ruta para crear un nuevo producto
  fastify.post("/", {
    schema: {
      summary: "Creación de un regalo",
      tags: ["Regalos"],
      description: "Creación de un regalo ",
      security: [{ BearerAuth: [] }],
      body: regaloPost,
      response: {
        201: {
          description: "Muestra el objeto resultante del producto creado",
          type: "object",
          properties: {
            ...regaloSchema.properties,
          },
        },
      },
    },
    onRequest: [fastify.authenticate], // Middleware para autenticar
    handler: async function (request, reply) {
      const bodyProducto: regaloPostType = request.body as regaloPostType;

      try {
        const result = await query(
          `INSERT INTO regalo(
        id_usuario,
        nombre,
        descripcion,
        precio_unidad
      ) VALUES($1,$2,$3,$4) RETURNING *`,
          [
            bodyProducto.id_usuario,
            bodyProducto.nombre,
            bodyProducto.descripcion,
            bodyProducto.precio_unidad,
          ]
        );

        console.log("emaaaailllll", bodyProducto.email);
        let recipient = bodyProducto.email;

        // Envía un correo de confirmación al usuario
        fastify.mailer.sendMail({
          from: process.env.user,
          to: recipient,
          subject: "Tenes un regalo de FOODCART",
          html: `<b> El dueño te regaló una compra, podes ir a reglos en nuestra página cuando quieras para cobrarlo, muchas gracias por utilizar FoodCart! 😊 </b>`,
        });
        reply.code(200).send(result.rows[0]);
      } catch (error) {
        return reply.status(500).send(error);
      }
    },
  });
};
export default regalosRoute;
