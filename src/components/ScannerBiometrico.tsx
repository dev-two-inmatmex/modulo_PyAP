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
  const workerRef = useRef<Worker | null>(null);
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
      toast({ variant: 'destructive', title: 'Error de Cámara', description: 'No se pudo acceder a la cámara. Revise los permisos.' });
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
    }
    return () => stopCamera();
  }, [open, startCamera, stopCamera]);

  useEffect(() => {
    workerRef.current = new Worker('/workers/human-worker.js', { type: 'module' });
    workerRef.current.onmessage = (e) => {
      const { success, descriptor, error } = e.data;
      if (success && descriptor) {
        setFeedback('¡Rostro capturado con éxito!');
        onResult(descriptor);
        setOpen(false);
      } else {
        setFeedback(error || 'Intente de nuevo. Rostro no detectado.');
        setIsScanning(false); // Permitir reintentar
      }
    };
    return () => {
      workerRef.current?.terminate();
    };
  }, [onResult]);

  const captureFrame = async () => {
    if (!videoRef.current || videoRef.current.readyState < 2) return;
    setIsScanning(true);
    setFeedback('Procesando...');

    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx?.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const imageBitmap = await createImageBitmap(canvas);

    workerRef.current?.postMessage({ imageBitmap }, [imageBitmap]);
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
        <p className="text-center text-sm text-muted-foreground min-h-[20px]">
            {isScanning ? <RefreshCw className="mx-auto h-5 w-5 animate-spin" /> : feedback}
        </p>
        <Button onClick={captureFrame} disabled={isScanning} size="lg">
          <Camera className="mr-2 h-5 w-5" />
          Escanear Rostro
        </Button>
        <DialogClose asChild>
            <Button variant="outline">Cancelar</Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}