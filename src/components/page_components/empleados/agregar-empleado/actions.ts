/*'use server'

import { createAdminClient } from '@/lib/supabase/admin';
import { createServidorClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

// Importamos la función de avatar
import { updateAvatar } from '@/app/(roles)/rh/empleados/actions';

// IMPORTAMOS TU HOOK DE TIEMPO
import { useHoy } from "@/hooks/useHoy";

// --- UTILIDAD: Para procesar los turnos/descansos de la semana ---
const procesarValorDia = (valor: string | undefined): number | null => {
  return (!valor || valor === "descanso" || valor === "") ? null : Number(valor);
};

export async function addUser(prevState: any, formData: FormData) {
  const supabase = await createServidorClient();
  const supabaseAdmin = createAdminClient();
  const tempPassword = `${Math.random().toString(36).slice(-6)}`;

  // 1. Obtenemos el usuario actual (HR)
  const { data: { user: currentUser } } = await supabase.auth.getUser();
  const id_capturista = currentUser?.id;

  // 2. Parseamos los objetos JSON que mandó el formulario
  const turnos = JSON.parse((formData.get('turnos') as string) || '{}');
  const descansos = JSON.parse((formData.get('descansos') as string) || '{}');

  const data = {
    //Datos Personales
    nombres: formData.get('nombres') as string,
    a_paterno: formData.get('a_paterno') as string,
    a_materno: formData.get('a_materno') as string,
    fecha_nacimiento: formData.get('fecha_nacimiento') as string,
    sexo: formData.get('sexo') === 'true',
    //Domicilio
    calle: formData.get('calle') as string,
    n_ext: formData.get('n_ext') as string,
    n_int: formData.get('n_int') as string | null,
    colonia: formData.get('colonia') as string,
    c_postal: formData.get('c_postal') as string,
    municipio: formData.get('municipio') as string,
    estado: formData.get('estado') as string,
    //Telefonos
    telefono1: formData.get('telefono1') as string,
    telefono2: formData.get('telefono2') as string | null,
    propietario_telefono2: formData.get('propietario_telefono2') as string | null,
    //Datos Empresariales
    fecha_ingreso: formData.get('fecha_ingreso') as string,
    email: formData.get('email') as string,
    id_puesto: Number(formData.get('id_puesto')),
    id_ubicacion: Number(formData.get('id_ubicacion')),
    id_estatus: Number(formData.get('id_estatus')),
  };

  // 3. Crear usuario en auth.users
  const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
    email: data.email,
    password: tempPassword,
    email_confirm: true, 
    user_metadata: {
      requires_password_change: true 
    }
  });

  if (authError || !authData.user) {
    console.error('Error creating auth user:', authError);
    return { message: `Error al crear usuario de autenticación: ${authError?.message}` };
  }

  const userId = authData.user.id;

  // 4. Insertar en tabla empleados principal
  const { error: empleadoError } = await supabase.from('empleados').insert({
    id: userId,
    nombres: data.nombres,
    apellido_paterno: data.a_paterno,
    apellido_materno: data.a_materno,
    fecha_nacimiento: data.fecha_nacimiento,
    sexo: data.sexo,
    fecha_ingreso: data.fecha_ingreso,
  });

  if (empleadoError) {
    console.error('Error inserting into Empleados:', empleadoError);
    return { message: `Error al insertar empleado: ${empleadoError.message}` };
  }

  // --- APLICAMOS TU REGLA DE NEGOCIO PARA LA FECHA Y HORA ---
  const { getFormatosBD } = useHoy();
  const { fecha: fechaActual, hora: horaActual } = getFormatosBD();
  const fechaEfectiva = data.fecha_ingreso; 

  // 5. Inserciones secundarias
  const inserts = [
    supabase.from('empleado_puesto').insert({ id_empleado: userId, id_puesto: data.id_puesto, fecha_inicio: fechaActual }),
    supabase.from('empleado_ubicacion_chequeo').insert({ id_empleado: userId, id_ubicaciones: data.id_ubicacion }),
    supabase.from('empleado_estatus').insert({ id_empleado: userId, id_estatus: data.id_estatus }),
    supabase.from('empleado_domicilio').insert({
      id_empleado: userId,
      calle: data.calle,
      n_ext: data.n_ext,
      n_int: data.n_int,
      colonia: data.colonia,
      c_postal: data.c_postal,
      municipio: data.municipio,
      estado: data.estado
    }),
    supabase.from('empleado_telefonos').insert({ id_empleado: userId, numero_telefonico: data.telefono1, tipo: 'principal', propietario: 'Propio' }),
    
    // Inserción en historial de TURNOS con la hora y fecha de México
    supabase.from('empleados_turno_horarios').insert({
      id_empleado: userId,
      fecha: fechaActual,
      hora: horaActual,
      ejecutar_a_partir_de: fechaEfectiva,
      id_capturista: id_capturista,
      lunes: procesarValorDia(turnos.lunes),
      martes: procesarValorDia(turnos.martes),
      miercoles: procesarValorDia(turnos.miercoles),
      jueves: procesarValorDia(turnos.jueves),
      viernes: procesarValorDia(turnos.viernes),
      sabado: procesarValorDia(turnos.sabado),
      domingo: procesarValorDia(turnos.domingo),
    }),

    // Inserción en historial de DESCANSOS con la hora y fecha de México
    supabase.from('empleados_turno_descansos').insert({
      id_empleado: userId,
      fecha: fechaActual,
      hora: horaActual,
      ejecutar_a_partir_de: fechaEfectiva,
      id_capturista: id_capturista,
      lunes: procesarValorDia(descansos.lunes),
      martes: procesarValorDia(descansos.martes),
      miercoles: procesarValorDia(descansos.miercoles),
      jueves: procesarValorDia(descansos.jueves),
      viernes: procesarValorDia(descansos.viernes),
      sabado: procesarValorDia(descansos.sabado),
      domingo: procesarValorDia(descansos.domingo),
    })
  ];

  if (data.telefono2) {
    inserts.push(supabase.from('empleado_telefonos').insert({
      id_empleado: userId, numero_telefonico: data.telefono2, tipo: 'emergencia',
      propietario: data.propietario_telefono2
    }));
  }

  // 6. Ejecutamos todas las promesas al mismo tiempo
  const results = await Promise.all(inserts);
  const errors = results.map(r => r.error).filter(Boolean);

  if (errors.length > 0) {
    console.error('Errors inserting employee details:', errors);
    return { message: `Error al guardar configuración del empleado: ${errors.map(e => e?.message).join(', ')}` };
  }

  // 7. Procesamiento Biométrico
  const avatarFile = formData.get('avatar');
  const faceDescriptor = formData.get('faceDescriptor');
  if (avatarFile && faceDescriptor) {
    formData.append('employeeId', userId);
    
    const avatarResult = await updateAvatar(formData);
    
    if (!avatarResult.success) {
      console.error("Error al procesar biometría:", avatarResult.message);
      return { message: `Empleado agregado, pero hubo un error subiendo la foto: ${avatarResult.message}` };
    }
  }

  revalidatePath('/(roles)/rh/empleados');
  return { message: 'Empleado agregado con éxito' };
}*/
'use server'

