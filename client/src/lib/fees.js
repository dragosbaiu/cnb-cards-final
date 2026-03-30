export const COUNTRIES = [
  { code: "RO", name: "Romania", zone: "RO" },
  { code: "AT", name: "Austria", zone: "EU" },
  { code: "BE", name: "Belgium", zone: "EU" },
  { code: "BG", name: "Bulgaria", zone: "EU" },
  { code: "HR", name: "Croatia", zone: "EU" },
  { code: "CY", name: "Cyprus", zone: "EU" },
  { code: "CZ", name: "Czech Republic", zone: "EU" },
  { code: "DK", name: "Denmark", zone: "EU" },
  { code: "EE", name: "Estonia", zone: "EU" },
  { code: "FI", name: "Finland", zone: "EU" },
  { code: "FR", name: "France", zone: "EU" },
  { code: "DE", name: "Germany", zone: "EU" },
  { code: "GR", name: "Greece", zone: "EU" },
  { code: "HU", name: "Hungary", zone: "EU" },
  { code: "IE", name: "Ireland", zone: "EU" },
  { code: "IT", name: "Italy", zone: "EU" },
  { code: "LV", name: "Latvia", zone: "EU" },
  { code: "LT", name: "Lithuania", zone: "EU" },
  { code: "LU", name: "Luxembourg", zone: "EU" },
  { code: "MT", name: "Malta", zone: "EU" },
  { code: "NL", name: "Netherlands", zone: "EU" },
  { code: "PL", name: "Poland", zone: "EU" },
  { code: "PT", name: "Portugal", zone: "EU" },
  { code: "SK", name: "Slovakia", zone: "EU" },
  { code: "SI", name: "Slovenia", zone: "EU" },
  { code: "ES", name: "Spain", zone: "EU" },
  { code: "SE", name: "Sweden", zone: "EU" },
  { code: "GB", name: "United Kingdom", zone: "OTHER" },
  { code: "CH", name: "Switzerland", zone: "OTHER" },
  { code: "NO", name: "Norway", zone: "OTHER" },
  { code: "US", name: "United States", zone: "OTHER" },
  { code: "CA", name: "Canada", zone: "OTHER" },
  { code: "AU", name: "Australia", zone: "OTHER" },
  { code: "JP", name: "Japan", zone: "OTHER" },
  { code: "OTHER", name: "Other country", zone: "OTHER" },
];

export const ZONE_FEES = { RO: 1, EU: 2, OTHER: 5 };

export function getZoneForCountry(code) {
  return COUNTRIES.find((c) => c.code === code)?.zone ?? "OTHER";
}

export function getShippingFee(countryCode) {
  return ZONE_FEES[getZoneForCountry(countryCode)];
}

export function getProcessingFee(subtotal) {
  return Math.round(subtotal * 0.015 * 100) / 100;
}
