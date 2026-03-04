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

- The default input used previously was `../../my-resume/2026-02-25-resume.md`.

Usage (pass path relative to project root)

```bash
# Build and run the compiled app
npm run build
npm run start -- resumes/2026-02-25-resume.md resume.pdf

# Or use the ts-node wrappers (no build required)
npm run pdf -- resumes/2026-02-25-resume.md resume.pdf
npm run html -- resumes/2026-02-25-resume.md out.html
```

Notes

- All resume paths are relative to the project root (the folder containing [package.json](package.json)).
- The first argument is the input Markdown file; the second argument is the output filename (PDF or HTML).
