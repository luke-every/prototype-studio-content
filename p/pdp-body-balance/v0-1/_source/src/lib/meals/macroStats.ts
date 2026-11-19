export type MacroStatInput = {
  key: string;
  value: number | string | undefined;
  label: string;
  unit?: string;
};

export type MacroStat = {
  key: string;
  value: number | string;
  label: string;
  unit?: string;
};

/** Drops macros that are missing, empty, or exactly 0 — nutrition tags only show real values. */
export function buildMacroStats(inputs: MacroStatInput[]): MacroStat[] {
  return inputs.reduce<MacroStat[]>((stats, { key, value, label, unit }) => {
    if (value === undefined || value === "" || value === 0) return stats;
    stats.push({ key, value, label, unit });
    return stats;
  }, []);
}
