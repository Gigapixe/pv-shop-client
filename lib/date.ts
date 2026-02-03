// Lightweight date helpers used across the app.
// - toInputDate: normalize various DOB formats to `YYYY-MM-DD` for <input type="date">
// - toSubmissionDate: convert `YYYY-MM-DD` -> `YYYY/MM/DD` (backend expected)
// - formatLong: human-friendly `DD Month YYYY` (en-US by default)
// - formatIsoToAsian: `DD/MM/YYYY` (used in some UIs)

export function toInputDate(value?: string | null): string {
  if (!value) return "";
  const s = String(value).trim();

  // If already in YYYY-MM-DD form and valid-ish, return first 10 chars
  if (/^\d{4}-\d{2}-\d{2}/.test(s)) return s.slice(0, 10);

  // If in YYYY/MM/DD -> convert to YYYY-MM-DD
  if (/^\d{4}\/\d{2}\/\d{2}/.test(s)) return s.replace(/\//g, "-").slice(0, 10);

  // If in DD/MM/YYYY or DD-MM-YYYY, try to parse
  if (/^\d{2}[\/-]\d{2}[\/-]\d{4}$/.test(s)) {
    const parts = s.split(/[-\/:]/);
    // parts likely [DD,MM,YYYY]
    return `${parts[2]}-${parts[1].padStart(2, "0")}-${parts[0].padStart(2, "0")}`;
  }

  // Last resort: attempt Date parsing and format to YYYY-MM-DD
  const d = new Date(s);
  if (!isNaN(d.getTime())) {
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  }

  return "";
}

export function toSubmissionDate(isoDate?: string | null): string | null {
  if (!isoDate) return null;
  const normalized = toInputDate(isoDate);
  if (!normalized) return null;
  const [y, m, d] = normalized.split("-");
  if (!y || !m || !d) return null;
  return `${y}/${m}/${d}`;
}

export function formatLong(isoDate?: string | null, locale = "en-US"): string {
  if (!isoDate) return "";
  const normalized = toInputDate(isoDate);
  if (!normalized) return String(isoDate);
  const d = new Date(normalized);
  if (isNaN(d.getTime())) return String(isoDate);
  const day = String(d.getDate()).padStart(2, "0");
  const month = d.toLocaleString(locale, { month: "long" });
  const year = d.getFullYear();
  return `${day} ${month} ${year}`;
}
function _ordinal(n: number) {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return s[(v - 20) % 10] || s[v] || s[0];
}

export function formatLongWithOrdinal(
  isoDate?: string | null,
  locale = "en-US",
): string {
  if (!isoDate) return "";
  const normalized = toInputDate(isoDate);
  if (!normalized) return String(isoDate);
  const d = new Date(normalized);
  if (isNaN(d.getTime())) return String(isoDate);
  const dayNum = d.getDate();
  const day = String(dayNum); // no leading zero for ordinals
  const month = d.toLocaleString(locale, { month: "long" });
  const year = d.getFullYear();
  return `${day}${_ordinal(dayNum)} ${month} ${year}`;
}
export function formatIsoToAsian(isoDate?: string | null): string {
  if (!isoDate) return "";
  const normalized = toInputDate(isoDate);
  if (!normalized) return String(isoDate);
  const [y, m, d] = normalized.split("-");
  return `${d}/${m}/${y}`;
}
