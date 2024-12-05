import { Static, Type } from "@sinclair/typebox";

// Define el esquema para el identificador del pedido
export const IdPedidoSchema = Type.Object({
  id: Type.Integer({
    description: "Identificador único del pedido",
  }),
});
export type IdPedidoType = Static<typeof IdPedidoSchema>;

// Define el esquema para crear un nuevo pedido
export const PedidoPostSchema = Type.Object(
  {
    estado: Type.String({
      enum: [
        "PENDIENTE",
        "CONFIRMADO",
        "EN_PREPARACION",
        "LISTO",
        "EN_CAMINO",
        "ENTREGADO",
        "CANCELADO",
      ],
      description: "Estado del pedido",
    }),
    importe_total: Type.Number({
      minimum: 0,
      description: "Importe total del pedido",
    }),
    id_local: Type.Integer({
      description: "Identificador del local",
    }),
    id_direccion: Type.Integer({
      description: "Identificador de la dirección donde se va a entregar el pedido.",
    }),
    id_usuario: Type.Integer({
      description: "Identificador del usuario",
    }),
  },
  { additionalProperties: false } // No se permiten propiedades adicionales
);
export type PedidoPostType = Static<typeof PedidoPostSchema>;

// Define el esquema para representar un pedido
export const PedidoSchema = Type.Object(
  {
    id_pedido: Type.Integer({
      description: "Identificador del pedido",
    }),
    fecha_hora: Type.String({
      format: "date-time",
      description: "Fecha y hora del pedido",
    }),
    estado: Type.String({
      enum: [
        "PENDIENTE",
        "CONFIRMADO",
        "EN_PREPARACION",
        "LISTO",
        "EN_CAMINO",
        "ENTREGADO",
        "CANCELADO",
      ],
      description: "Estado del pedido",
    }),
    importe_total: Type.Number({
      minimum: 0,
      description: "Importe total del pedido",
    }),
    id_local: Type.Integer({
      description: "Identificador del local",
    }),
    id_usuario: Type.Integer({
      description: "Identificador del usuario",
    }),
  },
  { additionalProperties: false } // No se permiten propiedades adicionales
);
export type PedidoSchema = Static<typeof PedidoSchema>;
