import React, { useEffect, useState, useRef } from 'react';
import {
    Menu,
    MenuItem,
    Box,
    Typography,
    Button,
} from '@mui/material';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { useTranslation } from 'react-i18next';

/**
 * Recursively builds a display label from the selected path.
 *
 * @param {Array}  options  - The full options tree at the current level
 * @param {Array}  path     - Array of selected IDs, e.g. [deptId, lineId, subLineId]
 * @returns {string}
 */
const buildLabel = (options, path) => {
    if (!path?.length || !options?.length) return '';

    const [currentId, ...rest] = path;
    const match = options.find((o) => o.id === currentId);
    if (!match) return '';

    const childLabel = rest.length ? buildLabel(match.children ?? [], rest) : '';
    return childLabel ? `${match.name} > ${childLabel}` : match.name;
};

const scopedKey = (depth, id) => `${depth}-${id}`;

/**
 * A single level of the cascading sub-menu.
 */
const SubMenu = ({ options, anchorEl, onHover, onSelect, depth, childId }) => {
    if (!anchorEl) return null;

    const glassMenuSx = {
        background: 'rgba(15,23,42,0.95)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '12px',
        '& .MuiMenuItem-root': {
            m: 0.5,
            borderRadius: '8px',
            color: '#eee',
            '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' },

        },
        "& .Mui-selected": {
            backgroundColor: 'rgba(255,255,255,0.1)',
        }
    };

    return (
        <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={() => onHover(depth, null, null)}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'left' }}
            PaperProps={{
                sx: { ...glassMenuSx, minWidth: 200, ml: 0.5 },
                onMouseLeave: () => onHover(depth, null, null),
            }}
            sx={{ pointerEvents: 'none' }}
        >
            <Box sx={{ pointerEvents: 'auto' }}>
                {options.map((option) => (
                    <MenuItem
                        selected={childId === option?.id}
                        key={scopedKey(depth, option.id)}
                        onMouseEnter={(e) => onHover(depth, e.currentTarget, option)}
                        onClick={() => onSelect(depth, option.id)}
                        sx={{ justifyContent: 'space-between' }}
                    >
                        {option.name}
                        {option.children?.length > 0 && (
                            <ChevronRightIcon fontSize="small" />
                        )}
                    </MenuItem>
                ))}
            </Box>
        </Menu>
    );
};

/**
 * NestedSelect
 *
 * Props:
 *  - options:     Array of tree nodes  { id, name, children?: [...] }
 *  - value:       Array of selected IDs from root → leaf, e.g. [deptId, lineId]
 *  - onSelect:    (idPath: string[]) => void
 *  - label:       i18n key shown when nothing is selected
 *  - placeholder: fallback string
 */
