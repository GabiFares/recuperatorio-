import { Static, Type } from "@sinclair/typebox";
import _static from "../plugins/static.js";

// Define el esquema para el identificador del pedido
export const IdPedidoSchema = Type.Object({
  id_pedido: Type.Integer({
    description: "Identificador único de la Pedido",
  }),
});
export type IdPedidoType = Static<typeof IdPedidoSchema>;

// Define el esquema para el detalle de pedido
export const detalle_pedido = Type.Object({
  id_pedido: Type.Integer({
    description: "Identificador único del pedido",
  }),
  id_producto: Type.Integer({
    description: "Identificado único del producto",
  }),
  cantidad: Type.Integer({}),
  indicaciones: Type.String({
    minLength: 10,
    maxLength: 400,
    examples: ["Sin huevo y la carne a punto"], // Ejemplo de indicaciones para el detalle del pedido
  }),
});
export type detalle_pedido = Static<typeof detalle_pedido>;
