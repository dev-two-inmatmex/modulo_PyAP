'use client'

import React, { useState, useEffect, useRef, startTransition, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { addUser } from './actions';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { SelectField } from '@/components/reutilizables/SelectField';
import { ComboboxField } from '@/components/reutilizables/ComboboxField';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Cropper, { ReactCropperElement } from "react-cropper";
import "cropperjs/dist/cropper.css";
import { useAnalizadorFacial } from '@/hooks/useAnalizadorFacial';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Wand2, CalendarDays, UserPlus, Home, Phone, Briefcase, Clock, Check } from 'lucide-react';

const DIAS_SEMANA = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'] as const;

// --- NUEVOS CAMPOS EN ZOD ---
const UserSchema = z.object({
  nombres: z.string().min(1, "Dato Requerido"),
  a_paterno: z.string().min(1, "Dato Requerido"),
  a_materno: z.string().min(1, "Dato Requerido"),
  fecha_nacimiento: z.string().min(1, "Dato Requerido"),
  sexo: z.enum(['true', 'false']),
  calle: z.string().min(1, "Dato Requerido"),
  n_ext: z.string().min(1, "Dato Requerido"),
  n_int: z.string().optional(),
  colonia: z.string().min(1, "Dato Requerido"),
  c_postal: z.string().min(5, "Dato Requerido"),
  municipio: z.string().min(1, "Dato Requerido"),
  estado: z.string().min(1, "Dato Requerido"),
  telefono1: z.string().min(10, "Dato Requerido"),
  telefono2: z.string().optional(), propietario_telefono2: z.string().optional(),
  fecha_ingreso: z.string().min(1, "Dato Requerido"),
  email: z.string().email().optional(),
  id_puesto: z.string().min(1, "Dato Requerido"),
  id_ubicacion: z.string().min(1, "Dato Requerido"),
  id_estatus: z.string().min(1, "Dato Requerido"),
  sueldo: z.string().min(1, "Dato Requerido"),
  id_jefe: z.string().min(1, "Dato Requerido"),
  turnos: z.record(z.string().min(1, "Dato Requerido")),
  descansos: z.record(z.string().min(1, "Dato Requerido")),
}).refine(data => data.telefono2 ? !!data.propietario_telefono2 : true, {
  message: "Especifique el propietario", path: ["propietario_telefono2"],
});

type UserFormValues = z.infer<typeof UserSchema>;

const ErrorDot = ({ hasError }: { hasError: boolean }) => {
  if (!hasError) return null;
  return <span className="ml-2 flex h-2.5 w-2.5 rounded-full bg-red-500 shadow-sm animate-in zoom-in-50" />;
};

const removeAccents = (str: string) => str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

