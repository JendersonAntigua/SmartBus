// Script para generar iconos PWA
// Este archivo es solo informativo - los iconos se generarían con herramientas externas

const iconSizes = [
  16, 32, 72, 96, 128, 144, 152, 192, 384, 512
];

const iconConfig = {
  name: 'SMARTBUS',
  backgroundColor: '#1e40af',
  foregroundColor: '#ffffff',
  // SVG del icono del bus
  svg: `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
    </svg>
  `
};

console.log('Configuración de iconos para SMARTBUS PWA:');
console.log('Tamaños necesarios:', iconSizes.join(', '));
console.log('Color de fondo:', iconConfig.backgroundColor);
console.log('Color de primer plano:', iconConfig.foregroundColor);

// Para generar los iconos reales, usar herramientas como:
// - PWA Builder (https://www.pwabuilder.com/)
// - Favicon Generator (https://realfavicongenerator.net/)
// - PWA Asset Generator (https://github.com/onderceylan/pwa-asset-generator)