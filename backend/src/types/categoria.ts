import { Static, Type } from "@sinclair/typebox";
import _static from "../plugins/static.js";

// Define el esquema para el identificador de categoría
export const IdCategoriaSchema = Type.Object({
  id_categoria: Type.Integer({
    description: "Identificador único de la categoria",
  }),
});
export type IdCategoriaType = Static<typeof IdCategoriaSchema>;

// Define el esquema para crear una nueva categoría
export const CategoriaPostSchema = Type.Object({
  nombre: Type.String({
    minLength: 3,
    maxLength: 20,
    pattern: "^[^\\d]+$", // Valida que no contenga dígitos
    examples: ["Comida"],
  }),
});
export type CategoriaPostSchema = Static<typeof CategoriaPostSchema>;

// Define el esquema para representar una categoría
export const Categoria = Type.Object({
  id_categoria: Type.Integer({
    description: "Identificador único de la categoria",
  }),
  nombre: Type.String({
    minLength: 3,
    maxLength: 20,
    pattern: "^[^\\d]+$", // Valida que no contenga dígitos
    examples: ["Comida"],
  }),
});
export type Categoria = Static<typeof Categoria>;
