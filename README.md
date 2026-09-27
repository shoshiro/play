# RESYTAL

**Each piece, signed.**

Resytal (said "recital", Hebrew רסיטל) is a family brand: one name for everything made, sold and shared, on every platform.

| File | What it is |
| --- | --- |
| `brand.html` | The brand kit: name, seal, colour, type, voice, mockups, and a checklist of handles to claim. Includes a live tool that seals any piece. |
| `index.html` | The public website. Social bios link here. |
| `assets/seal.js` | The seal generator. Browser and Node. |
| `export/` | Ready-to-upload assets (see below). |
| `scripts/export.mjs` | Regenerates everything in `export/`. |

## The name

- **The family:** Resytal is the family name in its Hebrew form, recital.
- **The word:** a recital presents pieces one at a time, which is how the brand releases its work.
- **The spelling:** the S keeps the Hebrew sound, and the Y makes it ownable.
- **Pronunciation:** officially "recital". Hebrew speakers say *reh-see-TAHL*, which is also correct. Bios read `RESYTAL · said "recital"`.

A web search found no consumer brand using the spelling Resytal. The only users are a French Ministry of Agriculture computer system and a telecom company in Cameroon, both far from this field. Handles and domains still need checking: claim `@resytal` everywhere in one sitting (the list is in `brand.html`, section IX), and run a trademark search before the first sale.

## The seal

The mark is the name written as one line on a **keyed letter wheel**. The 26 letters sit around a circle at step `(n × 7) mod 26`, which gives the brand its own alphabet order:

```
A P E T I X M B Q F U J Y N C R G V K Z O D S H W L
```

A single stroke visits R → E → S → Y → T → A → L. It opens with a small ring and closes with a bar. Seven letters on a seven-step wheel draw a lyre.

**Every piece gets its own seal.** The piece's name is drawn in gold on the same wheel, over the brand's faint lyre, with its number in the ring:

```js
ResytalSeal.svg()                                    // brand seal
ResytalSeal.svg({ variant: 'mark' })                 // compact mark: avatars, favicons, corners
ResytalSeal.svg({ item: 'Nightfall', edition: 1 })   // Piece Nº 001
ResytalSeal.svg({ ink: '#3A0D14', metal: '#9A7433' })  // colours for ivory paper
```

Make new seals from the "Sign a piece" panel in `brand.html` (Copy SVG), or in Node:

```sh
node -e "console.log(require('./assets/seal.js').svg({item:'First Light',edition:2}))" > export/piece-002.svg
```

## The programme

| | Pieces | Notes |
| --- | --- | --- |
| For | Anything with a price | Anything free |
| Numbering | `Nº 001`, three digits, never reused | `Note 01`, counted separately |
| Mark | Its own seal from its own name | Brand mark in a corner |
| Rule | State the quantity | Give it a title that could stand alone |

## Colour

| Name | Hex | Use |
| --- | --- | --- |
| Oxblood | `#5E1822` | Signature. Avatars, packaging, cards |
| Garnet | `#3A0D14` | Depth. Gradients, ink on ivory |
| Night | `#1A0A0E` | Ground for screens and the site |
| Ivory | `#F4ECDF` | Text on dark; paper for tags and cards |
| Gold | `#D4AF6A` | Piece seals, numbers, one accent (`#9A7433` on ivory) |

Rough proportion in use: Night 50%, Oxblood 25%, Ivory 15%, Garnet 8%, Gold 2%.

## Type

- **Marcellus**: wordmark, titles, piece names. Wordmark is all caps, tracked +140 or wider.
- **Hanken Grotesk**: body copy, captions, product details, numbers (tabular figures). Never lighter than regular weight.

Both are free on Google Fonts under the SIL Open Font License. Copies used for exports are in `assets/fonts/`.

## Voice

- No exclamation marks, no emoji, no countdowns. Scarcity is stated, never shouted.
- Exact numbers: "Piece Nº 004. Forty made. Ships 3 October."
- Use "pieces" and "notes". Never "content", "drops" or "merch".
- Prices are shown plainly. The brand does not run sales.
- Write to one person, not to a crowd.

## Exports

Run `node scripts/export.mjs` to regenerate everything.

| File | Use |
| --- | --- |
| `avatar-1024.png` | Profile picture on every platform (oxblood) |
| `avatar-light-1024.png` | Ivory version of the profile picture |
| `banner-1500x500.png` | X, LinkedIn header |
| `youtube-2560x1440.png` | YouTube channel art (content inside the safe area) |
| `og-1200x630.png` | Link preview image for the website |
| `story-1080x1920.png` | Instagram/TikTok story template, Piece Nº 001 |
| `seal-2048.png`, `seal-on-dark-2048.png` | Transparent seals for print and overlays |
| `wordmark-dark.png`, `wordmark-light.png` | Transparent wordmark |
| `seal.svg`, `seal-on-dark.svg`, `mark.svg`, `mark-on-dark.svg`, `favicon.svg` | Vector masters |
| `piece-001-nightfall.svg` | Example piece seal |

## Publishing the website

`index.html` is a static page that works on GitHub Pages, Netlify, Vercel or Cloudflare Pages without a build step. On GitHub Pages: Settings → Pages → deploy from branch, root folder. Then point your domain at it and put the URL in every bio.

When you're ready to sell, connect a shop (Shopify, Lemon Squeezy, Gumroad or Stripe Payment Links) and link each piece card to its product page.
