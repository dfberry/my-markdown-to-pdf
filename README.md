# Markdown-to-PDF Template

A production-ready template for converting Markdown documents to PDF with professional styling—plus an optional AI team for collaborative document refinement and project customization.

## What You Get

This template is **two things in one**:

1. **PDF/HTML Generator** — Convert Markdown to PDF or HTML with clean, professional styling. Control all design via CSS.
2. **Squad AI Team** (optional) — An AI-powered team configured for resume/document workflows. Customize or replace the team roster for your domain.

Fork this repo, configure your name and content, and you're ready to generate PDFs—with or without AI assistance.

---

## Prerequisites

- **Node.js** LTS or later
- **npm**
- **Chrome or Chromium** (required by Puppeteer for PDF generation)

---

## Quick Start

### 1. Fork or Clone This Template

```bash
git clone https://github.com/YOUR-USERNAME/resume-pdf.git
cd resume-pdf
npm install
```

### 2. Update the Document Title

Edit `src/index.ts` line 16 and change the hardcoded title to your name:

```typescript
// Before:
{ title: 'Bob Smith' }

// After:
{ title: 'Your Name Here' }
```

This becomes the HTML `<title>` in your generated PDFs.

### 3. Add Your Markdown Document

Create your document in the `resumes/` directory (this folder is gitignored):

```bash
# Example:
cat > resumes/my-document.md << 'EOF'
# Your Name
your@email.com | yourwebsite.com

## Experience
...
EOF
```

### 4. Generate PDF or HTML

```bash
# Generate PDF
npm run pdf -- resumes/my-document.md output.pdf

# Generate HTML (for preview)
npm run html -- resumes/my-document.md output.html
```

**⚠️ Note:** The `--` is required to pass arguments through npm.

---

## Customize the PDF Generator

### Change the Title

**File:** `src/index.ts` line 16

```typescript
{ title: 'Your Name' }
```

This becomes the `<title>` tag in the rendered HTML/PDF.

### Adjust Styling

All styling lives in one file: **`templates/print.css`**

Common tweaks:
- **Fonts**: Change `font-family` declarations
- **Margins**: Adjust `margin` and `padding`
- **Colors**: Update `color` and `background-color`
- **Spacing**: Modify `line-height` and gaps

Example:

```css
body {
  font-family: 'Segoe UI', Tahoma, Geneva, sans-serif;
  margin: 0.5in;
  line-height: 1.6;
  color: #333;
}
```

### Use the Compiled Version

For production or CI/CD pipelines:

```bash
npm run build
npm run start -- resumes/my-document.md output.pdf
```

---

## Customize the Squad AI Team (Optional)

Squad is an AI team framework that helps you refine documents and collaborate. It's **entirely optional**—the PDF generator works without it.

### What Is Squad?

The `.squad/` directory contains:
- **`.squad/team.md`** — Team roster and project context
- **`.squad/agents/{name}/charter.md`** — Each agent's role and boundaries

The default team (Deckard, Roy, Pris, Rachael) is tuned for resume workflows.

### Option A: Customize for Your Project

1. **Update the project context:**

   Edit `.squad/team.md` and change the `User:` field to your GitHub username and update `Project Context:`:

   ```markdown
   User: your-github-username
   Project Context: My technical documents (resumes, portfolios, cover letters)
   ```

2. **Customize agent roles:**

   Edit `.squad/agents/*/charter.md` to define roles for your domain. For example:
   - Deckard: Oversees the overall document pipeline
   - Roy: Handles TypeScript/code styling
   - Pris: Reviews for audience-specific clarity
   - Rachael: Tests output quality

3. **Use the team in GitHub Copilot CLI:**

   Open the Copilot CLI chat (terminal or VS Code) and talk to your team naturally:
   ```
   Deckard, what's the overall pipeline doing?
   Team, review my latest resume draft
   ```

### Option B: Start Fresh

If your project is very different, delete `.squad/` entirely. GitHub Copilot CLI will propose a new team tailored to your domain when you first use it.

