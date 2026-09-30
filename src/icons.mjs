const paths = {
  arrow: '<path d="M5 12h14m-6-6 6 6-6 6"/>',
  diagonal: '<path d="M6 18 18 6M6 6h12v12"/>',
  down: '<path d="m6 9 6 6 6-6"/>',
  pin: '<path d="M20 10c0 6-8 11-8 11S4 16 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/>',
  team: '<circle cx="9" cy="7" r="3"/><path d="M3 21v-4a6 6 0 0 1 12 0v4M16 4a3 3 0 0 1 0 6m2 3a5 5 0 0 1 3 4v4"/>',
  plan: '<rect x="4" y="4" width="16" height="17" rx="1"/><path d="M8 2v4m8-4v4M8 11h8m-8 4h5"/>',
  sparkle: '<path d="m12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5L12 3ZM20 2v4m-2-2h4"/>',
  apartment: '<path d="M5 22V3h14v19M2 22h20M9 7h1m4 0h1m-6 4h1m4 0h1M9 15h1m4 0h1m-6 7v-3h6v3"/>',
  house: '<path d="m2 11 10-9 10 9M5 9v12h14V9M10 21v-7h4v7m3-15V3h3v6"/>',
  business: '<path d="M3 9h18l-2-6H5L3 9Zm1 4v8h16v-8M3 9v2a3 3 0 0 0 6 0V9m0 2a3 3 0 0 0 6 0V9m0 2a3 3 0 0 0 6 0V9M9 21v-6h6v6"/>',
  check: '<path d="m5 12 4 4L19 6"/>',
  water: '<path d="M12 2s-7 8-7 13a7 7 0 0 0 14 0c0-5-7-13-7-13Z"/><path d="M8 15a4 4 0 0 0 4 4"/>',
  electric: '<path d="m13 2-9 12h7l-1 8 10-13h-7l1-7Z"/>',
  finish: '<path d="M3 3h16v7H3V3Zm16 3h3v8H11v8H8v-8m1 0v-4"/>',
  truck: '<path d="M2 5h12v12H2V5Zm12 4h5l3 4v4h-8M14 13h8"/><circle cx="6" cy="18" r="2.5"/><circle cx="18" cy="18" r="2.5"/>',
  phone: '<path d="m6 2-3 2c-2 7 10 19 17 17l2-3-6-4-2 2a17 17 0 0 1-6-6l2-2-4-6Z"/>',
  mail: '<rect x="2" y="4" width="20" height="16" rx="1"/><path d="m3 5 9 8 9-8"/>',
  instagram: '<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><path d="M17 7h.01"/>',
  whatsapp: '<path d="M21 11.5a9 9 0 0 1-13.5 8L3 21l1.5-4.5A9 9 0 1 1 21 11.5Z"/><path d="m8 7 2 3-1 1a8 8 0 0 0 4 4l1-1 3 2c-1 3-7 1-10-4-1-2-1-4 1-5Z"/>',
};
export const icon = (name, extra = '') => `<svg class="icon ${extra}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] || paths.arrow}</svg>`;
export const mark = `<svg class="brand-mark" viewBox="0 0 100 70" aria-hidden="true"><path fill="currentColor" d="M0 70 37 33 63 59H42L37 54 21 70Zm40-39L63 8l37 37H79L63 29 50 42Z"/><path fill="#a8371c" d="m37 10 17 1-17 17Z"/></svg>`;
