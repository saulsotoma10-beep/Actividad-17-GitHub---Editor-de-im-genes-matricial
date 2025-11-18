# 📸 Imágenes de Prueba

Este directorio contiene las imágenes que se usarán para probar las funciones del editor matricial.

## Imágenes Generadas Automáticamente

Ejecuta `npm run generar-imagenes` para crear:

1. **test_pequeña.png** (10×10 píxeles)
   - Imagen diminuta para debug rápido
   - Gradiente simple RGB
   - Útil para ver la estructura de la matriz

2. **test_mediana.png** (100×100 píxeles)
   - Tamaño ideal para pruebas
   - Gradiente diagonal colorido
   - Balance entre velocidad y detalle

3. **ejemplo.png** (256×256 píxeles)
   - Patrón de ajedrez
   - Colores: azul oscuro y naranja
   - Perfecto para ver transformaciones

4. **test_transparencia.png** (50×50 píxeles)
   - Círculo rojo con transparencia gradual
   - Útil para ejercicios con canal alpha
   - Fondo transparente

## Imágenes del Tecnológico de Software

5. **pusheen_azul.png** (1024×1024 píxeles)
   - Mascota con laptop TecDeSoft
   - Fondo azul cielo
   - Imagen oficial del proyecto

6. **pusheen_morado.png** (1024×1024 píxeles)
   - Misma mascota, fondo morado
   - Ideal para ejercicios de mezcla
   - Imagen oficial del proyecto

---

## 💡 Consejos

- Usa `test_pequeña.png` cuando debuggees tu código
- Usa `test_mediana.png` para pruebas normales
- Las imágenes grandes (1024×1024) pueden tardar más en procesarse
- Todas las imágenes son PNG con canal alpha (RGBA)

## 📝 Notas Técnicas

**Estructura de píxel:**
```javascript
{
  r: 0-255,   // Rojo
  g: 0-255,   // Verde
  b: 0-255,   // Azul
  a: 0-255    // Alpha (transparencia)
}
```

**Dimensiones:**
- Ancho × Alto = Total de píxeles
- 10×10 = 100 píxeles
- 1024×1024 = 1,048,576 píxeles
