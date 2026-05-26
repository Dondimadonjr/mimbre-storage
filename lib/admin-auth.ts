import "server-only";

import { supabaseAdmin } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type AdminAuthorization =
  | {
      status: "unauthenticated";
      userId: null;
      isAdmin: false;
    }
  | {
      status: "authenticated";
      userId: string;
      isAdmin: boolean;
    };

export async function getAdminAuthorization(): Promise<AdminAuthorization> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.getClaims();

  const userId = data?.claims?.sub;

  if (error || !userId) {
    return {
      status: "unauthenticated",
      userId: null,
      isAdmin: false,
    };
  }

  const { data: adminUser, error: adminError } = await supabaseAdmin
    .from("admin_users")
    .select("user_id")
    .eq("user_id", userId)
    .maybeSingle();

  if (adminError) {
    console.error("Error checking admin access:", adminError);
  }

  return {
    status: "authenticated",
    userId,
    isAdmin: Boolean(adminUser && !adminError),
  };
}
