import * as React from 'react';
import { useTheme, styled } from '@mui/material/styles';
import Popper from '@mui/material/Popper';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import {useGetDefectTypeLookupQuery} from "../../redux/feature/defect-type/defectTypeApiSlice.js";

/* ─── Generate a stable color from a string ─── */
function colorFromName(name) {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
        hash |= 0;
    }
    // Use HSL: fix saturation/lightness for pleasant, readable colors
    const hue = Math.abs(hash) % 360;
    return `hsl(${hue}, 65%, 48%)`;
}

/* ─── Contrast text (white or black) ─── */
function contrastColor(hslColor) {
    // Extract lightness from hsl string
    const match = hslColor.match(/hsl\(\d+,\s*\d+%,\s*(\d+)%\)/);
    const l = match ? parseInt(match[1]) : 50;
    return l < 55 ? '#fff' : '#24292e';
}

const StyledPopper = styled(Popper)(() => ({
    border: '1px solid #e1e4e8',
    boxShadow: '0 8px 24px rgba(149,157,165,0.25)',
    backgroundColor: '#fff',
    borderRadius: 10,
    width: 450,
    zIndex: 1300,
    fontSize: 13,
    overflow: 'hidden',
}));

/* ─── Stepper row ─── */
function StepperRow({ label, value, onIncrease, onDecrease }) {
    const color = colorFromName(label.name);
    return (
        <Box sx={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            px: 1.5, py: 0.75,
            '&:hover': { backgroundColor: '#f6f8fa' },
            transition: 'background 0.15s',
            borderBottom: '1px solid #f0f0f0',
        }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1, minWidth: 0 }}>
                <Box sx={{ width: 10, height: 10, borderRadius: '50%', flexShrink: 0, backgroundColor: color }} />
                <Box sx={{ fontSize: 12, fontWeight: 500, color: '#24292e', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {label.name}
                </Box>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flexShrink: 0, ml: 1 }}>
                <IconButton size="small" onClick={onDecrease} disabled={value <= 0} sx={{
                    width: 22, height: 22, border: '1px solid #d0d7de', borderRadius: 1, padding: 0,
                    color: value <= 0 ? '#ccc' : '#57606a', backgroundColor: '#fff',
                    '&:hover:not(:disabled)': { backgroundColor: '#f3f4f6', borderColor: '#0366d6', color: '#0366d6' },
                }}>
                    <RemoveIcon sx={{ fontSize: 13 }} />
                </IconButton>
                <Box sx={{
                    minWidth: 28, textAlign: 'center', fontSize: 13, fontWeight: 700,
                    color: value > 0 ? '#0366d6' : '#8c959f',
                    fontVariantNumeric: 'tabular-nums',
                }}>
                    {value}
                </Box>
                <IconButton size="small" onClick={onIncrease} sx={{
                    width: 22, height: 22, border: '1px solid #d0d7de', borderRadius: 1, padding: 0,
                    color: '#57606a', backgroundColor: '#fff',
                    '&:hover': { backgroundColor: '#f3f4f6', borderColor: '#0366d6', color: '#0366d6' },
                }}>
                    <AddIcon sx={{ fontSize: 13 }} />
                </IconButton>
            </Box>
        </Box>
    );
}

