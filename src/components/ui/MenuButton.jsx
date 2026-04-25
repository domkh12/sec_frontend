import "./ui.css"
import HistoryToggleOffIcon from '@mui/icons-material/HistoryToggleOff';
import { useState } from "react";
import {useTranslation} from "react-i18next";
function MenuButton({title, onClick, iconPath}) {
   const [pressed, setPressed] = useState(false);

  const handleClick = () => {
    setPressed(true);
    setTimeout(() => setPressed(false), 150);
    onClick?.();
  };

  return (
    <button
      onClick={handleClick}
      role="button"
      className={`
        relative z-10 flex flex-col items-center justify-center gap-2
        w-24 h-24
        rounded-2xl cursor-pointer select-none overflow-hidden
        border border-white/25
        bg-white/10
        shadow-[inset_0_1px_0_rgba(255,255,255,0.35),inset_0_-1px_0_rgba(255,255,255,0.08),0_8px_32px_rgba(0,0,0,0.25)]
        transition-all duration-200 ease-out
        hover:bg-white/20 hover:border-white/40 hover:-translate-y-0.5
        hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_12px_40px_rgba(0,0,0,0.3)]
        active:translate-y-0 active:scale-95 active:bg-white/15
        ${pressed ? "scale-95" : "scale-100"}
      `}
    >
      {/* Top glare streak */}
      <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/60 to-transparent" />
      {/* Inner light sheen */}
      <span className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-b from-white/15 via-transparent to-white/5" />

      {/* Icon */}
      <img
        src={iconPath || "/images/coming-soon.png"}
        alt={title}
        loading={"lazy"}
        decoding={"async"}
        className="relative w-8 h-8 object-contain drop-shadow-md flex-shrink-0"
      />

      {/* Label */}
      <span className="relative text-[11px] font-light tracking-wide text-white/90 drop-shadow text-center leading-tight px-1">
        {title || "Coming Soon"}
      </span>
    </button>
  );
}

export default MenuButton;