```bash
rm -rf .squad
```

### How to Talk to the Team

Squad runs through **GitHub Copilot CLI** (the chat interface in your terminal or VS Code). You type naturally — Squad routes your message to the right agent(s) automatically.

**Direct a specific agent:**
```
Deckard, review my resume structure and suggest improvements
Roy, the PDF is cutting off the last section — fix the page margins
Pris, does my resume pass ATS keyword scanning for a senior engineering role?
Rachael, run the PDF generator against my latest draft and report any issues
```

**Ask the whole team:**
```
Team, I just updated my work history section — review it for clarity, ATS compatibility, and layout
```
Squad fans out to relevant agents in parallel and assembles the results.

**Give a directive the team should always follow:**
```
Always keep the resume to one page
Never remove contact links from the header
From now on, use 0.5in margins
```
Squad captures these as persistent decisions — agents respect them in all future work.

**Check in on status or recent work:**
```
What did the team do last session?
What decisions have we made so far?
Where are we?
```

**What actually happens:** You type in Copilot CLI → Squad (coordinator) reads your message → spawns the right agent(s) as background tasks → collects results → presents a summary. You never interact with agents directly; Squad handles all routing.

---

## Usage Guide

### Command Reference

**Generate a PDF:**
```bash
npm run pdf -- resumes/my-resume.md resume.pdf
```

**Generate HTML (for browser preview):**
```bash
npm run html -- resumes/my-resume.md resume.html
```

Both commands run the same TypeScript script (`ts-node src/index.ts`). The output format depends on the file extension you provide.

### Accepted File Extensions

- `.pdf` → Renders as PDF
- `.html` → Renders as HTML

### Markdown Syntax

Use standard Markdown:
- `# Heading 1`, `## Heading 2`, etc.
- `**bold**`, `*italic*`
- `[links](https://example.com)`
- Lists, code blocks, etc.

All styling is controlled via `templates/print.css`, so you can customize appearance without touching Markdown.

---

## Architecture

For contributors or those curious about how it works:

- **Entry point**: [src/index.ts](src/index.ts)
  - Parses CLI arguments
  - Reads Markdown file and CSS template
  - Routes to PDF or HTML output based on file extension

- **Markdown → HTML**: `mdToHtml()` in [src/converter.ts](src/converter.ts)
  - Uses `unified` + `remark` plugins to parse and normalize Markdown
  - Outputs semantic HTML with consistent structure

- **HTML → PDF**: `htmlToPdf()` in [src/converter.ts](src/converter.ts)
  - Uses Puppeteer (headless Chrome) to render HTML
  - Inlines CSS from `templates/print.css`
  - Supports `PUPPETEER_EXECUTABLE_PATH` env var for custom Chrome paths

- **Styling**: [templates/print.css](templates/print.css)
  - Print-optimized CSS (no screen media queries needed)
  - Designed for single-page or multi-page documents
  - Easily customizable

---

## Troubleshooting

### PDF fails to generate

**Problem:** `Puppeteer couldn't find Chromium`

**Solution:** Install Chrome/Chromium or set `PUPPETEER_EXECUTABLE_PATH`:

```bash
# macOS with Homebrew
brew install chromium

# Then set environment variable
export PUPPETEER_EXECUTABLE_PATH=/path/to/chromium
npm run pdf -- resumes/my-document.md output.pdf
```

### Arguments not passed correctly

**Problem:** `Error: missing required arguments`

**Solution:** Use `--` to separate npm from script arguments:

```bash
# ❌ Wrong
npm run pdf resumes/my-resume.md resume.pdf

# ✅ Correct
npm run pdf -- resumes/my-resume.md resume.pdf
```

### File not found

**Problem:** `Cannot find resumes/my-resume.md`

**Solution:** Ensure the file exists and paths are relative to the project root (where `package.json` is):

```bash
ls resumes/my-resume.md  # Verify file exists
npm run pdf -- resumes/my-resume.md output.pdf
```

---

## License

[Add your license here if desired]
