"use client";

import Image from "next/image";
import { FormEvent, useRef, useState } from "react";
import { ImagePlus, Link, Loader2, X } from "lucide-react";
import { createBrowserSupabase } from "@/lib/supabase";

type Props = {
  value: string;
  onChange: (url: string) => void;
  bucket?: string;
};

export default function ImageUpload({ value, onChange, bucket = "images" }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [showUrlInput, setShowUrlInput] = useState(false);

  async function handleFile(file: File) {
    if (!file.type.startsWith("image/")) {
      setError("Le fichier doit être une image.");
      return;
    }
    setUploading(true);
    setError("");
    const supabase = createBrowserSupabase();
    if (!supabase) {
      setError("Client Supabase non disponible.");
      setUploading(false);
      return;
    }
    const path = `${Date.now()}-${crypto.randomUUID()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
    const { error: uploadError } = await supabase.storage.from(bucket).upload(path, file);
    if (uploadError) {
      setError(`Échec de l'upload : ${uploadError.message}`);
      setUploading(false);
      return;
    }
    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    onChange(data.publicUrl);
    setUploading(false);
  }

  function handleUrlSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const url = new FormData(event.currentTarget).get("url") as string;
    if (url?.trim()) onChange(url.trim());
  }

  return (
    <div className="grid gap-3">
      {value ? (
        <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-zinc-100">
          <Image src={value} alt="Image" fill sizes="400px" className="object-cover" />
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute right-2 top-2 rounded-full bg-black/60 p-1.5 text-white hover:bg-black/80"
            aria-label="Supprimer l'image"
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        <div className="flex aspect-video w-full items-center justify-center rounded-lg border border-dashed border-zinc-300 bg-zinc-50 text-sm text-zinc-400">
          Aucune image sélectionnée
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-2 rounded-lg border border-ink px-4 py-2.5 text-sm font-bold disabled:opacity-50"
        >
          {uploading ? <Loader2 size={16} className="animate-spin" /> : <ImagePlus size={16} />}
          {uploading ? "Upload..." : "Choisir un fichier"}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
          className="hidden"
        />
        <button
          type="button"
          onClick={() => setShowUrlInput(!showUrlInput)}
          className="flex items-center gap-2 rounded-lg border border-zinc-300 px-4 py-2.5 text-sm font-bold text-zinc-600"
        >
          <Link size={16} /> {showUrlInput ? "Masquer" : "Coller une URL"}
        </button>
      </div>

      {showUrlInput ? (
        <form onSubmit={handleUrlSubmit} className="flex gap-2">
          <input
            name="url"
            type="url"
            placeholder="https://..."
            defaultValue={value && !value.startsWith("blob:") ? value : ""}
            className="min-w-0 flex-1 rounded-lg border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-ink"
          />
          <button type="submit" className="rounded-lg bg-ink px-4 py-2 text-sm font-bold text-white">OK</button>
        </form>
      ) : null}

      {error ? <p className="text-sm font-bold text-red-600">{error}</p> : null}
    </div>
  );
}
