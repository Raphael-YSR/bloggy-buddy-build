// src/components/RequireAuth.tsx

import { useEffect, useState, type ReactNode } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getSession, onAuthChange, type AdminSession } from "@/lib/supabase";

interface RequireAuthProps {
  children: ReactNode;
}

function useAdminFavicon() {
  useEffect(() => {
    // Try all common favicon link selectors
    const selectors = [
      "link[rel='icon']",
      "link[rel='shortcut icon']",
      "link[rel~='icon']",
    ];
    const link = selectors.reduce<HTMLLinkElement | null>(
      (found, sel) => found ?? document.querySelector<HTMLLinkElement>(sel),
      null,
    );

    if (link) {
      const original = link.href;
      link.href = "/admin.ico";
      return () => {
        link.href = original;
      };
    }

    // If no existing link tag, create one
    const newLink = document.createElement("link");
    newLink.rel = "icon";
    newLink.href = "/admin.ico";
    document.head.appendChild(newLink);
    return () => {
      document.head.removeChild(newLink);
    };
  }, []);
}

export default function RequireAuth({ children }: RequireAuthProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [session, setSession] = useState<AdminSession | null | undefined>(
    undefined,
  );

  useAdminFavicon();

  useEffect(() => {
    getSession().then(setSession);
    const unsubscribe = onAuthChange(setSession);
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (session === null) {
      navigate("/admin/login", {
        replace: true,
        state: { from: location.pathname },
      });
    }
  }, [session, navigate, location]);

  if (session === undefined) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#000",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "Urbanist, system-ui, sans-serif",
          color: "rgba(255,255,255,0.15)",
          fontSize: "0.85rem",
          letterSpacing: "0.08em",
        }}
      >
        LOADING
      </div>
    );
  }

  if (!session) return null;

  return <>{children}</>;
}
