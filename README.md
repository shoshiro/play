# VESHIRO

**Each piece, signed.**

Veshiro (/vɛˈʃiː.roʊ/, *veh · shee · roh*) is a personal house: one name for everything made, sold and shared, on every platform.

| File | What it is |
| --- | --- |
| `brand.html` | The house book: name, seal, colour, type, voice, mockups, and a checklist of handles to claim. Includes a live tool that seals any piece. |
| `index.html` | The public website. Social bios link here. |
| `assets/seal.js` | The seal generator. Browser and Node. |
| `export/` | Ready-to-upload assets (see below). |
| `scripts/export.mjs` | Regenerates everything in `export/`. |

## The name

- **ve**: from Latin *vestigium*, a footprint or trace.
- **shiro**: Japanese 白 (white, the blank page) and 城 (castle, a house that keeps things).
- Put together, it means a mark left on a blank page, kept inside a house. It also nods to where it started: shoshiro.

A web search found no existing brand called Veshiro. Handles and domains still need checking. Claim `@veshiro` everywhere in one sitting (the list is in `brand.html`, section IX). If `veshiro.com` is taken, use `veshiro.house` or `houseofveshiro.com`.

## The seal

The mark is the name written as one line on a **keyed letter wheel**. The 26 letters sit around a circle at step `(n × 11) mod 26`, which gives the house its own alphabet order:

```
A T M F Y R K D W P I B U N G Z S L E X Q J C V O H
```

A single stroke visits V → E → S → H → I → R → O. It opens with a small ring and closes with a bar. The resulting shape (a gate under a crown) comes only from this name.

**Every piece gets its own seal.** The piece's name is drawn in gilt on the same wheel, over the faint house line, with its number in the ring:

```js
VeshiroSeal.svg()                                   // house seal
VeshiroSeal.svg({ variant: 'mark' })                // compact mark: avatars, favicons, corners
VeshiroSeal.svg({ item: 'Nightfall', edition: 1 })  // Edition Nº 001
VeshiroSeal.svg({ ink: '#ECE8DB', metal: '#D0B47C' })  // colours for dark grounds
```

Make new seals from the "Sign a piece" panel in `brand.html` (Copy SVG), or in Node:

```sh
node -e "console.log(require('./assets/seal.js').svg({item:'First Light',edition:2}))" > export/edition-002.svg
```

## The house system

| | Editions | Letters |
| --- | --- | --- |
| For | Anything with a price | Anything free |
| Numbering | `Nº 001`, three digits, never reused | `Letter 01`, counted separately |
| Mark | Its own seal from its own name | House mark in a corner |
| Rule | State the quantity | Give it a title that could stand alone |

## Colour

| Name | Hex | Use |
| --- | --- | --- |
| Rokushō 緑青 (verdigris) | `#1F4A43` | Signature. Avatars, packaging, cards |
| Shiro 白 (porcelain) | `#ECEDE8` | Ground |
| Sumi 墨 (ink) | `#16201E` | Text, the seal line |
| Kin 金 (gilt) | `#B8995F` | Edition seals and numbers only |
| Nezumi 鼠 (grey) | `#6A7773` | Captions, details |

Rough proportion in use: Shiro 60%, Rokushō 22%, Sumi 12%, Nezumi 4%, Kin 2%.

## Type

- **Bodoni Moda**: wordmark, display, titles. Wordmark is all caps, largest optical size, tracked +140 or wider.
- **Hanken Grotesk**: body copy, captions, product details.
- **IBM Plex Mono**: numbers and codes only (`Nº 004 · 12 / 40`).

All three are free on Google Fonts under the SIL Open Font License. Copies used for exports are in `assets/fonts/`.

## Voice

- No exclamation marks, no emoji, no countdowns. Scarcity is stated, never shouted.
- Exact numbers: "Edition Nº 004. Forty made. Ships 3 October."
- Use "pieces" and "editions". Never "content", "drops" or "merch".
- Prices are shown plainly. The house does not run sales.
- Write to one person, not to a crowd.

## Exports

Run `node scripts/export.mjs` to regenerate everything.

| File | Use |
| --- | --- |
| `avatar-1024.png` | Profile picture on every platform (verdigris) |
| `avatar-light-1024.png` | Light version of the profile picture |
| `banner-1500x500.png` | X, LinkedIn header |
| `youtube-2560x1440.png` | YouTube channel art (content inside the safe area) |
| `og-1200x630.png` | Link preview image for the website |
| `story-1080x1920.png` | Instagram/TikTok story template, Edition Nº 001 |
| `seal-2048.png` | Transparent seal for print and overlays |
| `wordmark-dark.png`, `wordmark-light.png` | Transparent wordmark |
| `seal.svg`, `seal-on-dark.svg`, `mark.svg`, `mark-on-dark.svg`, `favicon.svg` | Vector masters |
| `edition-001-nightfall.svg` | Example edition seal |

## Publishing the website

`index.html` is a static page that works on GitHub Pages, Netlify, Vercel or Cloudflare Pages without a build step. On GitHub Pages: Settings → Pages → deploy from branch, root folder. Then point your domain at it and put the URL in every bio.

When you're ready to sell, connect a shop (Shopify, Lemon Squeezy, Gumroad or Stripe Payment Links) and link each Edition card to its product page.
