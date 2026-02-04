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

export interface TurnoUsuario {
    id: string;
    id_usuario: string;
    fecha: string;
    entrada: string | null;
    salida_descanso: string | null;
    regreso_descanso: string | null;
    salida: string | null;
}

export interface Horario {
    horario_entrada: string;
    horario_salida: string;
}
