import { useState } from "react";
import {useTranslation} from "react-i18next";

function BackButton({onClick}){
  const [pressed, setPressed] = useState(false);
  const {t} = useTranslation();
  const handleClick = () => {
    setPressed(true);
    setTimeout(() => setPressed(false), 150);
    onClick?.();
  };

  return (
    <button
      onClick={handleClick}
      role="button"
      className={`button-glass ${pressed ? "scale-95" : "scale-100"}`}
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
        {t('buttons.back')}
      </span>
    </button>
  );
}

export default BackButton;