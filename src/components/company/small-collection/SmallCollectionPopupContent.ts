import { SmallCollectionPoint } from '@/types';

export const createPopupContent = (point: SmallCollectionPoint): string => {
    // Use Tailwind config colors
    const primary600 = '#e85a4f';
    const primary700 = '#d4422e';
    const danger = '#ef4444';
    const dark = '#1e293b';
    const light = '#f8fafc';
    const statusColor = point.status === 'Active' ? primary600 : danger;
    const statusBg = point.status === 'Active' ? 'rgba(232,90,79,0.08)' : 'rgba(239,68,68,0.08)';
    return `
        <div style="background: ${light}; border-radius: 16px; box-shadow: 0 6px 32px rgba(232,90,79,0.12); padding: 18px 20px; min-width: 220px; max-width: 320px; font-family: system-ui, -apple-system, sans-serif; display: flex; flex-direction: column; gap: 10px;">
            <div style="display: flex; align-items: flex-start; gap: 14px;">
                <div style="width: 38px; height: 38px; border-radius: 50%; background: ${statusColor}; display: flex; align-items: center; justify-content: center; flex-shrink: 0; box-shadow: 0 2px 8px rgba(232,90,79,0.18); margin-top: 2px;">
                    <svg width="22" height="22" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7Z"/><circle cx="12" cy="9" r="2.5"/></svg>
                </div>
                <div style="flex: 1; min-width: 0;">
                    <div style="font-size: 16px; font-weight: 700; color: ${dark}; margin-bottom: 2px; line-height: 1.3;">${point.name}</div>
                    <div style="font-size: 13px; color: #8D9194; font-weight: 400; line-height: 1.4;">${point.address}</div>
                    <div style="font-size: 13px; color: #8D9194; font-weight: 400; line-height: 1.4; margin-top: 2px;">${point.openTime ? `${point.openTime}` : ''}</div>
                </div>
            </div>
            <div style="display: flex; align-items: center; justify-content: space-between; margin-top: 6px;">
                <button id="view-detail-${point.id}" style="font-size: 13px; font-weight: 600; color: #fff; background: ${primary600}; border: none; border-radius: 6px; padding: 4px 14px; cursor: pointer; box-shadow: 0 2px 8px rgba(232,90,79,0.10); transition: background 0.2s;" onmouseover="this.style.background='${primary700}'" onmouseout="this.style.background='${primary600}'">Xem chi tiết</button>
            </div>
        </div>
    `;
};
