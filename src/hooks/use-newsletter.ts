// src/hooks/use-newsletter.ts
// Shared hook used by BlogHero and BlogCTA.
// Calls our /api/subscribe serverless function — never Kit directly.

import { useState } from "react";

type Status = "idle" | "loading" | "success" | "error";

interface UseNewsletterReturn {
  email: string;
  setEmail: (v: string) => void;
  status: Status;
  message: string;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
}

export function useNewsletter(): UseNewsletterReturn {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = (await res.json()) as { success?: boolean; error?: string };

      if (!res.ok) {
        setStatus("error");
        setMessage(data.error ?? "Something went wrong. Try again.");
        return;
      }

      setStatus("success");
      setMessage(
        "Welcome! Check your inbox — and your spam folder just in case.",
      );
      setEmail("");
    } catch {
      setStatus("error");
      setMessage("Network error. Please try again.");
    }
  };

  return { email, setEmail, status, message, handleSubmit };
}
