'use client';

import { useState, useEffect } from "react";
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select";
import { Pencil, CalendarDays, ArrowRight, Save, Clock } from "lucide-react";
import { toast } from "sonner";
import type { HorarioDraft, AsignacionDia, DiaSemana } from "@/services/horarios";

import { guardarNuevoHorario } from "@/app/(roles)/rh/horarios/actions";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { getHorarioBaseActualEmpleado } from "@/services/horarios";

export interface TurnoOption { id: number; nombre: string; entrada: string; salida: string; }
export interface DescansoOption { id: number; nombre: string; inicio: string; fin: string; }

interface EditarHorarioProps {
  empleadoId: string | null| undefined;
  empleadoNombre: string;
  horariosDisponibles: TurnoOption[];
  descansosDisponibles: DescansoOption[];
}

const DIAS_SEMANA_FORM = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'] as const;

// Constantes para dibujar el Timetable escolar
const START_HOUR = 7; // Empieza 7:00 AM
const END_HOUR = 19;  // Termina 7:00 PM (Da margen para turnos de 18:00)
const TOTAL_HOURS = END_HOUR - START_HOUR;
const ROW_HEIGHT = 60; // 60 pixeles por cada hora

// Función matemática para convertir la hora ("08:30") a un número decimal (8.5)
const parseTime = (timeStr: string) => {
  if (!timeStr) return 0;
  const [h, m] = timeStr.split(':').map(Number);
  return h + m / 60;
};

const plantillaVacia: HorarioDraft = {
  lunes: { id_horario: null, id_descanso: null },
  martes: { id_horario: null, id_descanso: null },
  miercoles: { id_horario: null, id_descanso: null },
  jueves: { id_horario: null, id_descanso: null },
  viernes: { id_horario: null, id_descanso: null },
  sabado: { id_horario: null, id_descanso: null },
  domingo: { id_horario: null, id_descanso: null },
};


