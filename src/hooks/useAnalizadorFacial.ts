import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export function useAnalizadorFacial() {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const analyzeFace = async (canvas: HTMLCanvasElement, employeeId: string): Promise<{ success: boolean; blob?: Blob; descriptor?: number[] }> => {
    setIsProcessing(true);
    
    return new Promise(async (resolve) => {
      try {
        const imageBitmap = await createImageBitmap(canvas);
        const worker = new Worker('/workers/human-worker.js', { type: 'module' });
        
        worker.postMessage({ imageBitmap, employeeId, mode: 'static' }, [imageBitmap]);
        
        worker.onmessage = (e) => {
          const { success, descriptor, error } = e.data;
          worker.terminate();
          
          if (!success) {
            toast({ variant: "destructive", title: "Error de IA", description: error });
            resolve({ success: false });
            return;
          }

          canvas.toBlob((blob) => {
            resolve({ success: true, blob: blob || undefined, descriptor });
          }, 'image/webp', 0.85);
        };

        worker.onerror = (err) => {
          worker.terminate();
          toast({ variant: "destructive", title: "Error", description: err.message });
          resolve({ success: false });
        };
      } catch (err) {
        resolve({ success: false });
      } finally {
        setIsProcessing(false);
      }
    });
  };

  return { analyzeFace, isProcessing };
}