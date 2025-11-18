/**
 * FUNCIONES AUXILIARES - NO MODIFICAR
 * 
 * Este archivo contiene funciones de ayuda que puedes usar en tus ejercicios.
 * Lee la documentación de cada función para entender cómo usarlas.
 */

const { PNG } = require('pngjs');
const fs = require('fs');

/**
 * Crea una matriz vacía de dimensiones específicas
 * @param {number} filas - Número de filas
 * @param {number} columnas - Número de columnas
 * @param {*} valorInicial - Valor inicial para cada elemento (default: 0)
 * @returns {Array<Array>} - Matriz inicializada
 * 
 * @example
 * const matriz = crearMatrizVacia(3, 3, 0);
 * // Retorna: [[0,0,0], [0,0,0], [0,0,0]]
 */
function crearMatrizVacia(filas, columnas, valorInicial = 0) {
  const matriz = [];
  for (let i = 0; i < filas; i++) {
    const fila = [];
    for (let j = 0; j < columnas; j++) {
      fila.push(valorInicial);
    }
    matriz.push(fila);
  }
  return matriz;
}

/**
 * Valida que una matriz sea válida
 * @param {Array} matriz - Matriz a validar
 * @throws {Error} Si la matriz no es válida
 * 
 * @example
 * validarMatriz([[1,2], [3,4]]); // OK
 * validarMatriz([[1,2], [3]]);    // Error: filas de diferente tamaño
 */
function validarMatriz(matriz) {
  if (!Array.isArray(matriz)) {
    throw new Error('La matriz debe ser un array');
  }
  
  if (matriz.length === 0) {
    throw new Error('La matriz no puede estar vacía');
  }
  
  if (!Array.isArray(matriz[0])) {
    throw new Error('Cada fila de la matriz debe ser un array');
  }
  
  const columnas = matriz[0].length;
  for (let i = 1; i < matriz.length; i++) {
    if (!Array.isArray(matriz[i])) {
      throw new Error(`La fila ${i} no es un array`);
    }
    if (matriz[i].length !== columnas) {
      throw new Error(`Todas las filas deben tener el mismo número de columnas. Fila 0: ${columnas} columnas, Fila ${i}: ${matriz[i].length} columnas`);
    }
  }
}

/**
 * Obtiene las dimensiones de una matriz
 * @param {Array<Array>} matriz - Matriz
 * @returns {Object} - {filas, columnas}
 * 
 * @example
 * const dims = obtenerDimensiones([[1,2,3], [4,5,6]]);
 * // Retorna: {filas: 2, columnas: 3}
 */
function obtenerDimensiones(matriz) {
  validarMatriz(matriz);
  return {
    filas: matriz.length,
    columnas: matriz[0].length
  };
}

/**
 * Valida que un valor esté en el rango de un canal de color (0-255)
 * @param {number} valor - Valor a validar
 * @returns {number} - Valor limitado al rango 0-255
 * 
 * @example
 * limitarValorColor(300); // Retorna: 255
 * limitarValorColor(-10); // Retorna: 0
 * limitarValorColor(128); // Retorna: 128
 */
function limitarValorColor(valor) {
  return Math.max(0, Math.min(255, Math.round(valor)));
}

/**
 * Valida que un pixel tenga la estructura correcta {r, g, b, a}
 * @param {Object} pixel - Pixel a validar
 * @throws {Error} Si el pixel no es válido
 */
function validarPixel(pixel) {
  if (typeof pixel !== 'object' || pixel === null) {
    throw new Error('El pixel debe ser un objeto');
  }
  
  const propiedades = ['r', 'g', 'b', 'a'];
  for (const prop of propiedades) {
    if (!(prop in pixel)) {
      throw new Error(`El pixel debe tener la propiedad '${prop}'`);
    }
    if (typeof pixel[prop] !== 'number') {
      throw new Error(`La propiedad '${prop}' debe ser un número`);
    }
  }
}

/**
 * Crea un pixel con valores específicos
 * @param {number} r - Rojo (0-255)
 * @param {number} g - Verde (0-255)
 * @param {number} b - Azul (0-255)
 * @param {number} a - Alpha/Transparencia (0-255), default: 255
 * @returns {Object} - Pixel {r, g, b, a}
 * 
 * @example
 * const rojo = crearPixel(255, 0, 0);
 * // Retorna: {r: 255, g: 0, b: 0, a: 255}
 */
function crearPixel(r, g, b, a = 255) {
  return {
    r: limitarValorColor(r),
    g: limitarValorColor(g),
    b: limitarValorColor(b),
    a: limitarValorColor(a)
  };
}

/**
 * Copia profunda de una matriz
 * @param {Array<Array>} matriz - Matriz a copiar
 * @returns {Array<Array>} - Copia de la matriz
 * 
 * @example
 * const original = [[1,2], [3,4]];
 * const copia = copiarMatriz(original);
 * copia[0][0] = 99;
 * // original sigue siendo [[1,2], [3,4]]
 */
function copiarMatriz(matriz) {
  return matriz.map(fila => {
    return fila.map(elemento => {
      if (typeof elemento === 'object' && elemento !== null) {
        return { ...elemento };
      }
      return elemento;
    });
  });
}

/**
 * Verifica si un archivo existe
 * @param {string} ruta - Ruta del archivo
 * @returns {boolean} - true si existe, false si no
 */
function archivoExiste(ruta) {
  try {
    return fs.existsSync(ruta);
  } catch (error) {
    return false;
  }
}

/**
 * Asegura que un directorio existe, si no lo crea
 * @param {string} ruta - Ruta del directorio
 */
function asegurarDirectorio(ruta) {
  if (!fs.existsSync(ruta)) {
    fs.mkdirSync(ruta, { recursive: true });
  }
}

/**
 * Imprime información de una matriz (útil para debug)
 * @param {Array<Array>} matriz - Matriz a inspeccionar
 * @param {string} nombre - Nombre descriptivo (opcional)
 */
function imprimirInfoMatriz(matriz, nombre = 'Matriz') {
  try {
    validarMatriz(matriz);
    const dims = obtenerDimensiones(matriz);
    console.log(`\n${nombre}:`);
    console.log(`   Dimensiones: ${dims.filas} × ${dims.columnas}`);
    console.log(`   Total elementos: ${dims.filas * dims.columnas}`);
    
    // Si es matriz de píxeles, mostrar info del primer pixel
    if (matriz[0][0] && typeof matriz[0][0] === 'object' && 'r' in matriz[0][0]) {
      console.log(`   Tipo: Matriz de píxeles RGB`);
      console.log(`   Pixel [0,0]: R=${matriz[0][0].r}, G=${matriz[0][0].g}, B=${matriz[0][0].b}, A=${matriz[0][0].a}`);
    }
  } catch (error) {
    console.error(`❌ Error al imprimir info de ${nombre}:`, error.message);
  }
}

// ============================================
// EXPORTAR FUNCIONES
// ============================================
module.exports = {
  crearMatrizVacia,
  validarMatriz,
  obtenerDimensiones,
  limitarValorColor,
  validarPixel,
  crearPixel,
  copiarMatriz,
  archivoExiste,
  asegurarDirectorio,
  imprimirInfoMatriz
};
