/**
 * ParticlesBackground — Drop-in tsParticles component
 * Theme: Technology Network (dark + electric cyan/blue)
 * Mobile: Particles disabled on mobile devices for performance
 * Uses MUI useMediaQuery for mobile detection
 */

import { useEffect, useMemo, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import { useMediaQuery, useTheme } from "@mui/material";

const ParticlesBackground = ({
                                 backgroundColor = "#020817",
                                 dotColor        = "#00f5ff",
                                 lineColor       = "#0ea5e9",
                                 dotCount = 90,
                                 speed    = 1.5,
                                 interactOnHover = true,
                                 interactOnClick = false,
                                 style     = {},
                                 className = "",
                             }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md")); // 👈 MUI mobile check

    const [engineReady, setEngineReady] = useState(false);

    useEffect(() => {
        if (isMobile) return; // 👈 Skip on mobile
        initParticlesEngine(async (engine) => {
            await loadSlim(engine);
        }).then(() => setEngineReady(true));
    }, [isMobile]);

    const options = useMemo(
        () => ({
            background: {
                color: { value: backgroundColor },
            },
            fpsLimit: 120,
            detectRetina: true,

            interactivity: {
                events: {
                    onHover: {
                        enable: interactOnHover,
                        mode: "grab",
                    },
                    onClick: {
                        enable: interactOnClick,
                        mode: "push",
                    },
                },
                modes: {
                    grab: {
                        distance: 200,
                        links: { opacity: 0.9 },
                    },
                    push: {
                        quantity: 4,
                    },
                },
            },

            particles: {
                number: {
                    value: dotCount,
                    density: { enable: true, area: 900 },
                },

                color: {
                    value: ["#00f5ff", "#38bdf8", "#7dd3fc", "#e0f2fe"],
                },

                opacity: {
                    value: { min: 0.2, max: 0.9 },
                    animation: {
                        enable: true,
                        speed: 1,
                        minimumValue: 0.1,
                        sync: false,
                    },
                },

                size: {
                    value: { min: 1, max: 3.5 },
                    animation: {
                        enable: true,
                        speed: 2,
                        minimumValue: 0.5,
                        sync: false,
                    },
                },

                links: {
                    enable: true,
                    color: lineColor,
                    distance: 150,
                    opacity: 0.2,
                    width: 1,
                    triangles: {
                        enable: true,
                        color: lineColor,
                        opacity: 0.03,
                    },
                },

                move: {
                    enable: true,
                    speed,
                    direction: "none",
                    random: true,
                    straight: false,
                    outModes: { default: "bounce" },
                },

                shape: { type: "circle" },

                shadow: {
                    enable: true,
                    color: "#00f5ff",
                    blur: 8,
                },
            },
        }),
        [
            backgroundColor,
            dotColor,
            lineColor,
            dotCount,
            speed,
            interactOnHover,
            interactOnClick,
        ]
    );

    // 👇 Return null on mobile — no particles, no lag!
    if (isMobile) return null;
    if (!engineReady) return null;

    return (
        <Particles
            id="tsparticles"
            options={options}
            className={className}
            style={{
                position: "absolute",
                inset: 0,
                zIndex: 0,
                ...style,
            }}
        />
    );
};

export default ParticlesBackground;