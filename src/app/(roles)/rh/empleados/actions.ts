'use server'
import { createAdminClient } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import sharp from 'sharp';

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
    propietario_telefono2: formData.get('propietario_telefono2') as string | null,
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
  const { error: empleadoError } = await supabase.from('empleados').insert({
    id: userId,
    nombres: data.nombres,
    apellido_paterno: data.a_paterno,
    apellido_materno: data.a_materno,
    fecha_nacimiento: data.fecha_nacimiento,
    direccion: data.direccion,
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
    supabase.from('empleado_telefonos').insert({ id_empleado: userId, numero_telefonico: data.telefono1, tipo: 'principal', propietario: 'Propio' }),
  ];

  if (data.telefono2) {
    inserts.push(supabase.from('empleado_telefonos').insert({
      id_empleado: userId, numero_telefonico: data.telefono2, tipo: 'emergencia',
      propietario: data.propietario_telefono2
    }));
  }

  const results = await Promise.all(inserts);
  const errors = results.map(r => r.error).filter(Boolean);

  if (errors.length > 0) {
    console.error('Errors inserting employee details:', errors);
    // Rollback needed for all previous inserts
    return { message: `Error al insertar detalles del empleado: ${errors.map(e => e?.message).join(', ')}` };
  }

  revalidatePath('/(roles)/rh/empleados');
  return { message: 'Empleado agregado con éxito' };
}
export async function updateEmployeeAddress(employeeId: string, newAddress: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('empleados')
    .update({ direccion: newAddress })
    .eq('id', employeeId);

  if (error) {
    return { success: false, message: `Error al actualizar la dirección: ${error.message}` };
  }

  revalidatePath('/(roles)/rh/empleados');
  return { success: true, message: "Dirección actualizada con éxito." };
}

// Action to update employee's phone numbers
export async function updateEmployeePhones(employeeId: string, phone1: string, phone2?: string, propietario_telefono2?: string) {
  const supabase = await createClient();
  const { error: err1 } = await supabase
    .from('empleado_telefonos')
    .upsert({
      id_empleado: employeeId,
      tipo: 'principal',
      numero_telefonico: phone1,
      propietario: 'Propio'
    }, { onConflict: 'id_empleado, tipo' });

  // 2. Actualizar/Insertar el teléfono de emergencia si existe
  if (phone2) {
    await supabase
      .from('empleado_telefonos')
      .upsert({
        id_empleado: employeeId,
        tipo: 'emergencia',
        numero_telefonico: phone2,
        propietario: propietario_telefono2
      }, { onConflict: 'id_empleado, tipo' });
  }
  revalidatePath('/(roles)/rh/empleados');
  return { success: true, message: "Teléfonos actualizados con éxito." };
}

// Action to upload and update avatar
export async function updateAvatar(formData: FormData) {
  const supabase = await createClient();
  const file = formData.get('avatar') as Blob;
  const employeeId = formData.get('employeeId') as string;
  const faceDescriptor = formData.get('faceDescriptor') as string;
  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    // 1. Procesamiento con Sharp (WebP + Redimensionar)
    const optimizedImage = await sharp(buffer)
      .resize(400, 400, { fit: 'cover' })
      .webp({ quality: 80 })
      .toBuffer();

    // 2. Subida al Storage (Estructura de carpeta)
    const filePath = `${employeeId}/avatar.webp`;
    const { error: storageError } = await supabase.storage
      .from('avatars')
      .upload(filePath, optimizedImage, {
        contentType: 'image/webp',
        upsert: true
      });

    if (storageError) throw storageError;

    // 3. Guardar Descriptor Facial en JSONB
    // Usamos upsert para actualizar si ya existe un registro para este empleado
    const { error: dbError } = await supabase
      .from('empleado_datos_biometricos')
      .upsert({
        id_empleado: employeeId,
        descriptor_facial: JSON.parse(faceDescriptor), // Convertimos el string a objeto JSON
        creado_el: new Date().toISOString()
      }, { onConflict: 'id_empleado' });

    if (dbError) throw dbError;

    revalidatePath('/rh/empleados');
    return { success: true, message: 'Avatar y biometría actualizados correctamente' };

  } catch (e: any) {
    console.error('Error en updateAvatar:', e);
    return { success: false, message: e.message };
  }
}

export async function getEmployeeDetails(employeeId: string) {
  const supabase = await createClient();
  try {
    const { data, error } = await supabase
      .from('empleados')
      .select(`
              *,
              telefonos:empleado_telefonos(*)
          `)
      .eq('id', employeeId)
      .single();

    if (error) {
      console.error('Error fetching employee details:', error);
      throw new Error(error.message);
    }

    return { success: true, data };

  } catch (error: any) {
    return { success: false, message: error.message, data: null };
  }
}