import { createAdminClient } from '@/lib/supabase/admin';
import { createServidorClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { updateAvatar } from '@/app/(roles)/rh/empleados/actions';
import { useHoy } from "@/hooks/useHoy";

const procesarValorDia = (v: string | undefined) => (v === "descanso" || !v) ? null : Number(v);

export async function addUser(prevState: any, formData: FormData) {
  const supabase = await createServidorClient();
  const supabaseAdmin = createAdminClient();
  const { getFormatosBD } = useHoy();
  const { fecha: fechaActual, hora: horaActual } = getFormatosBD();

  const { data: { user: currentUser } } = await supabase.auth.getUser();
  const id_capturista = currentUser?.id;

  const turnos = JSON.parse((formData.get('turnos') as string) || '{}');
  const descansos = JSON.parse((formData.get('descansos') as string) || '{}');

  const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
    email: formData.get('email') as string,
    password: Math.random().toString(36).slice(-8),
    email_confirm: true,
    user_metadata: { requires_password_change: true }
  });

  if (authError) return { success: false, message: `Error Auth: ${authError.message}`, timestamp: Date.now() };
  const uid = authData.user.id;

  // Usamos "as any" para que TS no llore por el ID (Supabase a veces no lo incluye en el tipo Insert)
  const { error: empError } = await supabase.from('empleados').insert({
    id: uid,
    nombres: formData.get('nombres') as string,
    apellido_paterno: formData.get('a_paterno') as string,
    apellido_materno: formData.get('a_materno') as string,
    fecha_nacimiento: formData.get('fecha_nacimiento') as string,
    sexo: formData.get('sexo') === 'true',
    fecha_ingreso: formData.get('fecha_ingreso') as string,
  } as any);

  if (empError) return { success: false, message: `Error Empleados: ${empError.message}`, timestamp: Date.now() };

  // Forzamos "as string" para todos los datos del formData
  const fechaEfectiva = formData.get('fecha_ingreso') as string;
  const calle = formData.get('calle') as string;
  const n_ext = formData.get('n_ext') as string;
  const n_int = formData.get('n_int') as string | null;
  const colonia = formData.get('colonia') as string;
  const c_postal = formData.get('c_postal') as string;
  const municipio = formData.get('municipio') as string;
  const estado = formData.get('estado') as string;
  const telefono1 = formData.get('telefono1') as string;
  const id_jefe = formData.get('id_jefe') as string;
  
  const inserts = [
    supabase.from('empleados_turno_horarios').insert({
      id_empleado: uid, fecha: fechaActual, hora: horaActual, ejecutar_a_partir_de: fechaEfectiva, id_capturista: id_capturista,
      lunes: procesarValorDia(turnos.lunes), martes: procesarValorDia(turnos.martes), miercoles: procesarValorDia(turnos.miercoles),
      jueves: procesarValorDia(turnos.jueves), viernes: procesarValorDia(turnos.viernes), sabado: procesarValorDia(turnos.sabado), domingo: procesarValorDia(turnos.domingo)
    }),
    supabase.from('empleados_turno_descansos').insert({
      id_empleado: uid, fecha: fechaActual, hora: horaActual, ejecutar_a_partir_de: fechaEfectiva, id_capturista: id_capturista,
      lunes: procesarValorDia(descansos.lunes), martes: procesarValorDia(descansos.martes), miercoles: procesarValorDia(descansos.miercoles),
      jueves: procesarValorDia(descansos.jueves), viernes: procesarValorDia(descansos.viernes), sabado: procesarValorDia(descansos.sabado), domingo: procesarValorDia(descansos.domingo)
    }),
    supabase.from('empleado_puesto').insert({ 
      id_empleado: uid,
      id_puesto: Number(formData.get('id_puesto')), 
      asignado_por: id_capturista,
      orden: 1,
      activo: true,
      fecha_asignacion: fechaActual,
      hora_asignacion: horaActual 
    }),
    supabase.from('empleado_ubicacion_chequeo').insert({ id_empleado: uid, id_ubicaciones: Number(formData.get('id_ubicacion')) }),

    supabase.from('empleado_estatus').insert({ 
      id_empleado: uid,
      id_estatus: Number(formData.get('id_estatus')),
      fecha_cambio: fechaActual, hora_cambio: horaActual,
      activo: true
    }),

    supabase.from('empleado_domicilio').insert({
      id_empleado: uid,
      calle,
      n_ext,
      n_int,
      colonia,
      c_postal,
      municipio,
      estado
    }),

    supabase.from('empleado_telefonos').insert({ 
      id_empleado: uid,
      numero_telefonico: telefono1,
      tipo: 'principal',
      propietario: 'Propio' 
    }),

    supabase.from('empleado_jefe_directo').insert({
      id_empleado: uid,
      id_jefe: id_jefe,
      fecha_asignacion: fechaActual,
      hora_asignacion: horaActual,
      activo: true,
      asignado_por: id_capturista
    }),

    supabase.from('empleado_sueldo_semanal').insert({
      id_empleado: uid,
      cantidad: Number(formData.get('sueldo')),
      fecha_asignacion: fechaActual,
      hora_asignacion: horaActual,
      asignado_por: id_capturista,
      activo: true,
    })
  ];

  const telefono2 = formData.get('telefono2') as string;
  if (telefono2) {
    inserts.push(supabase.from('empleado_telefonos').insert({
      id_empleado: uid, numero_telefonico: telefono2, tipo: 'emergencia',
      propietario: formData.get('propietario_telefono2') as string
    }) as any);
  }

  const results = await Promise.all(inserts);
  const errors = results.map(r => r.error).filter(Boolean);

  if (errors.length > 0) {
    return { success: false, message: `Error al vincular: ${errors.map(e => e?.message).join(', ')}`, timestamp: Date.now() };
  }

  const avatarFile = formData.get('avatar');
  const faceDescriptor = formData.get('faceDescriptor');
  if (avatarFile && faceDescriptor) {
    formData.append('employeeId', uid);
    const avatarResult = await updateAvatar(formData);
    if (!avatarResult.success) {
      return { success: false, message: `Creado, pero error en biometría: ${avatarResult.message}`, timestamp: Date.now() };
    }
  }

  revalidatePath('/rh/empleados');
  return { success: true, message: '¡Empleado agregado con éxito! Listo para el siguiente.', timestamp: Date.now() };
}