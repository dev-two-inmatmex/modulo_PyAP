'use server'
import { createAdminClient } from '@/lib/supabase/admin';
import { createServidorClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import sharp from 'sharp';

// This is a simplified version. A real-world scenario would have more robust error handling and validation.
export async function addUser(prevState: any, formData: FormData) {
  const supabase = await createServidorClient();
  const supabaseAdmin = createAdminClient();
  const tempPassword = `${Math.random().toString(36).slice(-6)}`
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
    //DatosEmpresariales
    fecha_ingreso: formData.get('fecha_ingreso') as string,
    email: formData.get('email') as string,
    id_puesto: Number(formData.get('id_puesto')),
    id_ubicacion: Number(formData.get('id_ubicacion')),
    id_estatus: Number(formData.get('id_estatus')),
    //Horarios
    id_ext_horario: Number(formData.get('id_ext_horario')),
    id_ext_descanso: Number(formData.get('id_ext_descanso')),
  };

  // 1. Create user in auth.users
  const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
    email: data.email,
    password: tempPassword,
    email_confirm: true,// IMPORTANT: This is insecure. Use a secure password generation method.
    user_metadata: {
      requires_password_change: true // <- Aquí está la clave
    }
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
    sexo: data.sexo,
    fecha_ingreso: data.fecha_ingreso,
  });

  if (empleadoError) {
    console.error('Error inserting into Empleados:', empleadoError);
    // Rollback would be needed here for the created auth user
    return { message: `Error al insertar empleado: ${empleadoError.message}` };
  }

  const inserts = [
    supabase.from('empleado_puesto').insert({ id_empleado: userId, id_puesto: data.id_puesto, fecha_inicio: new Date().toISOString().split('T')[0] }),
    supabase.from('empleado_ubicacion_chequeo').insert({ id_empleado: userId, id_ubicaciones: data.id_ubicacion }),
    supabase.from('empleado_turno').insert({ id_empleado: userId, id_horario: data.id_ext_horario, id_descanso: data.id_ext_descanso, lunes: true, martes: true, miercoles: true, jueves: true, viernes: true, sabado: true }),
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

  const avatarFile = formData.get('avatar');
  const faceDescriptor = formData.get('faceDescriptor');
  if (avatarFile && faceDescriptor) {
    // Le inyectamos el ID recién creado al FormData
    formData.append('employeeId', userId);
    
    // ¡Llamamos a tu función existente!
    const avatarResult = await updateAvatar(formData);
    
    if (!avatarResult.success) {
      console.error("Error al procesar biometría:", avatarResult.message);
      // El empleado se creó bien, pero la foto falló. Avisamos al usuario.
      return { message: `Empleado agregado, pero hubo un error subiendo la foto: ${avatarResult.message}` };
    }
  }

  revalidatePath('/(roles)/rh/empleados');
  return { message: 'Empleado agregado con éxito' };
}

