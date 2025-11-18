// ============================================
// TESTS AUTOMATIZADOS - NO MODIFICAR
// ============================================

const fs = require('fs');
const path = require('path');
const {
  imagenAMatriz,
  matrizAImagen,
  obtenerCanal,
  obtenerDimensionesImagen,
  ajustarBrillo,
  invertirColores,
  convertirEscalaGrises,
  voltearHorizontal,
  voltearVertical,
  rotar90Grados,
  mezclarImagenes,
  aplicarSepia,
  detectarBordes
} = require('./ejercicios');

// Sistema de puntuación
let puntosTotales = 0;
const puntosMaximos = 100;

// Rutas de imágenes de prueba
const IMAGENES = {
  pequeña: path.join(__dirname, '../imagenes/entrada/test_pequeña.png'),
  mediana: path.join(__dirname, '../imagenes/entrada/test_mediana.png'),
  ejemplo: path.join(__dirname, '../imagenes/entrada/ejemplo.png'),
  transparencia: path.join(__dirname, '../imagenes/entrada/test_transparencia.png'),
  pusheen1: path.join(__dirname, '../imagenes/entrada/pusheen_azul.png'),
  pusheen2: path.join(__dirname, '../imagenes/entrada/pusheen_morado.png')
};

// Directorio de salida para resultados
const DIR_SALIDA = path.join(__dirname, '../imagenes/salida');

// Asegurar que existe el directorio de salida
if (!fs.existsSync(DIR_SALIDA)) {
  fs.mkdirSync(DIR_SALIDA, { recursive: true });
}

// ============================================
// FUNCIONES AUXILIARES PARA TESTS
// ============================================

function validarMatrizPixeles(matriz) {
  expect(Array.isArray(matriz)).toBe(true);
  expect(matriz.length).toBeGreaterThan(0);
  expect(Array.isArray(matriz[0])).toBe(true);
  
  // Validar estructura del primer pixel
  const pixel = matriz[0][0];
  expect(pixel).toHaveProperty('r');
  expect(pixel).toHaveProperty('g');
  expect(pixel).toHaveProperty('b');
  expect(pixel).toHaveProperty('a');
  expect(typeof pixel.r).toBe('number');
  expect(typeof pixel.g).toBe('number');
  expect(typeof pixel.b).toBe('number');
  expect(typeof pixel.a).toBe('number');
}

function compararPixeles(pixel1, pixel2, tolerancia = 1) {
  return (
    Math.abs(pixel1.r - pixel2.r) <= tolerancia &&
    Math.abs(pixel1.g - pixel2.g) <= tolerancia &&
    Math.abs(pixel1.b - pixel2.b) <= tolerancia &&
    Math.abs(pixel1.a - pixel2.a) <= tolerancia
  );
}

function verificarValoresColor(matriz) {
  for (let i = 0; i < matriz.length; i++) {
    for (let j = 0; j < matriz[i].length; j++) {
      const pixel = matriz[i][j];
      expect(pixel.r).toBeGreaterThanOrEqual(0);
      expect(pixel.r).toBeLessThanOrEqual(255);
      expect(pixel.g).toBeGreaterThanOrEqual(0);
      expect(pixel.g).toBeLessThanOrEqual(255);
      expect(pixel.b).toBeGreaterThanOrEqual(0);
      expect(pixel.b).toBeLessThanOrEqual(255);
      expect(pixel.a).toBeGreaterThanOrEqual(0);
      expect(pixel.a).toBeLessThanOrEqual(255);
    }
  }
}

// ============================================
// SECCIÓN 1: FUNDAMENTOS (20 puntos)
// ============================================

