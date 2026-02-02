export function maskEmail(email?: string): string {
    if (!email) return '';
    const parts = email.split('@');
    if (parts.length !== 2) return email;
    const [local, domain] = parts;
    if (local.length <= 1) return `*@${domain}`;
    if (local.length === 2) return `${local[0]}*@${domain}`;
    // show first and last char, mask the middle
    const middle = '*'.repeat(Math.max(1, local.length - 2));
    return `${local[0]}${middle}${local[local.length - 1]}@${domain}`;
}

export function maskPhone(phone?: string): string {
    if (!phone) return '';
    // Keep digits only for masking logic, preserve non-digit formatting if needed
    const digits = phone.replace(/\D/g, '');
    if (digits.length <= 4) return phone.replace(/\d/g, '*');

    // Show first 2 and last 2 digits, mask the middle
    const first = digits.slice(0, 2);
    const last = digits.slice(-2);
    const middleMask = '*'.repeat(Math.max(1, digits.length - 4));
    const maskedDigits = `${first}${middleMask}${last}`;

    // Reconstruct mask keeping original non-digit characters positions is complex;
    // simplest approach: return masked digits grouped like original length
    return maskedDigits;
}
