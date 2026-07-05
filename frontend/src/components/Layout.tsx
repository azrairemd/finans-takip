import { useState } from "react";
import { Outlet } from "react-router-dom";
import { BottomNav } from "./BottomNav";
import { ContactBubbles } from "./ContactBubbles";

export function Layout() {
  const [supportOpen, setSupportOpen] = useState(false);

  return (
    <div className="min-h-screen bg-canvas dark:bg-canvas-dark pb-24">
      <Outlet />
      <ContactBubbles open={supportOpen} />
      <BottomNav
        supportActive={supportOpen}
        onSupportClick={() => setSupportOpen((v) => !v)}
      />
    </div>
  );
}
