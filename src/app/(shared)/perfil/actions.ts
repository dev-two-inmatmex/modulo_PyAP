"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function logout() {
  const supabase = await createClient();

  // Explicitly handle the response from signOut
  const { error } = await supabase.auth.signOut()

  if (error) {
    // Log any errors for debugging, but don't return them to the client
    console.error("Error during sign out:", error.message);
  }

  // Always redirect to the login page
  redirect("/login");
}
