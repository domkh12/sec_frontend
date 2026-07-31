import { useMemo } from "react";
import { Dialog, IconButton, Chip, Divider } from "@mui/material";
import { Gauge, gaugeClasses } from '@mui/x-charts/Gauge';
import CloseIcon from '@mui/icons-material/Close';
import { useSelector } from "react-redux";

const STATUS_STYLE = {
  COMPLETED: { bg: "#e6f4ea", color: "#1e7e34" },
  IN_PROGRESS: { bg: "#fff4e5", color: "#b26a00" },
  PENDING: { bg: "#eceff1", color: "#546e7a" },
};

// TODO: remove once backend returns real per-stage progress
const STATIC_STAGE_PROGRESS = {
  Cutting: 100,
  Sewing: 80,
  Ironing: 60,
  QC: 40,
  Packing: 10,
};

function stageKey(lineName = "") {
  // "Cutting-L" / "Sewing-L1" -> "Cutting" / "Sewing"
  return lineName.split("-")[0];
}

function Detail({ label, value }) {
  return (
    <div>
      <p className="text-gray-400 text-xs">{label}</p>
      <p className="font-medium">{value ?? "-"}</p>
    </div>
  );
}

function StageGauge({ label, value }) {
  return (
    <div className="relative z-10 flex flex-col items-center min-w-0 bg-white px-1">
      <Gauge
        value={value}
        startAngle={0}
        endAngle={360}
        innerRadius="75%"
        outerRadius="100%"
        width={56}
        height={56}
        text={`${value}%`}
        sx={{
          [`& .${gaugeClasses.valueText}`]: { fontSize: 11, fontWeight: 700 },
          [`& .${gaugeClasses.valueArc}`]: { fill: '#52b202' },
          [`& .${gaugeClasses.referenceArc}`]: { fill: "#eceff1" },
        }}
      />
      <p className="text-[10px] text-gray-500 mt-1 text-center leading-tight truncate max-w-[56px]">
        {label}
      </p>
    </div>
  );
}

function DialogViewAnalyticWO({ isOpen, handleClose }) {
  const workOrderDataForView = useSelector((state) => state.workOrder.workOrderDataForView);

  // dedupe stages by name — payload currently sends each line twice,
  // and collapses "Cutting-L" / "Sewing-L1" down to their stage name
  const stages = useMemo(() => {
    const seen = new Map();
    (workOrderDataForView?.lines ?? []).forEach((l) => {
      const key = stageKey(l.line);
      if (!seen.has(key)) seen.set(key, key);
    });
    return [...seen.values()];
  }, [workOrderDataForView]);

  const statusStyle = STATUS_STYLE[workOrderDataForView?.status] ?? STATUS_STYLE.PENDING;

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      maxWidth="xs"
      fullWidth
      sx={{ "& .MuiDialog-paper": { borderRadius: 4 } }}
    >
      <div className="p-5">

        {/* Header */}
        <div className="flex justify-between items-start mb-4 pr-6">
          <div>
            <p className="text-xl font-bold leading-tight">{workOrderDataForView?.mo}</p>
            <p className="text-sm text-gray-500">{workOrderDataForView?.style}</p>
          </div>
          <Chip
            label={workOrderDataForView?.status}
            size="small"
            sx={{ bgcolor: statusStyle.bg, color: statusStyle.color, fontWeight: 600 }}
          />
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={(theme) => ({
              position: "absolute",
              right: 8,
              top: 8,
              color: theme.palette.grey[500],
            })}
          >
            <CloseIcon />
          </IconButton>
        </div>

        {/* Image */}
        <div className="rounded-xl overflow-hidden bg-gray-50 mb-4 flex items-center justify-center h-40">
          <img
            src={workOrderDataForView?.image ?? "/images/placeholder.png"}
            className="max-h-40 object-contain"
            alt={workOrderDataForView?.mo}
          />
        </div>

        {/* Details grid */}
        <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-sm mb-4">
          <Detail label="PO" value={workOrderDataForView?.po?.po} />
          <Detail label="Color" value={workOrderDataForView?.color?.color} />
          <Detail
            label="Size"
            value={[...new Set(workOrderDataForView?.sizes?.map((s) => s.size))].join(", ")}
          />
          <Detail label="Qty" value={workOrderDataForView?.qty} />
          <Detail label="Start" value={workOrderDataForView?.startDate} />
          <Detail label="End" value={workOrderDataForView?.endDate} />
        </div>

        <Divider className="mb-4" />

        {/* One gauge per production stage — single row, connected by a pipeline */}
        {stages.length > 0 && (
          <div>
            <p className="text-sm font-semibold text-gray-600 mb-3">Production progress</p>
            <div className="relative flex flex-nowrap justify-between items-start gap-1">
              {/* connector line, sits behind the gauges at their vertical center */}
              <div
                className="absolute left-0 right-0 h-[2px] bg-gray-200 z-0"
                style={{ top: 28 }}
              />
              {stages.map((stage) => (
                <StageGauge
                  key={stage}
                  label={stage}
                  value={STATIC_STAGE_PROGRESS[stage] ?? 0}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </Dialog>
  );
}

export default DialogViewAnalyticWO;