import { Logo } from "@/components/Logo";
import { TopTicker } from "@/components/TopTicker";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useAuth } from "@/context/AuthContext";
import { Construction } from "lucide-react";

export function ProfilePage() {
  const { user } = useAuth();

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((p) => p[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "?";

  return (
    <div>
      <div className="flex items-center justify-between px-4 py-3 border-b border-line dark:border-line-dark">
        <Logo size="sm" />
        <ThemeToggle />
      </div>
      <TopTicker />

      <div className="max-w-md mx-auto px-4 py-8">
        <div className="flex flex-col items-center gap-3 mb-10">
          <div className="h-16 w-16 rounded-full bg-ink dark:bg-ink-dark text-canvas dark:text-canvas-dark flex items-center justify-center text-lg font-semibold">
            {initials}
          </div>
          <div className="text-center">
            <p className="font-display text-lg font-semibold text-ink dark:text-ink-dark">
              {user?.name ?? "Kullanıcı"}
            </p>
            <p className="text-xs text-ink-faint dark:text-ink-faint-dark">
              {user?.email}
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center text-center gap-3 bg-surface dark:bg-surface-dark border border-line dark:border-line-dark rounded-2xl p-8">
          <Construction size={26} className="text-ink-faint dark:text-ink-faint-dark" />
          <p className="text-sm font-medium text-ink dark:text-ink-dark">
            Profil ayarları yakında güncellenecek
          </p>
          <p className="text-xs text-ink-faint dark:text-ink-faint-dark max-w-[260px]">
            Bildirim tercihleri, hesap bilgileri ve güvenlik ayarları bu alana
            eklenecek.
          </p>
        </div>
      </div>
    </div>
  );
}
