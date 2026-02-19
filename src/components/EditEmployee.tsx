'use client'

import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { 
    Dialog, 
    DialogContent, 
    DialogHeader, 
    DialogTitle, 
    DialogTrigger, 
    DialogClose 
} from '@/components/ui/dialog';
import { 
    Tabs, 
    TabsContent, 
    TabsList, 
    TabsTrigger 
} from '@/components/ui/tabs';
import { 
    Form, 
    FormControl, 
    FormField, 
    FormItem, 
    FormLabel, 
    FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Vista_Lista_Empleados, Vista_Empleado_Datos_Editables, Telefono, EmployeeCardProps } from '@/lib/types';
import { getEmployeeDetails, updateEmployeeAddress, updateEmployeePhones, updateAvatar } from '@/app/(roles)/rh/empleados/actions';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from "@/components/ui/skeleton";
import Cropper, { ReactCropperElement } from "react-cropper";
import "cropperjs/dist/cropper.css";

// Zod Schemas
const AddressSchema = z.object({
  direccion: z.string().min(1, "La dirección es requerida"),
});

const PhoneSchema = z.object({
  telefono1: z.string().min(10, "Debe tener 10 dígitos").max(10, "Debe tener 10 dígitos"),
  telefono2: z.string().optional(),
  propietario_telefono2: z.string().optional(),
}).refine(data => !data.telefono2 || !!data.propietario_telefono2, {
    message: "Debe especificar el propietario del teléfono de emergencia",
    path: ["propietario_telefono2"],
});

