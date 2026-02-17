'use server';
import { createAdminClient } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

// This is a simplified version. A real-world scenario would have more robust error handling and validation.
export async function addUser(prevState: any, formData: FormData) {
  const supabase = await createClient();
  const supabaseAdmin = createAdminClient();

  const data = {
    nombres: formData.get('nombres') as string,
    a_paterno: formData.get('a_paterno') as string,
    a_materno: formData.get('a_materno') as string,
    fecha_nacimiento: formData.get('fecha_nacimiento') as string,
    sexo: formData.get('sexo') === 'true',
    direccion: formData.get('direccion') as string,
    telefono1: formData.get('telefono1') as string,
    telefono2: formData.get('telefono2') as string | null,
    email: formData.get('email') as string,
    id_puesto: Number(formData.get('id_puesto')),
    id_ubicacion: Number(formData.get('id_ubicacion')),
    id_ext_horario: Number(formData.get('id_ext_horario')),
    id_ext_descanso: Number(formData.get('id_ext_descanso')),
    id_estatus: Number(formData.get('id_estatus')),
  };

  // 1. Create user in auth.users
  const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
    email: data.email,
    password: 'password123', 
    email_confirm: true,// IMPORTANT: This is insecure. Use a secure password generation method.
  });

  if (authError || !authData.user) {
    console.error('Error creating auth user:', authError);
    return { message: `Error al crear usuario de autenticación: ${authError?.message}` };
  }

  const userId = authData.user.id;

  // 2. Insert into Empleados table
  const { error: empleadoError } = await supabase .from('Empleados').insert({
    id: userId,
    nombres: data.nombres,
    apellido_paterno: data.a_paterno,
    apellido_materno: data.a_materno,
    fecha_nacimiento: data.fecha_nacimiento,
    Direccion: data.direccion,
    sexo: data.sexo,
    fecha_ingreso: new Date().toISOString().split('T')[0],
  });

  if (empleadoError) {
    console.error('Error inserting into Empleados:', empleadoError);
    // Rollback would be needed here for the created auth user
    return { message: `Error al insertar empleado: ${empleadoError.message}` };
  }

  const inserts = [
    supabase.from('empleado_puesto').insert({ id_empleado: userId, id_puesto: data.id_puesto, fecha_inicio: new Date().toISOString().split('T')[0] }),
    supabase.from('empleado_ubicacion_chequeo').insert({ id_empleado: userId, id_ubicaciones: data.id_ubicacion }),
    supabase.from('empleado_turno').insert({ id_empleado: userId, id_horario: data.id_ext_horario, id_descanso: data.id_ext_descanso, Lunes: true, Martes: true, Miercoles: true, Jueves: true, Viernes: true, Sabado: true }),
    supabase.from('empleado_estatus').insert({ id_empleado: userId, id_estatus: data.id_estatus }),
    supabase.from('empleado_telefonos').insert({ id_empleado: userId, numero_telefonico: data.telefono1, tipo: 'principal' }),
  ];
  
  if (data.telefono2) {
    inserts.push(supabase.from('empleado_telefonos').insert({ id_empleado: userId, numero_telefonico: data.telefono2, tipo: 'emergencia' }));
  }

  const results = await Promise.all(inserts);
  const errors = results.map(r => r.error).filter(Boolean);

  if (errors.length > 0) {
    console.error('Errors inserting employee details:', errors);
    // Rollback needed for all previous inserts
    return { message: `Error al insertar detalles del empleado: ${errors.map(e=>e?.message).join(', ')}` };
  }

  revalidatePath('/(roles)/rh/empleados');
  return { message: 'Empleado agregado con éxito' };
}
