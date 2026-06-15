import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/proxy";

export async function proxy(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  if (pathname === "/pago/retorno/resultado" && !searchParams.has("token_ws")) {
    const redirectUrl = request.nextUrl.clone();

    redirectUrl.pathname = "/pago/resultado";
    redirectUrl.search = "";
    redirectUrl.searchParams.set("status", "error");

    const response = NextResponse.redirect(redirectUrl, 303);
    response.headers.set("Cache-Control", "no-store, max-age=0");

    return response;
  }

  return await updateSession(request);
}