export async function addUserIncomplet(prevState: any, formData: FormData) {
  const supabase = await createServidorClient();
  const supabaseAdmin = createAdminClient();
  const tempPassword = `${Math.random().toString(36).slice(-6)}`
  const data = {
    //Datos Personales
    nombres: formData.get('nombres') as string,
    a_paterno: formData.get('a_paterno') as string,
    a_materno: formData.get('a_materno') as string,
    fecha_nacimiento: formData.get('fecha_nacimiento') as string,
    sexo: formData.get('sexo') === 'true',
    //DatosEmpresariales
    email: formData.get('email') as string,
    id_ubicacion: Number(formData.get('id_ubicacion')),
    //Horarios
    id_estatus: Number(1),
    id_rol: Number(1),
    id_empresa: Number(formData.get('id_empresa')),
    id_ext_horario: Number(formData.get('id_ext_horario')),
    id_ext_descanso: Number(formData.get('id_ext_descanso')),
  };

  // 1. Create user in auth.users
  const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
    email: data.email,
    password: tempPassword,
    email_confirm: true,// IMPORTANT: This is insecure. Use a secure password generation method.
    user_metadata: {
      requires_password_change: true // <- Aquí está la clave
    }
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
    sexo: data.sexo,
    id_empresa: data.id_empresa,
  });

  if (empleadoError) {
    console.error('Error inserting into Empleados:', empleadoError);
    // Rollback would be needed here for the created auth user
    return { message: `Error al insertar empleado: ${empleadoError.message}` };
  }

  const { error: empleadoUbicacionError } = await supabase.from('empleado_ubicacion_chequeo').insert({ id_empleado: userId, id_ubicaciones: data.id_ubicacion });
  if (empleadoUbicacionError) {
    console.error('Error al insertar', empleadoUbicacionError)
    return { message: `Error al insertar la ubicacion: ${empleadoUbicacionError.message}` };
  }

  const {error: empleado_turnoError} = await supabase.from('empleado_turno').insert({ id_empleado: userId, id_horario: data.id_ext_horario, id_descanso: data.id_ext_descanso, lunes: true, martes: true, miercoles: true, jueves: true, viernes: true, sabado: true });
  if (empleado_turnoError) {
    console.error('Error al insertar', empleado_turnoError)
    return { message: `Error al insertar el turno: ${empleado_turnoError.message}` };
  }

  const {error: empleado_estatusError} = await supabase.from('empleado_estatus').insert({ id_empleado: userId, id_estatus: data.id_estatus });
  if (empleado_estatusError) {
    console.error('Error al insertar', empleado_estatusError)
    return { message: `Error al insertar el estatus: ${empleado_estatusError.message}` };
  }
  revalidatePath('/(roles)/rh/empleados');
  return { message: 'Empleado agregado con éxito' };
}

export async function updateEmployeeAddress(employeeId: string, newAddress: string) {
  const supabase = await createServidorClient();

  const { error } = await supabase
    .from('empleados')
    .update({ direccion: newAddress })
    .eq('id', employeeId);

  if (error) {
    return { success: false, message: `Error al actualizar la dirección: ${error.message}` };
  }

  //revalidatePath('/(roles)/rh/empleados');
  return { success: true, message: "Dirección actualizada con éxito." };
}

// Action to update employee's phone numbers
export async function updateEmployeePhones(employeeId: string, phone1: string, phone2?: string, propietario_telefono2?: string) {
  const supabase = await createServidorClient();
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
  //revalidatePath('/(roles)/rh/empleados');
  return { success: true, message: "Teléfonos actualizados con éxito." };
}

// Action to upload and update avatar
export async function updateAvatar(formData: FormData) {
  const supabase = await createServidorClient();
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

    revalidatePath('/(roles)/rh/empleados');
    return { success: true, message: 'Avatar y biometría actualizados correctamente' };

  } catch (e: any) {
    console.error('Error en updateAvatar:', e);
    return { success: false, message: e.message };
  }
}

export async function getEmployeeDetails(employeeId: string) {
  const supabase = await createServidorClient();
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


export async function resetUserPassword(userId: string): Promise<{ 
  success: boolean; 
  tempPassword?: string; 
  message?: string; 
  error?: string 
}> {
  const supabaseAdmin = createAdminClient();
  const tempPassword = `${Math.random().toString(36).slice(-6)}`

  try {
    // PASO 1: Intentamos actualizar la contraseña y el metadata
    const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
      userId,
      { 
        password: tempPassword,
        user_metadata: { requires_password_change: true }
      }
    )
    
    // Si falla aquí, el mensaje de error dirá "Error en Auth"
    if (updateError) {
      console.error('Error en updateUserById:', updateError);
      return { success: false, error: `[Error en Auth]: ${updateError.message}` }
    }

    // PASO 2: Intentamos cerrar las sesiones
    const { error: rpcError } = await supabaseAdmin.rpc(
      'admin_revoke_user_sessions', 
      { target_user_id: userId }
    )
    
    // Si falla aquí, el mensaje de error dirá "Error en RPC"
    if (rpcError) {
      console.error('Error en RPC:', rpcError);
      return { success: false, error: `[Error en RPC]: ${rpcError.message}` }
    }

    return { 
      success: true, 
      tempPassword: tempPassword,
      message: 'Contraseña reseteada y sesiones cerradas.' 
    }

  } catch (error: any) {
    console.error('Error general:', error)
    return { success: false, error: `[Error Inesperado]: ${error.message}` }
  }
}