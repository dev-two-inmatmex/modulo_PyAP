'use client'

import { useState, useRef, useEffect, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Camera, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ScannerBiometricoProps {
  onResult: (descriptor: number[]) => void;
  children: React.ReactNode;
}

export function ScannerBiometrico({ onResult, children }: ScannerBiometricoProps) {
  const [open, setOpen] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [feedback, setFeedback] = useState('Alinee su rostro en el centro.');
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();


  const stopCamera = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, []);

  const captureFrame = useCallback(async () => {
    if (!videoRef.current || videoRef.current.readyState < 2 || isScanning) return;
    setIsScanning(true);
    try {
      const video = videoRef.current;
      const canvas = document.createElement('canvas');
      // Usamos un tamaño cuadrado para que coincida con el entrenamiento de la IA
      canvas.width = 400;
      canvas.height = 400;
      const ctx = canvas.getContext('2d');

      // Calculamos el centro para recortar un cuadrado del flujo de video
      const size = Math.min(video.videoWidth, video.videoHeight);
      const x = (video.videoWidth - size) / 2;
      const y = (video.videoHeight - size) / 2;
      ctx?.drawImage(video, x, y, size, size, 0, 0, 400, 400);

      const imageBitmap = await createImageBitmap(canvas);
      const worker = new Worker('/workers/human-worker.js', { type: 'module' });

      worker.onmessage = (e) => {
        const { success, descriptor, error } = e.data;
        worker.terminate();

        if (success && descriptor) {
          onResult(descriptor);
          setOpen(false);
        } else {
          setIsScanning(false);
          setFeedback(error);
          if (open) {
            timeoutRef.current = setTimeout(captureFrame, 500);
          }
        }
      };

      worker.onerror = () => {
        worker.terminate();
        setIsScanning(false);
        if (open) timeoutRef.current = setTimeout(captureFrame, 3000);
      };

      worker.postMessage({ imageBitmap, mode: 'live' }, [imageBitmap]);
    } catch (error) {
      console.error("Error en procesamiento:", error);
      setIsScanning(false);
      if (open) timeoutRef.current = setTimeout(captureFrame, 3000);
    }
  }, [isScanning, onResult, open]);

  useEffect(() => {
    if (open) {
      navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user'
        }
      })
        .then(s => {
          streamRef.current = s;
          if (videoRef.current) videoRef.current.srcObject = s;
          timeoutRef.current = setTimeout(captureFrame, 1200); // Primer intento al segundo de abrir
        })

        .catch((err) => {
          console.error("Error cámara:", err);
          toast({ variant: 'destructive', title: 'Error', description: 'Cámara no disponible' });
          setOpen(false);
        });
    } else {
      stopCamera();
      setIsScanning(false);
      setFeedback('Alinee su rostro en el centro.');
    }
    return () => {
      stopCamera();
    }
  }, [open, toast]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader><DialogTitle>Verificación Biométrica</DialogTitle></DialogHeader>
        <div className="relative w-full aspect-video rounded-md overflow-hidden bg-slate-900">
          <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            {/* Guía visual para el usuario */}
            <div className={`w-2/3 h-5/6 border-4 border-dashed rounded-full transition-colors ${isScanning ? 'border-green-400' : 'border-white/50'}`} />
          </div>
        </div>

        <div className="text-center text-sm text-muted-foreground min-h-[60px] flex flex-col items-center justify-center gap-2">
          {isScanning ? (
            <>
              <RefreshCw className="h-5 w-5 animate-spin text-green-600" />
              <span className="font-semibold text-green-600 italic">¡Parpadee ahora para verificar!</span>
            </>
          ) : (
            <div className="flex flex-col items-center">
              <span className="font-medium text-muted-foreground">{feedback}</span>
            </div>)}
        </div>
        <DialogClose asChild>
          <Button variant="outline" className="w-full">Cancelar</Button>
        </DialogClose>
      </DialogContent>
    </Dialog>

  );

}