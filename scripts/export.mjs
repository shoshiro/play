// Renders every brand asset into export/: SVG masters and PNGs sized for each platform.
//
//   node scripts/export.mjs
//
// Needs Playwright with a Chromium build (npm i -D playwright && npx playwright install chromium).
import { createRequire } from 'node:module';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const out = join(root, 'export');
const S = require(join(root, 'assets/seal.js'));

let chromium;
try {
  ({ chromium } = require('playwright'));
} catch {
  ({ chromium } = require('/opt/node22/lib/node_modules/playwright'));
}

const C = {
  oxblood: '#5E1822',
  oxbloodLight: '#6E1D28',
  garnet: '#3A0D14',
  night: '#1A0A0E',
  ivory: '#F4ECDF',
  gold: '#D4AF6A',
  goldDeep: '#9A7433', // gold that holds up on ivory
};

mkdirSync(out, { recursive: true });

// ---- SVG masters ----------------------------------------------------------
const svgs = {
  'seal.svg': S.svg({ ink: C.garnet, metal: C.goldDeep }),
  'seal-on-dark.svg': S.svg({ ink: C.ivory, metal: C.gold }),
  'mark.svg': S.svg({ variant: 'mark', ink: C.garnet, metal: C.goldDeep }),
  'mark-on-dark.svg': S.svg({ variant: 'mark', ink: C.ivory, metal: C.gold }),
  'favicon.svg': S.svg({ variant: 'mark', ink: C.ivory, metal: C.gold, ground: C.oxblood }),
  'piece-001-nightfall.svg': S.svg({ item: 'Nightfall', edition: 1, ink: C.ivory, metal: C.gold }),
};
for (const [name, svg] of Object.entries(svgs)) writeFileSync(join(out, name), svg + '\n');

// ---- PNGs -----------------------------------------------------------------
// Fonts are embedded from assets/fonts so rendering never depends on the network.
const face = (family, file, weight) =>
  `@font-face{font-family:'${family}';font-weight:${weight};src:url(data:font/woff2;base64,${readFileSync(join(root, 'assets/fonts', file)).toString('base64')}) format('woff2')}`;
const fonts = '<style>' +
  face('Marcellus', 'Marcellus.woff2', '400') +
  face('Hanken Grotesk', 'HankenGrotesk.woff2', '100 900') +
  '</style>';
const base = `*{box-sizing:border-box}html,body{margin:0}body{font-family:'Marcellus',Georgia,serif}`;
const lacquer = `radial-gradient(120% 140% at 85% 20%, ${C.oxbloodLight} 0%, ${C.garnet} 75%)`;

const wordmark = (size, color, spacing = 0.28) =>
  `<div style="font-size:${size}px;letter-spacing:${spacing}em;margin-right:-${spacing}em;color:${color};line-height:1">RESYTAL</div>`;
const line = (size, color, top) =>
  `<div style="font-size:${size}px;margin-top:${top}px;color:${color}">Each piece, signed.</div>`;
const onDark = (variant, extra = {}) => S.svg({ variant, ink: C.ivory, metal: C.gold, ...extra });

const pages = [
  {
    file: 'avatar-1024.png', w: 1024, h: 1024,
    html: `<div style="width:1024px;height:1024px;background:${lacquer};display:grid;place-items:center">
      <div style="width:960px">${onDark('mark')}</div></div>`,
  },
  {
    file: 'avatar-light-1024.png', w: 1024, h: 1024,
    html: `<div style="width:1024px;height:1024px;background:${C.ivory};display:grid;place-items:center">
      <div style="width:960px">${S.svg({ variant: 'mark', ink: C.garnet, metal: C.goldDeep })}</div></div>`,
  },
  {
    file: 'seal-2048.png', w: 2048, h: 2048, transparent: true,
    html: `<div style="width:2048px;height:2048px;display:grid;place-items:center">
      <div style="width:1960px">${S.svg({ ink: C.garnet, metal: C.goldDeep })}</div></div>`,
  },
  {
    file: 'seal-on-dark-2048.png', w: 2048, h: 2048, transparent: true,
    html: `<div style="width:2048px;height:2048px;display:grid;place-items:center">
      <div style="width:1960px">${onDark('seal')}</div></div>`,
  },
  {
    file: 'banner-1500x500.png', w: 1500, h: 500,
    html: `<div style="width:1500px;height:500px;background:${lacquer};display:flex;align-items:center;justify-content:space-between;padding:0 110px">
      <div>${wordmark(92, C.ivory)}${line(32, C.gold, 26)}</div>
      <div style="width:400px">${onDark('seal')}</div></div>`,
  },
  {
    file: 'youtube-2560x1440.png', w: 2560, h: 1440,
    // Only the centre 1546 x 423 is safe on every device.
    html: `<div style="width:2560px;height:1440px;background:${lacquer};display:grid;place-items:center">
      <div style="display:flex;align-items:center;gap:80px">
        <div style="width:380px">${onDark('mark')}</div>
        <div>${wordmark(120, C.ivory)}${line(42, C.gold, 30)}</div>
      </div></div>`,
  },
  {
    file: 'og-1200x630.png', w: 1200, h: 630,
    html: `<div style="width:1200px;height:630px;background:${C.night};display:flex;align-items:center;justify-content:space-between;padding:0 90px">
      <div><div style="font-family:'Hanken Grotesk',Arial,sans-serif;font-weight:600;font-size:18px;letter-spacing:.18em;color:${C.gold};margin-bottom:30px">THE HOUSE OF</div>
      ${wordmark(84, C.ivory, 0.2)}${line(34, C.gold, 28)}</div>
      <div style="width:440px">${onDark('seal')}</div></div>`,
  },
  {
    file: 'wordmark-dark.png', w: 1600, h: 360, transparent: true,
    html: `<div style="width:1600px;height:360px;display:grid;place-items:center">${wordmark(170, C.garnet, 0.22)}</div>`,
  },
  {
    file: 'wordmark-light.png', w: 1600, h: 360, transparent: true,
    html: `<div style="width:1600px;height:360px;display:grid;place-items:center">${wordmark(170, C.ivory, 0.22)}</div>`,
  },
  {
    file: 'story-1080x1920.png', w: 1080, h: 1920,
    html: `<div style="width:1080px;height:1920px;background:${lacquer};display:grid;align-content:center;justify-items:center;gap:90px">
      <div style="width:760px">${onDark('seal', { item: 'Nightfall', edition: 1 })}</div>
      <div style="text-align:center">${wordmark(64, C.ivory)}<div style="font-size:40px;margin-top:32px;color:${C.gold}">Piece Nº 001. Nightfall.</div></div>
    </div>`,
  },
];

const browser = await chromium.launch();
try {
  for (const p of pages) {
    const page = await browser.newPage({ viewport: { width: p.w, height: p.h } });
    await page.setContent(`<!doctype html><html><head><meta charset="utf-8">${fonts}<style>${base}${p.transparent ? 'html,body{background:transparent}' : ''}</style></head><body>${p.html}</body></html>`);
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({ path: join(out, p.file), omitBackground: !!p.transparent });
    await page.close();
    console.log('wrote export/' + p.file);
  }
} finally {
  await browser.close();
}
console.log('wrote ' + Object.keys(svgs).map((n) => 'export/' + n).join(', '));
