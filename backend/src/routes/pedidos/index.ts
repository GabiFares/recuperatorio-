import { FastifyPluginAsync } from "fastify";
import { query } from "../../services/database.js";
import {
  PedidoPostSchema,
  PedidoPostType,
  PedidoSchema,
} from "../../types/pedidos.js";
import { IdPedidoSchema } from "../../types/detalle_pedido.js";

const pedidosRoute: FastifyPluginAsync = async (
  fastify,
  opts
): Promise<void> => {
  // ################################################### POST ###################################################
  // Ruta para crear un nuevo pedido
  fastify.post("/", {
    schema: {
      summary: "Creación de un pedido",
      tags: ["Pedidos"],
      description: "Creación de un nuevo pedido",
      security: [{ BearerAuth: [] }],
      body: PedidoPostSchema,
      response: {
        201: {
          description: "Muestra el objeto resultante del pedido creado",
          type: "object",
          properties: {
            ...PedidoPostSchema.properties,
            id_pedido: { type: "integer" },
          },
        },
      },
    },
    onRequest: [fastify.authenticate], // Middleware para autenticar
    handler: async function (request, reply) {
      const bodyPedido: PedidoPostType = request.body as PedidoPostType;

      await query("BEGIN");

      try {
        // Verifica si el local especificado existe
        const localExists = await query(
          "SELECT id_local FROM local WHERE id_local = $1",
          ["1"]
        );
        if (localExists.rows.length === 0) {
          await query("ROLLBACK");
          return reply
            .status(400)
            .send({ error: "El local especificado no existe" });
        }

        // Verifica si el usuario especificado existe
        const userExists = await query("SELECT id FROM usuario WHERE id = $1", [
          bodyPedido.id_usuario,
        ]);
        if (userExists.rows.length === 0) {
          await query("ROLLBACK");
          return reply
            .status(400)
            .send({ error: "El usuario especificado no existe" });
        }

        // Inserta el nuevo pedido en la base de datos
        const result = await query(
          `INSERT INTO pedido(
            estado,
            importe_total,
            id_local,
            id_usuario,
            id_direccion
          ) VALUES($1, $2, $3, $4, $5) RETURNING *`,
          [
            bodyPedido.estado || "PENDIENTE",
            bodyPedido.importe_total,
            bodyPedido.id_local,
            bodyPedido.id_usuario,
            bodyPedido.id_direccion || 1
          ]
        );

        await query("COMMIT");
        reply.code(201).send(result.rows[0]);
      } catch (error) {
        await query("ROLLBACK");
        return reply.status(500).send(error);
      }
    },
  });

  // ################################################### PUT ###################################################
  // Ruta para modificar un pedido existente por su ID
  fastify.put("/:id_pedido", {
    schema: {
      summary: "Modificación de un pedido por su id",
      description:
        "### Implementa y valida: \n " +
        " - token \n " +
        " - params \n " +
        " - body \n " +
        " - response \n ",
      tags: ["Pedidos"],
      security: [{ BearerAuth: [] }],
      params: {
        type: "object",
        properties: {
          id_pedido: { type: "string" },
        },
        required: ["id_pedido"],
      },
      body: PedidoPostSchema,
      response: {
        200: {
          description: "Muestra el pedido actualizado",
          type: "object",
          properties: {
            ...PedidoPostSchema.properties,
          },
        },
      },
    },
    onRequest: [fastify.authenticate], // Middleware para autenticar
    handler: async function (request, reply) {
      const bodyPedido: PedidoPostType = request.body as PedidoPostType;
      const id_pedido = (request.params as { id_pedido: string }).id_pedido;

      await query("BEGIN");

      try {
        // Verifica si el pedido existe
        const existingPedido = await query(
          "SELECT * FROM pedido WHERE id_pedido = $1",
          [id_pedido]
        );
        if (existingPedido.rows.length === 0) {
          await query("ROLLBACK");
          return reply.status(404).send({ error: "Pedido no encontrado" });
        }

        // Verifica si el local especificado existe
        const localExists = await query(
          "SELECT id_local FROM local WHERE id_local = $1",
          [bodyPedido.id_local]
        );
        if (localExists.rows.length === 0) {
          await query("ROLLBACK");
          return reply
            .status(400)
            .send({ error: "El local especificado no existe" });
        }
        const direccionExists = await query(
          "SELECT id FROM direccion WHERE id = $1",
          [bodyPedido.id_direccion]
        );
        if (direccionExists.rows.length === 0) {
          await query("ROLLBACK");
          return reply
            .status(400)
            .send({ error: "La dirección especificada no existe" });
        }

        // Verifica si el usuario especificado existe
        const userExists = await query("SELECT id FROM usuario WHERE id = $1", [
          bodyPedido.id_usuario,
        ]);
        if (userExists.rows.length === 0) {
          await query("ROLLBACK");
          return reply
            .status(400)
            .send({ error: "El usuario especificado no existe" });
        }

        // Actualiza el pedido en la base de datos
        const result = await query(
          `UPDATE pedido SET
            estado = $1,
            importe_total = $2,
            id_local = $3,
            id_usuario = $4,
            id_direccion = $5
          WHERE id_pedido = $6
          RETURNING *`,
          [
            bodyPedido.estado,
            bodyPedido.importe_total,
            bodyPedido.id_local,
            bodyPedido.id_usuario,
            bodyPedido.id_direccion,
            id_pedido,
          ]
        );

        await query("COMMIT");
        const server = fastify.websocketServer;

        for (const socket of server.clients) {

          socket.send("Actualizacion_pedido");

        }

        reply.code(200).send(result.rows[0]);
      } catch (error) {
        await query("ROLLBACK");
        return reply.status(500).send(error);
      }
    },
  });
  // Ruta para obtener una lista completa de pedidos
  fastify.get("/", {
    schema: {
      summary: "Listado de pedidos completo",
      description: "### Implementa y valida: \n " + "- token",
      tags: ["Pedidos"],
      security: [{ BearerAuth: [] }],
      response: {
        200: {
          description: "Proporciona todos los pedidos y sus datos",
          type: "array",
          properties: {
            ...IdPedidoSchema.properties,
            ...PedidoSchema.properties,
          },
          examples: [
            {
              id_pedido: 1,
              fecha_hora: "2024-10-27T15:30:00Z",
              estado: "PENDIENTE",
              importe_total: 1500,
              id_local: 1,
              id_direccion: 1,
              id_usuario: 1,
            },
          ],
        },
      },
    },
    onRequest: [fastify.authenticate], // Middleware para autenticar
    handler: async function (request, reply) {
      try {
        // Consulta para obtener todos los pedidos ordenados por fecha y hora
        const response = await query(
          "SELECT * FROM pedido ORDER BY fecha_hora DESC"
        );
        if (response.rows.length === 0) {
          return reply.status(404).send("No se encontró ningún pedido");
        }
        reply.code(200);
        return response.rows;
      } catch (error) {
        return reply.status(500).send(error);
      }
    },
  });

  // Ruta para obtener un pedido por su ID
  fastify.get("/:id_pedido", {
    schema: {
      summary: "Obtener un pedido por su ID",
      description: "### Implementa y valida: \n " + "- token \n - params",
      tags: ["Pedidos"],
      security: [{ BearerAuth: [] }],
      params: {
        type: "object",
        properties: {
          id_pedido: { type: "string" },
        },
        required: ["id_pedido"],
      },
      response: {
        200: {
          description: "Detalles del pedido solicitado",
          type: "object",
          properties: {
            ...PedidoSchema.properties,
          },
        },
      },
    },
    onRequest: [fastify.authenticate], // Middleware para autenticar
    handler: async function (request, reply) {
      const id_pedido = (request.params as { id_pedido: string }).id_pedido;

      try {
        // Consulta para obtener un pedido por su ID
        const response = await query(
          "SELECT * FROM pedido WHERE id_pedido = $1",
          [id_pedido]
        );

        if (response.rows.length === 0) {
          return reply.status(404).send("Pedido no encontrado");
        }

        reply.code(200);
        return response.rows[0];
      } catch (error) {
        return reply.status(500).send(error);
      }
    },
  });

  // Ruta para obtener todos los pedidos de un usuario por su ID
  fastify.get("/usuario/:id_usuario", {
    schema: {
      summary:
        "Obtener todos los pedidos y sus detalles de un usuario por su ID",
      description: "### Implementa y valida: \n - token \n - params",
      tags: ["Pedidos"],
      security: [{ BearerAuth: [] }],
      params: {
        type: "object",
        properties: {
          id_usuario: { type: "string" },
        },
        required: ["id_usuario"],
      },
      response: {
        200: {
          description: "Proporciona todos los pedidos y sus detalles",
          type: "array",
          items: {
            type: "object",
            properties: {
              id_pedido: { type: "number" },
              id_usuario: { type: "number" },
              id_local: { type: "number" },
              id_direccion: { type: "number" },
              importe_total: { type: "number" },
              estado: { type: "string" },
              fecha: { type: "string", format: "date-time" },
              items: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    id_producto: { type: "number" },
                    producto: { type: "string" },
                    precio_unidad: { type: "number" },
                    cantidad: { type: "number" },
                    indicaciones: { type: "string" },
                  },
                },
              },
            },
          },
        },
      },
    },
    onRequest: [fastify.authenticate], // Middleware para autenticar
    handler: async function (request, reply) {
      const id_usuario = (request.params as { id_usuario: string }).id_usuario;

      try {
        // Consulta para obtener todos los pedidos de un usuario por su ID
        const response = await query(
          `
          SELECT 
            p.id_pedido,
            p.id_local,
            p.id_usuario,
            p.id_direccion,
            p.importe_total,
            p.estado,  
            p.fecha_hora,
            dp.id_producto,
            dp.cantidad,
            dp.indicaciones, 
            pr.nombre AS producto,
            pr.precio_unidad -- Incluir precio_unidad
          FROM pedido p
          LEFT JOIN detalle_pedido dp ON p.id_pedido = dp.id_pedido
          LEFT JOIN producto pr ON dp.id_producto = pr.id_producto
          WHERE p.id_usuario = $1
          ORDER BY p.fecha_hora DESC
          `,
          [id_usuario]
        );

        if (response.rows.length === 0) {
          return reply.status(404).send("Pedidos no encontrados");
        }

        // Agrupamos los pedidos y sus detalles
        const pedidos = response.rows.reduce((acc, row) => {
          // Verificamos si el pedido ya fue procesado
          let pedido = acc.find((p: any) => p.id_pedido === row.id_pedido);

          if (!pedido) {
            // Si el pedido no está en la lista, lo añadimos con su estructura básica
            pedido = {
              id_pedido: row.id_pedido,
              id_local: row.id_local,
              id_usuario: row.id_usuario,
              id_direccion: row.id_direccion,
              importe_total: row.importe_total,
              estado: row.estado,
              fecha: row.fecha_hora,
              items: [],
            };
            acc.push(pedido);
          }

          // Si hay detalles, los agregamos al pedido
          if (row.id_producto) {
            pedido.items.push({
              id_producto: row.id_producto,
              producto: row.producto,
              precio_unidad: row.precio_unidad,
              cantidad: row.cantidad,
              indicaciones: row.indicaciones,
            });
          }

          return acc;
        }, []);

        reply.code(200).send(pedidos);
      } catch (error) {
        console.error(error);
        return reply.status(500).send("Error al obtener los pedidos");
      }
    },
  });

  // Ruta para eliminar un pedido por su ID
  fastify.delete("/:id_pedido", {
    schema: {
      summary: "Eliminación de un pedido por su id",
      description:
        "### Implementa y valida: \n " +
        " - token \n " +
        " - params \n " +
        " - response \n ",
      tags: ["Pedidos"],
      security: [{ BearerAuth: [] }],
      params: {
        type: "object",
        properties: {
          id_pedido: { type: "string" },
        },
        required: ["id_pedido"],
      },
      response: {
        204: {
          description: "Pedido eliminado correctamente",
          type: "null",
        },
      },
    },
    onRequest: [fastify.authenticate], // Middleware para autenticar
    handler: async function (request, reply) {
      const id_pedido = (request.params as { id_pedido: string }).id_pedido;

      try {
        // Verifica el estado del pedido antes de eliminarlo
        const pedidoExistente = await query(
          "SELECT estado FROM pedido WHERE id_pedido = $1",
          [id_pedido]
        );

        if (pedidoExistente.rows.length === 0) {
          return reply.status(404).send({
            error: "Pedido no encontrado",
          });
        }

        // Permite eliminar pedidos en estado CANCELADO o cambia su estado a CANCELADO si está PENDIENTE
        if (pedidoExistente.rows[0].estado === "CANCELADO") {
          await query("DELETE FROM pedido WHERE id_pedido = $1", [id_pedido]);
          return reply.code(204).send();
        }

        if (pedidoExistente.rows[0].estado === "PENDIENTE") {
          await query(
            "UPDATE pedido SET estado = 'CANCELADO' WHERE id_pedido = $1 RETURNING *",
            [id_pedido]
          );
          return reply.code(204).send();
        }

        return reply.status(400).send({
          error:
            "Solo se pueden eliminar pedidos en estado PENDIENTE o CANCELADO",
        });
      } catch (error) {
        return reply.status(500).send(error);
      }
    },
  });
};
export default pedidosRoute;