describe('Sección 1: Fundamentos - Conversión Imagen ↔ Matriz (20 puntos)', () => {
  
  test('1.1 imagenAMatriz - Cargar imagen pequeña (5 puntos)', () => {
    const matriz = imagenAMatriz(IMAGENES.pequeña);
    
    // Verificar que es una matriz válida
    validarMatrizPixeles(matriz);
    
    // Verificar dimensiones (imagen pequeña es 10x10)
    expect(matriz.length).toBe(10);
    expect(matriz[0].length).toBe(10);
    
    // Verificar que los valores están en rango
    verificarValoresColor(matriz);
    
    // Verificar que no todos los píxeles son iguales (tiene variación)
    const primerPixel = matriz[0][0];
    let hayVariacion = false;
    for (let i = 0; i < matriz.length && !hayVariacion; i++) {
      for (let j = 0; j < matriz[i].length && !hayVariacion; j++) {
        if (!compararPixeles(matriz[i][j], primerPixel, 0)) {
          hayVariacion = true;
        }
      }
    }
    expect(hayVariacion).toBe(true);
    
    puntosTotales += 5;
  });

  test('1.2 matrizAImagen - Guardar matriz como PNG (5 puntos)', () => {
    // Cargar imagen original
    const matrizOriginal = imagenAMatriz(IMAGENES.pequeña);
    
    // Guardar como nueva imagen
    const rutaSalida = path.join(DIR_SALIDA, 'test_1_2_copia.png');
    matrizAImagen(matrizOriginal, rutaSalida);
    
    // Verificar que el archivo se creó
    expect(fs.existsSync(rutaSalida)).toBe(true);
    
    // Verificar que el archivo tiene contenido
    const stats = fs.statSync(rutaSalida);
    expect(stats.size).toBeGreaterThan(0);
    
    // Cargar la imagen guardada
    const matrizRecargada = imagenAMatriz(rutaSalida);
    
    // Verificar dimensiones iguales
    expect(matrizRecargada.length).toBe(matrizOriginal.length);
    expect(matrizRecargada[0].length).toBe(matrizOriginal[0].length);
    
    // Verificar que los píxeles son similares (con tolerancia por compresión)
    let pixelesSimilares = 0;
    const totalPixeles = matrizOriginal.length * matrizOriginal[0].length;
    
    for (let i = 0; i < matrizOriginal.length; i++) {
      for (let j = 0; j < matrizOriginal[i].length; j++) {
        if (compararPixeles(matrizOriginal[i][j], matrizRecargada[i][j], 2)) {
          pixelesSimilares++;
        }
      }
    }
    
    // Al menos 95% de los píxeles deben ser iguales
    expect(pixelesSimilares / totalPixeles).toBeGreaterThan(0.95);
    
    puntosTotales += 5;
  });

  test('1.3 obtenerCanal - Extraer canal rojo (5 puntos)', () => {
    const matriz = imagenAMatriz(IMAGENES.mediana);
    const soloRojo = obtenerCanal(matriz, 'r');
    
    validarMatrizPixeles(soloRojo);
    
    // Verificar dimensiones iguales
    expect(soloRojo.length).toBe(matriz.length);
    expect(soloRojo[0].length).toBe(matriz[0].length);
    
    // Verificar que R = G = B en cada pixel (escala de grises)
    for (let i = 0; i < soloRojo.length; i++) {
      for (let j = 0; j < soloRojo[i].length; j++) {
        expect(soloRojo[i][j].r).toBe(soloRojo[i][j].g);
        expect(soloRojo[i][j].g).toBe(soloRojo[i][j].b);
        // El valor debe ser el canal rojo original
        expect(soloRojo[i][j].r).toBe(matriz[i][j].r);
      }
    }
    
    // Guardar resultado
    matrizAImagen(soloRojo, path.join(DIR_SALIDA, 'test_1_3_canal_rojo.png'));
    
    puntosTotales += 5;
  });

  test('1.4 obtenerDimensionesImagen - Leer dimensiones (5 puntos)', () => {
    const dims = obtenerDimensionesImagen(IMAGENES.pequeña);
    
    expect(dims).toHaveProperty('ancho');
    expect(dims).toHaveProperty('alto');
    expect(dims).toHaveProperty('totalPixeles');
    
    expect(dims.ancho).toBe(10);
    expect(dims.alto).toBe(10);
    expect(dims.totalPixeles).toBe(100);
    
    // Probar con imagen mediana
    const dims2 = obtenerDimensionesImagen(IMAGENES.mediana);
    expect(dims2.ancho).toBe(100);
    expect(dims2.alto).toBe(100);
    expect(dims2.totalPixeles).toBe(10000);
    
    puntosTotales += 5;
  });
});

