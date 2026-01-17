// utils/qr.ts
// Hàm kiểm tra QR code hợp lệ (chỉ cho phép QR do hệ thống tạo ra)
export function isValidSystemQRCode(qr: string): boolean {
    // Quy ước: QR hệ thống tạo là số nguyên dương, đúng 13 ký tự số, không chứa ký tự chữ
    if (!qr) return false;
    if (!/^[0-9]{13}$/.test(qr)) return false;
    return true;
}
