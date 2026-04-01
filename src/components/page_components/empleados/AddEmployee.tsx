'use client'
import React, { useState, useEffect, useRef, startTransition } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { addUser } from '@/app/(roles)/rh/empleados/actions';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { SelectField } from '@/components/reutilizables/SelectField';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@/components/ui/tabs';
import Cropper, { ReactCropperElement } from "react-cropper";
import "cropperjs/dist/cropper.css";
import { useAnalizadorFacial } from '@/hooks/useAnalizadorFacial';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

const UserSchema = z.object({
  //DatosPersonales
  nombres: z.string().min(1, "Nombres es requerido"),
  a_paterno: z.string().min(1, "Apellido Paterno es requerido"),
  a_materno: z.string().min(1, "Apellido Materno es requerido"),
  fecha_nacimiento: z.string().min(1, "Fecha de nacimiento es requerida"),
  sexo: z.enum(['true', 'false'], { required_error: 'Sexo es requerido.' }),
  //Domicilio
  calle: z.string().min(1, "La calle es requerida"),
  n_ext: z.string().min(1, "El número exterior es requerido"),
  n_int: z.string().optional(), // Es opcional
  colonia: z.string().min(1, "La colonia es requerida"),
  c_postal: z.string().min(5, "El código postal debe tener 5 dígitos"),
  ciudad: z.string().min(1, "La ciudad/municipio es requerida"),
  estado: z.string().min(1, "El estado es requerido"),
  //Telefonos
  telefono1: z.string().min(10, "Teléfono principal debe tener 10 dígitos"),
  telefono2: z.string().min(10, "Teléfono de emergencia debe tener 10 dígitos").optional().or(z.literal('')),
  propietario_telefono2: z.string().optional(),
  //DatosEmpresariales
  fecha_ingreso: z.string().min(1, "Fecha de ingreso es requerida"),
  email: z.string().email("Email inválido").optional(),
  id_puesto: z.string().min(1, "Puesto es requerido"),
  id_ubicacion: z.string().min(1, "Ubicación es requerida"),
  id_estatus: z.string().min(1, "Estatus es requerido"),
  //Turno
  id_ext_horario: z.string().min(1, "Horario es requerido"),
  id_ext_descanso: z.string().min(1, "Descanso es requerido"),
}).refine(data => {
  // Si hay un teléfono de emergencia, el propietario es requerido.
  if (data.telefono2 && !data.propietario_telefono2) {
    return false;
  }
  return true;
}, {
  message: "Debe especificar el propietario del teléfono de emergencia",
  path: ["propietario_telefono2"],
});

type UserFormValues = z.infer<typeof UserSchema>;

type Horario = { id: number; hora_entrada: string; hora_salida: string; };
type Descanso = { id: number; inicio_descanso: string; fin_descanso: string; };
type Puesto = { id: number; nombre_puesto: string; };
type Ubicacion = { id: number; nombre_ubicacion: string; };
type Estatus = { id: number; nombre_estatus: string; };

interface AddUserProps {
  horarios: Horario[];
  descansos: Descanso[];
  puestos: Puesto[];
  ubicaciones: Ubicacion[];
  estatuses: Estatus[];
  n_empleados: string;
}

interface ActionState {
  message: string;
}

const removeAccents = (str: string) => str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

