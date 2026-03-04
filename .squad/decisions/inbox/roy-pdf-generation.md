# PDF Generation Invocation Pattern

**Filed by:** Roy  
**Date:** 2026-03-04  
**Context:** Generating a dated PDF from a dated markdown resume copy.

## Decision

The standard invocation for the PDF pipeline is:

```
npm run pdf -- <input.md> <output.pdf>
```

The `--` separator is **required** to pass positional args through npm to `ts-node src/index.ts`. Without it, npm swallows the arguments.

`src/index.ts` reads `process.argv[2]` (input md path) and `process.argv[3]` (output path). Defaults fall back to `../../my-resume/2026-02-25-resume.md` and `resume.pdf` respectively.

## Rationale

Needed a clear, documented invocation pattern so future dated-resume generation (e.g., `2026-03-11`, `2026-04-01`) can be done without re-reading the source each time.

## Verified

- `resumes/2026-03-04-resume.md` — 6.1KB ✓  
- `resumes/2026-03-04-resume.pdf` — 235KB ✓  
- Chrome: `/Applications/Google Chrome.app/Contents/MacOS/Google Chrome` (auto-detected) ✓
