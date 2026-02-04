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
export interface Turno_Realizandose {
    id: string;
    fecha: string;
    id_empleado: string;
    entrada: string | null;
    salida_descanso: string | null;
    regreso_descanso: string | null;
    salida: string | null;
}
