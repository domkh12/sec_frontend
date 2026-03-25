/**
 * StatCards — reusable stat card grid
 *
 * Props:
 *   cards: Array<{
 *     label: string,
 *     value: number | string,
 *     color: 'sky' | 'emerald' | 'slate' | 'red' | 'amber' | 'violet' | 'pink' | 'orange',
 *     icon: ReactNode   (optional — falls back to a default dot)
 *   }>
 *
 * Example:
 *   <StatCards cards={[
 *     { label: "Total Users", value: 120, color: "sky", icon: <UsersIcon /> },
 *     { label: "Active",      value: 80,  color: "emerald" },
 *   ]} />
 */

const COLOR_MAP = {
    sky:     { grad: "from-sky-400/10",     num: "text-white",      badge: "bg-sky-500/15 border-sky-400/20",     line: "via-sky-400/50",     icon: "text-sky-300"     },
    emerald: { grad: "from-emerald-400/10", num: "text-emerald-300",badge: "bg-emerald-500/15 border-emerald-400/20", line: "via-emerald-400/50", icon: "text-emerald-300" },
    slate:   { grad: "from-slate-400/10",   num: "text-slate-300",  badge: "bg-slate-400/15 border-slate-300/20", line: "via-slate-300/50",   icon: "text-slate-300"   },
    red:     { grad: "from-red-400/10",     num: "text-red-300",    badge: "bg-red-500/15 border-red-400/20",     line: "via-red-400/50",     icon: "text-red-300"     },
    amber:   { grad: "from-amber-400/10",   num: "text-amber-300",  badge: "bg-amber-500/15 border-amber-400/20", line: "via-amber-400/50",   icon: "text-amber-300"   },
    violet:  { grad: "from-violet-400/10",  num: "text-violet-300", badge: "bg-violet-500/15 border-violet-400/20",line: "via-violet-400/50",  icon: "text-violet-300"  },
    pink:    { grad: "from-pink-400/10",    num: "text-pink-300",   badge: "bg-pink-500/15 border-pink-400/20",   line: "via-pink-400/50",    icon: "text-pink-300"    },
    orange:  { grad: "from-orange-400/10",  num: "text-orange-300", badge: "bg-orange-500/15 border-orange-400/20",line: "via-orange-400/50",  icon: "text-orange-300"  },
};

// Default fallback icon
const DefaultIcon = ({ className }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="6" />
    </svg>
);

function StatCard({ label, value, color = "sky", icon }) {
    const c = COLOR_MAP[color] ?? COLOR_MAP.sky;

    return (
        <div className="relative overflow-hidden rounded-xl border border-white/15 bg-white/[0.07] backdrop-blur-md px-4 py-3.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.15),0_4px_20px_rgba(0,0,0,0.25)] hover:bg-white/[0.11] transition-all duration-200">
            {/* Tinted gradient overlay */}
            <div className={`absolute inset-0 bg-gradient-to-br ${c.grad} via-transparent to-transparent pointer-events-none`} />

            {/* Label */}
            <p className="text-[0.7rem] uppercase tracking-[0.1em] text-white/90 mb-1.5">
                {label}
            </p>

            {/* Value */}
            <p className={`text-[1.75rem] font-bold leading-none tracking-tight ${c.num}`}>
                {value ?? 0}
            </p>

            {/* Icon badge */}
            <div className={`absolute right-3 top-3 w-7 h-7 rounded-lg border flex items-center justify-center ${c.badge}`}>
                {icon
                    ? <span className={`w-3.5 h-3.5 flex items-center justify-center ${c.icon}`}>{icon}</span>
                    : <DefaultIcon className={`w-3.5 h-3.5 ${c.icon}`} />
                }
            </div>

            {/* Bottom accent line */}
            <div className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent ${c.line} to-transparent`} />
        </div>
    );
}

function StatCards({ cards = [] }) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 my-3">
            {cards.map((card, i) => (
                <StatCard key={card.label ?? i} {...card} />
            ))}
        </div>
    );
}

export default StatCards;