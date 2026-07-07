"use client";

import { useState } from "react";

export function NewsletterCard() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setStatus("error");
      return;
    }
    setStatus("success");
    setEmail("");
  };

  return (
    <div className="border border-border bg-primary/5 p-4">
      <h3 className="mb-2 text-xs font-bold uppercase tracking-widest text-primary">
        The Daily GitHub Digest
      </h3>
      <p className="mb-3 font-sans text-[10px] leading-relaxed text-muted-foreground">
        Get the most important repositories, AI releases, and developer tooling updates delivered every morning.
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (status !== "idle") setStatus("idle");
          }}
          placeholder="you@example.com"
          className="rounded border border-border bg-card px-3 py-2 text-[10px] font-mono text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none"
        />
        <button
          type="submit"
          className="rounded border border-primary bg-primary px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Subscribe
        </button>
      </form>
      {status === "success" && (
        <p className="mt-2 text-[10px] font-mono text-primary">Thanks for subscribing.</p>
      )}
      {status === "error" && (
        <p className="mt-2 text-[10px] font-mono text-destructive">Please enter a valid email.</p>
      )}
    </div>
  );
}
