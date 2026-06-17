"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { error: loginError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (loginError) throw loginError;

      router.push("/panel-rm");
      router.refresh();
    } catch (loginError) {
      console.error("Login error:", loginError);
      setError("Email o contraseña incorrectos.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-linear-to-b from-cream via-white to-cream px-4 py-12">
      <section className="w-full max-w-md overflow-hidden rounded-4xl border border-border bg-white/95 shadow-soft">
        <div className="border-b border-border bg-cream/60 px-6 py-7 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-coffee text-lg font-black text-white shadow-md">
            RM
          </div>

          <p className="text-xs font-black uppercase tracking-[0.22em] text-coffee">
            Acceso privado
          </p>

          <h1 className="mt-2 text-2xl font-black text-text-dark">
            Panel administrador
          </h1>

          <p className="mt-1 text-sm text-text-secondary">Raíz y Mimbre</p>
        </div>

        <div className="p-6 sm:p-8">
          {error && (
            <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="block">
              <span className="mb-2 block text-sm font-bold text-text-dark">
                Email
              </span>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                autoComplete="email"
                className="w-full rounded-2xl border border-border bg-white px-4 py-3 text-sm outline-none transition focus:border-coffee focus:ring-4 focus:ring-coffee/10"
                placeholder="admin@raizymimbre.cl"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-bold text-text-dark">
                Contraseña
              </span>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                autoComplete="current-password"
                className="w-full rounded-2xl border border-border bg-white px-4 py-3 text-sm outline-none transition focus:border-coffee focus:ring-4 focus:ring-coffee/10"
                placeholder="••••••••"
              />
            </label>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-coffee px-5 py-3.5 text-sm font-black text-white shadow-lg shadow-coffee/20 transition hover:-translate-y-0.5 hover:bg-coffee-dark disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Iniciando sesión..." : "Ingresar"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-text-secondary">
            Para obtener acceso, contacta al administrador.
          </p>
        </div>
      </section>
    </main>
  );
}