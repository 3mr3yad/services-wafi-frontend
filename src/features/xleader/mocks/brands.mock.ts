// MOCK DATA: development only. Never served in production (see isMockMode).
// Shape mirrors xleader_brands (id, name) as XleaderController@index exposes it to the view.
// The real list is managed by admins (no seeder exists), so these names are placeholders.
const brands: unknown[] = [
  { id: 1, name: 'Apple (mock)' },
  { id: 2, name: 'Samsung (mock)' },
  { id: 3, name: 'Huawei (mock)' },
];

export function getXleaderBrandsMock(): unknown[] {
  return brands;
}
