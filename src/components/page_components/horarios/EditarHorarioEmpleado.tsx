/*'use client';

import { useState, useEffect } from "react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import { Pencil, Save, Clock, Coffee } from "lucide-react";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useHoy } from "@/hooks/useHoy";

import { guardarTurnosSemana, guardarDescansosSemana } from "@/app/(roles)/rh/horarios/actions";

export interface TurnoOption { id: number; nombre: string; entrada: string; salida: string; }
export interface DescansoOption { id: number; nombre: string; inicio: string; fin: string; }

interface EditarHorarioProps {
  empleadoId: string;
  empleadoNombre: string;
  horariosDisponibles: TurnoOption[];
  descansosDisponibles: DescansoOption[];
  turnoActual?: Record<string, number | null>; 
  descansoActual?: Record<string, number | null>;
}

const DIAS_SEMANA = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'] as const;
type DiaSemana = typeof DIAS_SEMANA[number];

type SemanaConfig = Record<DiaSemana, string>;

const configVacia: SemanaConfig = {
  lunes: "", martes: "", miercoles: "", jueves: "", viernes: "", sabado: "", domingo: ""
};

export function EditarHorarioModal({
  empleadoId, empleadoNombre, horariosDisponibles, descansosDisponibles
}: EditarHorarioProps) {

  const [isOpen, setIsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { getFormatosBD } = useHoy();

  // Estados independientes para Horarios y Descansos
  const [turnos, setTurnos] = useState<SemanaConfig>(configVacia);
  const [descansos, setDescansos] = useState<SemanaConfig>(configVacia);

  // Limpiar al cerrar
  useEffect(() => {
    if (!isOpen) {
      setTurnos(configVacia);
      setDescansos(configVacia);
    }
  }, [isOpen]);

  const handleSelectChange = (tipo: 'turno' | 'descanso', dia: DiaSemana, valor: string) => {
    if (tipo === 'turno') {
      setTurnos(prev => ({ ...prev, [dia]: valor }));
      // Si seleccionan "descanso" en el turno, forzamos "descanso" en su tabla de descansos
      if (valor === "descanso") {
        setDescansos(prev => ({ ...prev, [dia]: "descanso" }));
      }
    } else {
      setDescansos(prev => ({ ...prev, [dia]: valor }));
    }
  };

  // Función para guardar HORARIOS
  const handleGuardarTurnos = async () => {
    // Validar que ningún día esté vacío ("")
    if (Object.values(turnos).some(val => val === "")) {
      toast.error("Por favor selecciona una opción para todos los días en Horarios.");
      return;
    }

    setIsSaving(true);
    const { fecha, hora } = getFormatosBD();

    try {
      const result = await guardarTurnosSemana(empleadoId, turnos, fecha, hora);
      if (result.error) toast.error(result.error);
      else toast.success(result.success);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  // Función para guardar DESCANSOS
  const handleGuardarDescansos = async () => {
    // Validar que ningún día esté vacío ("")
    if (Object.values(descansos).some(val => val === "")) {
      toast.error("Por favor selecciona una opción para todos los días en Descansos.");
      return;
    }

    setIsSaving(true);
    const { fecha, hora } = getFormatosBD();

    try {
      const result = await guardarDescansosSemana(empleadoId, descansos, fecha, hora);
      if (result.error) toast.error(result.error);
      else toast.success(result.success);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="text-blue-600 hover:bg-blue-50">
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Gestionar Horarios: {empleadoNombre}</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="horarios" className="w-full mt-2">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="horarios" className="flex items-center gap-2">
              <Clock className="w-4 h-4" /> Turnos (Horarios)
            </TabsTrigger>
            <TabsTrigger value="descansos" className="flex items-center gap-2">
              <Coffee className="w-4 h-4" /> Comidas / Descansos
            </TabsTrigger>
          </TabsList>

          <TabsContent value="horarios" className="space-y-4 pt-4">
            <ScrollArea className="h-[45vh] pr-4">
              <div className="space-y-3">
                {DIAS_SEMANA.map((dia) => (
                  <div key={dia} className="grid grid-cols-[100px_1fr] items-center gap-4 border-b pb-3">
                    <Label className="capitalize font-semibold">{dia}</Label>
                    <Select value={turnos[dia]} onValueChange={(val) => handleSelectChange('turno', dia, val)}>
                      <SelectTrigger className={turnos[dia] === "descanso" ? "bg-slate-100 text-slate-500" : ""}>
                        <SelectValue placeholder="Seleccionar turno..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="descanso" className="font-bold text-emerald-600">Día de Descanso (Libre)</SelectItem>
                        {horariosDisponibles.map(h => (
                          <SelectItem key={h.id} value={h.id.toString()}>
                            {h.nombre} ({h.entrada.slice(0, 5)} - {h.salida.slice(0, 5)})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ))}
              </div>
            </ScrollArea>
            <Button onClick={handleGuardarTurnos} disabled={isSaving} className="w-full bg-blue-600 hover:bg-blue-700">
              <Save className="w-4 h-4 mr-2" /> {isSaving ? "Guardando..." : "Guardar Horarios"}
            </Button>
          </TabsContent>

          <TabsContent value="descansos" className="space-y-4 pt-4">
            <ScrollArea className="h-[45vh] pr-4">
              <div className="space-y-3">
                {DIAS_SEMANA.map((dia) => {
                  const esDiaLibre = turnos[dia] === "descanso";
                  
                  return (
                    <div key={dia} className="grid grid-cols-[100px_1fr] items-center gap-4 border-b pb-3">
                      <Label className="capitalize font-semibold">{dia}</Label>
                      <Select 
                        value={descansos[dia]} 
                        onValueChange={(val) => handleSelectChange('descanso', dia, val)}
                        disabled={esDiaLibre} // 👈 Inhabilitamos si el turno es descanso
                      >
                        <SelectTrigger className={esDiaLibre || descansos[dia] === "descanso" ? "bg-slate-100 text-slate-500" : ""}>
                          <SelectValue placeholder={esDiaLibre ? "No aplica (Día libre)" : "Seleccionar descanso..."} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="descanso" className="font-bold text-emerald-600">Día de Descanso / Sin Pausa</SelectItem>
                          {descansosDisponibles.map(d => (
                            <SelectItem key={d.id} value={d.id.toString()}>
                              {d.nombre} ({d.inicio.slice(0, 5)} - {d.fin.slice(0, 5)})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
            <Button onClick={handleGuardarDescansos} disabled={isSaving} className="w-full bg-orange-600 hover:bg-orange-700">
              <Save className="w-4 h-4 mr-2" /> {isSaving ? "Guardando..." : "Guardar Descansos"}
            </Button>
          </TabsContent>

        </Tabs>
      </DialogContent>
    </Dialog>
  );
}*/
'use client';