const NestedSelect = ({
                          options = [],
                          value,
                          onSelect,
                          label = 'table.deptAndLine',
                          placeholder = 'Select...',
                      }) => {
    const { t } = useTranslation();
    const [rootAnchor, setRootAnchor] = useState(null);
    const [selectedText, setSelectedText] = useState('');

    // subMenus[depth] = { anchorEl, options, activeOption }
    const [subMenus, setSubMenus] = useState([]);

    // Close everything
    const closeAll = () => {
        setRootAnchor(null);
        setSubMenus([]);
    };

    // Update display text whenever value/options change
    useEffect(() => {
        if (!value) return setSelectedText('');
        const path = [value.parentId, value.childId].filter(Boolean);
        setSelectedText(buildLabel(options, path));
    }, [value, options]);

    /**
     * Called when the user hovers a menu item at a given depth.
     * Clears all sub-menus deeper than `depth`, then opens a new one if the
     * hovered option has children.
     */
    const handleHover = (depth, anchorEl, option) => {
        setSubMenus((prev) => {
            // Trim everything deeper than the current depth
            const next = prev.slice(0, depth);
            if (anchorEl && option?.children?.length) {
                next[depth] = { anchorEl, options: option.children, activeOption: option };
            }
            return next;
        });
    };

    /**
     * Called when the user clicks an item at `depth`.
     * Builds the full id-path from root → clicked item, then calls onSelect.
     */
    const handleSelect = (depth, id) => {
        const pathFromSubMenus = subMenus
            .slice(0, depth)
            .map((sm) => sm.activeOption?.id)
            .filter(Boolean);

        const fullPath = [...pathFromSubMenus, id];

        // Build named object from path
        const result = {
            parentId: fullPath[0] ?? null,
            childId:  fullPath[fullPath.length - 1] ?? null,
        };

        onSelect?.(result);
        closeAll();
    };

    const handleRootSelect = (option) => {
        if (!option.children?.length) {
            onSelect?.({ parentId: option.id, childId: null });
            closeAll();
        }
    };

    const glassMenuSx = {
        background: 'rgba(15,23,42,0.95)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '12px',
        '& .MuiMenuItem-root': {
            m: 0.5,
            borderRadius: '8px',
            color: '#eee',
            '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' },
        },
        "& .Mui-selected": {
            backgroundColor: 'rgba(255,255,255,0.1)',
        }
    };

    return (
        <Box sx={{ width: '100%' }}>
            {/* Trigger button */}
            <Button
                fullWidth
                onClick={(e) => setRootAnchor(e.currentTarget)}
                endIcon={<KeyboardArrowDownIcon sx={{ opacity: 0.5 }} />}
                sx={{
                    justifyContent: 'space-between',
                    textTransform: 'none',
                    backgroundColor: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    borderRadius: '10px',
                    padding: '8.5px 14px',
                    color: selectedText ? '#fff' : 'rgba(255,255,255,0.4)',
                    backdropFilter: 'blur(8px)',
                    '&:hover': {
                        backgroundColor: 'rgba(255,255,255,0.1)',
                        borderColor: 'rgba(255,255,255,0.3)',
                    },
                }}
            >
                <Typography variant="body2" noWrap>
                    {selectedText || t(label)}
                </Typography>
            </Button>

            {/* Root menu */}
            <Menu
                anchorEl={rootAnchor}
                open={Boolean(rootAnchor)}
                onClose={closeAll}
                PaperProps={{
                    sx: {
                        ...glassMenuSx,
                        width: rootAnchor ? rootAnchor.clientWidth : 'auto',
                    },
                }}
                sx={{
                    "& .Mui-selected": {
                        backgroundColor: 'rgba(255,255,255,0.1)',
                        "&:hover": {
                            backgroundColor: 'rgba(255,255,255,0.1)',
                        }
                    }
                }}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                transformOrigin={{ vertical: 'top', horizontal: 'left' }}
            >
                {options.length === 0 ? (
                    <MenuItem disabled sx={{ justifyContent: 'left', opacity: 0.5 }}>
                        <Typography variant="body2">{"No Options"}</Typography>
                    </MenuItem>
                ) : (
                    [...options].sort((a, b) => a.name.localeCompare(b.name)).map((option) => (
                        <MenuItem
                            selected={value?.parentId === option.id}
                            key={scopedKey(0, option.id)}
                            onMouseEnter={(e) => handleHover(0, e.currentTarget, option)}
                            onClick={() => handleRootSelect(option)}
                            sx={{ justifyContent: 'space-between'}}
                        >
                            {option.name}
                            {option.children?.length > 0 && (
                                <ChevronRightIcon fontSize="small" />
                            )}
                        </MenuItem>
                    ))
                )}

            </Menu>

            {/* Dynamically rendered sub-menus for each depth level */}
            {subMenus.map((sm, depth) =>
                sm ? (
                    <SubMenu
                        key={depth}
                        depth={depth + 1}
                        options={sm.options}
                        anchorEl={sm.anchorEl}
                        onHover={handleHover}
                        onSelect={handleSelect}
                        childId={value?.childId}
                    />
                ) : null
            )}
        </Box>
    );
};

export default NestedSelect;