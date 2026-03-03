Resume PDF generator (Markdown → clean HTML → PDF)

Quick start

1. From this directory install dependencies:

```bash
npm install
```

2. Generate PDF (reads your local resume):

```bash
npm run pdf
```

3. During development, generate HTML to preview styling:

```bash
npm run html
# opens out.html in your browser to iterate quickly
```

Notes

- The script `render-pdf.js` uses a small AST transform to ensure a top-level H1 and normalizes heading depth; add more remark/rehype plugins there to tune structure (callouts, code captions, etc.).
- Styling is centralized in `templates/print.css` and intentionally minimal for maintainability.
- The default input is `../../my-resume/2026-02-25-resume.md` relative to this project; pass a custom path as the first argument and an output filename as the second.

Example:

```bash
node render-pdf.js ../../my-resume/2026-02-25-resume.md my-resume.pdf
```
