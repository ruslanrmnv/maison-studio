# Fonts

Self-hosted and subset. Together they are the largest thing on the page after
the photographs, so both were cut down to what this site actually renders.

| file | full | here |
|---|---|---|
| general-sans-400/500/600/700 | 23 KB each | ~11 KB each |
| bodoni-moda-italic-latin | 54 KB | 30 KB |
| bodoni-moda-italic-latin-ext | 28 KB | 18 KB |

The page loads five of the six — the latin-ext cut stays off the wire until a
character in its `unicode-range` appears. **144 KB → 74 KB** on the wire.

## Where the originals come from

- **General Sans** — [Fontshare](https://www.fontshare.com/fonts/general-sans),
  static weights 400/500/600/700.
- **Bodoni Moda** — [Google Fonts](https://fonts.google.com/specimen/Bodoni+Moda),
  italic, variable across `wght` and `opsz`, split latin / latin-ext the way
  Google's own stylesheet splits it.

The originals are not kept in this repo. Re-download them before regenerating.

## How they were cut

Two separate reductions, and the second is the one that mattered for Bodoni:

**Glyphs.** `subset-chars.txt` in the repo root holds the set: every character
in `index.html`, `main.js` and `styles.css` (including `\XXXX` escapes, which
are not literal characters in the file and are missed by a naive pass), plus
all printable ASCII and Latin-1 accented letters so a later copy edit can write
*café* without hitting a missing glyph.

**Axes.** Bodoni Moda ships `wght 400–900` and `opsz 6–96`, and 60 KB of its
54 KB was the `gvar` variation table. The stylesheet only ever sets weight 400
and 500, and the smallest serif on the page is 18.4px — about 13.8pt — so
neither the heavy weights nor the small optical sizes were reachable. Trimming
to `wght=400:500 opsz=12:96` took the file from 45 KB to 30 KB on top of what
glyph subsetting alone achieved. The optical-size axis is kept, not pinned:
it is what keeps a Bodoni headline from looking like Bodoni body copy.

```bash
pip install fonttools brotli

# Bodoni: trim the axes first, then the glyphs.
python -m fontTools.varLib.instancer bodoni-moda-italic-latin.woff2 \
  wght=400:500 opsz=12:96 -o tmp.ttf
python -m fontTools.subset tmp.ttf --text-file=../../subset-chars.txt \
  --flavor=woff2 --with-zopfli \
  --layout-features='kern,liga,clig,calt,onum,tnum,frac' \
  --output-file=bodoni-moda-italic-latin.woff2

# General Sans: static already, so glyphs only.
python -m fontTools.subset general-sans-400.woff2 \
  --text-file=../../subset-chars.txt --flavor=woff2 --with-zopfli \
  --layout-features='kern,liga,clig,calt,onum,tnum,frac,ss01,ss02' \
  --output-file=general-sans-400.woff2
```

The latin-ext cut is subset by `--unicodes=` to its own range instead of the
page's text — subsetting it to today's copy would produce an empty file and
silently remove the accented fallback.

## One thing that is not a regression

The `→` in the copy renders from a system fallback and always has: none of
these fonts ever carried U+2192. Worth knowing before someone blames the
subset for it.
