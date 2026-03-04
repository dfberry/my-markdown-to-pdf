# Decisions

## Active Decisions

| Date | Decision | Why | By |
|------|----------|-----|----|
| 2026-03-03 | AST processing is the primary pipeline; layout transformations must happen at AST level before HTML serialization | Ensures ATS compatibility and testability | {contributor} |
| 2026-03-03 | Single-page consolidation is a post-AST optimization; shrink font/margins via CSS before truncating content | Preserve content integrity | {contributor} |
| 2026-03-03 | TypeScript is the target language for all new code | contributor requirement | {contributor} |
| 2026-03-03 | Use **CommonJS** as TypeScript module format; do NOT add `"type": "module"` to package.json | Existing unified/remark/rehype (v10–v11) and puppeteer (v21) are CJS-compatible; defer ESM migration | Deckard |
| 2026-03-03 | **LAYOUT CONSOLIDATION VIA CSS OPTIMIZATION** — 3-page resume reduced to 2 pages | H3 hierarchy fix + font/line-height reduction + margin tightening achieves 25-30% space savings without content loss. Implementation: 10pt body font, 1.25 line-height, 12/12/10/10mm margins, explicit 10pt h3 rule. Verified by Roy: PDF renders cleanly, page count reduced 3→2. | Pris & Roy |

| Date | Decision | Rationale | By |
|------|----------|-----------|-----|
| 2026-03-03 | **KEEP CURRENT PIPELINE** — unified/remark/rehype + Puppeteer for md-to-PDF | AST-first processing is non-negotiable for ATS transforms. Evaluated md-to-pdf (v5.2.5 active, uses Marked—opaque parser, no AST plugin hooks), markdown-pdf (v9.0.0 stale, uses PhantomJS—deprecated), markdown-it-pdf (browser component, irrelevant). Our pipeline: ~200 LoC, type-safe, extensible via remark plugins. Switching to md-to-pdf requires forking Marked to expose AST, eliminating packaging benefit. | Deckard |
| 2026-03-03 | **Puppeteer v21 Chrome auto-detect with fallback chain** | ARM64 macOS crashes without explicit executablePath. Implemented `resolveChromePath()` helper: env var → `/Applications/Google Chrome.app/...` (macOS) → `/usr/bin/google-chrome` (Linux) → Puppeteer bundled. Updated `htmlToPdf()` with `headless: 'new'`, preserved `--disable-dev-shm-usage`. Pipeline verified: 39KB PDF output. | Roy |

## Pending Decisions (Inbox)

### mdast/unist-util-visit Type Compatibility

**Issue:** @types/mdast@4 `Root` type lacks index signature required by unist-util-visit@4. Current workaround uses generic Node casts in `src/plugins/heading-normalize.ts`.

**Options:**
1. Pin @types/mdast to ^3.0.15 (older, CJS-compatible, may have better visit@4 compat)
2. Upgrade unist-util-visit to ^5 (ESM-only — conflicts with CJS module decision)
3. Accept the casts with `// ts-expect-error` comments for clarity

**Status:** Needs Deckard/Roy decision

**Filed by:** Roy (2026-03-03T19:55:38Z)

---

### Test Import Path Resolution

**Issue:** Rachael's tests in `src/__tests__/` use `../../converter` which resolves to project root, not src/. Correct relative path is `../converter`.

**Options:**
1. Fix import paths to `../converter` and `../plugins/heading-normalize`
2. Restructure tests to live at project root `__tests__/`

**Status:** Vitest runtime will fail on current paths; needs decision before test execution

**Filed by:** Roy (2026-03-03T19:55:38Z)

---

### Dual unified Installs

**Issue:** remark-rehype@11.1.2 ships unified@11.0.5 internally; package.json pins unified@10.1.2. Type checking passes (skipLibCheck), but potential runtime concern.

**Status:** Low priority; flagging for awareness

**Filed by:** Roy (2026-03-03T19:55:38Z)