// ============================================
// SECCIÓN 2: OPERACIONES BÁSICAS (25 puntos)
// ============================================

describe('Sección 2: Operaciones Básicas (25 puntos)', () => {
  
  test('2.1 ajustarBrillo - Aumentar brillo (8 puntos)', () => {
    const matriz = imagenAMatriz(IMAGENES.mediana);
    const masBrillante = ajustarBrillo(matriz, 1.5);
    
    validarMatrizPixeles(masBrillante);
    expect(masBrillante.length).toBe(matriz.length);
    expect(masBrillante[0].length).toBe(matriz[0].length);
    
    // Verificar que los valores aumentaron (donde no estaban saturados)
    let aumentos = 0;
    for (let i = 0; i < matriz.length; i++) {
      for (let j = 0; j < matriz[i].length; j++) {
        const orig = matriz[i][j];
        const nuevo = masBrillante[i][j];
        
        // Si el original no estaba cerca del máximo, debe aumentar
        if (orig.r < 170 && nuevo.r > orig.r) aumentos++;
        if (orig.g < 170 && nuevo.g > orig.g) aumentos++;
        if (orig.b < 170 && nuevo.b > orig.b) aumentos++;
      }
    }
    expect(aumentos).toBeGreaterThan(100); // Muchos canales aumentaron
    
    // Probar oscurecer
    const masOscuro = ajustarBrillo(matriz, 0.5);
    let disminuciones = 0;
    for (let i = 0; i < matriz.length; i++) {
      for (let j = 0; j < matriz[i].length; j++) {
        const orig = matriz[i][j];
        const nuevo = masOscuro[i][j];
        
        if (orig.r > 10 && nuevo.r < orig.r) disminuciones++;
        if (orig.g > 10 && nuevo.g < orig.g) disminuciones++;
        if (orig.b > 10 && nuevo.b < orig.b) disminuciones++;
      }
    }
    expect(disminuciones).toBeGreaterThan(100);
    
    // Guardar resultados
    matrizAImagen(masBrillante, path.join(DIR_SALIDA, 'test_2_1_mas_brillante.png'));
    matrizAImagen(masOscuro, path.join(DIR_SALIDA, 'test_2_1_mas_oscuro.png'));
    
    puntosTotales += 8;
  });

  test('2.2 invertirColores - Negativo de imagen (8 puntos)', () => {
    const matriz = imagenAMatriz(IMAGENES.ejemplo);
    const invertida = invertirColores(matriz);
    
    validarMatrizPixeles(invertida);
    expect(invertida.length).toBe(matriz.length);
    
    // Verificar inversión: nuevo = 255 - original
    for (let i = 0; i < Math.min(matriz.length, 10); i++) {
      for (let j = 0; j < Math.min(matriz[i].length, 10); j++) {
        const orig = matriz[i][j];
        const inv = invertida[i][j];
        
        expect(Math.abs(inv.r - (255 - orig.r))).toBeLessThanOrEqual(1);
        expect(Math.abs(inv.g - (255 - orig.g))).toBeLessThanOrEqual(1);
        expect(Math.abs(inv.b - (255 - orig.b))).toBeLessThanOrEqual(1);
        expect(inv.a).toBe(orig.a); // Alpha no cambia
      }
    }
    
    // Guardar resultado
    matrizAImagen(invertida, path.join(DIR_SALIDA, 'test_2_2_invertida.png'));
    
    puntosTotales += 8;
  });

  test('2.3 convertirEscalaGrises - Blanco y negro (9 puntos)', () => {
    const matriz = imagenAMatriz(IMAGENES.mediana);
    const grises = convertirEscalaGrises(matriz);
    
    validarMatrizPixeles(grises);
    expect(grises.length).toBe(matriz.length);
    
    // Verificar que R = G = B en cada pixel
    for (let i = 0; i < grises.length; i++) {
      for (let j = 0; j < grises[i].length; j++) {
        const pixel = grises[i][j];
        expect(pixel.r).toBe(pixel.g);
        expect(pixel.g).toBe(pixel.b);
      }
    }
    
    // Verificar que usa la fórmula correcta (al menos aproximada)
    const pixelOriginal = matriz[50][50];
    const pixelGris = grises[50][50];
    const grisEsperado = Math.round(
      0.299 * pixelOriginal.r +
      0.587 * pixelOriginal.g +
      0.114 * pixelOriginal.b
    );
    
    expect(Math.abs(pixelGris.r - grisEsperado)).toBeLessThanOrEqual(2);
    
    // Guardar resultado
    matrizAImagen(grises, path.join(DIR_SALIDA, 'test_2_3_grises.png'));
    
    puntosTotales += 9;
  });
});

