export interface Empleado {
  id: string;
  nombres: string;
  apellido_paterno: string;
  apellido_materno: string;
}

export interface Vista_Lista_Empleados{
  id: string;
  nombre_completo: string;
  puesto: string | null;
  area: string | null;
  estatus: string | null;
  url: string | null;
}
export interface Vista_Empleado_Datos_Editables {
  id: string;
  direccion: string | null;
  telefonos: Telefono[];
}

export interface EmployeeCardProps {
  empleado: Vista_Lista_Empleados;
  edit_empleado: Vista_Empleado_Datos_Editables;
  avatarUrl?: string;
}
export interface Telefono {
  id: string;
  tipo: 'principal' | 'emergencia';
  numero_telefonico: string;
  propietario: string | null;
}

export interface RolSistema {
  id: string;
  nombre_rol: string;
}

export interface UsuarioRol {
  id:string;
  roles_sistema: RolSistema[];
}

export interface EmpleadoTurno {
    entrada: string | null;
    salida_descanso: string | null;
    regreso_descanso: string | null;
    salida: string | null;
}

type ChequeoTipo = 'entrada' | 'salida_descanso' | 'regreso_descanso' | 'salida';

// Represents one row in the `registro_checador` table.
export interface RegistroChequeo {
  id: string;
  fecha: string;
  id_empleado: string;
  registro: string; // The time, e.g., "14:30:00"
  tipo_registro: ChequeoTipo; // The type of check-in
  latitud: number;
  longitud: number;
  exactitud_geografica: number;
  estatus_puntualidad?: 'Puntual' | 'Retraso Leve' | 'Retraso Grave' | 'Salida Anticipada' | null;
}

// A reconstructed object representing all check-ins for the day, for UI purposes.
export interface Turno {
  id: string;
  entrada: string | null;
  salida_descanso: string | null;
  regreso_descanso: string | null;
  salida: string | null;
}
