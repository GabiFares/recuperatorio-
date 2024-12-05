import swagger, { SwaggerOptions } from "@fastify/swagger";
import fp from "fastify-plugin";
import swaggerui from "@fastify/swagger-ui";

/**
 * Plugin para documentar la API utilizando Swagger.
 *
 * Este plugin utiliza @fastify/swagger y @fastify/swagger-ui
 * para generar y servir la documentación de la API.
 */
const options: SwaggerOptions = {
  openapi: {
    openapi: "3.0.0", // Especificación OpenAPI.
    info: {
      title: "FoodCartApi", // Título de la API.
      description: "FoodCartApi", // Descripción de la API.
      version: "0.1.0", // Versión de la API.
    },
    servers: [
      {
        url: `https://${process.env.FRONT_URL}/backend`, // Servidor de desarrollo.
        description: "Development server",
      },
    ],
    tags: [
      { name: "Usuarios", description: "CRUD de usuarios" },
      { name: "Auth", description: "Autorización para logearse" },
      { name: "Locales", description: "CRUD de locales" },
      { name: "Pedidos", description: "CRUD de pedidos" },
      { name: "Productos", description: "CRUD de productos" },
      { name: "Categorias", description: "CRUD de categorias" },
      { name: "Detalle_Pedidos", description: "CRUD de detalles pedidos" },
      { name: "Direcciones", description: "Consultas con direcciones" },
    ],
    components: {
      securitySchemes: {
        apiKey: {
          type: "apiKey",
          name: "apiKey",
          in: "header",
        },
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    externalDocs: {
      url: "https://swagger.io",
      description: "Más información aquí",
    },
  },
};

export default fp<SwaggerOptions>(async (fastify) => {
  await fastify.register(swagger, options);
  await fastify.register(swaggerui, {
    routePrefix: "docs", // Ruta donde se sirve la documentación.
    uiConfig: {
      docExpansion: "none",
      deepLinking: false,
    },
    uiHooks: {
      onRequest: function (request, reply, next) {
        next(); // Middleware previo a las solicitudes de la UI.
      },
      preHandler: function (request, reply, next) {
        next(); // Middleware previo al manejo de las solicitudes.
      },
    },
    staticCSP: true,
    transformStaticCSP: (header) => header,
    transformSpecification: (swaggerObject, request, reply) => {
      return swaggerObject; // Transforma la especificación de Swagger.
    },
    transformSpecificationClone: true,
  });
});
