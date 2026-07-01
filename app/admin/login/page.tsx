"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { Loader2, LockKeyhole } from "lucide-react";
import { createBrowserSupabase } from "@/lib/supabase";

export default function AdminLoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    const form = new FormData(event.currentTarget);
    const supabase = createBrowserSupabase();
    if (!supabase) {
      router.push("/admin");
      return;
    }
    const { error } = await supabase.auth.signInWithPassword({
      email: String(form.get("email")),
      password: String(form.get("password"))
    });
    setLoading(false);
    if (error) {
      setMessage(error.message);
      return;
    }
    router.push("/admin");
  }

  return (
    <main className="grid min-h-screen place-items-center bg-mist px-4">
      <form onSubmit={submit} className="w-full max-w-md rounded-xl bg-white p-6 shadow-soft">
        <div className="grid h-12 w-12 place-items-center rounded-full bg-gold"><LockKeyhole /></div>
        <h1 className="mt-5 text-3xl font-black">Admin 99 DH Store</h1>
        <p className="mt-2 text-zinc-600">Connectez-vous avec un compte Supabase présent dans `admin_users`.</p>
        <div className="mt-6 grid gap-4">
          <input required type="email" name="email" placeholder="Email" className="rounded-lg border border-zinc-200 px-4 py-3 outline-none focus:border-ink" />
          <input required type="password" name="password" placeholder="Mot de passe" className="rounded-lg border border-zinc-200 px-4 py-3 outline-none focus:border-ink" />
          {message ? <p className="rounded-lg bg-red-50 p-3 text-sm font-bold text-red-700">{message}</p> : null}
          <button className="flex items-center justify-center gap-2 rounded-lg bg-ink px-5 py-4 font-bold text-white">
            {loading ? <Loader2 className="animate-spin" size={18} /> : null}
            Se connecter
          </button>
          <Link href="/" className="text-center text-sm font-bold underline">Retour boutique</Link>
        </div>
      </form>
    </main>
  );
}
