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
  rokusho: '#1F4A43',
  rokushoDeep: '#16332E',
  rokushoLight: '#25564E',
  shiro: '#ECEDE8',
  sumi: '#16201E',
  kin: '#B8995F',
  kinBright: '#D0B47C',
  paper: '#ECE8DB',
};

mkdirSync(out, { recursive: true });

// ---- SVG masters ----------------------------------------------------------
const svgs = {
  'seal.svg': S.svg({ ink: C.sumi, metal: C.kin }),
  'seal-on-dark.svg': S.svg({ ink: C.paper, metal: C.kinBright }),
  'mark.svg': S.svg({ variant: 'mark', ink: C.sumi, metal: C.kin }),
  'mark-on-dark.svg': S.svg({ variant: 'mark', ink: C.paper, metal: C.kinBright }),
  'favicon.svg': S.svg({ variant: 'mark', ink: C.paper, metal: C.kinBright, ground: C.rokusho }),
  'edition-001-nightfall.svg': S.svg({ item: 'Nightfall', edition: 1, ink: C.sumi, metal: C.kin }),
};
for (const [name, svg] of Object.entries(svgs)) writeFileSync(join(out, name), svg + '\n');

// ---- PNGs -----------------------------------------------------------------
// Fonts are embedded from assets/fonts so rendering never depends on the network.
const face = (family, file, style) =>
  `@font-face{font-family:'${family}';font-style:${style};font-weight:100 900;src:url(data:font/woff2;base64,${readFileSync(join(root, 'assets/fonts', file)).toString('base64')}) format('woff2')}`;
const fonts = '<style>' +
  face('Bodoni Moda', 'BodoniModa.woff2', 'normal') +
  face('Bodoni Moda', 'BodoniModa-Italic.woff2', 'italic') +
  face('Hanken Grotesk', 'HankenGrotesk.woff2', 'normal') +
  '</style>';
const base = `*{box-sizing:border-box}html,body{margin:0}body{font-family:'Bodoni Moda',Didot,Georgia,serif}`;
const lacquer = `radial-gradient(120% 140% at 85% 20%, ${C.rokushoLight} 0%, ${C.rokushoDeep} 75%)`;

const wordmark = (size, color, spacing = 0.3) =>
  `<div style="font-size:${size}px;letter-spacing:${spacing}em;margin-right:-${spacing}em;color:${color};line-height:1;font-variation-settings:'opsz' 96">VESHIRO</div>`;

const pages = [
  {
    file: 'avatar-1024.png', w: 1024, h: 1024,
    html: `<div style="width:1024px;height:1024px;background:${lacquer};display:grid;place-items:center">
      <div style="width:960px;color:${C.paper}">${S.svg({ variant: 'mark', ink: C.paper, metal: C.kinBright })}</div></div>`,
  },
  {
    file: 'avatar-light-1024.png', w: 1024, h: 1024,
    html: `<div style="width:1024px;height:1024px;background:${C.shiro};display:grid;place-items:center">
      <div style="width:960px">${S.svg({ variant: 'mark', ink: C.sumi, metal: C.kin })}</div></div>`,
  },
  {
    file: 'seal-2048.png', w: 2048, h: 2048, transparent: true,
    html: `<div style="width:2048px;height:2048px;display:grid;place-items:center">
      <div style="width:1960px">${S.svg({ ink: C.sumi, metal: C.kin })}</div></div>`,
  },
  {
    file: 'banner-1500x500.png', w: 1500, h: 500,
    html: `<div style="width:1500px;height:500px;background:${lacquer};display:flex;align-items:center;justify-content:space-between;padding:0 110px;color:${C.paper}">
      <div>${wordmark(92, C.paper)}<div style="font-style:italic;font-size:30px;margin-top:22px;color:rgba(236,232,219,.72)">Each piece, signed.</div></div>
      <div style="width:400px">${S.svg({ ink: C.paper, metal: C.kinBright })}</div></div>`,
  },
  {
    file: 'youtube-2560x1440.png', w: 2560, h: 1440,
    // Only the centre 1546 x 423 is safe on every device.
    html: `<div style="width:2560px;height:1440px;background:${lacquer};display:grid;place-items:center">
      <div style="display:flex;align-items:center;gap:80px;color:${C.paper}">
        <div style="width:380px">${S.svg({ variant: 'mark', ink: C.paper, metal: C.kinBright })}</div>
        <div>${wordmark(120, C.paper)}<div style="font-style:italic;font-size:40px;margin-top:26px;color:rgba(236,232,219,.72)">Each piece, signed.</div></div>
      </div></div>`,
  },
  {
    file: 'og-1200x630.png', w: 1200, h: 630,
    html: `<div style="width:1200px;height:630px;background:${C.shiro};display:flex;align-items:center;justify-content:space-between;padding:0 90px;color:${C.sumi}">
      <div><div style="font-family:'Hanken Grotesk',Arial,sans-serif;font-size:18px;letter-spacing:.18em;color:#55625E;margin-bottom:28px">THE HOUSE OF</div>
      ${wordmark(84, C.sumi, 0.18)}<div style="font-style:italic;font-size:34px;margin-top:26px">Each piece, signed.</div></div>
      <div style="width:440px">${S.svg({ ink: C.sumi, metal: C.kin })}</div></div>`,
  },
  {
    file: 'wordmark-dark.png', w: 1600, h: 360, transparent: true,
    html: `<div style="width:1600px;height:360px;display:grid;place-items:center">${wordmark(170, C.sumi, 0.22)}</div>`,
  },
  {
    file: 'wordmark-light.png', w: 1600, h: 360, transparent: true,
    html: `<div style="width:1600px;height:360px;display:grid;place-items:center">${wordmark(170, C.paper, 0.22)}</div>`,
  },
  {
    file: 'story-1080x1920.png', w: 1080, h: 1920,
    html: `<div style="width:1080px;height:1920px;background:${lacquer};display:grid;align-content:center;justify-items:center;gap:90px;color:${C.paper}">
      <div style="width:760px">${S.svg({ item: 'Nightfall', edition: 1, ink: C.paper, metal: C.kinBright })}</div>
      <div style="text-align:center">${wordmark(64, C.paper)}<div style="font-style:italic;font-size:40px;margin-top:30px;color:rgba(236,232,219,.75)">Edition Nº 001. Nightfall.</div></div>
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
