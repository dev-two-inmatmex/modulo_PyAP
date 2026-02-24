// public/workers/human-worker.js
import { Human } from 'https://cdn.jsdelivr.net/npm/@vladmandic/human/dist/human.esm.js';

let human = null;

const config = {
  modelBasePath: '/models/', // La barra al inicio y al final es vital
  face: {
    enabled: true,
    detector: { return: true },
    mesh: { enabled: true },
    iris: { enabled: true },
    description: { enabled: true }, // ACTIVAR para el face_descriptor
    emotion: { enabled: false },    // DESACTIVAR para evitar el error 404 de emotion
    liveness: { enabled: true },
  },
  body: { enabled: false },
  hand: { enabled: false },
  object: { enabled: false },
  segmentation: { enabled: false },
  gesture: { enabled: true },
};

self.onmessage = async (e) => {
  const { imageBitmap, employeeId, mode } = e.data;

  try {
    if (!human) {
      human = new Human(config);
      await human.load();
    }

    const result = await human.detect(imageBitmap);

    if (result.face && result.face.length > 0) {
      const face = result.face[0];
      
      if (mode === 'live') {
        const livenessScore = face.live || 0;
        const faceScore = face.boxScore || 0;
        const gestures =face.gestures || [];
        

        console.log(`Liveness: ${livenessScore.toFixed(2)}, Face Score: ${faceScore.toFixed(2)}`);
        
        
        if (livenessScore < 0.90) {
          return self.postMessage({
            success: false,
            error: 'Detección de vida insuficiente. Asegúrese de tener buena iluminación frontal.'
          });
        }
        const hasMovement = gestures.length > 0;
        if (!hasMovement && livenessScore < 0.60) {
           return self.postMessage({ 
            success: false, 
            error: 'Por favor, parpadee o muévase ligeramente.' 
          });
        }


      }
      const descriptor = Array.from(face.embedding || []);
      self.postMessage({ success: true, descriptor, employeeId });
    } else {
      self.postMessage({ success: false, error: 'Alinee su rostro en el centro.' });
    }
  } catch (err) {
    self.postMessage({ success: false, error: "Error de IA: " + err.message });
  }
};