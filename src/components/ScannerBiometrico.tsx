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
  const { toast } = useToast();

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user'
        }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error("Error accessing camera: ", error);
      toast({ variant: 'destructive', title: 'Error de Cámara', description: 'No se pudo acceder a la cámara.' });
      setOpen(false);
    }
  }, [toast]);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, []);

  useEffect(() => {
    if (open) {
      startCamera();
    } else {
      stopCamera();
      setIsScanning(false);
      setFeedback('Alinee su rostro en el centro.');
    }
    return () => stopCamera();
  }, [open, startCamera, stopCamera]);

  const captureFrame = async () => {
    if (!videoRef.current || videoRef.current.readyState < 2) return;

    setIsScanning(true);
    setFeedback('Analizando rostro...');

    /*const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx?.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const imageBitmap = await createImageBitmap(canvas);

    const worker = new Worker('/workers/human-worker.js', { type: 'module' });

    worker.onmessage = (e) => {
      const { success, descriptor, error } = e.data;
      worker.terminate();

      if (success && descriptor) {
        setFeedback('¡Rostro verificado!');
        onResult(descriptor);
        setOpen(false);
      } else {
        setFeedback(error || 'Rostro no detectado.');
        setIsScanning(false); 
        toast({ variant: 'destructive', title: 'Aviso', description: error });
      }
    };

    worker.onerror = (err) => {
      worker.terminate();
      setIsScanning(false);
      setFeedback('Error en el procesamiento.');
      console.error("Worker error:", err);
    };

    worker.postMessage({ imageBitmap }, [imageBitmap]);*/
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

    /*if (ctx) {
      // --- SOLUCIÓN AL EFECTO ESPEJO ---
      // Movemos el contexto al borde derecho y escalamos a -1 en X para invertir
      ctx.translate(400, 0);
      ctx.scale(-1, 1);
      
      const size = Math.min(video.videoWidth, video.videoHeight);
      const x = (video.videoWidth - size) / 2;
      const y = (video.videoHeight - size) / 2;
  
      ctx.drawImage(video, x, y, size, size, 0, 0, 400, 400);
    }*/
    const imageBitmap = await createImageBitmap(canvas);
    const worker = new Worker('/workers/human-worker.js', { type: 'module' });

    worker.onmessage = (e) => {
      const { success, descriptor, error } = e.data;
      worker.terminate();

      if (success && descriptor) {
        //console.log("Descriptor generado por cámara:", descriptor);
        onResult(descriptor);
        setOpen(false);
      } else {
        setFeedback(error || 'Rostro no detectado.');
        setIsScanning(false);
        toast({ variant: 'destructive', title: 'Error de IA', description: error });
      }
    };

    worker.postMessage({ imageBitmap }, [imageBitmap]);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Verificación Biométrica</DialogTitle>
        </DialogHeader>
        <div className="relative w-full aspect-video rounded-md overflow-hidden bg-slate-900">
          <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
            <div className="w-2/3 h-5/6 border-4 border-dashed border-white/50 rounded-full" />
          </div>
        </div>
        <div className="text-center text-sm text-muted-foreground min-h-[24px] flex items-center justify-center gap-2">
          {isScanning && <RefreshCw className="h-4 w-4 animate-spin" />}
          <span>{feedback}</span>
        </div>
        <div className="flex flex-col gap-2">
          <Button onClick={captureFrame} disabled={isScanning} size="lg" className="w-full">
            <Camera className="mr-2 h-5 w-5" />
            Escanear Rostro
          </Button>
          <DialogClose asChild>
            <Button variant="outline" className="w-full">Cancelar</Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}