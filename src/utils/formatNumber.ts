// Định dạng số về 2 chữ số thập phân
export function formatWeightKg(weight?: number): string {
    return weight != null ? weight.toFixed(2) : '-';
}

// Làm tròn từng số trong dimensionText về 2 chữ số thập phân
export function formatDimensionText(text?: string): string {
    if (!text) return '-';
    return text.split('x')
        .map(s => {
            const n = parseFloat(s.trim());
            if (isNaN(n)) return s.trim();
            // Làm tròn 2 số, bỏ số 0 dư
            return n.toFixed(2).replace(/\.00$/, '').replace(/(\.[1-9]*)0$/, '$1');
        })
        .join(' x ');
}