export function EditarHorarioModal({
  empleadoId, empleadoNombre, horariosDisponibles, descansosDisponibles
}: EditarHorarioProps) {
  
  const [isOpen, setIsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingDraft, setIsLoadingDraft] = useState(false);
  const [horarioDraft, setHorarioDraft] = useState<HorarioDraft>(plantillaVacia);
  const [horarioActualBase, setHorarioActualBase] = useState<HorarioDraft>(plantillaVacia);
  const [diasSeleccionados, setDiasSeleccionados] = useState<DiaSemana[]>([]);
  const [horarioSeleccionado, setHorarioSeleccionado] = useState<string>("");
  const [descansoSeleccionado, setDescansoSeleccionado] = useState<string>("");

  useEffect(() => {
    async function cargarHorarioReal() {
      if (isOpen && empleadoId) {
        setIsLoadingDraft(true);
        try {
          // Ejecutamos tu función en el servidor
          const datosReales = await getHorarioBaseActualEmpleado(empleadoId);
          
          setHorarioActualBase(datosReales);
          setHorarioDraft(datosReales);
          
          // Imprimimos para confirmar en consola
          console.log("✅ Datos cargados con tu función:", datosReales);
        } catch (error) {
          console.error("Error al cargar horario:", error);
          toast.error("Error al cargar el horario actual del empleado.");
        } finally {
          setIsLoadingDraft(false);
        }
      }
    }

    if (isOpen) {
      cargarHorarioReal();
      setDiasSeleccionados([]);
      setHorarioSeleccionado("");
      setDescansoSeleccionado("");
    } else {
      // Limpiamos si se cierra
      setHorarioDraft(plantillaVacia);
      setHorarioActualBase(plantillaVacia);
    }
  }, [isOpen, empleadoId]);

  const toggleDia = (dia: DiaSemana) => {
    setDiasSeleccionados(prev => 
      prev.includes(dia) ? prev.filter(d => d !== dia) : [...prev, dia]
    );
  };

  const aplicarCambioPreview = () => {
    if (diasSeleccionados.length === 0) {
      toast.error("Selecciona al menos un día para aplicar el cambio.");
      return;
    }
    
    const newHorarioId = horarioSeleccionado === "descanso" ? null : Number(horarioSeleccionado);
    const newDescansoId = descansoSeleccionado === "descanso" || !descansoSeleccionado ? null : Number(descansoSeleccionado);

    const nuevoDraft = { ...horarioDraft };
    diasSeleccionados.forEach(dia => {
      nuevoDraft[dia] = { id_horario: newHorarioId, id_descanso: newDescansoId };
    });

    setHorarioDraft(nuevoDraft);
    setDiasSeleccionados([]); 
  };

  const getDetallesDia = (asignacion: AsignacionDia) => {
    if (!asignacion.id_horario) return null;
    const h = horariosDisponibles.find(x => x.id === asignacion.id_horario);
    const d = descansosDisponibles.find(x => x.id === asignacion.id_descanso);
    return { horario: h, descanso: d };
  };

  const handleGuardarCambios = async () => {
    setIsSaving(true);
    try {
      const result = await guardarNuevoHorario(empleadoId?.toString(), horarioDraft);
      if (result.error) toast.error(result.error);
      else {
        toast.success(result.success || "¡Horario actualizado y registrado!");
        setIsOpen(false);
      }
    } catch (error: any) {
      toast.error(error.message || "Ocurrió un error inesperado al guardar.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 h-8 w-8">
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      
      <DialogContent className="grid w-full grid-cols-1 p-0 overflow-hidden sm:max-w-2xl">
      <ScrollArea className="max-h-[90vh] w-full p-6">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CalendarDays className="h-6 w-6 text-primary" />
            Asignar Horario: {empleadoNombre}
          </DialogTitle>
        </DialogHeader>

        <div className="grid w-full grid-cols-1">
          <div className="space-y-6 bg-slate-50 p-4 rounded-xl border h-fit sticky top-0">
            <div>
              <Label className="text-base font-semibold mb-3 block">1. Selecciona los días</Label>
              <div className="grid grid-cols-1">
                {DIAS_SEMANA_FORM.map((dia) => (
                  <div key={dia} className="flex items-center space-x-2 bg-white p-2 rounded-md border shadow-sm hover:border-blue-200 transition-colors">
                    <Checkbox 
                      id={`chk-form-${dia}`} 
                      checked={diasSeleccionados.includes(dia as DiaSemana)}
                      onCheckedChange={() => toggleDia(dia as DiaSemana)}
                    />
                    <label htmlFor={`chk-form-${dia}`} className="text-sm font-medium leading-none cursor-pointer capitalize w-full">
                      {dia}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4 border-t pt-4">
              <Label className="text-base font-semibold block">2. Asigna el Turno</Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 ">
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Turno de Entrada/Salida</Label>
                <Select value={horarioSeleccionado} onValueChange={setHorarioSeleccionado}>
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="Selecciona un turno..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="descanso" className="font-semibold text-slate-500">Día Libre (Eliminar turno)</SelectItem>
                    {horariosDisponibles.map(h => (
                      <SelectItem key={h.id} value={h.id.toString()}>
                        {h.nombre} ({h.entrada} - {h.salida})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {horarioSeleccionado !== "descanso" && horarioSeleccionado !== "" && (
                <div className="space-y-2 animate-in fade-in zoom-in-95">
                  <Label className="text-xs text-muted-foreground">Comida (Opcional)</Label>
                  <Select value={descansoSeleccionado} onValueChange={setDescansoSeleccionado}>
                    <SelectTrigger className="bg-white">
                      <SelectValue placeholder="Selecciona horario..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="descanso" className="font-semibold text-slate-500">Sin comida</SelectItem>
                      {descansosDisponibles.map(d => (
                        <SelectItem key={d.id} value={d.id.toString()}>
                          {d.nombre} ({d.inicio} - {d.fin})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                
                </div>
              )}
              </div>

              <Button 
                className="w-full mt-4" 
                onClick={aplicarCambioPreview}
                disabled={diasSeleccionados.length === 0 || !horarioSeleccionado}
              >
                Pintar en la Cuadrícula <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
          <div className="lg:col-span-8 flex flex-col bg-white border rounded-xl shadow-sm overflow-hidden h-150">
            
            <div className="p-3 border-b bg-slate-50 flex justify-between items-center z-20">
              <Label className="text-base font-semibold flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-500" /> Vista Previa
              </Label>
              <div className="flex gap-3 text-xs font-medium text-slate-600">
                <span className="flex items-center gap-1"><div className="w-3 h-3 bg-slate-200 rounded-sm"></div> Actual</span>
                <span className="flex items-center gap-1"><div className="w-3 h-3 bg-blue-100 border border-blue-400 rounded-sm"></div> Modificado</span>
              </div>
            </div>

            <div className="flex-1 overflow-auto relative bg-white">
              <div className="min-w-175 relative">
                
                <div className="flex border-b sticky top-0 bg-white/95 backdrop-blur-sm z-30 shadow-sm">
                  <div className="w-16 border-r shrink-0"></div>
                  {DIAS_SEMANA_FORM.map(dia => (
                    <div key={`head-${dia}`} className="flex-1 text-center py-2 text-xs font-bold uppercase tracking-wider text-slate-600 border-r">
                      {dia.slice(0, 3)}
                    </div>
                  ))}
                </div>

                <div className="flex relative" style={{ height: `${TOTAL_HOURS * ROW_HEIGHT}px` }}>
                  
                  <div className="w-16 border-r shrink-0 flex flex-col relative bg-slate-50/50 z-20">
                    {Array.from({ length: TOTAL_HOURS + 1 }).map((_, i) => (
                      <div key={`hora-${i}`} className="absolute w-full text-right pr-2 text-[10px] font-mono text-slate-400" 
                           style={{ top: `${i * ROW_HEIGHT - 7}px` }}>
                        {START_HOUR + i}:00
                      </div>
                    ))}
                  </div>

                  
                  <div className="absolute inset-0 left-16 flex flex-col pointer-events-none z-0">
                    {Array.from({ length: TOTAL_HOURS * 2 }).map((_, i) => (
                      <div key={`linea-${i}`} 
                           className={`w-full border-b ${i % 2 === 0 ? 'border-slate-200' : 'border-slate-100 border-dashed'}`} 
                           style={{ height: `${ROW_HEIGHT / 2}px` }} />
                    ))}
                  </div>

                  {DIAS_SEMANA_FORM.map(dia => {
                    const diaTyped = dia as DiaSemana;
                    const asignacion = horarioDraft[diaTyped];
                    const isModificado = JSON.stringify(asignacion) !== JSON.stringify(horarioActualBase[diaTyped]);
                    const detalles = getDetallesDia(asignacion);

                    return (
                      <div key={`col-${dia}`} className="flex-1 border-r relative z-10">
                        
                        {detalles?.horario && (
                          <div
                            className={`absolute left-1 right-1 rounded-md p-1.5 overflow-hidden transition-all duration-300 shadow-sm border-l-4
                              ${isModificado 
                                ? 'bg-blue-100/90 border-blue-500 z-20 ring-1 ring-blue-300' 
                                : 'bg-slate-100/70 border-slate-300 z-10 grayscale-50'}`}
                            style={{
                              top: `${(parseTime(detalles.horario.entrada) - START_HOUR) * ROW_HEIGHT}px`,
                              height: `${(parseTime(detalles.horario.salida) - parseTime(detalles.horario.entrada)) * ROW_HEIGHT}px`
                            }}
                          >
                            <div className={`text-[10px] font-bold leading-tight truncate ${isModificado ? 'text-blue-900' : 'text-slate-600'}`}>
                              {detalles.horario.nombre}
                            </div>
                            <div className={`text-[9px] font-mono mt-0.5 ${isModificado ? 'text-blue-700' : 'text-slate-500'}`}>
                              {detalles.horario.entrada.slice(0,5)} - {detalles.horario.salida.slice(0,5)}
                            </div>
                            
                            {isModificado && (
                              <div className="absolute bottom-1 right-1 text-[8px] bg-blue-500 text-white px-1 rounded uppercase font-bold tracking-widest opacity-80">
                                Nuevo
                              </div>
                            )}
                          </div>
                        )}

                        {detalles?.descanso && (
                          <div
                            className={`absolute left-2 right-2 border-l-4 rounded-sm flex items-center justify-center
                              ${isModificado ? 'bg-orange-100/95 border-orange-400 z-30 shadow-md' : 'bg-slate-200/80 border-slate-400 z-20'}`}
                            style={{
                              top: `${(parseTime(detalles.descanso.inicio) - START_HOUR) * ROW_HEIGHT}px`,
                              height: `${(parseTime(detalles.descanso.fin) - parseTime(detalles.descanso.inicio)) * ROW_HEIGHT}px`
                            }}
                          >
                            <span className={`text-[9px] font-bold uppercase tracking-widest ${isModificado ? 'text-orange-900' : 'text-slate-600'}`}>
                              Comida
                            </span>
                          </div>
                        )}

                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

          </div>
        </div>

        <DialogFooter className="mt-2 border-t pt-4 bg-white">
          <Button variant="outline" onClick={() => setIsOpen(false)} disabled={isSaving}>
            Cancelar
          </Button>
          <Button onClick={handleGuardarCambios} className="bg-blue-600 hover:bg-blue-700" disabled={isSaving}>
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? "Guardando Masivamente..." : "Confirmar y Guardar Cambios"}
          </Button>
        </DialogFooter>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}