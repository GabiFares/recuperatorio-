import {
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
  FastifyPluginAsync,
} from "fastify";
import got from "got"; // Librería para hacer solicitudes HTTP.
import { query } from "../../../../services/database.js";
import { OAuth2Namespace } from "@fastify/oauth2";

// Declara el namespace para usar Facebook OAuth2.
declare module "fastify" {
  interface FastifyInstance {
    facebookOAuth2: OAuth2Namespace;
  }
}

// Interface que describe la información del usuario obtenida de Facebook.
interface FacebookUserInfo {
  id: string;
  email: string;
  name: string;
  first_name: string;
  last_name: string;
  picture: {
    data: {
      url: string;
    };
  };
}

// Plugin de rutas para manejar la autenticación con Facebook.
const facebookRoutes: FastifyPluginAsync = async (
  fastify: FastifyInstance,
  opts: any
): Promise<void> => {
  fastify.get(
    "/callback", // Ruta de callback para Facebook OAuth.
    async function (request: FastifyRequest, reply: FastifyReply) {
      try {
        // Obtiene el token de acceso desde el flujo de autorización.
        const { token: facebookToken } =
          await fastify.facebookOAuth2.getAccessTokenFromAuthorizationCodeFlow(
            request
          );

        console.log({ facebookToken });

        // Solicita la información del usuario a Facebook.
        const userInfo: FacebookUserInfo = await got
          .get(
            "https://graph.facebook.com/me?fields=id,email,first_name,last_name,picture",
            {
              headers: {
                Authorization: `Bearer ${facebookToken.access_token}`,
              },
            }
          )
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
            userInfo.first_name
          )}&family_name=${encodeURIComponent(userInfo.last_name || "")}`;
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
      } catch (error) {
        return reply.redirect(`https://${process.env.FRONT_URL}`); // Si ocurre un error, redirige al inicio.
      }
    }
  );
};

export default facebookRoutes;
