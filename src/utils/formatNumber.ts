// Locale-aware number formatting utilities
// By default uses international formatting ('en-US') where decimal separator is '.' and thousands separator is ','
export function formatNumber(value?: number, options?: {
    locale?: string;
    maximumFractionDigits?: number;
    minimumFractionDigits?: number;
    useGrouping?: boolean;
}): string {
    if (value == null || Number.isNaN(value)) return '-';
    const locale = options?.locale ?? 'en-US';
    const maximumFractionDigits = typeof options?.maximumFractionDigits === 'number'
        ? options!.maximumFractionDigits
        : // default: preserve integers (0), otherwise up to 3 decimals
            (Number.isInteger(value) ? 0 : 3);
    const minimumFractionDigits = typeof options?.minimumFractionDigits === 'number' ? options!.minimumFractionDigits : 0;
    const nf = new Intl.NumberFormat(locale, {
        maximumFractionDigits,
        minimumFractionDigits,
        useGrouping: options?.useGrouping ?? true,
    });
    return nf.format(value);
}

// Format weight in kg with sensible defaults. Returns '-' for null/undefined.
export function formatWeightKg(weight?: number, locale = 'en-US'): string {
    if (weight == null || Number.isNaN(weight)) return '-';
    // Round to nearest integer and show no decimal places for capacity/weight
    const rounded = Math.round(weight);
    return formatNumber(rounded, { locale, maximumFractionDigits: 0 });
}

// Format dimension text like "12 x 34.5 x 6" -> formats each number with up to 2 decimals
export function formatDimensionText(text?: string, locale = 'en-US'): string {
    if (!text) return '-';
    return text.split('x')
        .map(s => {
            const raw = s.trim();
            const n = parseFloat(raw);
            if (isNaN(n)) return raw;
            return formatNumber(n, { locale, maximumFractionDigits: 2 });
        })
        .join(' x ');
}
