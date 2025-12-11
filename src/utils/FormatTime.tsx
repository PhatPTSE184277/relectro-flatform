
const formatTimeTo24h = (timeStr: string) => {
    if (!timeStr) return '';
    if (/^\d{2}:\d{2}$/.test(timeStr)) return timeStr;
    const secMatch = timeStr.match(/^\d{2}:(\d{2}):(\d{2})$/);
    if (secMatch) return `${secMatch[1]}:${secMatch[2]}`;
    const match = timeStr.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
    if (!match) return timeStr;
    let hour = parseInt(match[1], 10);
    const minute = match[2];
    const period = match[3].toUpperCase();
    if (period === 'PM' && hour < 12) hour += 12;
    if (period === 'AM' && hour === 12) hour = 0;
    return `${hour.toString().padStart(2, '0')}:${minute}`;
}

// Format ISO datetime string (e.g. '2025-12-10T15:47:06.2886081Z') to 'HH:mm'
const formatIsoToHourMinute = (isoStr: string) => {
    if (!isoStr) return '';
    // Try to parse as Date
    const date = new Date(isoStr);
    if (isNaN(date.getTime())) return '';
    const hour = date.getHours().toString().padStart(2, '0');
    const minute = date.getMinutes().toString().padStart(2, '0');
    return `${hour}:${minute}`;
}

const formatTime = (timeStr: string) => {
    if (!timeStr) return '';
    const parts = timeStr.split(':');
    if (parts.length >= 2) {
        return `${parts[0].padStart(2, '0')}:${parts[1].padStart(2, '0')}`;
    }
    return timeStr;
}

// Helper to format time and date if needed
const formatTimeWithDate = (isoStr: string) => {
    if (!isoStr) return '';
    const date = new Date(isoStr);
    if (isNaN(date.getTime())) return '';
    const hour = date.getHours().toString().padStart(2, '0');
    const minute = date.getMinutes().toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${hour}:${minute} ${day}/${month}/${year}`;
};

export { formatTimeTo24h, formatTime, formatIsoToHourMinute, formatTimeWithDate };