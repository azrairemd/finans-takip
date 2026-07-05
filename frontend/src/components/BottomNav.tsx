import { Home, Star, User, Headphones, LogOut } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";

interface BottomNavProps {
  onSupportClick: () => void;
  supportActive: boolean;
}

const navItems = [
  { key: "home", label: "Ana Sayfa", icon: Home, path: "/dashboard" },
  { key: "favorites", label: "Favoriler", icon: Star, path: "/favorites" },
  { key: "profile", label: "Profil", icon: User, path: "/profile" },
];

export function BottomNav({ onSupportClick, supportActive }: BottomNavProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-line dark:border-line-dark bg-surface/95 dark:bg-surface-dark/95 backdrop-blur">
      <div className="max-w-md mx-auto flex items-center justify-between px-2 py-2">
        {navItems.map((item) => {
          const active = isActive(item.path);
          const Icon = item.icon;
          return (
            <button
              key={item.key}
              onClick={() => navigate(item.path)}
              className="relative flex flex-col items-center gap-1 px-3 py-1.5 flex-1"
            >
              {active && (
                <motion.div
                  layoutId="nav-pill"
                  className="absolute inset-0 bg-surface-2 dark:bg-surface-2-dark rounded-2xl"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              <Icon
                size={20}
                strokeWidth={active ? 2.4 : 1.8}
                className={`relative z-10 ${
                  active
                    ? "text-ink dark:text-ink-dark"
                    : "text-ink-faint dark:text-ink-faint-dark"
                }`}
              />
              <span
                className={`relative z-10 text-[10px] font-medium ${
                  active
                    ? "text-ink dark:text-ink-dark"
                    : "text-ink-faint dark:text-ink-faint-dark"
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}

        <button
          onClick={onSupportClick}
          className="relative flex flex-col items-center gap-1 px-3 py-1.5 flex-1"
        >
          {supportActive && (
            <motion.div
              layoutId="nav-pill"
              className="absolute inset-0 bg-surface-2 dark:bg-surface-2-dark rounded-2xl"
              transition={{ type: "spring", stiffness: 380, damping: 30 }}
            />
          )}
          <Headphones
            size={20}
            strokeWidth={supportActive ? 2.4 : 1.8}
            className={`relative z-10 ${
              supportActive
                ? "text-ink dark:text-ink-dark"
                : "text-ink-faint dark:text-ink-faint-dark"
            }`}
          />
          <span
            className={`relative z-10 text-[10px] font-medium ${
              supportActive
                ? "text-ink dark:text-ink-dark"
                : "text-ink-faint dark:text-ink-faint-dark"
            }`}
          >
            Destek
          </span>
        </button>

        <button
          onClick={handleLogout}
          className="flex flex-col items-center gap-1 px-3 py-1.5 flex-1"
        >
          <LogOut size={20} strokeWidth={1.8} className="text-ink-faint dark:text-ink-faint-dark" />
          <span className="text-[10px] font-medium text-ink-faint dark:text-ink-faint-dark">
            Çıkış
          </span>
        </button>
      </div>
    </nav>
  );
}