export function FormularioNuevoEmpleado({ horarios, descansos, puestos, ubicaciones, estatuses, empresas, empleadosLista, n_empleados }: any) {
  const router = useRouter(); // <-- Inicializamos el router
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const [faceData, setFaceData] = useState<any>(null);
  const [idEmpresaFiltro, setIdEmpresaFiltro] = useState<string>("");
  const cropperRef = useRef<ReactCropperElement>(null);
  const { analyzeFace, isProcessing } = useAnalizadorFacial();

  const [state, formAction] = React.useActionState(addUser, { success: false, message: '', timestamp: 0 });

  const defaultWeeklyTurnos = DIAS_SEMANA.reduce((acc, dia) => { acc[dia] = dia === 'domingo' ? "descanso" : ""; return acc; }, {} as any);
  const defaultWeeklyDescansos = DIAS_SEMANA.reduce((acc, dia) => { acc[dia] = dia === 'domingo' ? "descanso" : ""; return acc; }, {} as any);

  // --- CORRECCIÓN DE TYPESCRIPT: Especificamos el tipo UserFormValues explícitamente ---
  const initialValues: UserFormValues = {
    nombres: '', a_paterno: '', a_materno: '', fecha_nacimiento: '', sexo: 'false',
    calle: '', n_ext: '', n_int: '', colonia: '', c_postal: '', municipio: '', estado: '',
    telefono1: '', telefono2: '', propietario_telefono2: '',
    fecha_ingreso: '', email: '', id_puesto: '', id_ubicacion: '', id_estatus: '1',
    sueldo: '', id_jefe: '',
    turnos: { ...defaultWeeklyTurnos }, descansos: { ...defaultWeeklyDescansos }
  };

  const form = useForm<UserFormValues>({
    resolver: zodResolver(UserSchema),
    defaultValues: initialValues,
  });

  const { watch, setValue, getValues, formState: { errors } } = form;
  const watchTurnos = watch('turnos'); const watchDescansos = watch('descansos'); const nombresValue = watch('nombres');

  const tabHasErrors = useMemo(() => {
    const checkErrors = (fields: string[]) => fields.some(f => errors[f as keyof UserFormValues]);
    const hasRecordError = (r: any) => r && Object.keys(r).length > 0;
    return {
      foto: false,
      datosP: checkErrors(['nombres', 'a_paterno', 'a_materno', 'fecha_nacimiento', 'sexo']),
      domicilio: checkErrors(['calle', 'n_ext', 'colonia', 'c_postal', 'municipio', 'estado']),
      telefonos: checkErrors(['telefono1', 'telefono2']) || !!errors.propietario_telefono2,
      datosE: checkErrors(['fecha_ingreso', 'email', 'id_puesto', 'id_ubicacion', 'id_estatus', 'sueldo', 'id_jefe']),
      turnos: hasRecordError(errors.turnos) || hasRecordError(errors.descansos),
    };
  }, [errors]);

  const puestosFiltrados = useMemo(() => puestos.filter((p: any) => String(p.id_empresa) === idEmpresaFiltro), [idEmpresaFiltro, puestos]);

  useEffect(() => {
    if (nombresValue) {
      const nom = removeAccents(nombresValue.split(' ')[0]).toLowerCase();
      setValue('email', `${nom}${n_empleados}@inmatmex.com.mx`, { shouldValidate: true });
    }
  }, [nombresValue, n_empleados, setValue]);

  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name && name.startsWith('turnos.')) {
        const dia = name.split('.')[1];
        if (form.getValues('turnos')[dia] === 'descanso') form.setValue(`descansos.${dia}` as any, 'descanso', { shouldValidate: true, shouldDirty: true });
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, form]);

  const autoCompletarSemana = () => {
    const tLunes = getValues('turnos.lunes'); const dLunes = getValues('descansos.lunes');
    if (!tLunes || !dLunes) { toast.warning("Asigna Lunes primero."); return; }

    const semanaTurnos = { lunes: tLunes, martes: tLunes, miercoles: tLunes, jueves: tLunes, viernes: tLunes, sabado: tLunes, domingo: "descanso" };
    const semanaDescansos = { lunes: dLunes, martes: dLunes, miercoles: dLunes, jueves: dLunes, viernes: dLunes, sabado: dLunes, domingo: "descanso" };
    setValue('turnos', semanaTurnos, { shouldValidate: true, shouldDirty: true });
    setValue('descansos', semanaDescansos, { shouldValidate: true, shouldDirty: true });
    toast.success("Horario replicado.");
  };

  const handleFormSubmit = async (data: UserFormValues) => {
    if (faceData === null && croppedImage !== null) { toast.error("Fotografía sin rostro válido."); return; }
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => formData.append(key, typeof value === 'object' ? JSON.stringify(value) : String(value)));
    if (croppedImage) formData.append('avatar', await (await fetch(croppedImage)).blob(), 'avatar.webp');
    if (faceData) formData.append('faceDescriptor', JSON.stringify(faceData));
    startTransition(() => formAction(formData));
  };

  // --- LÓGICA DE RESPUESTA: REDIRECCIÓN AL DIRECTORIO ---
  useEffect(() => {
    if (state.timestamp) {
      if (!state.success) {
        toast.error(state.message);
      } else {
        toast.success(state.message, { duration: 5000 });
        // En cuanto sea exitoso, mandamos a RH de vuelta a la tabla principal
        router.push('/rh/empleados');
      }
    }
  }, [state.timestamp, router]);

  return (
    <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden mb-10">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleFormSubmit)} className="flex flex-col">
          <Tabs defaultValue='foto' className="flex flex-col">
            <div className='px-6 pt-4 pb-0 bg-slate-50/50 border-b border-slate-100 overflow-x-auto'>
              <TabsList className='flex h-auto justify-start bg-transparent gap-2'>
                <TabsTrigger value="foto" className="data-[state=active]:bg-white data-[state=active]:border-blue-600 rounded-none pb-2 flex items-center"><Briefcase className="w-4 h-4 mr-2" /> Foto<ErrorDot hasError={tabHasErrors.foto} /></TabsTrigger>
                <TabsTrigger value="datosP" className="data-[state=active]:bg-white data-[state=active]:border-blue-600 rounded-none pb-2 flex items-center"><UserPlus className="w-4 h-4 mr-2" /> Personales<ErrorDot hasError={tabHasErrors.datosP} /></TabsTrigger>
                <TabsTrigger value="domicilio" className="data-[state=active]:bg-white data-[state=active]:border-blue-600 rounded-none pb-2 flex items-center"><Home className="w-4 h-4 mr-2" /> Domicilio<ErrorDot hasError={tabHasErrors.domicilio} /></TabsTrigger>
                <TabsTrigger value="telefonos" className="data-[state=active]:bg-white data-[state=active]:border-blue-600 rounded-none pb-2 flex items-center"><Phone className="w-4 h-4 mr-2" /> Teléfonos<ErrorDot hasError={tabHasErrors.telefonos} /></TabsTrigger>
                <TabsTrigger value="datosE" className="data-[state=active]:bg-white data-[state=active]:border-blue-600 rounded-none pb-2 flex items-center"><Briefcase className="w-4 h-4 mr-2" /> Empresa<ErrorDot hasError={tabHasErrors.datosE} /></TabsTrigger>
                <TabsTrigger value='turnos' className="data-[state=active]:bg-white data-[state=active]:border-blue-600 rounded-none pb-2 flex items-center"><Clock className="w-4 h-4 mr-2" /> Horario Semanal<ErrorDot hasError={tabHasErrors.turnos} /></TabsTrigger>
              </TabsList>
            </div>

            <div className="p-8 min-h-137.5]">

              {/* TAB FOTO */}
              <TabsContent value="foto" className="mt-0">
                <div className="flex flex-col items-center space-y-6">
                  {!selectedFile && (
                    <div className='w-full max-w-md border-2 border-dashed border-slate-300 rounded-2xl p-12 text-center bg-slate-50 hover:bg-slate-100 transition-colors'>
                      <p className="mb-4 text-sm font-medium text-slate-600 uppercase tracking-wider">Fotografía Biométrica</p>
                      <Input type="file" accept="image/*" className="cursor-pointer" onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = () => { setSelectedFile(reader.result as string); setCroppedImage(null); setFaceData(null); };
                          reader.readAsDataURL(file);
                        }
                      }} />
                    </div>
                  )}
                  {selectedFile && !croppedImage && (
                    <div className="w-full max-w-2xl space-y-4">
                      <div className="rounded-xl overflow-hidden shadow-inner border bg-black">
                        <Cropper ref={cropperRef} src={selectedFile} style={{ height: 400, width: "100%" }} aspectRatio={1} viewMode={1} guides={true} />
                      </div>
                      {/* Botón para recortar la imagen
                        <Button type="button" disabled={isProcessing} onClick={async () => {
                        const canvas = cropperRef.current?.cropper.getCroppedCanvas({ width: 400, height: 400 });
                        if (canvas) {
                          setCroppedImage(canvas.toDataURL('image/webp'));
                          const { success, descriptor } = await analyzeFace(canvas, "nuevo");
                          if (success) { setFaceData(descriptor); toast.success("Rostro detectado."); }
                        }
                      }} className="w-full bg-blue-600 h-12 text-lg font-bold">
                        {isProcessing ? "Analizando..." : "RECORTAR Y ANALIZAR"}
                      </Button>
                      */}
                      <Button type="button" disabled={isProcessing} onClick={() => {
                        const canvas = cropperRef.current?.cropper.getCroppedCanvas({ width: 400, height: 400 });
                        if (canvas) {
                          const imageUrl = canvas.toDataURL('image/webp');
                          // 1. Envolvemos el análisis en una Promesa para que Sonner pueda vigilarla
                          const promesaAnalisis = new Promise(async (resolve, reject) => {
                            try {
                              const { success, descriptor } = await analyzeFace(canvas, "nuevo");
                              if (success) {
                                // 2. Solo si hay éxito mostramos la imagen final
                                setCroppedImage(imageUrl);
                                setFaceData(descriptor);
                                resolve("Rostro validado");
                              } else {
                                // 3. Si falla, forzamos el rechazo para que salte el toast de error
                                reject(new Error("No se detectó un rostro humano claro en el recorte."));
                              }
                            } catch (error) {
                              reject(new Error("Error interno al escanear la fotografía."));
                            }
                          });

                          // 4. Lanzamos el Toast de Progreso (Muestra un spinner mientras espera)
                          toast.promise(promesaAnalisis, {
                            loading: 'Analizando y extrayendo vectores biométricos...',
                            success: '¡Rostro escaneado y validado con éxito!',
                            error: (err) => err.message,
                          });
                        }
                      }}
                        className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg font-bold transition-all"
                      >
                        {isProcessing ? "Procesando biometría..." : "RECORTAR Y ANALIZAR"}
                      </Button>
                    </div>
                  )}
                  {croppedImage && (
                    <div className="flex flex-col items-center space-y-6 animate-in fade-in zoom-in-95">
                      <div className="relative">
                        <img src={croppedImage} className="w-56 h-56 rounded-full border-4 border-white shadow-2xl ring-4 ring-slate-100" />
                        {faceData && <div className="absolute bottom-4 right-4 bg-green-500 rounded-full p-2 shadow-lg border-2 border-white"><Check className="w-6 h-6 text-white" /></div>}
                      </div>
                      <Button type="button" variant="outline" onClick={() => { setSelectedFile(null); setCroppedImage(null); setFaceData(null); }}>CAMBIAR FOTOGRAFÍA</Button>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value='datosP' className="mt-0 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField control={form.control} name="nombres" render={({ field }) => (
                    <FormItem><FormLabel>NOMBRE(S)</FormLabel><FormControl><Input {...field} onChange={e => field.onChange(e.target.value.toUpperCase())} /></FormControl><FormMessage /></FormItem>)} />
                  <FormField control={form.control} name="a_paterno" render={({ field }) => (
                    <FormItem><FormLabel>APELLIDO PATERNO</FormLabel><FormControl><Input {...field} onChange={e => field.onChange(e.target.value.toUpperCase())} /></FormControl><FormMessage /></FormItem>)} />
                  <FormField control={form.control} name="a_materno" render={({ field }) => (
                    <FormItem><FormLabel>APELLIDO MATERNO</FormLabel><FormControl><Input {...field} onChange={e => field.onChange(e.target.value.toUpperCase())} /></FormControl><FormMessage /></FormItem>)} />
                  <FormField control={form.control} name="fecha_nacimiento" render={({ field }) => (
                    <FormItem><FormLabel>FECHA DE NACIMIENTO</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>)} />
                  <FormField control={form.control} name="sexo" render={({ field }) => (
                    <FormItem><FormLabel>SEXO</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent><SelectItem value="true">MASCULINO</SelectItem><SelectItem value="false">FEMENINO</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
                </div>
              </TabsContent>

              <TabsContent value='domicilio' className="mt-0 space-y-6">
                <FormField control={form.control} name="calle" render={({ field }) => (
                  <FormItem><FormLabel>CALLE</FormLabel><FormControl><Input {...field} onChange={e => field.onChange(e.target.value.toUpperCase())} /></FormControl><FormMessage /></FormItem>)} />
                <div className="grid grid-cols-2 gap-6">
                  <FormField control={form.control} name="n_ext" render={({ field }) => (
                    <FormItem><FormLabel>NO. EXTERIOR</FormLabel><FormControl><Input {...field} onChange={e => field.onChange(e.target.value.toUpperCase())} /></FormControl><FormMessage /></FormItem>)} />
                  <FormField control={form.control} name="n_int" render={({ field }) => (
                    <FormItem><FormLabel>NO. INTERIOR (OPCIONAL)</FormLabel><FormControl><Input {...field} onChange={e => field.onChange(e.target.value.toUpperCase())} /></FormControl><FormMessage /></FormItem>)} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField control={form.control} name="colonia" render={({ field }) => (
                    <FormItem><FormLabel>COLONIA / CIUDAD</FormLabel><FormControl><Input {...field} onChange={e => field.onChange(e.target.value.toUpperCase())} /></FormControl><FormMessage /></FormItem>)} />
                  <FormField control={form.control} name="c_postal" render={({ field }) => (
                    <FormItem><FormLabel>CÓDIGO POSTAL</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                  <FormField control={form.control} name="municipio" render={({ field }) => (
                    <FormItem><FormLabel>MUNICIPIO</FormLabel><FormControl><Input {...field} onChange={e => field.onChange(e.target.value.toUpperCase())} /></FormControl><FormMessage /></FormItem>)} />
                  <FormField control={form.control} name="estado" render={({ field }) => (
                    <FormItem><FormLabel>ESTADO</FormLabel><FormControl><Input {...field} onChange={e => field.onChange(e.target.value.toUpperCase())} /></FormControl><FormMessage /></FormItem>)} />
                </div>
              </TabsContent>

              <TabsContent value='telefonos' className="mt-0 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4 p-6 rounded-xl border bg-slate-50/50">
                    <h3 className="font-bold text-slate-800 border-b pb-2">CONTACTO PRINCIPAL</h3>
                    <FormField control={form.control} name="telefono1" render={({ field }) => (
                      <FormItem><FormLabel>TELÉFONO</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                  </div>
                  <div className="space-y-4 p-6 rounded-xl border bg-slate-50/50">
                    <h3 className="font-bold text-slate-800 border-b pb-2">CONTACTO DE EMERGENCIA</h3>
                    <FormField control={form.control} name="telefono2" render={({ field }) => (
                      <FormItem><FormLabel>TELÉFONO</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="propietario_telefono2" render={({ field }) => (
                      <FormItem><FormLabel>PARENTESCO / NOMBRE</FormLabel><FormControl><Input {...field} onChange={e => field.onChange(e.target.value.toUpperCase())} /></FormControl><FormMessage /></FormItem>)} />
                  </div>
                </div>
              </TabsContent>

              {/* --- TAB EMPRESA (CON JEFE Y SUELDO) --- */}
              <TabsContent value='datosE' className="mt-0 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                  <div className="space-y-2 p-6 rounded-xl border border-blue-100 bg-blue-50/30">
                    <FormLabel className="text-blue-800 font-black tracking-tight">1. SELECCIONAR EMPRESA</FormLabel>
                    <Select onValueChange={(val) => { setIdEmpresaFiltro(val); form.setValue('id_puesto', ''); }}>
                      <SelectTrigger className="bg-white"><SelectValue placeholder="Empresa..." /></SelectTrigger>
                      <SelectContent>{empresas.map((e: any) => (<SelectItem key={e.id} value={String(e.id)}>{e.nombre_empresa}</SelectItem>))}</SelectContent>
                    </Select>
                  </div>
                  {/*<SelectField control={form.control} name="id_puesto" label="2. PUESTO ASIGNADO" options={puestosFiltrados.map((p: any) => ({ id: p.id, label: p.nombre_puesto }))} disabled={!idEmpresaFiltro} />*/}
                  <ComboboxField
                    control={form.control}
                    name="id_puesto"
                    label="2. Puesto Asignado"
                    placeholder="Escribe para buscar puesto..."
                    options={puestosFiltrados.map((p: any) => ({ id: p.id, label: p.nombre_puesto }))}
                    disabled={!idEmpresaFiltro}
                  />

                  {/*<SelectField control={form.control} name="id_jefe" label="JEFE DIRECTO" options={empleadosLista.map((emp: any) => ({ id: emp.id, label: `${emp.nombres} ${emp.apellido_paterno}` }))} />*/}
                  <ComboboxField
                    control={form.control}
                    name="id_jefe"
                    label="Jefe Directo"
                    placeholder="Buscar empleado jefe..."
                    options={empleadosLista.map((emp: any) => ({
                      id: emp.id,
                      label: `${emp.nombres} ${emp.apellido_paterno} ${emp.apellido_materno || ''}`
                    }))}
                  />
                  <FormField control={form.control} name="sueldo" render={({ field }) => (
                    <FormItem><FormLabel>SUELDO SEMANAL (LIBRE)</FormLabel><FormControl><Input type="number" placeholder="Ej: 2500" {...field} /></FormControl><FormMessage /></FormItem>)} />

                  <FormField control={form.control} name="email" render={({ field }) => (
                    <FormItem><FormLabel>EMAIL CORPORATIVO</FormLabel><FormControl><Input {...field} readOnly className="bg-slate-100 lowercase" /></FormControl><FormMessage /></FormItem>)} />
                  <SelectField control={form.control} name="id_ubicacion" label="UBICACIÓN BASE" options={ubicaciones.map((u: any) => ({ id: u.id, label: u.nombre_ubicacion }))} />
                  <SelectField control={form.control} name="id_estatus" label="ESTATUS" options={estatuses.map((s: any) => ({ id: s.id, label: s.nombre_estatus }))} />
                  <FormField control={form.control} name="fecha_ingreso" render={({ field }) => (
                    <FormItem><FormLabel>FECHA INGRESO</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>)} />
                </div>
              </TabsContent>

              <TabsContent value='turnos' className="mt-0 space-y-6">
                <div className="flex items-center justify-between bg-blue-600 p-4 rounded-xl shadow-sm">
                  <div className="flex items-center gap-3 text-white">
                    <CalendarDays className="w-6 h-6" />
                    <span className="font-black">JORNADA SEMANAL</span>
                  </div>
                  <Button type="button" variant="secondary" size="sm" onClick={autoCompletarSemana}><Wand2 className="w-4 h-4 mr-2" /> COPIAR LUNES A TODA LA SEMANA</Button>
                </div>
                <ScrollArea className="h-112.5 pr-4">
                  <div className="grid grid-cols-1 gap-6">
                    {DIAS_SEMANA.map((dia) => (
                      <div key={dia} className="bg-white p-6 rounded-xl border">
                        <h4 className="uppercase font-black text-blue-900 border-b pb-3 mb-4">{dia}</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <SelectField control={form.control} name={`turnos.${dia}`} label="TURNO" options={[{ id: "descanso", label: "DESCANSO (LIBRE)" }, ...horarios.map((h: any) => ({ id: h.id, label: `${h.hora_entrada?.slice(0, 5)} - ${h.hora_salida?.slice(0, 5)}` }))]} />
                          <SelectField control={form.control} name={`descansos.${dia}`} label="PAUSA / COMIDA" options={[{ id: "descanso", label: "SIN PAUSA" }, ...descansos.map((d: any) => ({ id: d.id, label: `${d.inicio_descanso?.slice(0, 5)} - ${d.fin_descanso?.slice(0, 5)}` }))]} />
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </TabsContent>

            </div>
          </Tabs>

          <div className="flex justify-end p-6 bg-slate-50 border-t gap-4">
            <Button type="button" variant="outline" size="lg" onClick={() => router.push('/rh/empleados')} disabled={form.formState.isSubmitting}>
              CANCELAR
            </Button>
            <Button type="submit" size="lg" disabled={form.formState.isSubmitting} className="bg-green-600 hover:bg-green-700 text-white font-black px-10">
              {form.formState.isSubmitting ? 'GUARDANDO...' : 'GUARDAR EMPLEADO'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}