/* ─── Main component ─── */
export default function DefectTypeSelect() {
    // -- Query --------------------------------------------------------------------------------------------------
    const {data: labels} = useGetDefectTypeLookupQuery();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [counts, setCounts] = React.useState({});

    const open = Boolean(anchorEl);
    const id = open ? 'defect-type-popper' : undefined;

    const handleOpen = (e) => setAnchorEl(e.currentTarget);
    const handleClose = () => setAnchorEl(null);

    const changeCount = (name, delta) =>
        setCounts((prev) => ({ ...prev, [name]: Math.max(0, (prev[name] ?? 0) + delta) }));

    const totalDefects = labels?.reduce((sum, l) => sum + (counts[l.name] ?? 0), 0);
    const activeLabels = labels?.filter((l) => (counts[l.name] ?? 0) > 0);

    return (
        <Box sx={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>

            {/* ── Trigger button ── */}
            <Box
                aria-describedby={id}
                onClick={handleOpen}
                className="flex justify-between"
                sx={{
                    display: 'inline-flex', alignItems: 'center', gap: 1,
                    px: 2, py: 1, width: "100%",
                    border: '1px solid #d0d7de', borderRadius: 2,
                    cursor: 'pointer', backgroundColor: '#f6f8fa',
                    fontSize: 13, fontWeight: 600, color: '#24292e', userSelect: 'none',
                    transition: 'border-color 0.15s, box-shadow 0.15s, background 0.15s',
                    '&:hover': { backgroundColor: '#f0f3f6', borderColor: '#0366d6' },
                    ...(open && { backgroundColor: '#fff', borderColor: '#0366d6', boxShadow: '0 0 0 3px rgba(3,102,214,0.15)' }),
                }}
            >
                Defect Type
                <KeyboardArrowDownIcon sx={{
                    fontSize: 16, color: '#57606a',
                    transform: open ? 'rotate(180deg)' : 'rotate(0)',
                    transition: 'transform 0.2s',
                }} />
            </Box>

            {/* ── Summary chips (only labels with count > 0) ── */}
            {activeLabels?.length > 0 && (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1, maxWidth: 420, alignItems: 'center' }}>
                    {activeLabels?.map((label) => {
                        const bg = colorFromName(label.name);
                        const fg = contrastColor(bg);
                        return (
                            <Box key={label.id} sx={{
                                display: 'inline-flex', alignItems: 'center', gap: 0.5,
                                px: 1, py: 0.25, borderRadius: 1,
                                fontSize: 11, fontWeight: 600, lineHeight: 1.5,
                                backgroundColor: bg, color: fg,
                            }}>
                                {label.name}
                                <Box component="span" sx={{
                                    ml: 0.25, px: 0.5, borderRadius: 0.5,
                                    backgroundColor: 'rgba(0,0,0,0.18)', fontSize: 10, fontWeight: 700,
                                }}>
                                    {counts[label.name]}
                                </Box>
                            </Box>
                        );
                    })}
                </Box>
            )}

            {/* ── Dropdown ── */}
            <StyledPopper id={id} open={open} anchorEl={anchorEl} placement="bottom-start">
                <ClickAwayListener onClickAway={handleClose}>
                    <div>
                        <Box sx={{
                            px: 1.5, py: 1, fontWeight: 600, fontSize: 12, color: '#57606a',
                            borderBottom: '1px solid #eaecef', letterSpacing: 0.5, textTransform: 'uppercase',
                        }}>
                            Defect Type
                        </Box>

                        <Box sx={{ maxHeight: 320, overflowY: 'auto' }}>
                            {labels?.map((label) => (
                                <StepperRow
                                    key={label.id}
                                    label={label}
                                    value={counts[label.name] ?? 0}
                                    onIncrease={() => changeCount(label.name, 1)}
                                    onDecrease={() => changeCount(label.name, -1)}
                                />
                            ))}
                        </Box>

                        <Box sx={{ px: 1.5, py: 1, display: 'flex', justifyContent: 'flex-end' }}>
                            <Box onClick={handleClose} sx={{
                                px: 2, py: 0.6, borderRadius: 1.5, fontSize: 12, fontWeight: 600,
                                color: '#fff', backgroundColor: '#0366d6', cursor: 'pointer', userSelect: 'none',
                                '&:hover': { backgroundColor: '#0256b5' }, transition: 'background 0.15s',
                            }}>
                                Done
                            </Box>
                        </Box>
                    </div>
                </ClickAwayListener>
            </StyledPopper>
        </Box>
    );
}