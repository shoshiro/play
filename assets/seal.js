/*
 * The Veshiro Seal
 *
 * The house mark is the name itself, written as a path on a 26-letter wheel.
 * The wheel is keyed: letter n sits at step (n * 11) mod 26, so the alphabet is
 * shuffled into the house's own order (A stays at the top, clockwise). A curved
 * stroke visits V-E-S-H-I-R-O in order, opening with a small ring and closing
 * with a bar, the way hand-drawn sigils traditionally do.
 *
 * Anything the house makes can carry its own seal: pass `item` and the piece's
 * name is drawn on the same wheel, over the faint house path, inside the ring.
 *
 *   VeshiroSeal.svg()                                    // house seal
 *   VeshiroSeal.svg({ variant: 'mark' })                 // no text ring
 *   VeshiroSeal.svg({ item: 'Nightfall', edition: 1 })   // edition seal
 *   VeshiroSeal.svg({ house: 'Deshar' })                 // any other house name
 *
 * Works in the browser (window.VeshiroSeal) and in Node (require).
 */
(function (root) {
  'use strict';

  var HOUSE = 'VESHIRO';
  var MOTTO = 'EACH PIECE, SIGNED';
  var FOUNDED = 'MMXXVI';
  var KEY = 11; // coprime with 26, so every letter gets its own step

  var R_OUTER = 96, R_OUTER_2 = 93;
  var R_TEXT = 85.5;
  var R_TICK_OUT = 78, R_TICK_IN = 75.5, R_TICK_LONG = 72.5;
  var R_INNER = 69;
  var R_WHEEL = 60;

  function letters(str) {
    return String(str || '')
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .toUpperCase()
      .replace(/[^A-Z]/g, '')
      .split('');
  }

  function stepOf(ch) {
    return ((ch.charCodeAt(0) - 65) * KEY) % 26;
  }

  function angleOf(ch) {
    // Step 0 (A) at 12 o'clock, clockwise.
    return (stepOf(ch) / 26) * Math.PI * 2 - Math.PI / 2;
  }

  function polar(r, a) {
    return [r * Math.cos(a), r * Math.sin(a)];
  }

  function f(n) {
    return Math.round(n * 100) / 100;
  }

  // The name as a sequence of wheel points, with immediate repeats removed.
  function points(name) {
    var out = [];
    letters(name).forEach(function (ch) {
      if (out.length && out[out.length - 1].ch === ch) return;
      var a = angleOf(ch);
      var p = polar(R_WHEEL, a);
      out.push({ ch: ch, a: a, x: p[0], y: p[1] });
    });
    return out;
  }

  // Quadratic curves between successive letters, bowed toward the centre so
  // the stroke reads as a single calligraphic gesture rather than a polygon.
  function namePath(pts, pull) {
    if (pts.length === 0) return '';
    if (pts.length === 1) return 'M' + f(pts[0].x) + ' ' + f(pts[0].y);
    var d = 'M' + f(pts[0].x) + ' ' + f(pts[0].y);
    for (var i = 1; i < pts.length; i++) {
      var a = pts[i - 1], b = pts[i];
      var cx = ((a.x + b.x) / 2) * pull;
      var cy = ((a.y + b.y) / 2) * pull;
      d += ' Q' + f(cx) + ' ' + f(cy) + ' ' + f(b.x) + ' ' + f(b.y);
    }
    return d;
  }

  function terminals(pts, color, sw) {
    if (!pts.length) return '';
    var s = pts[0], e = pts[pts.length - 1];
    var out = '<circle cx="' + f(s.x) + '" cy="' + f(s.y) + '" r="3.2" fill="none" stroke="' + color + '" stroke-width="' + sw + '"/>';
    // Closing bar: tangent to the wheel at the last letter.
    var t = e.a + Math.PI / 2, h = 5.5;
    out += '<line x1="' + f(e.x - h * Math.cos(t)) + '" y1="' + f(e.y - h * Math.sin(t)) +
      '" x2="' + f(e.x + h * Math.cos(t)) + '" y2="' + f(e.y + h * Math.sin(t)) +
      '" stroke="' + color + '" stroke-width="' + sw + '" stroke-linecap="round"/>';
    return out;
  }

  function pad(n) {
    n = Math.max(0, Math.floor(n));
    return n < 10 ? '00' + n : n < 100 ? '0' + n : String(n);
  }

  function escapeXml(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  var uid = 0;

  function svg(opts) {
    opts = opts || {};
    var ink = opts.ink || '#16201E';
    var metal = opts.metal || '#A88A55';
    var ground = opts.ground || 'none';
    var variant = opts.variant || 'seal'; // 'seal' | 'mark'
    var size = opts.size || null;
    var fontFamily = opts.fontFamily || "'Bodoni Moda', 'Didot', 'Bodoni 72', Georgia, serif";
    var item = opts.item ? String(opts.item) : '';
    var edition = opts.edition != null ? Number(opts.edition) : null;
    var id = 'vs' + (++uid) + Math.random().toString(36).slice(2, 6);

    var houseName = opts.house ? String(opts.house).toUpperCase() : HOUSE;
    var motto = opts.motto ? String(opts.motto).toUpperCase() : MOTTO;
    var house = points(houseName);
    var piece = item ? points(item) : [];
    var used = {};
    house.forEach(function (p) { used[p.ch] = 'house'; });
    piece.forEach(function (p) { used[p.ch] = 'piece'; });

    var hair = 0.55;
    var parts = [];

    if (ground !== 'none') {
      parts.push('<circle cx="0" cy="0" r="100" fill="' + ground + '"/>');
    }

    if (variant === 'seal') {
      parts.push('<circle cx="0" cy="0" r="' + R_OUTER + '" fill="none" stroke="' + ink + '" stroke-width="' + hair * 1.6 + '"/>');
      parts.push('<circle cx="0" cy="0" r="' + R_OUTER_2 + '" fill="none" stroke="' + ink + '" stroke-width="' + hair + '"/>');

      var unit = item
        ? houseName + '  ·  Nº ' + pad(edition == null ? 1 : edition) + '  ·  ' + letters(item).join('') + '  ·  '
        : houseName + '  ·  ' + motto + '  ·  EST. ' + FOUNDED + '  ·  ';
      // Repeat the legend until it roughly fills the ring, then let
      // textLength close the last small gap so the spacing stays even.
      var label = unit;
      while (label.length + unit.length <= 60) label += unit;
      // Full circle path starting at the top so text begins at 12 o'clock.
      var r = R_TEXT;
      parts.push('<defs><path id="' + id + '-ring" d="M0 ' + (-r) + ' A' + r + ' ' + r + ' 0 1 1 0 ' + r + ' A' + r + ' ' + r + ' 0 1 1 0 ' + (-r) + '"/></defs>');
      parts.push('<text font-family="' + escapeXml(fontFamily) + '" font-size="8.2" letter-spacing="2.2" fill="' + ink + '" dominant-baseline="middle">' +
        '<textPath href="#' + id + '-ring" startOffset="0" textLength="' + f(2 * Math.PI * r - 4) + '" lengthAdjust="spacing">' + escapeXml(label) + '</textPath></text>');
    }

    // Tick ring: 26 positions, the letters in play are drawn long and gilded.
    var ticks = '';
    var dots = '';
    for (var i = 0; i < 26; i++) {
      var ch = String.fromCharCode(65 + i);
      var a = angleOf(ch);
      var inner = used[ch] ? R_TICK_LONG : R_TICK_IN;
      var p1 = polar(inner, a), p2 = polar(R_TICK_OUT, a);
      ticks += '<line x1="' + f(p1[0]) + '" y1="' + f(p1[1]) + '" x2="' + f(p2[0]) + '" y2="' + f(p2[1]) +
        '" stroke="' + (used[ch] ? metal : ink) + '" stroke-width="' + (used[ch] ? hair * 2 : hair) + '"/>';
      var w = polar(R_WHEEL, a);
      dots += '<circle cx="' + f(w[0]) + '" cy="' + f(w[1]) + '" r="' + (used[ch] ? 1.25 : 0.6) + '" fill="' + (used[ch] ? metal : ink) + '" opacity="' + (used[ch] ? 1 : 0.45) + '"/>';
    }
    parts.push(ticks);
    parts.push('<circle cx="0" cy="0" r="' + R_INNER + '" fill="none" stroke="' + ink + '" stroke-width="' + hair + '"/>');
    parts.push(dots);

    var sw = variant === 'mark' ? 2.4 : 1.9;
    if (item) {
      parts.push('<path class="vs-house" d="' + namePath(house, 0.28) + '" fill="none" stroke="' + ink + '" stroke-width="' + hair * 1.4 + '" stroke-linecap="round" stroke-linejoin="round" opacity="0.35" pathLength="1"/>');
      parts.push('<path class="vs-name" d="' + namePath(piece, 0.28) + '" fill="none" stroke="' + metal + '" stroke-width="' + sw + '" stroke-linecap="round" stroke-linejoin="round" pathLength="1"/>');
      parts.push('<g class="vs-term">' + terminals(piece, metal, sw * 0.8) + '</g>');
    } else {
      parts.push('<path class="vs-name" d="' + namePath(house, 0.28) + '" fill="none" stroke="' + ink + '" stroke-width="' + sw + '" stroke-linecap="round" stroke-linejoin="round" pathLength="1"/>');
      parts.push('<g class="vs-term">' + terminals(house, ink, sw * 0.8) + '</g>');
    }

    var attrs = 'xmlns="http://www.w3.org/2000/svg" viewBox="-100 -100 200 200"';
    if (size) attrs += ' width="' + size + '" height="' + size + '"';
    var title = item ? houseName + ' seal, Nº ' + pad(edition == null ? 1 : edition) + ', ' + item : houseName + ' house seal';
    return '<svg ' + attrs + ' role="img" aria-label="' + escapeXml(title) + '"><title>' + escapeXml(title) + '</title>' + parts.join('') + '</svg>';
  }

  var api = { svg: svg, points: points, path: namePath, stepOf: stepOf, KEY: KEY, letters: letters, pad: pad, HOUSE: HOUSE, MOTTO: MOTTO };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  root.VeshiroSeal = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