export function AddEmployee({ horarios, descansos, puestos, ubicaciones, estatuses, n_empleados }: AddUserProps) {
  const [open, setOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const [faceData, setFaceData] = useState<any>(null);

  const cropperRef = useRef<ReactCropperElement>(null);
  const { analyzeFace, isProcessing } = useAnalizadorFacial();
  const formRef = useRef<HTMLFormElement>(null);

  const [state, formAction] = React.useActionState<ActionState, FormData>(addUser, { message: '' });

  const form = useForm<UserFormValues>({
    resolver: zodResolver(UserSchema),
    defaultValues: {
      //DatosPersonales
      nombres: '',
      a_paterno: '',
      a_materno: '',
      fecha_nacimiento: '',
      sexo: 'false',
      //Domicilio
      calle: '',
      n_ext: '',
      n_int: '',
      colonia: '',
      c_postal: '',
      ciudad: '',
      estado: '',
      //Telefonos
      telefono1: '',
      telefono2: '',
      propietario_telefono2: '',
      //DatosEmpresariales
      fecha_ingreso: '',
      email: '',
      id_puesto: '',
      id_ubicacion: '',
      id_estatus: '',
      //Turno
      id_ext_horario: '',
      id_ext_descanso: '',
    },
  });

  const { formState: { isSubmitting }, watch, setValue } = form;
  const nombresValue = watch('nombres');

  useEffect(() => {
    if (nombresValue) {
      const primerNombre = nombresValue.split(' ')[0];
      const normalizedNombre = removeAccents(primerNombre).toLowerCase();
      const generatedEmail = `${normalizedNombre}${n_empleados}@inmatmex.com.mx`;
      setValue('email', generatedEmail, { shouldValidate: true });
    }
  }, [nombresValue, n_empleados, setValue]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedFile(reader.result as string);
        setCroppedImage(null);
        setFaceData(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCropAndAnalyze = async () => {
    const cropper = cropperRef.current?.cropper;
    if (cropper) {
      const canvas = cropper.getCroppedCanvas({ width: 400, height: 400 });
      const croppedUrl = canvas.toDataURL('image/webp');

      setCroppedImage(croppedUrl);

      try {
        const { success, descriptor } = await analyzeFace(canvas, "nuevo");

        if (success && descriptor) {
          setFaceData(descriptor);
          toast.success("Rostro detectado y biometría generada correctamente.");
        } else {
          toast.warning("No se pudo detectar un rostro claro. Intenta con otra foto.");
        }
      } catch (e) {
        toast.error("Error al procesar el rostro.");
      }
    }
  };

  const handleFormSubmit = async (data: UserFormValues) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value.toString());
      }
    });

    if (croppedImage) {
      const res = await fetch(croppedImage);
      const blob = await res.blob();
      formData.append('avatar', blob, 'avatar.webp');
    }

    if (faceData) {
      formData.append('faceDescriptor', JSON.stringify(faceData));
    }

    startTransition(() => {
      formAction(formData);
    });
  };

  useEffect(() => {
    if (state.message) {
      const isError = /error|inválido/i.test(state.message);
      if (isError) {
        toast.error('Error', {
          description: state.message,
          position: "top-center"
        });
      } else {
        toast.success('Éxito', {
          description: state.message,
          position: "top-center"
        });
        setOpen(false);
        form.reset();
        setSelectedFile(null);
        setCroppedImage(null);
        setFaceData(null);
      }
    }
  }, [state, form, setOpen]);


  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className='bg-green-600 hover:bg-green-700 text-white'>Agregar Empleado</Button>
      </DialogTrigger>
      <DialogContent className='max-h-[90dvh] max-w-3xl w-[95vw] flex flex-col p-0'>
        <DialogHeader className='px-6 pt-6 pb-2 shrink-0 z-10'>
          <DialogTitle>Agregar Nuevo Empleado</DialogTitle>
          <DialogDescription>
            Complete el formulario para registrar un nuevo empleado en el sistema.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            id="add-employee-form"
            ref={formRef}
            onSubmit={form.handleSubmit(handleFormSubmit)}
            className="flex flex-col flex-1 min-h-0"
          >

            <Tabs defaultValue='foto' className="flex flex-col flex-1 min-h-0">
              <div className='px-6 pb-2 shrink-0'>
                <TabsList className='flex flex-wrap h-auto justify-start'>
                  <TabsTrigger value="foto">Foto</TabsTrigger>
                  <TabsTrigger value="datosP">Datos Personales</TabsTrigger>
                  <TabsTrigger value="domicilio">Domicilio</TabsTrigger>
                  <TabsTrigger value="telefonos">Teléfonos</TabsTrigger>
                  <TabsTrigger value="datosE">Datos Empresariales</TabsTrigger>
                  <TabsTrigger value='turnos'>Turnos</TabsTrigger>
                </TabsList>
              </div>
              <div className="flex-1 overflow-y-auto min-h-0 px-6">
                <div className="pb-6">
                  <TabsContent value="foto" className="mt-2">

                    <div className="flex flex-col items-center space-y-4">

                      {!selectedFile && (

                        <div className='w-full max-w-sm border-2 border-dashed rounded-xl p-8 text-center bg-slate-50'>

                          <label className="mb-4 block text-sm font-semibold text-slate-700">Subir foto del empleado</label>

                          <Input type="file" accept="image/*" onChange={handleFileChange} className="cursor-pointer" />

                        </div>

                      )}



                      {selectedFile && !croppedImage && (

                        <div className="w-full max-w-2xl space-y-4">

                          <div className="overflow-hidden rounded-lg border bg-slate-900 shadow-inner">

                            <Cropper

                              ref={cropperRef}

                              src={selectedFile}

                              style={{ height: 350, width: "100%" }}

                              aspectRatio={1}

                              guides={true}

                              viewMode={1}

                              dragMode="move"

                              autoCropArea={0.8}

                            />

                          </div>

                          <div className="flex justify-center gap-3">

                            <Button type="button" variant="outline" onClick={() => setSelectedFile(null)} disabled={isProcessing}>

                              Cancelar

                            </Button>

                            <Button type="button" onClick={handleCropAndAnalyze} disabled={isProcessing} className="bg-blue-600 hover:bg-blue-700">

                              {isProcessing ? "Analizando rostro..." : "Recortar y Analizar"}

                            </Button>

                          </div>

                        </div>

                      )}



                      {croppedImage && (

                        <div className="flex flex-col items-center space-y-6 animate-in fade-in zoom-in-95 duration-300">

                          <div className="relative">

                            <img

                              src={croppedImage}

                              alt="Preview del empleado"

                              className="w-48 h-48 rounded-full object-cover border-4 border-white shadow-xl ring-2 ring-slate-100"

                            />

                            {faceData && (

                              <div className="absolute bottom-2 right-2 bg-green-500 rounded-full p-1.5 shadow-md" title="Rostro detectado">

                                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>

                              </div>

                            )}

                          </div>



                          <div className="text-center space-y-1">

                            <h4 className="font-semibold text-slate-700">Vista Previa del Avatar</h4>

                            <p className={`text-sm ${faceData ? 'text-green-600 font-medium' : 'text-amber-600'}`}>

                              {faceData ? 'Biometría facial extraída correctamente.' : 'Falta información biométrica.'}

                            </p>

                          </div>



                          <Button type="button" variant="outline" onClick={() => setCroppedImage(null)}>

                            Volver a Recortar

                          </Button>

                        </div>

                      )

                      }

                    </div>

                  </TabsContent>



                  <TabsContent value='datosP' className="mt-2 space-y-4">

                    <FormField control={form.control} name="nombres" render={({ field }) => (

                      <FormItem>

                        <FormLabel>Nombres</FormLabel>

                        <FormControl>

                          <Input placeholder="Juan" {...field} />

                        </FormControl>

                        <FormMessage />

                      </FormItem>)} />

                    <FormField control={form.control} name="a_paterno" render={({ field }) => (

                      <FormItem>

                        <FormLabel>Apellido Paterno</FormLabel>

                        <FormControl>

                          <Input placeholder="Pérez" {...field} />

                        </FormControl><FormMessage />

                      </FormItem>)} />

                    <FormField control={form.control} name="a_materno" render={({ field }) => (

                      <FormItem>

                        <FormLabel>Apellido Materno</FormLabel>

                        <FormControl>

                          <Input placeholder="García" {...field} />

                        </FormControl>

                        <FormMessage />

                      </FormItem>)} />

                    <FormField control={form.control} name="fecha_nacimiento" render={({ field }) => (

                      <FormItem>

                        <FormLabel>Fecha de Nacimiento</FormLabel>

                        <FormControl>

                          <Input type="date" {...field} />

                        </FormControl><FormMessage />

                      </FormItem>)} />

                    <FormField control={form.control} name="sexo" render={({ field }) => (

                      <FormItem>

                        <FormLabel>Sexo</FormLabel>

                        <Select onValueChange={field.onChange} defaultValue={field.value}>

                          <FormControl>

                            <SelectTrigger>

                              <SelectValue placeholder="Seleccione el sexo" />

                            </SelectTrigger>

                          </FormControl>

                          <SelectContent>

                            <SelectItem value="true">Masculino</SelectItem>

                            <SelectItem value="false">Femenino</SelectItem>

                          </SelectContent>

                        </Select>

                        <FormMessage /></FormItem>)} />

                  </TabsContent>



                  <TabsContent value='domicilio' className="mt-2 space-y-4">

                    <FormField control={form.control} name="calle" render={({ field }) => (

                      <FormItem>

                        <FormLabel>Calle</FormLabel>

                        <FormControl><Input placeholder="Ej. Av. Siempre Viva" {...field} /></FormControl>

                        <FormMessage />

                      </FormItem>

                    )} />



                    <div className="grid grid-cols-2 gap-4">

                      <FormField control={form.control} name="n_ext" render={({ field }) => (

                        <FormItem>

                          <FormLabel>No. Exterior</FormLabel>

                          <FormControl><Input placeholder="Ej. 123" {...field} /></FormControl>

                          <FormMessage />

                        </FormItem>

                      )} />

                      <FormField control={form.control} name="n_int" render={({ field }) => (

                        <FormItem>

                          <FormLabel>No. Interior (Opcional)</FormLabel>

                          <FormControl><Input placeholder="Ej. Depto 4" {...field} /></FormControl>

                          <FormMessage />

                        </FormItem>

                      )} />

                    </div>



                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                      <FormField control={form.control} name="colonia" render={({ field }) => (

                        <FormItem>

                          <FormLabel>Colonia</FormLabel>

                          <FormControl><Input placeholder="Ej. Centro" {...field} /></FormControl>

                          <FormMessage />

                        </FormItem>

                      )} />

                      <FormField control={form.control} name="c_postal" render={({ field }) => (

                        <FormItem>

                          <FormLabel>Código Postal</FormLabel>

                          <FormControl><Input placeholder="Ej. 12345" {...field} /></FormControl>

                          <FormMessage />

                        </FormItem>

                      )} />

                      <FormField control={form.control} name="ciudad" render={({ field }) => (

                        <FormItem>

                          <FormLabel>Ciudad / Municipio</FormLabel>

                          <FormControl><Input placeholder="Ej. Yautepec" {...field} /></FormControl>

                          <FormMessage />

                        </FormItem>

                      )} />

                      <FormField control={form.control} name="estado" render={({ field }) => (

                        <FormItem>

                          <FormLabel>Estado</FormLabel>

                          <FormControl><Input placeholder="Ej. Morelos" {...field} /></FormControl>

                          <FormMessage />

                        </FormItem>

                      )} />

                    </div>

                  </TabsContent>



                  <TabsContent value='telefonos' className="mt-2 space-y-4">

                    <FormField control={form.control} name="telefono1" render={({ field }) => (<FormItem><FormLabel>Teléfono Principal</FormLabel><FormControl><Input placeholder="5512345678" {...field} /></FormControl><FormMessage /></FormItem>)} />

                    <FormItem>

                      <FormLabel>Propietario Tel. Principal</FormLabel>

                      <FormControl>

                        <Input value="Propio" disabled />

                      </FormControl>

                    </FormItem>

                    <FormField control={form.control} name="telefono2" render={({ field }) => (<FormItem><FormLabel>Teléfono de Emergencia</FormLabel><FormControl><Input placeholder="5587654321" {...field} /></FormControl><FormMessage /></FormItem>)} />

                    <FormField control={form.control} name="propietario_telefono2" render={({ field }) => (<FormItem><FormLabel>Propietario Tel. Emergencia</FormLabel><FormControl><Input placeholder="Ej: Esposa, Madre" {...field} /></FormControl><FormMessage /></FormItem>)} />

                  </TabsContent>



                  <TabsContent value='datosE' className="mt-2 space-y-4">

                    <FormField

                      control={form.control}

                      name="email"

                      render={({ field }) => (

                        <FormItem>

                          <FormLabel>Email</FormLabel>

                          <FormControl>

                            <Input placeholder="email@generado.com" {...field} readOnly />

                          </FormControl>

                          <FormMessage />

                        </FormItem>

                      )}

                    />

                    <SelectField

                      control={form.control}

                      name="id_puesto"

                      label="Puesto"

                      placeholder="Seleccione un puesto"

                      options={puestos.map(p => ({ id: p.id, label: p.nombre_puesto }))}

                    />

                    <SelectField

                      control={form.control}

                      name="id_ubicacion"

                      label="Ubicación de Trabajo"

                      placeholder="Seleccione una ubicación"

                      options={ubicaciones.map(ubi => ({ id: ubi.id, label: ubi.nombre_ubicacion }))}
                    />

                    <FormField control={form.control} name="id_estatus" render={({ field }) => (<FormItem><FormLabel>Estatus</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Seleccione un estatus" /></SelectTrigger></FormControl><SelectContent>{estatuses.map((estatus) => (<SelectItem key={estatus.id} value={String(estatus.id)}>{estatus.nombre_estatus}</SelectItem>))}</SelectContent></Select><FormMessage /></FormItem>)} />
                  </TabsContent>
                  <TabsContent value='turnos' className="mt-2 space-y-4">
                  <SelectField
                      control={form.control}
                      name="id_ext_horario"
                      label="Horario"
                      placeholder="Seleccione un horario"
                      options={horarios.map((horario) => ({
                        id: horario.id,
                        label: `${horario.hora_entrada.slice(0, 5)} - ${horario.hora_salida.slice(0, 5)}`
                      }))}
                    />

                    <SelectField
                      control={form.control}
                      name="id_ext_descanso"
                      label="Descanso"
                      placeholder="Seleccione un descanso"
                      options={descansos.map((descanso) => ({
                        id: descanso.id,
                        label: `${descanso.inicio_descanso.slice(0, 5)} - ${descanso.fin_descanso.slice(0, 5)}`
                      }))}
                    />
                  </TabsContent>
                </div>
              </div>
            </Tabs>
            <DialogFooter className="m-2 px-6 py-4 bg-white shrink-0 mt-auto relative z-20 flex flex-col-reverse sm:flex-row sm:justify-end gap-2 sm:gap-0">
              <DialogClose asChild>
                <Button type="button" variant="secondary">Cancelar</Button>
              </DialogClose>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Guardando...' : 'Guardar Empleado'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>

    </Dialog>
  );
}
