export interface Empleado {
  nombres: string;
  apellido_paterno: string;
  apellido_materno: string;
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
    salida: string | null;
}

// Represents one row in the `registro_checador` table.
export interface RegistroChequeo {
  id: string;
  fecha: string;
  id_empleado: string;
  registro: string; // The time, e.g., "14:30:00"
}

// A reconstructed object representing all check-ins for the day, for UI purposes.
export interface TurnoHoy {
  entrada: string | null;
  salida_descanso: string | null;
  regreso_descanso: string | null;
  salida: string | null;
}
