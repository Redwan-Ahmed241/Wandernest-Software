// Polyfill for TextEncoder/TextDecoder
const { TextEncoder, TextDecoder } = require('util');

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Canvas polyfill for HTMLCanvasElement.getContext
try {
  const { createCanvas } = require('canvas');
  
  HTMLCanvasElement.prototype.getContext = function getContext(contextType) {
    return createCanvas(200, 200).getContext(contextType);
  };
} catch (error) {
  // Fallback if canvas is not available
  HTMLCanvasElement.prototype.getContext = function getContext(contextType) {
    return {
      fillRect: () => {},
      clearRect: () => {},
      getImageData: () => ({ data: new Array(4) }),
      putImageData: () => {},
      createImageData: () => ([]),
      setTransform: () => {},
      drawImage: () => {},
      save: () => {},
      fillText: () => {},
      restore: () => {},
      beginPath: () => {},
      moveTo: () => {},
      lineTo: () => {},
      closePath: () => {},
      stroke: () => {},
      translate: () => {},
      scale: () => {},
      rotate: () => {},
      arc: () => {},
      fill: () => {},
      measureText: () => ({ width: 0 }),
      transform: () => {},
      rect: () => {},
      clip: () => {},
    };
  };
}