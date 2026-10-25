/** Formats up to 9 national digits as "90 123 45 67" while typing. */
export function formatPhone(raw: string): string {
  const digits = raw.replace(/\D/g, "").substring(0, 9);
  const p1 = digits.substring(0, 2);
  const p2 = digits.substring(2, 5);
  const p3 = digits.substring(5, 7);
  const p4 = digits.substring(7, 9);
  if (digits.length > 7) return `${p1} ${p2} ${p3} ${p4}`;
  if (digits.length > 5) return `${p1} ${p2} ${p3}`;
  if (digits.length > 2) return `${p1} ${p2}`;
  return p1;
}

export function isPhoneValid(phone: string): boolean {
  return /^\d{2} \d{3} \d{2} \d{2}$/.test(phone);
}
