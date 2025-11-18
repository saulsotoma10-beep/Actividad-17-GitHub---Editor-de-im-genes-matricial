/**
 * OPERACIONES MATRICIALES - NO MODIFICAR
 * 
 * Este archivo contiene operaciones de álgebra lineal ya implementadas.
 * Los estudiantes pueden usar estas funciones en sus ejercicios.
 * 
 * Conceptos matemáticos implementados:
 * - Suma de matrices
 * - Resta de matrices  
 * - Multiplicación escalar
 * - Multiplicación matricial
 * - Matriz transpuesta
 * - Matriz identidad
 */

const { validarMatriz, obtenerDimensiones, crearMatrizVacia } = require('./utilidades');

/**
 * Suma dos matrices del mismo tamaño
 * Operación: C = A + B, donde C[i][j] = A[i][j] + B[i][j]
 * 
 * @param {Array<Array<number>>} matrizA - Primera matriz
 * @param {Array<Array<number>>} matrizB - Segunda matriz
 * @returns {Array<Array<number>>} - Matriz resultado
 * @throws {Error} Si las matrices no tienen las mismas dimensiones
 * 
 * @example
 * const A = [[1, 2], [3, 4]];
 * const B = [[5, 6], [7, 8]];
 * const C = sumarMatrices(A, B);
 * // C = [[6, 8], [10, 12]]
 */
function sumarMatrices(matrizA, matrizB) {
  validarMatriz(matrizA);
  validarMatriz(matrizB);
  
  const dimsA = obtenerDimensiones(matrizA);
  const dimsB = obtenerDimensiones(matrizB);
  
  if (dimsA.filas !== dimsB.filas || dimsA.columnas !== dimsB.columnas) {
    throw new Error(`Las matrices deben tener las mismas dimensiones. A: ${dimsA.filas}×${dimsA.columnas}, B: ${dimsB.filas}×${dimsB.columnas}`);
  }
  
  const resultado = [];
  for (let i = 0; i < dimsA.filas; i++) {
    const fila = [];
    for (let j = 0; j < dimsA.columnas; j++) {
      fila.push(matrizA[i][j] + matrizB[i][j]);
    }
    resultado.push(fila);
  }
  
  return resultado;
}

/**
 * Resta dos matrices del mismo tamaño
 * Operación: C = A - B, donde C[i][j] = A[i][j] - B[i][j]
 * 
 * @param {Array<Array<number>>} matrizA - Primera matriz
 * @param {Array<Array<number>>} matrizB - Segunda matriz
 * @returns {Array<Array<number>>} - Matriz resultado
 * @throws {Error} Si las matrices no tienen las mismas dimensiones
 * 
 * @example
 * const A = [[5, 6], [7, 8]];
 * const B = [[1, 2], [3, 4]];
 * const C = restarMatrices(A, B);
 * // C = [[4, 4], [4, 4]]
 */
function restarMatrices(matrizA, matrizB) {
  validarMatriz(matrizA);
  validarMatriz(matrizB);
  
  const dimsA = obtenerDimensiones(matrizA);
  const dimsB = obtenerDimensiones(matrizB);
  
  if (dimsA.filas !== dimsB.filas || dimsA.columnas !== dimsB.columnas) {
    throw new Error(`Las matrices deben tener las mismas dimensiones. A: ${dimsA.filas}×${dimsA.columnas}, B: ${dimsB.filas}×${dimsB.columnas}`);
  }
  
  const resultado = [];
  for (let i = 0; i < dimsA.filas; i++) {
    const fila = [];
    for (let j = 0; j < dimsA.columnas; j++) {
      fila.push(matrizA[i][j] - matrizB[i][j]);
    }
    resultado.push(fila);
  }
  
  return resultado;
}

/**
 * Multiplica una matriz por un escalar
 * Operación: B = k * A, donde B[i][j] = k * A[i][j]
 * 
 * @param {Array<Array<number>>} matriz - Matriz a multiplicar
 * @param {number} escalar - Número por el que multiplicar
 * @returns {Array<Array<number>>} - Matriz resultado
 * 
 * @example
 * const A = [[1, 2], [3, 4]];
 * const B = multiplicarPorEscalar(A, 2);
 * // B = [[2, 4], [6, 8]]
 */
function multiplicarPorEscalar(matriz, escalar) {
  validarMatriz(matriz);
  
  if (typeof escalar !== 'number') {
    throw new Error('El escalar debe ser un número');
  }
  
  const dims = obtenerDimensiones(matriz);
  const resultado = [];
  
  for (let i = 0; i < dims.filas; i++) {
    const fila = [];
    for (let j = 0; j < dims.columnas; j++) {
      fila.push(matriz[i][j] * escalar);
    }
    resultado.push(fila);
  }
  
  return resultado;
}

