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