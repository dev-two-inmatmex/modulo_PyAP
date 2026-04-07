'use client';

import { useState } from 'react';
import { AlertTriangle, KeyRound } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { resetUserPassword } from '@/app/(roles)/rh/empleados/actions'; // Ajusta tu ruta real
import { toast } from 'sonner'; // <-- IMPORTAMOS SONNER
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface ResetPasswordButtonProps {
  employeeId: string;
  employeeName: string;
  employeeEmail: string|null;
}

export function ResetPasswordButton({ employeeId, employeeName, employeeEmail }: ResetPasswordButtonProps) {
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [tempPassword, setTempPassword] = useState<string | null>(null);

  const handlePasswordReset = async () => {
    setIsResettingPassword(true);
    setTempPassword(null);

    try {
      // Llamada al Server Action
      const result = await resetUserPassword(employeeId);

      if (result.success && result.tempPassword) {
        setTempPassword(result.tempPassword);
        // SONNER: Éxito
        toast.success("Contraseña reseteada", {
          description: "Se generó una nueva contraseña temporal exitosamente.",
          duration: 5000,
       position: "top-center"
        });
      } else {
        // SONNER: Error
        toast.error("Error al resetear", {
          description: result.error || "Ocurrió un error inesperado.",
       position: "top-center"
        });
      }
    } catch (error: any) {
      console.error("Fallo crítico al llamar al servidor:", error);
      // SONNER: Error Crítico
      toast.error("Error de Conexión o Servidor", {
        description: "Revisa los logs de tu servidor de producción.",
       position: "top-center"
      });
    } finally {
      setIsResettingPassword(false);
    }
  };

  const copyToClipboard = () => {
    if (tempPassword) {
      navigator.clipboard.writeText(tempPassword);
      // SONNER: Normal (sin icono)
      toast("¡Contraseña copiada al portapapeles!", {
        position: "top-center"});
    }
  };

  if (tempPassword) {
    return (
      <div className="p-4 bg-green-50 border border-green-200 rounded-md space-y-3">
        <div className="flex items-center gap-2 text-green-800 font-medium">
          <KeyRound className="h-5 w-5" />
          ¡Contraseña generada con éxito!
        </div>
        <p className="text-sm text-green-700">
          Copia esta contraseña temporal y entrégala al empleado. El sistema le pedirá que la cambie la próxima vez que inicie sesión.
        </p>
        <div className="flex items-center gap-2">
          <code className="flex-1 p-2 bg-white rounded border font-mono text-lg text-center select-all">
            {employeeEmail}
          </code>
        </div>
        <div className="flex items-center gap-2">
          <code className="flex-1 p-2 bg-white rounded border font-mono text-lg text-center select-all">
            {tempPassword}
          </code>
          <Button variant="outline" onClick={copyToClipboard}>
            Copiar
          </Button>
        </div>
        <Button
          variant="link"
          className="px-0 text-sm h-auto text-muted-foreground"
          onClick={() => setTempPassword(null)}
        >
          Ocultar esta información
        </Button>
      </div>
    );
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" className="w-full sm:w-auto">
          <KeyRound className="mr-2 h-4 w-4" />
          Resetear Contraseña
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            ¿Estás absolutamente seguro?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción generará una nueva contraseña temporal y <strong>cerrará todas las sesiones activas</strong> de {employeeName} en todos los dispositivos.
            El empleado no podrá entrar hasta que le proporciones la nueva clave.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              handlePasswordReset();
            }}
            variant="destructive"
  disabled={isResettingPassword}
          >
            {isResettingPassword ? "Reseteando..." : "Sí, Resetear Contraseña"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}