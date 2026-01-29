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
