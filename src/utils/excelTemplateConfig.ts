import { SystemConfig } from '@/services/admin/SystemConfigService';

const normalize = (value: string) =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();

export const pickExcelTemplateUrl = (
  configs: SystemConfig[],
  keywords: string[]
): string | null => {
  if (!Array.isArray(configs) || configs.length === 0) return null;

  const normalizedKeywords = keywords.map(normalize).filter(Boolean);
  let best: { score: number; url: string } | null = null;

  for (const cfg of configs) {
    if (!cfg?.value) continue;
    const haystack = normalize(`${cfg.displayName || ''} ${cfg.key || ''}`);
    if (!haystack) continue;

    let score = 0;
    for (const keyword of normalizedKeywords) {
      if (haystack.includes(keyword)) score += 1;
    }

    if (score > 0 && (!best || score > best.score)) {
      best = { score, url: cfg.value };
    }
  }

  return best?.url ?? null;
};
