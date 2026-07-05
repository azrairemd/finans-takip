import { AnimatePresence, motion } from "framer-motion";
import { Phone, MapPin } from "lucide-react";

const PHONE_DISPLAY = "+90 216 988 16 35";
const PHONE_TEL = "+902169881635";
const ADDRESS =
  "Fetih Mah. Tahralı Sk. Kavakyeli Sitesi E Blok Kat: 3, Daire: 10, 34704 Ataşehir/İstanbul";
const MAPS_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  ADDRESS
)}`;

interface ContactBubblesProps {
  open: boolean;
}

export function ContactBubbles({ open }: ContactBubblesProps) {
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed bottom-24 right-5 z-50 flex flex-col items-end gap-3">
          <motion.a
            href={MAPS_URL}
            target="_blank"
            rel="noreferrer"
            initial={{ opacity: 0, y: 12, scale: 0.85 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.85 }}
            transition={{ duration: 0.2, delay: 0.05 }}
            className="group flex items-center gap-3"
          >
            <span className="hidden group-hover:block bg-ink dark:bg-ink-dark text-canvas dark:text-canvas-dark text-xs font-medium px-3 py-1.5 rounded-full max-w-[220px] text-right">
              {ADDRESS}
            </span>
            <span className="flex items-center justify-center h-12 w-12 rounded-full bg-ink dark:bg-ink-dark text-canvas dark:text-canvas-dark shadow-lg shrink-0">
              <MapPin size={20} />
            </span>
          </motion.a>

          <motion.a
            href={`tel:${PHONE_TEL}`}
            initial={{ opacity: 0, y: 12, scale: 0.85 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.85 }}
            transition={{ duration: 0.2 }}
            className="group flex items-center gap-3"
          >
            <span className="hidden group-hover:block bg-ink dark:bg-ink-dark text-canvas dark:text-canvas-dark text-xs font-medium px-3 py-1.5 rounded-full whitespace-nowrap">
              {PHONE_DISPLAY}
            </span>
            <span className="flex items-center justify-center h-12 w-12 rounded-full bg-rise text-white shadow-lg shrink-0">
              <Phone size={20} />
            </span>
          </motion.a>
        </div>
      )}
    </AnimatePresence>
  );
}
