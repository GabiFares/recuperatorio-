import nodemailer = require("nodemailer");
import fp from "fastify-plugin";

/**
 * Plugin para configurar un transportador de correos con Nodemailer.
 *
 * Este plugin permite enviar correos electrónicos desde la aplicación,
 * utilizando un servidor SMTP (en este caso, Gmail).
 */
export default fp(async (fastify) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com", // Servidor SMTP de Gmail.
    port: 465, // Puerto seguro para conexiones SSL.
    secure: true, // Habilita SSL.
    auth: {
      user: process.env.user, // Usuario de correo (extraído de las variables de entorno).
      pass: process.env.pass, // Contraseña del correo (extraída de las variables de entorno).
    },
  });

  // Decora la instancia de Fastify con el transportador.
  fastify.decorate("mailer", transporter);
});

// Declaración del tipo para TypeScript.
declare module "fastify" {
  interface FastifyInstance {
    mailer: any; // Propiedad para enviar correos.
  }
}
