import { FastifyPluginAsync } from "fastify";

const websocket: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.get("/", { websocket: true }, (socket, req) => {
    socket.on('message', (message) => {
      const messageString = message.toString();
      const data = JSON.parse(messageString);

      if (data.type === 'positionChanged') {
        const positionUpdate = JSON.stringify({
          type: 'repartidorPosition',
          data: data.data, // { lat, lon }
        });
        const server = fastify.websocketServer;

        for (const socket of server.clients) {

          socket.send(positionUpdate);

        }
      }
    });
    socket.on("connection", (message) => {
      console.log("Se conecto el usuario.");
    });

    socket.on("close", (message) => {
      console.log("Se cerro la conexión.");
    });
  });
};
export default websocket;
