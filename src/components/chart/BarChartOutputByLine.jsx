import {BarChart} from "@mui/x-charts";

function TopLeftRightBar(props) {
    const { x, y, width, height, fill, style, className } = props;
    if (!height || height <= 0) return null;
    const r = 16;
    return (
        <path
            className={className}
            style={style}
            fill={fill}
            d={`M${x + r},${y} L${x + width - r},${y} Q${x + width},${y} ${x + width},${y + r} L${x + width},${y + height} L${x},${y + height} L${x},${y + r} Q${x},${y} ${x + r},${y} Z`}
        />
    );
}

function BarChartOutputByLine() {

    return(
        <div className="sub-card-glass">
            <BarChart

                xAxis={[{ data: ['1', '2', '3', '4', '5', '6', '7', '8'] }]}
                series={[{ data: [4, 3, 5, 10, 4, 3, 5, 10] }]}
                height={300}
                slots={{
                    bar: TopLeftRightBar,
                }}
                grid={{ horizontal: true }}
                sx={{
                    width: "100%",
                    "& .MuiChartsGrid-horizontalLine": {
                        stroke: "rgba(255,255,255,0.15)",
                        strokeDasharray: "3 3",
                        strokeWidth: 1,
                    },
                    "& .MuiChartsAxis-tickLabel": {
                        fill: "#FFFFFF",
                        fontSize: "12px",
                    },
                    "& .MuiChartsAxis-line": {
                        stroke: "rgba(255,255,255,0.15)",
                        strokeWidth: 1,
                    },
                    "& .MuiChartsAxis-tick": { display: "none" },
                }}
            />
        </div>
    )
}

export default BarChartOutputByLine;