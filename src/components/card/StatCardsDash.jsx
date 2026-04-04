import { Paper } from "@mui/material";
import NumberFlow from '@number-flow/react';
import { FaShirt } from "react-icons/fa6";
import {CARD_THEMES} from "../../config/theme.js";

function StatCardsDash({
                           icon = <FaShirt />,
                           title = "--",
                           percentage = "--",
                           theme = "emerald",
                           value = 0,
                           unit = "",
                       }) {
    const t = CARD_THEMES[theme] ?? CARD_THEMES.emerald;

    // Radial dot pattern using CSS — mimics the scattered dot grid in the reference
    const dotPattern = `radial-gradient(circle, ${t.dot} 0.8px, transparent 2px)`;

    return (
        <Paper
            sx={{
                width: "100%",
                padding: "10px",
                borderRadius: "16px",
                background: t.gradient,
                position: "relative",
                overflow: "hidden",
                boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
                transition: "transform 0.2s, box-shadow 0.2s",
                "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0 16px 36px rgba(0,0,0,0.28)",
                },
                // Dot grid overlay
                "&::before": {
                    content: '""',
                    position: "absolute",
                    inset: 0,
                    backgroundImage: dotPattern,
                    backgroundSize: "14px 14px",
                    backgroundPosition: "0 0",
                    // Fade dots: strong on left, transparent on right (matches reference image)
                    WebkitMaskImage: "radial-gradient(ellipse 70% 90% at 20% 50%, black 30%, transparent 80%)",
                    maskImage: "radial-gradient(ellipse 70% 90% at 20% 50%, black 30%, transparent 80%)",
                    pointerEvents: "none",
                    zIndex: 0,
                },
            }}
        >
            {/* All content sits above the dot layer */}
            <div style={{ position: "relative", zIndex: 1 }}>
                <div className="flex justify-between items-start gap-3">
                    <div
                        className="text-4xl px-3 py-3"
                        style={{ filter: "brightness(0) invert(1)" }}
                    >
                        {icon}
                    </div>
                    <p className="px-3 py-3 text-lg" style={{ color: t.text }}>
                        {percentage}
                    </p>
                </div>

                <div
                    style={{ color: t.text }}
                    className="flex flex-col justify-start items-start pt-5 px-3"
                >
                    <p className="text-nowrap tracking-wide">{title}</p>
                    <div >
                        <NumberFlow value={value} className="text-4xl font-bold" />
                        <span className="ml-2">{unit}</span>
                    </div>
                </div>
            </div>
        </Paper>
    );
}

export default StatCardsDash;