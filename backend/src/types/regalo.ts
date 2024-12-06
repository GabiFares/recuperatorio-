import { Static, Type } from "@sinclair/typebox";

// Define el esquema para el identificador del producto
export const IdRegaloSchema = Type.Object({
  id_regalo: Type.Integer({
    description: "Identificador único del regalo",
  }),
});
export type IdRegaloType = Static<typeof IdRegaloSchema>;

// Define el esquema para representar un producto
export const regaloSchema = Type.Object({
  id_regalo: Type.Integer({
    description: "Identificador del regalo",
  }),
  id_usuario: Type.Integer({
    description: "Identificador del usuario",
  }),
  nombre: Type.String({
    minLength: 3,
    maxLength: 50,
    pattern: "^[^\\d]+$", // Valida que no contenga dígitos
    examples: ["Regalo"],
  }),
  descripcion: Type.String({}),
  precio_unidad: Type.Number({
    examples: [300],
  }),
  email: Type.String({}),
});
export type productoSchemaType = Static<typeof regaloSchema>;

// Define el esquema para crear un nuevo producto utilizando un subconjunto de las propiedades del producto
export const regaloPost = Type.Pick(regaloSchema, [
  "id_usuario",
  "nombre",
  "descripcion",
  "precio_unidad",
  "email",
]);
export type regaloPostType = Static<typeof regaloPost>;
