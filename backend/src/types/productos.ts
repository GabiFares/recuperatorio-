import { Static, Type } from "@sinclair/typebox";

// Define el esquema para el identificador del producto
export const IdProductoSchema = Type.Object({
  id_producto: Type.Integer({
    description: "Identificador único del producto",
  }),
});
export type IdProductoType = Static<typeof IdProductoSchema>;

// Define el esquema para representar un producto
export const productoSchema = Type.Object(
  {
    id_producto: Type.Integer({
      description: "Identificador del producto",
    }),
    nombre: Type.String({
      minLength: 3,
      maxLength: 50,
      pattern: "^[^\\d]+$", // Valida que no contenga dígitos
      examples: ["Hamburgesa Triple"],
    }),
    descripcion: Type.String({
      minLength: 3,
      maxLength: 300,
      examples: [
        `Tres patties de 100% carne de res con cebolla picada, ketchup, mostaza y dos fetas de queso americano.`,
      ],
    }),
    precio_unidad: Type.Number({
      examples: [300],
    }),
    id_categoria: Type.Integer({
      description: "Identificador de la categoría",
    }),
    foto: Type.Object({}, { additionalProperties: false }), // Campo para la foto del producto
  },
  { additionalProperties: false } // No se permiten propiedades adicionales
);
export type productoSchemaType = Static<typeof productoSchema>;

// Define el esquema para crear un nuevo producto utilizando un subconjunto de las propiedades del producto
export const productoPost = Type.Pick(productoSchema, [
  "nombre",
  "descripcion",
  "precio_unidad",
  "id_categoria",
  "foto",
]);
export type productoPostType = Static<typeof productoPost>;

// Define el esquema para obtener un producto
export const productoGet = Type.Object(
  {
    nombre: productoSchema.properties.nombre,
    descripcion: productoSchema.properties.descripcion,
    precio_unidad: productoSchema.properties.precio_unidad,
    id_categoria: productoSchema.properties.id_categoria,
    foto: Type.Boolean({
      description: "Indica si el producto tiene foto con un true.",
    }),
  },
  { additionalProperties: false }
);
export type productoGetType = Static<typeof productoGet>;
