import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Navigate } from "react-router-dom";
import { Logo } from "@/components/Logo";
import { GoogleLoginButton } from "@/components/GoogleLoginButton";
import { useAuth } from "@/context/AuthContext";
import { X } from "lucide-react";

export function LoginPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const { user } = useAuth();

  if (user) return <Navigate to="/dashboard" replace />;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-canvas dark:bg-canvas-dark px-6">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center gap-10"
      >
        <Logo size="lg" />

        <button
          onClick={() => setModalOpen(true)}
          className="text-sm font-medium tracking-wide text-ink-soft dark:text-ink-soft-dark border-b border-ink-faint dark:border-ink-faint-dark pb-0.5 hover:text-ink dark:hover:text-ink-dark hover:border-ink dark:hover:border-ink-dark transition-colors"
        >
          Giriş
        </button>
      </motion.div>

      <AnimatePresence>
        {modalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-ink/40 dark:bg-black/60 backdrop-blur-sm"
            onClick={() => setModalOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.97 }}
              transition={{ type: "spring", stiffness: 300, damping: 28 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full sm:w-[360px] bg-surface dark:bg-surface-dark rounded-t-3xl sm:rounded-3xl border border-line dark:border-line-dark p-8 flex flex-col items-center gap-6"
            >
              <button
                onClick={() => setModalOpen(false)}
                className="absolute top-4 right-4 text-ink-faint dark:text-ink-faint-dark hover:text-ink dark:hover:text-ink-dark"
                aria-label="Kapat"
              >
                <X size={18} />
              </button>

              <Logo size="md" />
              <p className="text-sm text-ink-soft dark:text-ink-soft-dark text-center">
                Portföyünü ve favori varlıklarını takip etmek için
                hesabınla giriş yap.
              </p>

              <GoogleLoginButton />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
