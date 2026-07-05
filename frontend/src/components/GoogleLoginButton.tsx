import { useEffect, useRef } from "react";
import { useAuth } from "@/context/AuthContext";

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: Record<string, unknown>) => void;
          renderButton: (parent: HTMLElement, options: Record<string, unknown>) => void;
        };
      };
    };
  }
}

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined;

export function GoogleLoginButton() {
  const buttonRef = useRef<HTMLDivElement>(null);
  const { loginWithGoogleIdToken } = useAuth();

  useEffect(() => {
    if (!CLIENT_ID || !buttonRef.current) return;

    const scriptId = "google-identity-script";
    if (!document.getElementById(scriptId)) {
      const script = document.createElement("script");
      script.id = scriptId;
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.onload = renderButton;
      document.body.appendChild(script);
    } else {
      renderButton();
    }

    function renderButton() {
      if (!window.google || !buttonRef.current) return;
      window.google.accounts.id.initialize({
        client_id: CLIENT_ID,
        callback: (response: { credential: string }) => {
          loginWithGoogleIdToken(response.credential);
        },
      });
      window.google.accounts.id.renderButton(buttonRef.current, {
        theme: "outline",
        size: "large",
        shape: "pill",
        width: 280,
      });
    }
  }, []);

  if (!CLIENT_ID) {
    return (
      <div className="flex flex-col items-center gap-3">
        <p className="text-xs text-ink-faint dark:text-ink-faint-dark text-center max-w-[260px]">
          Google girişini etkinleştirmek için <code>.env</code> dosyasına{" "}
          <code>VITE_GOOGLE_CLIENT_ID</code> ekle. Şimdilik demo hesapla devam
          edebilirsin.
        </p>
      </div>
    );
  }

  return <div ref={buttonRef} className="flex justify-center" />;
}
