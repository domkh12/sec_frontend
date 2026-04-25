import * as React from 'react';
import PropTypes from 'prop-types';
import IconButton from '@mui/material/IconButton';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

function NumberField({ id: idProp, label, error, size = 'medium', sx, inputSx, labelSx, arrowSx, arrowDisabledSx, ...other }) {
    let id = React.useId();
    if (idProp) {
        id = idProp;
    }

    // Track the raw string the user is typing
    const [rawValue, setRawValue] = React.useState(
        other.value !== undefined ? String(other.value) : ''
    );
    const [isFocused, setIsFocused] = React.useState(false);

    // Sync external value changes when not focused
    React.useEffect(() => {
        if (!isFocused) {
            setRawValue(other.value !== undefined ? String(other.value) : '');
        }
    }, [other.value, isFocused]);

    const handleChange = (e) => {
        const raw = e.target.value;
        // Allow digits, one decimal point, and a leading minus
        if (/^-?\d*\.?\d*$/.test(raw)) {
            setRawValue(raw);
            const parsed = parseFloat(raw);
            if (!isNaN(parsed) && other.onChange) {
                other.onChange(parsed);
            }
        }
    };

    const handleBlur = () => {
        const parsed = parseFloat(rawValue);
        const finalValue = isNaN(parsed) ? (other.min ?? 0) : parsed;
        // Clamp to min/max on blur
        let clamped = finalValue;
        if (other.min !== undefined) clamped = Math.max(clamped, other.min);
        if (other.max !== undefined) clamped = Math.min(clamped, other.max);
        setRawValue(String(clamped));
        if (other.onChange) other.onChange(clamped);
        setIsFocused(false);
    };

    const handleIncrement = () => {
        const current = parseFloat(rawValue) || 0;
        const next = current + (other.step ?? 1);
        const clamped = other.max !== undefined ? Math.min(next, other.max) : next;
        const rounded = parseFloat(clamped.toPrecision(10)); // avoid floating point noise
        setRawValue(String(rounded));
        if (other.onChange) other.onChange(rounded);
    };

    const handleDecrement = () => {
        const current = parseFloat(rawValue) || 0;
        const next = current - (other.step ?? 1);
        const clamped = other.min !== undefined ? Math.max(next, other.min) : next;
        const rounded = parseFloat(clamped.toPrecision(10)); // avoid floating point noise
        setRawValue(String(rounded));
        if (other.onChange) other.onChange(rounded);
    };

    return (
        <FormControl
            size={size}
            disabled={other.disabled}
            required={other.required}
            error={error}
            variant="outlined"
            fullWidth
            sx={sx}
        >
            <InputLabel htmlFor={id} sx={labelSx}>{label}</InputLabel>
            <OutlinedInput
                id={id}
                label={label}
                value={isFocused ? rawValue : (other.value !== undefined ? String(other.value) : '')}
                onFocus={() => setIsFocused(true)}
                onChange={handleChange}
                onBlur={handleBlur}
                name={other.name}
                disabled={other.disabled}
                required={other.required}
                inputProps={{
                    inputMode: 'decimal',
                    min: other.min,
                    max: other.max,
                    step: other.step,
                }}
                endAdornment={
                    <InputAdornment
                        position="end"
                        sx={{
                            flexDirection: 'column',
                            maxHeight: 'unset',
                            alignSelf: 'stretch',
                            borderLeft: '1px solid',
                            borderColor: 'divider',
                            ml: 0,
                            '& button': {
                                py: 0,
                                flex: 1,
                                borderRadius: 0.5,
                            },
                        }}
                    >
                        <IconButton
                            size={size}
                            aria-label="Increase"
                            disabled={other.disabled || (other.max !== undefined && parseFloat(rawValue) >= other.max)}
                            onMouseDown={(e) => e.preventDefault()} // prevent input blur
                            onClick={handleIncrement}
                            sx={{
                                ...arrowSx,
                                '&.Mui-disabled': arrowDisabledSx,
                            }}
                        >
                            <KeyboardArrowUpIcon
                                fontSize={size}
                                sx={{ transform: 'translateY(2px)' }}
                            />
                        </IconButton>
                        <IconButton
                            size={size}
                            aria-label="Decrease"
                            disabled={other.disabled || (other.min !== undefined && parseFloat(rawValue) <= other.min)}
                            onMouseDown={(e) => e.preventDefault()} // prevent input blur
                            onClick={handleDecrement}
                            sx={{
                                ...arrowSx,
                                '&.Mui-disabled': arrowDisabledSx,
                            }}
                        >
                            <KeyboardArrowDownIcon
                                fontSize={size}
                                sx={{ transform: 'translateY(-2px)' }}
                            />
                        </IconButton>
                    </InputAdornment>
                }
                sx={{ pr: 0, ...inputSx }}
            />
            {/*<FormHelperText sx={{ ml: 0, '&:empty': { mt: 0 } }}>*/}
            {/*    Enter value from {other.min ?? 1}*/}
            {/*</FormHelperText>*/}
        </FormControl>
    );
}

NumberField.propTypes = {
    error: PropTypes.bool,
    /** The id of the input element. */
    id: PropTypes.string,
    label: PropTypes.node,
    size: PropTypes.oneOf(['medium', 'small']),
    value: PropTypes.number,
    onChange: PropTypes.func,
    name: PropTypes.string,
    min: PropTypes.number,
    max: PropTypes.number,
    step: PropTypes.number,
    disabled: PropTypes.bool,
    required: PropTypes.bool,
    sx: PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.array,
        PropTypes.func,
    ]),
    inputSx: PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.array,
        PropTypes.func,
    ]),
    labelSx: PropTypes.oneOfType([PropTypes.object, PropTypes.array, PropTypes.func]),
    arrowSx: PropTypes.oneOfType([PropTypes.object, PropTypes.array, PropTypes.func]),
};

export default NumberField;