/**
 * Multiplica dos matrices (producto matricial)
 * Operación: C = A × B
 * Condición: número de columnas de A = número de filas de B
 * 
 * @param {Array<Array<number>>} matrizA - Primera matriz (m×n)
 * @param {Array<Array<number>>} matrizB - Segunda matriz (n×p)
 * @returns {Array<Array<number>>} - Matriz resultado (m×p)
 * @throws {Error} Si las dimensiones no son compatibles
 * 
 * @example
 * const A = [[1, 2], [3, 4]];
 * const B = [[5, 6], [7, 8]];
 * const C = multiplicarMatrices(A, B);
 * // C = [[19, 22], [43, 50]]
 */
function multiplicarMatrices(matrizA, matrizB) {
  validarMatriz(matrizA);
  validarMatriz(matrizB);
  
  const dimsA = obtenerDimensiones(matrizA);
  const dimsB = obtenerDimensiones(matrizB);
  
  if (dimsA.columnas !== dimsB.filas) {
    throw new Error(`Incompatibles para multiplicación. A: ${dimsA.filas}×${dimsA.columnas}, B: ${dimsB.filas}×${dimsB.columnas}. Se requiere: columnas(A) = filas(B)`);
  }
  
  const resultado = crearMatrizVacia(dimsA.filas, dimsB.columnas, 0);
  
  for (let i = 0; i < dimsA.filas; i++) {
    for (let j = 0; j < dimsB.columnas; j++) {
      let suma = 0;
      for (let k = 0; k < dimsA.columnas; k++) {
        suma += matrizA[i][k] * matrizB[k][j];
      }
      resultado[i][j] = suma;
    }
  }
  
  return resultado;
}

/**
 * Transpone una matriz (intercambia filas por columnas)
 * Operación: B = A^T, donde B[i][j] = A[j][i]
 * 
 * @param {Array<Array>} matriz - Matriz a transponer
 * @returns {Array<Array>} - Matriz transpuesta
 * 
 * @example
 * const A = [[1, 2, 3], [4, 5, 6]];
 * const B = transponerMatriz(A);
 * // B = [[1, 4], [2, 5], [3, 6]]
 */
function transponerMatriz(matriz) {
  validarMatriz(matriz);
  
  const dims = obtenerDimensiones(matriz);
  const resultado = crearMatrizVacia(dims.columnas, dims.filas);
  
  for (let i = 0; i < dims.filas; i++) {
    for (let j = 0; j < dims.columnas; j++) {
      resultado[j][i] = matriz[i][j];
    }
  }
  
  return resultado;
}

/**
 * Crea una matriz identidad de tamaño n×n
 * La matriz identidad tiene 1s en la diagonal y 0s en el resto
 * 
 * @param {number} n - Tamaño de la matriz
 * @returns {Array<Array<number>>} - Matriz identidad n×n
 * 
 * @example
 * const I = crearMatrizIdentidad(3);
 * // I = [[1,0,0], [0,1,0], [0,0,1]]
 */
function crearMatrizIdentidad(n) {
  if (typeof n !== 'number' || n <= 0 || !Number.isInteger(n)) {
    throw new Error('n debe ser un entero positivo');
  }
  
  const matriz = crearMatrizVacia(n, n, 0);
  
  for (let i = 0; i < n; i++) {
    matriz[i][i] = 1;
  }
  
  return matriz;
}

/**
 * Obtiene una sub-matriz (región rectangular de una matriz)
 * 
 * @param {Array<Array>} matriz - Matriz original
 * @param {number} filaInicio - Fila inicial (inclusiva)
 * @param {number} filaFin - Fila final (exclusiva)
 * @param {number} colInicio - Columna inicial (inclusiva)
 * @param {number} colFin - Columna final (exclusiva)
 * @returns {Array<Array>} - Sub-matriz
 * 
 * @example
 * const A = [[1,2,3], [4,5,6], [7,8,9]];
 * const B = obtenerSubmatriz(A, 0, 2, 1, 3);
 * // B = [[2,3], [5,6]]
 */
function obtenerSubmatriz(matriz, filaInicio, filaFin, colInicio, colFin) {
  validarMatriz(matriz);
  
  const dims = obtenerDimensiones(matriz);
  
  if (filaInicio < 0 || filaFin > dims.filas || colInicio < 0 || colFin > dims.columnas) {
    throw new Error('Índices fuera de rango');
  }
  
  const resultado = [];
  for (let i = filaInicio; i < filaFin; i++) {
    const fila = [];
    for (let j = colInicio; j < colFin; j++) {
      fila.push(matriz[i][j]);
    }
    resultado.push(fila);
  }
  
  return resultado;
}

// ============================================
// EXPORTAR FUNCIONES
// ============================================
module.exports = {
  sumarMatrices,
  restarMatrices,
  multiplicarPorEscalar,
  multiplicarMatrices,
  transponerMatriz,
  crearMatrizIdentidad,
  obtenerSubmatriz
};