// ============================================
// SECCIÓN 3: TRANSFORMACIONES GEOMÉTRICAS (30 puntos)
// ============================================

describe('Sección 3: Transformaciones Geométricas (30 puntos)', () => {
  
  test('3.1 voltearHorizontal - Efecto espejo (10 puntos)', () => {
    const matriz = imagenAMatriz(IMAGENES.ejemplo);
    const volteada = voltearHorizontal(matriz);
    
    validarMatrizPixeles(volteada);
    expect(volteada.length).toBe(matriz.length);
    expect(volteada[0].length).toBe(matriz[0].length);
    
    // Verificar volteo: pixel[i][j] = original[i][ancho-1-j]
    const ancho = matriz[0].length;
    for (let i = 0; i < matriz.length; i++) {
      for (let j = 0; j < ancho; j++) {
        const original = matriz[i][j];
        const volteado = volteada[i][ancho - 1 - j];
        expect(compararPixeles(original, volteado, 0)).toBe(true);
      }
    }
    
    // Guardar resultado
    matrizAImagen(volteada, path.join(DIR_SALIDA, 'test_3_1_espejo.png'));
    
    puntosTotales += 10;
  });

  test('3.2 voltearVertical - Arriba-abajo (10 puntos)', () => {
    const matriz = imagenAMatriz(IMAGENES.ejemplo);
    const volteada = voltearVertical(matriz);
    
    validarMatrizPixeles(volteada);
    expect(volteada.length).toBe(matriz.length);
    expect(volteada[0].length).toBe(matriz[0].length);
    
    // Verificar volteo: pixel[i][j] = original[alto-1-i][j]
    const alto = matriz.length;
    for (let i = 0; i < alto; i++) {
      for (let j = 0; j < matriz[0].length; j++) {
        const original = matriz[i][j];
        const volteado = volteada[alto - 1 - i][j];
        expect(compararPixeles(original, volteado, 0)).toBe(true);
      }
    }
    
    // Guardar resultado
    matrizAImagen(volteada, path.join(DIR_SALIDA, 'test_3_2_volteo_vertical.png'));
    
    puntosTotales += 10;
  });

  test('3.3 rotar90Grados - Rotación horaria (10 puntos)', () => {
    const matriz = imagenAMatriz(IMAGENES.ejemplo);
    const rotada = rotar90Grados(matriz);
    
    validarMatrizPixeles(rotada);
    
    // Verificar que las dimensiones se intercambiaron
    expect(rotada.length).toBe(matriz[0].length); // alto_nuevo = ancho_viejo
    expect(rotada[0].length).toBe(matriz.length); // ancho_nuevo = alto_viejo
    
    // Verificar rotación: pixel_nuevo[j][alto-1-i] = pixel_original[i][j]
    const altoOrig = matriz.length;
    for (let i = 0; i < Math.min(altoOrig, 10); i++) {
      for (let j = 0; j < Math.min(matriz[0].length, 10); j++) {
        const original = matriz[i][j];
        const rotado = rotada[j][altoOrig - 1 - i];
        expect(compararPixeles(original, rotado, 0)).toBe(true);
      }
    }
    
    // Guardar resultado
    matrizAImagen(rotada, path.join(DIR_SALIDA, 'test_3_3_rotada_90.png'));
    
    puntosTotales += 10;
  });
});

