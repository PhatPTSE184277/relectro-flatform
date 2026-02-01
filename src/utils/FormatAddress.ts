// Trim address to keep from street name onwards.
// Example: "Số 146 Võ Văn Ngân, Thủ Đức" -> "Võ Văn Ngân, Thủ Đức"
export function formatAddress(address?: string): string {
    if (!address) return '';
    let a = address.trim();

    // Remove common leading tokens like "Số", "Số nhà", "Nhà số", optional "No." and following house numbers
    // Matches: "Số 123", "Số 123/45", "123/45", "No. 12-3" etc.
    a = a.replace(/^\s*(?:Số(?: nhà)?|Nhà số|No\.?|Address:)?\s*\d+[\d\/-]*\s*[,.-]?\s*/i, '');

    // If still starts with a number (e.g., "146 Võ..."), remove leading number
    a = a.replace(/^\s*\d+[\d\/-]*\s*[,.-]?\s*/i, '');

    return a.trim();
}
