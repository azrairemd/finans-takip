import { Search, Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Logo } from "./Logo";
import { useAuth } from "@/context/AuthContext";

interface TopBarProps {
  showSearch?: boolean;
  showNotifications?: boolean;
  showProfile?: boolean;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
}

export function TopBar({
  showSearch,
  showNotifications,
  showProfile,
  searchValue,
  onSearchChange,
  searchPlaceholder = "Sembol ara...",
}: TopBarProps) {
  const navigate = useNavigate();
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
    <div className="flex items-center gap-3 px-4 py-3 border-b border-line dark:border-line-dark">
      <Logo size="sm" />

      {showSearch && (
        <div className="flex-1 flex items-center gap-2 bg-surface-2 dark:bg-surface-2-dark rounded-full px-3.5 py-2 min-w-0">
          <Search size={15} className="text-ink-faint dark:text-ink-faint-dark shrink-0" />
          <input
            value={searchValue}
            onChange={(e) => onSearchChange?.(e.target.value)}
            placeholder={searchPlaceholder}
            className="bg-transparent text-sm outline-none w-full min-w-0 text-ink dark:text-ink-dark placeholder:text-ink-faint dark:placeholder:text-ink-faint-dark"
          />
        </div>
      )}

      {!showSearch && <div className="flex-1" />}

      {showNotifications && (
        <button
          aria-label="Bildirimler"
          className="flex items-center justify-center h-9 w-9 rounded-full border border-line dark:border-line-dark text-ink-soft dark:text-ink-soft-dark hover:text-ink dark:hover:text-ink-dark transition-colors shrink-0"
        >
          <Bell size={16} />
        </button>
      )}

      {showProfile && (
        <button
          onClick={() => navigate("/profile")}
          aria-label="Profil"
          className="flex items-center justify-center h-9 w-9 rounded-full bg-ink dark:bg-ink-dark text-canvas dark:text-canvas-dark text-xs font-semibold shrink-0"
        >
          {initials}
        </button>
      )}
    </div>
  );
}
