// Define la interfaz para representar un producto
export interface Producto {
  id_producto: number; // Campo para el ID del producto
  nombre: string; // Campo para el nombre del producto
  descripcion: string; // Campo para la descripción del producto
  precio_unidad: number; // Campo para el precio por unidad del producto
  id_categoria: number; // Campo para el ID de la categoría del producto
  foto: undefined | null | boolean; // Campo para la foto del producto (puede ser undefined, null o boolean)
  cantidad: number;
}

// Define la interfaz para representar un producto a crear
export interface ProductoPost {
  nombre: string; // Campo para el nombre del producto
  descripcion: string; // Campo para la descripción del producto
  precio_unidad: number; // Campo para el precio por unidad del producto
  id_categoria: number; // Campo para el ID de la categoría del producto
  foto: Blob | undefined | null; // Campo para la foto del producto (puede ser Blob, undefined o null)
}
