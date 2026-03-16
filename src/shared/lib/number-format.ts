const KRW_FORMATTER = new Intl.NumberFormat("ko-KR");

export function formatNumber(value: number): string {
  return KRW_FORMATTER.format(value);
}