import { useState, useEffect } from "react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Pencil, Save, Clock, Coffee, Loader2, CalendarOff } from "lucide-react";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useHoy } from "@/hooks/useHoy";

import { guardarTurnosSemana, guardarDescansosSemana } from "@/app/(roles)/rh/horarios/actions";
import { getIdsConfiguracionActual } from "@/services/horarios"; 

export interface TurnoOption { id: number; nombre: string; entrada: string; salida: string; }
export interface DescansoOption { id: number; nombre: string; inicio: string; fin: string; }

interface EditarHorarioProps {
  empleadoId: string;
  empleadoNombre: string;
  horariosDisponibles: TurnoOption[];
  descansosDisponibles: DescansoOption[];
}

const DIAS_SEMANA = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'] as const;
type DiaSemana = typeof DIAS_SEMANA[number];

type SemanaConfigStr = Record<DiaSemana, string>;
type SemanaConfigBool = Record<DiaSemana, boolean>;

const configStrVacia: SemanaConfigStr = { lunes: "", martes: "", miercoles: "", jueves: "", viernes: "", sabado: "", domingo: "" };
const configBoolVacia: SemanaConfigBool = { lunes: false, martes: false, miercoles: false, jueves: false, viernes: false, sabado: false, domingo: false };

export function EditarHorarioModal({
  empleadoId, empleadoNombre, horariosDisponibles, descansosDisponibles
}: EditarHorarioProps) {

  const [isOpen, setIsOpen] = useState(false);
  const [isLoadingDraft, setIsLoadingDraft] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { getFormatosBD } = useHoy();

  // Estados Base (Para saber si hay cambios)
  const [turnosOriginales, setTurnosOriginales] = useState<SemanaConfigStr>(configStrVacia);
  const [descansosOriginales, setDescansosOriginales] = useState<SemanaConfigStr>(configStrVacia);
  const [diasLibresOriginales, setDiasLibresOriginales] = useState<SemanaConfigBool>(configBoolVacia);

  // Estados Editables
  const [turnos, setTurnos] = useState<SemanaConfigStr>(configStrVacia);
  const [descansos, setDescansos] = useState<SemanaConfigStr>(configStrVacia);
  const [diasLibres, setDiasLibres] = useState<SemanaConfigBool>(configBoolVacia);

  const cargarDatosActuales = async () => {
    setIsLoadingDraft(true);
    try {
      const bd = await getIdsConfiguracionActual(empleadoId);
      
      const turnosMap = { ...configStrVacia };
      const descansosMap = { ...configStrVacia };
      const libresMap = { ...configBoolVacia };

      DIAS_SEMANA.forEach(dia => {
        // Si el turno viene nulo de la base de datos, significa que es día libre
        const esLibre = !bd.turnos || bd.turnos[dia] === null;
        
        libresMap[dia] = esLibre;
        turnosMap[dia] = esLibre ? "descanso" : String(bd.turnos[dia]);
        descansosMap[dia] = esLibre ? "descanso" : (bd.descansos && bd.descansos[dia] ? String(bd.descansos[dia]) : "");
      });

      setTurnosOriginales(turnosMap);
      setDescansosOriginales(descansosMap);
      setDiasLibresOriginales(libresMap);

      setTurnos(turnosMap);
      setDescansos(descansosMap);
      setDiasLibres(libresMap);

    } catch (error) {
      toast.error("Error al cargar la configuración actual.");
    } finally {
      setIsLoadingDraft(false);
    }
  };

  useEffect(() => {
    if (isOpen) cargarDatosActuales();
  }, [isOpen, empleadoId]);

  // --- MANEJADORES DE GUARDADO INDEPENDIENTES ---

  const handleGuardarTurnos = async () => {
    // Solo validamos los días que NO son libres
    const faltanDatos = DIAS_SEMANA.some(dia => !diasLibres[dia] && turnos[dia] === "");
    if (faltanDatos) {
      toast.error("Asigna un turno a todos los días laborables.");
      return;
    }
    
    setIsSaving(true);
    const { fecha, hora } = getFormatosBD();

    try {
      // Usa tu action existente que actualiza la tabla empleados_turno_horarios
      const result = await guardarTurnosSemana(empleadoId, turnos, fecha, hora);
      if (result.error) toast.error(result.error);
      else {
        toast.success(result.success);
        setTurnosOriginales(turnos); 
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleGuardarDescansos = async () => {
    const faltanDatos = DIAS_SEMANA.some(dia => !diasLibres[dia] && descansos[dia] === "");
    if (faltanDatos) {
      toast.error("Asigna un descanso a todos los días laborables.");
      return;
    }
    
    setIsSaving(true);
    const { fecha, hora } = getFormatosBD();

    try {
      // Usa tu action existente que actualiza la tabla empleados_turno_descansos
      const result = await guardarDescansosSemana(empleadoId, descansos, fecha, hora);
      if (result.error) toast.error(result.error);
      else {
        toast.success(result.success);
        setDescansosOriginales(descansos);
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleGuardarDiasLibres = async () => {
    // Si quitaron un día libre, tenemos que asegurarnos que le hayan asignado un turno y descanso en las otras tabs
    const requiereAsignacion = DIAS_SEMANA.some(dia => !diasLibres[dia] && (turnos[dia] === "descanso" || turnos[dia] === ""));
    if (requiereAsignacion) {
      toast.error("Has habilitado un nuevo día laborable. Ve a las pestañas de Turnos y Descansos para asignarle sus horas antes de guardar.");
      return;
    }

    setIsSaving(true);
    const { fecha, hora } = getFormatosBD();

    try {
      // Al guardar días libres, impactamos AMBAS tablas para mantener consistencia
      const resTurnos = await guardarTurnosSemana(empleadoId, turnos, fecha, hora);
      const resDescansos = await guardarDescansosSemana(empleadoId, descansos, fecha, hora);

      if (resTurnos.error || resDescansos.error) {
        toast.error("Hubo un error al actualizar ambos registros.");
      } else {
        toast.success("Días de descanso actualizados correctamente en ambas tablas.");
        cargarDatosActuales(); // Recargamos todo para sincronizar los estados originales
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  // --- CÁLCULOS VISUALES ---
  const diasLaborables = DIAS_SEMANA.filter(dia => !diasLibres[dia]);
  const hayCambiosEnTurnos = JSON.stringify(turnos) !== JSON.stringify(turnosOriginales);
  const hayCambiosEnDescansos = JSON.stringify(descansos) !== JSON.stringify(descansosOriginales);
  const hayCambiosEnDiasLibres = JSON.stringify(diasLibres) !== JSON.stringify(diasLibresOriginales);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="text-blue-600 hover:bg-blue-50">
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Gestionar Horarios: {empleadoNombre}</DialogTitle>
        </DialogHeader>

        {isLoadingDraft ? (
          <div className="flex flex-col items-center justify-center py-10 opacity-60">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500 mb-2" />
            <span className="text-sm">Cargando datos actuales...</span>
          </div>
        ) : (
          <Tabs defaultValue="turnos" className="w-full mt-2">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="turnos" className="flex items-center gap-1 relative text-xs sm:text-sm">
                <Clock className="w-3.5 h-3.5" /> Turnos
                {hayCambiosEnTurnos && <span className="absolute top-1 right-1 w-2 h-2 bg-blue-500 rounded-full animate-pulse" />}
              </TabsTrigger>
              <TabsTrigger value="descansos" className="flex items-center gap-1 relative text-xs sm:text-sm">
                <Coffee className="w-3.5 h-3.5" /> Descansos
                {hayCambiosEnDescansos && <span className="absolute top-1 right-1 w-2 h-2 bg-orange-500 rounded-full animate-pulse" />}
              </TabsTrigger>
              <TabsTrigger value="dias-libres" className="flex items-center gap-1 relative text-xs sm:text-sm">
                <CalendarOff className="w-3.5 h-3.5" /> Días Libres
                {hayCambiosEnDiasLibres && <span className="absolute top-1 right-1 w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />}
              </TabsTrigger>
            </TabsList>

            {/* TAB 1: SOLO TURNOS */}
            <TabsContent value="turnos" className="space-y-4 pt-4">
              <ScrollArea className="h-[45vh] pr-4">
                <div className="space-y-3">
                  {diasLaborables.length === 0 ? (
                    <div className="text-center text-muted-foreground p-4 text-sm bg-slate-50 rounded-md border">Toda la semana está marcada como libre.</div>
                  ) : (
                    diasLaborables.map((dia) => {
                      const isModificado = turnos[dia] !== turnosOriginales[dia];
                      return (
                        <div key={dia} className="grid grid-cols-[100px_1fr] items-center gap-4 border-b pb-3">
                          <Label className="capitalize font-semibold">{dia}</Label>
                          <Select value={turnos[dia]} onValueChange={(val) => setTurnos(prev => ({ ...prev, [dia]: val }))}>
                            <SelectTrigger className={isModificado ? "border-blue-400 bg-blue-50" : ""}>
                              <SelectValue placeholder="Seleccionar turno..." />
                            </SelectTrigger>
                            <SelectContent>
                              {horariosDisponibles.map(h => (
                                <SelectItem key={h.id} value={h.id.toString()}>
                                  {h.nombre} ({h.entrada.slice(0, 5)} - {h.salida.slice(0, 5)})
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      );
                    })
                  )}
                </div>
              </ScrollArea>
              <Button onClick={handleGuardarTurnos} disabled={isSaving || !hayCambiosEnTurnos} className="w-full bg-blue-600 hover:bg-blue-700">
                <Save className="w-4 h-4 mr-2" /> Guardar Solo Turnos
              </Button>
            </TabsContent>

            {/* TAB 2: SOLO DESCANSOS */}
            <TabsContent value="descansos" className="space-y-4 pt-4">
              <ScrollArea className="h-[45vh] pr-4">
                <div className="space-y-3">
                  {diasLaborables.length === 0 ? (
                    <div className="text-center text-muted-foreground p-4 text-sm bg-slate-50 rounded-md border">Toda la semana está marcada como libre.</div>
                  ) : (
                    diasLaborables.map((dia) => {
                      const isModificado = descansos[dia] !== descansosOriginales[dia];
                      return (
                        <div key={dia} className="grid grid-cols-[100px_1fr] items-center gap-4 border-b pb-3">
                          <Label className="capitalize font-semibold">{dia}</Label>
                          <Select value={descansos[dia]} onValueChange={(val) => setDescansos(prev => ({ ...prev, [dia]: val }))}>
                            <SelectTrigger className={isModificado ? "border-orange-400 bg-orange-50" : ""}>
                              <SelectValue placeholder="Seleccionar descanso..." />
                            </SelectTrigger>
                            <SelectContent>
                              {descansosDisponibles.map(d => (
                                <SelectItem key={d.id} value={d.id.toString()}>
                                  {d.nombre} ({d.inicio.slice(0, 5)} - {d.fin.slice(0, 5)})
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      );
                    })
                  )}
                </div>
              </ScrollArea>
              <Button onClick={handleGuardarDescansos} disabled={isSaving || !hayCambiosEnDescansos} className="w-full bg-orange-600 hover:bg-orange-700">
                <Save className="w-4 h-4 mr-2" /> Guardar Solo Descansos
              </Button>
            </TabsContent>

            {/* TAB 3: GESTIÓN DE DÍAS LIBRES */}
            <TabsContent value="dias-libres" className="space-y-4 pt-4">
              <ScrollArea className="h-[45vh] pr-4">
                <div className="space-y-2 bg-slate-50 p-4 rounded-lg border">
                  <p className="text-xs text-muted-foreground mb-4">
                    Selecciona los días de descanso para este empleado. Al guardar, se actualizarán ambas tablas de turnos y descansos.
                  </p>
                  {DIAS_SEMANA.map((dia) => {
                    const isModificado = diasLibres[dia] !== diasLibresOriginales[dia];
                    return (
                      <div key={dia} className={`flex items-center justify-between space-x-2 p-3 rounded-md border bg-white ${isModificado ? 'border-emerald-400 shadow-sm' : ''}`}>
                        <Label htmlFor={`lib-${dia}`} className="capitalize font-semibold cursor-pointer w-full">
                          {dia}
                        </Label>
                        <Checkbox
                          id={`lib-${dia}`}
                          checked={diasLibres[dia]}
                          onCheckedChange={(checked) => {
                            const isChecked = checked as boolean;
                            setDiasLibres(prev => ({ ...prev, [dia]: isChecked }));
                            // Forzamos "descanso" en los selects en tiempo real
                            setTurnos(prev => ({ ...prev, [dia]: isChecked ? "descanso" : (turnosOriginales[dia] === "descanso" ? "" : turnosOriginales[dia]) }));
                            setDescansos(prev => ({ ...prev, [dia]: isChecked ? "descanso" : (descansosOriginales[dia] === "descanso" ? "" : descansosOriginales[dia]) }));
                          }}
                        />
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
              <Button onClick={handleGuardarDiasLibres} disabled={isSaving || !hayCambiosEnDiasLibres} className="w-full bg-emerald-600 hover:bg-emerald-700">
                <Save className="w-4 h-4 mr-2" /> Aplicar Días Libres
              </Button>
            </TabsContent>

          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  );
}