import { FastifyPluginAsync } from "fastify";
import { query } from "../../../services/database.js";

// Este plugin maneja la autenticación básica mediante email y contraseña.
const auth: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.post("/", {
    // Esquema de validación para la ruta.
    schema: {
      tags: ["Auth"], // Categoría para la documentación Swagger.
      body: {
        type: "object",
        properties: {
          email: {
            type: "string",
            format: "email", // Valida que sea un email válido.
            examples: ["emilio.rodriguez@example.com"], // Ejemplo para la documentación.
          },
          contraseña: { type: "string", examples: ["Contraseña123!"] },
        },
        required: ["email", "contraseña"], // Campos obligatorios.
      },
      response: {
        200: {
          description: "Token del usuario", // Respuesta esperada.
        },
      },
    },
    // Controlador de la ruta.
    handler: async function (request, reply) {
      const { email, contraseña } = request.body as {
        email: string;
        contraseña: string;
      };

      // Consulta a la base de datos para verificar el usuario.
      const checkResult = await query(
        "SELECT id,admin,repartidor FROM usuario WHERE email = $1 AND contraseña = crypt($2, contraseña)",
        [email, contraseña]
      );
      const rows = checkResult.rows;
      if (!rows || rows.length === 0) {
        return reply.unauthorized("Tu correo o contraseña es incorrecto");
      }

      // Si el usuario existe, genera un token JWT.
      const id_usuario = rows[0].id;
      const isAdmin = rows[0].admin;
      const isRepartidor = rows[0].repartidor;
      console.log(isRepartidor);
      const token = fastify.jwt.sign({
        email,
        id: id_usuario,
        expiresIn: "3h", // El token expira en 3 horas.
        isAdmin: isAdmin,
        isRepartidor: isRepartidor
      });
      reply.send({ token }); // Devuelve el token al cliente.
    },
  });
};

export default auth;
