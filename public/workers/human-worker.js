// public/workers/human-worker.js
import { Human } from 'https://cdn.jsdelivr.net/npm/@vladmandic/human/dist/human.esm.js';

let human = null;

const config = {
  modelBasePath: '/models/', // La barra al inicio y al final es vital
  face: { 
    enabled: true, 
    detector: { return: true },
    mesh: { enabled: true },      // DESACTIVAR para evitar el error 404 de facemesh
    iris: { enabled: true },
    description: { enabled: true }, // ACTIVAR para el face_descriptor
    emotion: { enabled: false },    // DESACTIVAR para evitar el error 404 de emotion
  },
  body: { enabled: false },
  hand: { enabled: false },
  object: { enabled: false },
  segmentation: { enabled: false },
};

self.onmessage = async (e) => {
  const { imageBitmap, employeeId } = e.data;

  try {
    if (!human) {
      human = new Human(config);
      // Solo cargamos los modelos configurados arriba
      await human.load();
    }

    const result = await human.detect(imageBitmap);
    
    if (result.face && result.face.length > 0) {
      const descriptor = Array.from(result.face[0].embedding || []);
      self.postMessage({ success: true, descriptor, employeeId });
    } else {
      self.postMessage({ success: false, error: 'No se detectó un rostro claro.' });
    }
  } catch (err) {
    self.postMessage({ success: false, error: "Error de IA: " + err.message });
  }
};