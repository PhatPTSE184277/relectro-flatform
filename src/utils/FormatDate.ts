
// Format date string yyyy-mm-dd (hoặc yyyy-mm-ddTHH:MM:SS) thành dd/mm/yyyy
export function formatDate(dateStr?: string): string {
	if (!dateStr) return '';
	// Lấy phần yyyy-mm-dd nếu có thêm giờ
	const match = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})/);
	if (!match) return dateStr;
	const [, year, month, day] = match;
	return `${day}/${month}/${year}`;
}
