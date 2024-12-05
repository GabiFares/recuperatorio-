import { FastifyInstance, FastifyPluginAsync } from "fastify";
import { IdUsuario, ImagenUsuario } from "../../../../types/usuario.js";
import { extname, join } from "node:path";
import { writeFileSync } from "fs";
import { query } from "../../../../services/database.js";

const rutasImagenUsuario: FastifyPluginAsync = async (
  fastify: FastifyInstance,
  opts
): Promise<void> => {
  // Ruta para subir una imagen de usuario
  fastify.post("/", {
    handler: async function (request, reply) {
      const body = request.body as ImagenUsuario; // Datos del cuerpo de la solicitud (imagen)
      const params = request.params as IdUsuario; // Parámetros de la solicitud (ID del usuario)
      const fileBuffer = body.imagen._buf as Buffer; // Buffer de la imagen
      const extension = extname(body.imagen.filename); // Obtener la extensión del archivo
      const filename = params.id_usuario + extension; // Nombre del archivo
      const destinoArchivo = join(
        process.cwd(),
        "Resources",
        "img",
        "usuarios",
        filename
      );
      // Guardar el archivo en el servidor
      writeFileSync(destinoArchivo, fileBuffer);
      const urlUsuario = "Resources/img/usuarios/" + filename;

      // Actualizar la URL de la imagen en la base de datos
      try {
        await query("UPDATE usuario set foto = $1 WHERE id = $2", [
          urlUsuario,
          params.id_usuario,
        ]);
        return reply.status(201).send("La imagen se creó correctamente");
      } catch (error) {
        return reply.status(500).send(error);
      }
    },
  });
};

export default rutasImagenUsuario;
