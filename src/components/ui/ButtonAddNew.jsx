import { useState } from "react";
import {useTranslation} from "react-i18next";

function ButtonAddNew({onClick, title= "buttons.addNew"}) {
    const [pressed, setPressed] = useState(false);
    const {t} = useTranslation();
    const handleClick = () => {
        setPressed(true);
        setTimeout(() => setPressed(false), 150);
        onClick?.();
    };

    return(
        <button
        role="button"
        className={`
        relative z-10 flex items-center justify-center gap-2
        px-5 py-2.5 m-2
        rounded-xl cursor-pointer select-none overflow-hidden
        border border-white/25
        bg-white/10
        shadow-[inset_0_1px_0_rgba(255,255,255,0.35),inset_0_-1px_0_rgba(255,255,255,0.08),0_8px_32px_rgba(0,0,0,0.25)]
        transition-all duration-200 ease-out
        hover:bg-white/20 hover:border-white/40 hover:-translate-y-0.5
        hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_12px_40px_rgba(0,0,0,0.3)]
        active:translate-y-0 active:scale-95 active:bg-white/15
        ${pressed ? "scale-95" : "scale-100"}
      `} onClick={handleClick}>
        {/* Top glare streak */}
        <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/60 to-transparent" />
        {/* Inner light sheen */}
        <span className="pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-b from-white/15 via-transparent to-white/5" />

        {/* Plus icon */}
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
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
        </svg>

        {/* Label */}
        <span className="relative text-sm font-light tracking-wide text-white/90 drop-shadow">
            {t(`${title}`)}
        </span>
        </button>
    )
}

export default ButtonAddNew;