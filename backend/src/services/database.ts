import pg from "pg";

// Crear una nueva instancia de Pool de pg
export const pool = new pg.Pool();

/**
 * Función para ejecutar una consulta en la base de datos
 * @param {string} text - La consulta SQL a ejecutar
 * @param {(string | number | string[] | number[] | boolean)[]} [params] - Parámetros opcionales para la consulta
 * @returns {Promise<pg.QueryResult>} - El resultado de la consulta
 */
export const query = async (
  text: string,
  params?: (string | number | string[] | number[] | boolean)[]
) => {
  // const start = Date.now() // Iniciar el temporizador (descomentado si es necesario para medir la duración)
  const res = await pool.query(text, params); // Ejecutar la consulta con los parámetros dados
  // const duration = Date.now() - start // Calcular la duración de la consulta (descomentado si es necesario)
  // console.log('executed query', { text, duration, rows: res.rowCount }) // Registrar información sobre la consulta (descomentado si es necesario)
  return res; // Devolver el resultado de la consulta
};
