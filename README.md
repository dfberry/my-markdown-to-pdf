# Resume PDF Generator

Convert Markdown resumes to PDF or HTML with clean, professional styling.

## Prerequisites

- Node.js (LTS) and `npm` installed
- Chrome or Chromium (required by Puppeteer for PDF generation)

## Installation

```bash
npm install
```

## Usage

You **must** provide two arguments: the input Markdown file and the output filename. The output format is determined by the file extension (`.pdf` or `.html`).

Always use `--` to separate npm arguments from script arguments:

```bash
# Generate PDF
npm run pdf -- resumes/my-resume.md resume.pdf

# Generate HTML
npm run html -- resumes/my-resume.md resume.html
```

Both `npm run pdf` and `npm run html` run the same TypeScript script (`ts-node src/index.ts`). The output format depends entirely on the file extension you provide.

### Alternative: Run the compiled version

```bash
npm run build
npm run start -- resumes/my-resume.md resume.pdf
```

## Notes

- **Resume location**: Add your Markdown resume files to the `resumes/` directory (this directory is gitignored for privacy).
- **Paths are relative to the project root** (the folder containing `package.json`).
- **Required arguments**: First argument = input Markdown file, second argument = output filename.
- **Output format**: Use `.pdf` extension for PDF or `.html` extension for HTML output.

## Architecture

- **Entry point**: [src/index.ts](src/index.ts) — parses CLI args, reads Markdown and CSS, handles output format selection.
- **Markdown → HTML**: `mdToHtml()` in [src/converter.ts](src/converter.ts) — uses `unified`, `remark-parse`, `remark-rehype`, `rehype-format`, `rehype-stringify`, and a heading normalization plugin to ensure consistent structure.
- **HTML → PDF**: `htmlToPdf()` in [src/converter.ts](src/converter.ts) — renders full HTML with inline CSS from `templates/print.css` and converts to PDF using Puppeteer (headless browser). Supports `PUPPETEER_EXECUTABLE_PATH` environment variable to use a local Chrome/Chromium binary.
- **Styling**: Centralized in `templates/print.css` — designed to be minimal and maintainable for easy customization.
