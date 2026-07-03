import { Box, Tooltip } from "@mui/material";

const formatHour = (date) => {
    const hour = date.getHours();
    const displayHour = hour % 12 || 12;
    const period = hour >= 12 ? "PM" : "AM";

    return `${displayHour}:00 ${period}`;
};

const formatDay = (date) => {
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return "Today";
    if (date.toDateString() === yesterday.toDateString()) return "Yesterday";

    return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
    });
};

const formatTooltipTimeRange = (hourAgo) => {
    const end = new Date();
    end.setMinutes(0, 0, 0);
    end.setHours(end.getHours() - hourAgo + 1);

    const start = new Date(end);
    start.setHours(end.getHours() - 1);

    return `${formatDay(start)}, ${formatHour(start)} - ${formatHour(end)}`;
};

const getBarHeight = (output, maxOutput) => {
    if (output === 0 || maxOutput === 0) return 0;

    return Math.max((output / maxOutput) * 72, 3);
};

function BarChartOutput48h({data = []}) {
    const outputData = Array.isArray(data) ? data : [];
    const outputValues = outputData.map((item) => item.output);
    const maxOutput = outputValues.length > 0 ? Math.max(...outputValues) : 0;

    return (
        <Box
            sx={{
                width: "100%",
                height: "100%",
                
            }}
        >
            <Box
                sx={{
                    height: 72,
                    borderBottom: "1px solid #3a3a3a",
                    display: "flex",
                    alignItems: "flex-end",
                    gap: "2px",
                }}
            >
                {outputData.map((item, index) => (
                    <Tooltip
                        key={`${index}`}
                        placement="top"
                        title={
                            <Box>
                                <Box
                                    sx={{
                                        color: "#e8e8e8",
                                        fontSize: 12,
                                        fontWeight: 700,
                                        lineHeight: 1.2,
                                        mb: 0.75,
                                        whiteSpace: "nowrap",
                                    }}
                                >
                                    {formatTooltipTimeRange(item.hourAgo)}
                                </Box>
                                <Box
                                    sx={{
                                        color: "#39c8f2",
                                        fontSize: 24,
                                        fontWeight: 500,
                                        lineHeight: 1,
                                    }}
                                >
                                    {item.output}
                                </Box>
                            </Box>
                        }
                        slotProps={{
                            tooltip: {
                                sx: {
                                    bgcolor: "#101010",
                                    borderRadius: 0,
                                    boxShadow: "none",
                                    px: 0.75,
                                    py: 0.75,
                                },
                            },
                        }}
                    >
                        <Box
                            component="span"
                            sx={{
                                flex: "1 1 0",
                                minWidth: 0,
                                height: 72,
                                display: "flex",
                                alignItems: "flex-end",
                                justifyContent: "center",
                                cursor: "default",
                                background: "transparent",
                                boxShadow: "none",
                                "&:hover": {
                                    background: "linear-gradient(to top, rgba(0, 0, 0, 0.55), rgba(0, 0, 0, 0.08))",
                                    boxShadow: "inset 0 -8px 10px rgba(0, 0, 0, 0.65)",
                                },
                            }}
                        >
                            <Box
                                component="span"
                                sx={{
                                    width: 3,
                                    height: `${getBarHeight(item.output, maxOutput)}px`,
                                    bgcolor: item.output === 0 ? "transparent" : "#39c8f2",
                                    borderRadius: "2px 2px 0 0",
                                    boxShadow: item.output === 0 ? "none" : "0 0 3px rgba(57, 200, 242, 0.55)",
                                }}
                            />
                        </Box>
                    </Tooltip>
                ))}
            </Box>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    pt: 0.75,
                    color: "#d8ecf4",
                    fontSize: 12,
                    lineHeight: 1,
                }}
            >
                <span>-48h</span>
                <span>Now</span>
            </Box>
        </Box>
    )
}

export default BarChartOutput48h;