// ============================================
// SECCIÓN 4: FILTROS AVANZADOS (25 puntos)
// ============================================

describe('Sección 4: Filtros Avanzados (25 puntos)', () => {
  
  test('4.1 mezclarImagenes - Blend de dos imágenes (8 puntos)', () => {
    // Verificar que existan ambas imágenes de Pusheen
    if (!fs.existsSync(IMAGENES.pusheen1) || !fs.existsSync(IMAGENES.pusheen2)) {
      console.log('Imágenes de Pusheen no encontradas, usando imágenes de prueba');
      
      const matriz1 = imagenAMatriz(IMAGENES.mediana);
      const matriz2 = imagenAMatriz(IMAGENES.ejemplo);
      const mezcla = mezclarImagenes(matriz1, matriz2, 0.5);
      
      validarMatrizPixeles(mezcla);
      matrizAImagen(mezcla, path.join(DIR_SALIDA, 'test_4_1_mezcla.png'));
      
      puntosTotales += 8;
      return;
    }
    
    const matriz1 = imagenAMatriz(IMAGENES.pusheen1);
    const matriz2 = imagenAMatriz(IMAGENES.pusheen2);
    
    // Mezcla 50/50
    const mezcla = mezclarImagenes(matriz1, matriz2, 0.5);
    
    validarMatrizPixeles(mezcla);
    expect(mezcla.length).toBe(matriz1.length);
    expect(mezcla[0].length).toBe(matriz1[0].length);
    
    // Verificar fórmula de mezcla en algunos píxeles
    for (let i = 0; i < Math.min(matriz1.length, 10); i++) {
      for (let j = 0; j < Math.min(matriz1[0].length, 10); j++) {
        const p1 = matriz1[i][j];
        const p2 = matriz2[i][j];
        const pm = mezcla[i][j];
        
        const rEsperado = Math.round(p1.r * 0.5 + p2.r * 0.5);
        const gEsperado = Math.round(p1.g * 0.5 + p2.g * 0.5);
        const bEsperado = Math.round(p1.b * 0.5 + p2.b * 0.5);
        
        expect(Math.abs(pm.r - rEsperado)).toBeLessThanOrEqual(2);
        expect(Math.abs(pm.g - gEsperado)).toBeLessThanOrEqual(2);
        expect(Math.abs(pm.b - bEsperado)).toBeLessThanOrEqual(2);
      }
    }
    
    // Guardar resultado
    matrizAImagen(mezcla, path.join(DIR_SALIDA, 'test_4_1_mezcla_pusheen.png'));
    
    // Probar otros factores
    const casi1 = mezclarImagenes(matriz1, matriz2, 0.2);
    const casi2 = mezclarImagenes(matriz1, matriz2, 0.8);
    matrizAImagen(casi1, path.join(DIR_SALIDA, 'test_4_1_mezcla_20.png'));
    matrizAImagen(casi2, path.join(DIR_SALIDA, 'test_4_1_mezcla_80.png'));
    
    puntosTotales += 8;
  });

  test('4.2 aplicarSepia - Efecto vintage (9 puntos)', () => {
    const matriz = imagenAMatriz(IMAGENES.mediana);
    const sepia = aplicarSepia(matriz);
    
    validarMatrizPixeles(sepia);
    expect(sepia.length).toBe(matriz.length);
    
    // Verificar fórmula de sepia en algunos píxeles
    for (let i = 0; i < Math.min(matriz.length, 10); i++) {
      for (let j = 0; j < Math.min(matriz[0].length, 10); j++) {
        const orig = matriz[i][j];
        const sep = sepia[i][j];
        
        const rEsperado = Math.min(255, Math.round(
          0.393 * orig.r + 0.769 * orig.g + 0.189 * orig.b
        ));
        const gEsperado = Math.min(255, Math.round(
          0.349 * orig.r + 0.686 * orig.g + 0.168 * orig.b
        ));
        const bEsperado = Math.min(255, Math.round(
          0.272 * orig.r + 0.534 * orig.g + 0.131 * orig.b
        ));
        
        expect(Math.abs(sep.r - rEsperado)).toBeLessThanOrEqual(2);
        expect(Math.abs(sep.g - gEsperado)).toBeLessThanOrEqual(2);
        expect(Math.abs(sep.b - bEsperado)).toBeLessThanOrEqual(2);
      }
    }
    
    // Guardar resultado
    matrizAImagen(sepia, path.join(DIR_SALIDA, 'test_4_2_sepia.png'));
    
    puntosTotales += 9;
  });

  test('4.3 detectarBordes - Detección simple (8 puntos)', () => {
    const matriz = imagenAMatriz(IMAGENES.ejemplo);
    const bordes = detectarBordes(matriz, 50);
    
    validarMatrizPixeles(bordes);
    expect(bordes.length).toBe(matriz.length);
    
    // Verificar que hay píxeles blancos y negros (detectó bordes)
    let pixelesBlancos = 0;
    let pixelesNegros = 0;
    
    for (let i = 0; i < bordes.length; i++) {
      for (let j = 0; j < bordes[i].length; j++) {
        const pixel = bordes[i][j];
        
        // Los píxeles deben ser blanco o negro (o grises)
        expect(pixel.r).toBe(pixel.g);
        expect(pixel.g).toBe(pixel.b);
        
        if (pixel.r > 200) pixelesBlancos++;
        if (pixel.r < 50) pixelesNegros++;
      }
    }
    
    // Debe haber tanto píxeles blancos como negros
    expect(pixelesBlancos).toBeGreaterThan(10);
    expect(pixelesNegros).toBeGreaterThan(10);
    
    // Guardar resultado
    matrizAImagen(bordes, path.join(DIR_SALIDA, 'test_4_3_bordes.png'));
    
    puntosTotales += 8;
  });
});

