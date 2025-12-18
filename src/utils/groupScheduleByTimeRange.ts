import { formatDate } from '@/utils/FormatDate';
import { formatTimeTo24h } from '@/utils/FormatTime';

export interface GroupedSchedule {
  dateStr: string;
  range: string;
}

export function groupScheduleByTimeRange(schedule: any[]): GroupedSchedule[] {
  if (!Array.isArray(schedule)) return [];
  // Helper to format time range string
  const getTimeRange = (item: any) => {
    const start = item?.slots?.startTime ? formatTimeTo24h(item.slots.startTime) : '-';
    const end = item?.slots?.endTime ? formatTimeTo24h(item.slots.endTime) : '-';
    return `${start} - ${end}`;
  };
  // Group by time range
  const groups: Record<string, any[]> = {};
  schedule.forEach((item: any) => {
    const range = getTimeRange(item);
    if (!groups[range]) groups[range] = [];
    groups[range].push(item);
  });
  // Render each group
  return Object.entries(groups).map(([range, items]) => {
    // Sort dates
    const dates = items.map(i => i?.pickUpDate).filter(Boolean).sort();
    let dateStr = '';
    if (dates.length === 1) {
      dateStr = formatDate(dates[0]);
    } else if (dates.length > 1) {
      // Check if dates are consecutive
      const allDates = dates.map(d => new Date(d));
      allDates.sort((a, b) => a.getTime() - b.getTime());
      let isConsecutive = true;
      for (let i = 1; i < allDates.length; i++) {
        const diff = (allDates[i].getTime() - allDates[i-1].getTime()) / (1000*60*60*24);
        if (diff !== 1) { isConsecutive = false; break; }
      }
      if (isConsecutive) {
        dateStr = `${formatDate(dates[0])} - ${formatDate(dates[dates.length-1])}`;
      } else {
        dateStr = dates.map(formatDate).join(', ');
      }
    } else {
      dateStr = 'Không có thông tin';
    }
    return { dateStr, range };
  });
}
