'use server';

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from 'next/navigation'
import { z } from "zod";

const UpdatePasswordSchema = z
    .object({
        password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres."),
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Las contraseñas no coinciden.",
        path: ["confirmPassword"],
    });

export async function updatePassword(prevState: any, formData: FormData) {
    const supabase = await createClient();
    const validatedFields = UpdatePasswordSchema.safeParse(
        Object.fromEntries(formData.entries())
    );

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Error de validación.",
        };
    }

    const { error } = await supabase.auth.updateUser({
        password: validatedFields.data.password,
        data: {
            requires_password_change: false // Actualizamos la bandera en los metadatos
        }
    });

    if (error) {
        return {
            message: error.message || "Error al actualizar la contraseña.",
        };
    }
    revalidatePath("/");
    redirect('/perfil')
    return { message: "Contraseña actualizada exitosamente." };

}
