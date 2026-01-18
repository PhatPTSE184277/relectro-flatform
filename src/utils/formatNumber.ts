// Định dạng số về 2 chữ số thập phân
export function formatWeightKg(weight?: number): string {
    if (weight == null) return '-';
    // Nếu là số nguyên, trả về nguyên, nếu có thập phân thì giữ lại
    if (Number.isInteger(weight)) return weight.toString();
    return weight % 1 === 0 ? weight.toString() : weight.toString().replace(/\.0+$/, '').replace(/(\.[1-9]*)0+$/, '$1');
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