// Main Component
export function EditEmployee({ empleado, avatarUrl }: { empleado: Vista_Lista_Empleados, avatarUrl?: string }) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [detailedEmployee, setDetailedEmployee] = useState<Vista_Empleado_Datos_Editables | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (open && !detailedEmployee) {
      const fetchDetails = async () => {
        setIsLoading(true);
        const result = await getEmployeeDetails(empleado.id);
        if (result.success && result.data) {
          setDetailedEmployee(result.data as Vista_Empleado_Datos_Editables);
        } else {
          toast({ variant: "destructive", title: "Error", description: "No se pudieron cargar los detalles del empleado." });
          setOpen(false);
        }
        setIsLoading(false);
      };
      fetchDetails();
    }
    if (!open) {
      setDetailedEmployee(null);
    }
  }, [open, empleado.id, toast, detailedEmployee]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Editar</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Perfil de {empleado.nombre_completo}</DialogTitle>
        </DialogHeader>
        {isLoading ? (
          <div className="space-y-4 mt-4 py-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : detailedEmployee ? (
          <EditForm empleado={empleado} edit_empleado={detailedEmployee} avatarUrl={avatarUrl} setOpen={setOpen} />
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
// Form Component (Internal)
function EditForm({ empleado, edit_empleado, setOpen, avatarUrl }: { empleado: Vista_Lista_Empleados, edit_empleado: Vista_Empleado_Datos_Editables, avatarUrl?: string, setOpen: (open: boolean) => void }) {
  const [activeTab, setActiveTab] = useState("picture");
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const cropperRef = useRef<ReactCropperElement>(null);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const addressForm = useForm({ resolver: zodResolver(AddressSchema), defaultValues: { direccion: edit_empleado.direccion || '' } });
  const phoneForm = useForm({ resolver: zodResolver(PhoneSchema), defaultValues: {
    telefono1: (edit_empleado.telefonos as Telefono[]).find(
      (t) => t.tipo === 'principal'
    )?.numero_telefonico || '',

    telefono2: (edit_empleado.telefonos as Telefono[]).find(
      (t: Telefono) => t.tipo === 'emergencia'
    )?.numero_telefonico || '',

    propietario_telefono2: (edit_empleado.telefonos as Telefono[]).find(
      (t: Telefono) => t.tipo === 'emergencia'
    )?.propietario || 'Propio',
  }});

  /*const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setPreview(URL.createObjectURL(file));
  };

  const handleAvatarSubmit = async () => {
    const file = fileInputRef.current?.files?.[0];
    if (!file) return toast({ variant: "destructive", title: "No se ha seleccionado ninguna imagen." });
    const formData = new FormData();
    formData.append('avatar', file);
    formData.append('employeeId', edit_empleado.id);
    const result = await updateAvatar(formData);
    if (result.success) {
      toast({ title: "Éxito", description: result.message });
      window.location.reload();
    } else {
      toast({ variant: "destructive", title: "Error", description: result.message });
    }
  };*/
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedFile(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAvatarSubmit = async () => {
    const cropper = cropperRef.current?.cropper;
    if (!cropper) return;

    setIsProcessing(true);

    // 1. Obtenemos el recorte del canvas
    cropper.getCroppedCanvas({
        width: 400, // Tamaño estandarizado para evitar deformación
        height: 400,
    }).toBlob(async (blob) => {
      if (!blob) {
        setIsProcessing(false);
        return;
      }

      // 2. Aquí es donde en el futuro integrarás:
      // const descriptor = await extractFaceDescriptor(blob);

      const formData = new FormData();
      formData.append('avatar', blob); // Enviamos el recorte, Sharp en el servidor hará el resto
      formData.append('employeeId', edit_empleado.id);

      const result = await updateAvatar(formData);
      
      if (result.success) {
        toast({ title: "Éxito", description: "Avatar actualizado" });
        // Usamos revalidatePath desde el servidor, pero esto ayuda a refrescar la UI local
        window.location.reload(); 
      } else {
        toast({ variant: "destructive", title: "Error", description: result.message });
      }
      setIsProcessing(false);
    }, 'image/webp'); // Intentamos enviar ya como webp desde el cliente
  };

  const onAddressSubmit = async (data: z.infer<typeof AddressSchema>) => {
    const result = await updateEmployeeAddress(edit_empleado.id, data.direccion);
    if (result.success) {
      toast({ title: "Éxito", description: result.message });
      setOpen(false);
    } else {
      toast({ variant: "destructive", title: "Error", description: result.message });
    }
  };

  const onPhoneSubmit = async (data: z.infer<typeof PhoneSchema>) => {
    const result = await updateEmployeePhones(edit_empleado.id, data.telefono1, data.telefono2, data.propietario_telefono2);
    if (result.success) {
      toast({ title: "Éxito", description: result.message });
      setOpen(false);
    } else {
      toast({ variant: "destructive", title: "Error", description: result.message });
    }
  };
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="picture">Foto</TabsTrigger>
        <TabsTrigger value="address">Dirección</TabsTrigger>
        <TabsTrigger value="phones">Teléfonos</TabsTrigger>
      </TabsList>

      <TabsContent value="picture" className="mt-4">
        <div className="flex flex-col items-center space-y-4">
            {/*<Avatar className="w-32 h-32">
                <AvatarImage src={preview || avatarUrl} alt="Avatar" />
                <AvatarFallback>{empleado.nombre_completo.charAt(0)}</AvatarFallback>
            </Avatar>
            <Input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} />*/}
            {!selectedFile ? (
              <>
                <Avatar className="w-32 h-32">
                  <AvatarImage src={preview || avatarUrl} alt="Avatar" className='object-cover' />
                  <AvatarFallback>{empleado.nombre_completo.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className='w-full'>
                  <label className="mb-2 block text-center">Seleccionar nueva imagen</label>
                  <Input type="file" accept="image/*" onChange={handleFileChange} />
                </div>
              </>
            ):(
              <div className="w-full space-y-4">
              <div className="overflow-hidden rounded-lg border bg-slate-50">
                <Cropper
                  ref={cropperRef}
                  src={selectedFile}
                  style={{ height: 300, width: "100%" }}
                  aspectRatio={1} // Mantiene la proporción cuadrada para el avatar
                  guides={true}
                  viewMode={1}
                  dragMode="move"
                  autoCropArea={1}
                />
              </div>
              <p className="text-xs text-center text-muted-foreground italic">
                Ajusta la imagen dentro del recuadro para evitar deformaciones.
              </p>
              <div className="flex justify-center space-x-2">
                <Button variant="outline" onClick={() => setSelectedFile(null)} disabled={isProcessing}>
                  Cambiar imagen
                </Button>
              </div>
            </div>
            )}
            <div className="flex justify-end w-full space-x-2 mt-4">
                <DialogClose asChild><Button variant="ghost">Cancelar</Button></DialogClose>
                <Button onClick={handleAvatarSubmit}>
                  {isProcessing ? "Procesando..." : "Guardar Foto"}
                </Button>
            </div>
        </div>
      </TabsContent>

      <TabsContent value="address" className="mt-4">
        <Form {...addressForm}>
          <form onSubmit={addressForm.handleSubmit(onAddressSubmit)} className="space-y-4">
            <FormField control={addressForm.control} name="direccion" render={({ field }) => (
                <FormItem><FormLabel>Dirección</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <div className="flex justify-end w-full space-x-2 mt-4">
                <DialogClose asChild><Button type="button" variant="ghost">Cancelar</Button></DialogClose>
                <Button type="submit">Guardar Dirección</Button>
            </div>
          </form>
        </Form>
      </TabsContent>

      <TabsContent value="phones" className="mt-4">
        <Form {...phoneForm}>
          <form onSubmit={phoneForm.handleSubmit(onPhoneSubmit)} className="space-y-4">
            <FormField control={phoneForm.control} name="telefono1" render={({ field }) => (
                <FormItem><FormLabel>Teléfono Principal</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )} />
             <FormItem><FormLabel>Propietario Tel. Principal</FormLabel><FormControl><Input value="Propio" disabled /></FormControl></FormItem>
            <FormField control={phoneForm.control} name="telefono2" render={({ field }) => (
                <FormItem><FormLabel>Teléfono de Emergencia</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={phoneForm.control} name="propietario_telefono2" render={({ field }) => (
                <FormItem><FormLabel>Propietario Tel. Emergencia</FormLabel><FormControl><Input placeholder="Ej: Esposa, Madre" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <div className="flex justify-end w-full space-x-2 mt-4">
                <DialogClose asChild><Button type="button" variant="ghost">Cancelar</Button></DialogClose>
                <Button type="submit">Guardar Teléfonos</Button>
            </div>
          </form>
        </Form>
      </TabsContent>
    </Tabs>
  );
}
