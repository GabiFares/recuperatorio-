import { FastifyReply, FastifyRequest } from "fastify";

// Define la interfaz para la función de autenticación
export interface authenticateFunction {
  (request: FastifyRequest, reply: FastifyReply): Promise<void>;
}

// Define la interfaz para la función de verificación de administrador
export interface verifyAdminFunction {
  (request: FastifyRequest, reply: FastifyReply): Promise<void>;
}

// Extiende el módulo de Fastify para incluir las funciones de autenticación y verificación de administrador
declare module "fastify" {
  interface FastifyInstance {
    authenticate: authenticateFunction;
    verifyAdmin: verifyAdminFunction;
  }
}

// Extiende el módulo de JWT para incluir información del usuario en el token
declare module "@fastify/jwt" {
  interface FastifyJWT {
    user: {
      id: string;
      email: string;
      is_admin: boolean;
    };
  }
}
