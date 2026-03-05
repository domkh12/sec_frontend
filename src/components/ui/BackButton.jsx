import {Button} from "@mui/material";
import { useState } from "react";

function BackButton({onClick}){
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
        relative z-10 flex items-center justify-center gap-2
        px-5 py-2.5 m-2
        rounded-xl cursor-pointer select-none overflow-hidden
        border border-white/25
        bg-white/10
        shadow-[inset_0_1px_0_rgba(255,255,255,0.35),inset_0_-1px_0_rgba(255,255,255,0.08),0_8px_32px_rgba(0,0,0,0.25)]
        backdrop-blur-md
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
      <span className="pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-b from-white/15 via-transparent to-white/5" />

      {/* Arrow icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="relative w-4 h-4 text-white/90 drop-shadow"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2.2}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="15 18 9 12 15 6" />
      </svg>

      {/* Label */}
      <span className="relative text-sm font-light tracking-wide text-white/90 drop-shadow">
        Back
      </span>
    </button>
  );
}

export default BackButton;