// ============================================
// REPORTE FINAL
// ============================================

afterAll(() => {
  console.log('\n' + '='.repeat(60));
  console.log('REPORTE DE CALIFICACIÓN - EDITOR DE IMÁGENES MATRICIAL');
  console.log('='.repeat(60));
  console.log(`Puntos obtenidos: ${puntosTotales}/${puntosMaximos}`);
  console.log(`Porcentaje: ${((puntosTotales/puntosMaximos) * 100).toFixed(2)}%`);
  
  let calificacion;
  const porcentaje = (puntosTotales/puntosMaximos) * 100;
  
  if (porcentaje >= 90) {
    calificacion = 'A - Excelente ⭐⭐⭐';
  } else if (porcentaje >= 80) {
    calificacion = 'B - Muy Bien ⭐⭐';
  } else if (porcentaje >= 70) {
    calificacion = 'C - Bien ⭐';
  } else if (porcentaje >= 60) {
    calificacion = 'D - Aprobado ✓';
  } else {
    calificacion = 'F - Reprobado ✗';
  }
  
  console.log(`Calificación: ${calificacion}`);
  console.log('='.repeat(60));
  console.log(`\nRevisa tus imágenes generadas en: imagenes/salida/\n`);
  
  // Para GitHub Actions
  if (process.env.GITHUB_ACTIONS) {
    console.log(`::notice title=Calificación::${puntosTotales}/${puntosMaximos} puntos (${porcentaje.toFixed(2)}%) - ${calificacion}`);
  }
});
