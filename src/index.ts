import fs from 'fs';
import path from 'path';
import { mdToHtml, htmlToPdf } from './converter';

async function main(): Promise<void> {
  const mdPath = process.argv[2] || path.join('..', '..', 'my-resume', '2026-02-25-resume.md');
  const outPath = process.argv[3] || 'resume.pdf';
  const cssPath = path.join(__dirname, '..', 'templates', 'print.css');

  if (!fs.existsSync(mdPath)) {
    console.error('Markdown file not found:', mdPath);
    process.exit(1);
  }

  const md = fs.readFileSync(mdPath, 'utf8');
  const html = await mdToHtml(md, { title: 'Geraldine Berry' });
  const css = fs.existsSync(cssPath) ? fs.readFileSync(cssPath, 'utf8') : '';

  if (outPath.endsWith('.html')) {
    fs.writeFileSync(
      outPath,
      `<!doctype html><html><head><meta charset="utf-8"><style>${css}</style></head><body>${html}</body></html>`
    );
    console.log('Wrote HTML to', outPath);
    return;
  }

  await htmlToPdf(html, css, outPath);
  console.log('Wrote PDF to', outPath);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
