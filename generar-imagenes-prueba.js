/**
 * Script para generar imágenes de prueba
 * Ejecutar con: npm run generar-imagenes
 * o: node generar-imagenes-prueba.js
 */

const { PNG } = require('pngjs');
const fs = require('fs');
const path = require('path');

// Asegurar que existe el directorio de entrada
const dirEntrada = path.join(__dirname, 'imagenes', 'entrada');
if (!fs.existsSync(dirEntrada)) {
  fs.mkdirSync(dirEntrada, { recursive: true });
  console.log('📁 Directorio imagenes/entrada/ creado');
}

// ============================================
// IMAGEN 1: Pequeña 10x10 (para debug rápido)
// ============================================
function crearImagenPequeña() {
  const ancho = 10;
  const alto = 10;
  const png = new PNG({ width: ancho, height: alto });
  
  for (let y = 0; y < alto; y++) {
    for (let x = 0; x < ancho; x++) {
      const idx = (ancho * y + x) << 2;
      
      // Patrón de colores simple: gradiente
      png.data[idx]     = x * 25;      // R (0-255)
      png.data[idx + 1] = y * 25;      // G (0-255)
      png.data[idx + 2] = 128;         // B (constante)
      png.data[idx + 3] = 255;         // A (opacidad total)
    }
  }
  
  const buffer = PNG.sync.write(png);
  fs.writeFileSync(path.join(dirEntrada, 'test_pequeña.png'), buffer);
  console.log('✅ test_pequeña.png creada (10x10 píxeles)');
}

// ============================================
// IMAGEN 2: Mediana 100x100 (para pruebas)
// ============================================
function crearImagenMediana() {
  const ancho = 100;
  const alto = 100;
  const png = new PNG({ width: ancho, height: alto });
  
  for (let y = 0; y < alto; y++) {
    for (let x = 0; x < ancho; x++) {
      const idx = (ancho * y + x) << 2;
      
      // Gradiente diagonal colorido
      png.data[idx]     = Math.floor((x / ancho) * 255);      // R
      png.data[idx + 1] = Math.floor((y / alto) * 255);       // G
      png.data[idx + 2] = Math.floor(((x + y) / (ancho + alto)) * 255); // B
      png.data[idx + 3] = 255;                                // A
    }
  }
  
  const buffer = PNG.sync.write(png);
  fs.writeFileSync(path.join(dirEntrada, 'test_mediana.png'), buffer);
  console.log('✅ test_mediana.png creada (100x100 píxeles)');
}

// ============================================
// IMAGEN 3: Ejemplo 256x256 (patrón ajedrez)
// ============================================
function crearImagenEjemplo() {
  const ancho = 256;
  const alto = 256;
  const png = new PNG({ width: ancho, height: alto });
  
  const tamañoCuadro = 32; // Tamaño de cada cuadro del ajedrez
  
  for (let y = 0; y < alto; y++) {
    for (let x = 0; x < ancho; x++) {
      const idx = (ancho * y + x) << 2;
      
      // Determinar si es cuadro negro o blanco
      const filaAjedrez = Math.floor(y / tamañoCuadro);
      const colAjedrez = Math.floor(x / tamañoCuadro);
      const esCuadroOscuro = (filaAjedrez + colAjedrez) % 2 === 0;
      
      if (esCuadroOscuro) {
        // Cuadro oscuro: azul oscuro
        png.data[idx]     = 30;
        png.data[idx + 1] = 30;
        png.data[idx + 2] = 80;
      } else {
        // Cuadro claro: naranja/dorado
        png.data[idx]     = 255;
        png.data[idx + 1] = 200;
        png.data[idx + 2] = 100;
      }
      png.data[idx + 3] = 255; // A
    }
  }
  
  const buffer = PNG.sync.write(png);
  fs.writeFileSync(path.join(dirEntrada, 'ejemplo.png'), buffer);
  console.log('✅ ejemplo.png creada (256x256 píxeles - patrón ajedrez)');
}

// ============================================
// IMAGEN 4: Test con transparencia 50x50
// ============================================
function crearImagenTransparencia() {
  const ancho = 50;
  const alto = 50;
  const png = new PNG({ width: ancho, height: alto });
  
  for (let y = 0; y < alto; y++) {
    for (let x = 0; x < ancho; x++) {
      const idx = (ancho * y + x) << 2;
      
      // Círculo rojo con gradiente de transparencia
      const centroX = ancho / 2;
      const centroY = alto / 2;
      const distancia = Math.sqrt(Math.pow(x - centroX, 2) + Math.pow(y - centroY, 2));
      const radio = 20;
      
      if (distancia < radio) {
        png.data[idx]     = 255;  // R
        png.data[idx + 1] = 0;    // G
        png.data[idx + 2] = 0;    // B
        // Transparencia gradual desde el centro
        png.data[idx + 3] = Math.floor(255 * (1 - distancia / radio));
      } else {
        // Fondo transparente
        png.data[idx]     = 0;
        png.data[idx + 1] = 0;
        png.data[idx + 2] = 0;
        png.data[idx + 3] = 0;
      }
    }
  }
  
  const buffer = PNG.sync.write(png);
  fs.writeFileSync(path.join(dirEntrada, 'test_transparencia.png'), buffer);
  console.log('✅ test_transparencia.png creada (50x50 píxeles - con canal alpha)');
}

// ============================================
// IMÁGENES REALES: Copiar si existen
// ============================================
function copiarImagenesReales() {
  // Estas imágenes se deben colocar manualmente en imagenes/entrada/
  // Son las imágenes oficiales del Tecnológico de Software
  const imagenesReales = [
    'pusheen_azul.png',
    'pusheen_morado.png'
  ];
  
  let copiadas = 0;
  imagenesReales.forEach(nombre => {
    const origen = path.join(__dirname, nombre);
    const destino = path.join(dirEntrada, nombre);
    
    if (fs.existsSync(origen)) {
      fs.copyFileSync(origen, destino);
      console.log(`✅ ${nombre} copiada`);
      copiadas++;
    }
  });
  
  return copiadas;
}

// ============================================
// EJECUTAR GENERACIÓN
// ============================================
console.log('\n🎨 Generando imágenes de prueba...\n');

try {
  crearImagenPequeña();
  crearImagenMediana();
  crearImagenEjemplo();
  crearImagenTransparencia();
  
  console.log('\n📸 Copiando imágenes del TecDeSoft (si existen)...\n');
  const copiadas = copiarImagenesReales();
  
  if (copiadas > 0) {
    console.log(`\n✨ ¡Todas las imágenes generadas exitosamente! (${4 + copiadas} imágenes)`);
  } else {
    console.log('\n✨ ¡Imágenes de prueba generadas exitosamente!');
    console.log('💡 Tip: Coloca pusheen_azul.png y pusheen_morado.png en la raíz');
    console.log('   y ejecuta de nuevo para copiarlas a imagenes/entrada/');
  }
  console.log('📂 Ubicación: imagenes/entrada/\n');
} catch (error) {
  console.error('❌ Error al generar imágenes:', error.message);
  console.error('\n💡 Asegúrate de haber instalado las dependencias:');
  console.error('   npm install\n');
  process.exit(1);
}
