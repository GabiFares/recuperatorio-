import {
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
  FastifyPluginAsync,
} from "fastify";
import got from "got";
import { query } from "../../../../services/database.js";
import { OAuth2Namespace } from "@fastify/oauth2";

// Declara el namespace para usar Google OAuth2.
declare module "fastify" {
  interface FastifyInstance {
    googleOAuth2: OAuth2Namespace;
  }
}

// Interface que describe la información del usuario obtenida de Google.
interface GoogleUserInfo {
  id: string;
  email: string;
  verified_email: boolean;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  locale: string;
}

// Plugin de rutas para manejar la autenticación con Google.
const googleRoutes: FastifyPluginAsync = async (
  fastify: FastifyInstance,
  opts: any
): Promise<void> => {
  fastify.get(
    "/callback", // Ruta de callback para Google OAuth.
    async function (request: FastifyRequest, reply: FastifyReply) {
      const { token: googletoken } =
        await fastify.googleOAuth2.getAccessTokenFromAuthorizationCodeFlow(
          request
        );

      console.log({ googletoken });

      // Solicita la información del usuario a Google.
      const userInfo: GoogleUserInfo = await got
        .get("https://www.googleapis.com/oauth2/v2/userinfo", {
          headers: {
            Authorization: `Bearer ${googletoken.access_token}`,
          },
        })
        .json();

      console.log({ userInfo });

      // Verifica si el usuario ya existe en la base de datos.
      const res = await query("SELECT * FROM usuario WHERE email=$1", [
        userInfo.email,
      ]);

      // Si no existe, redirige al formulario de registro.
      if (res.rowCount === 0) {
        const formUrl = `https://${
          process.env.FRONT_URL
        }/registro?email=${encodeURIComponent(
          userInfo.email
        )}&given_name=${encodeURIComponent(
          userInfo.given_name
        )}&family_name=${encodeURIComponent(userInfo.family_name || "")}`;
        return reply.redirect(formUrl);
      }

      // Si existe, genera un token JWT y redirige al cliente.
      const payload = {
        id: res.rows[0].id,
        email: res.rows[0].email,
        isAdmin: res.rows[0].admin,
        expiresIn: "3h",
        isRepartidor: res.rows[0].repartidor
      };

      const token = fastify.jwt.sign(payload);
      const url = `https://${process.env.FRONT_URL}/?token=${token}`;
      return reply.redirect(url);
    }
  );
};

export default googleRoutes;
