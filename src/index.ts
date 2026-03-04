import fs from 'fs';
import path from 'path';
import { mdToHtml, htmlToPdf } from './converter';

async function main(): Promise<void> {
  const argIn = process.argv[2];
  const argOut = process.argv[3];

  if (!argIn || argIn === '-h' || argIn === '--help') {
    console.error('Usage: npm run pdf -- <resume.md> [out.pdf]');
    process.exit(2);
  }

  const mdPath = path.resolve(process.cwd(), argIn);
  const outPath = path.resolve(process.cwd(), argOut || 'resume.pdf');
  const cssPath = path.resolve(process.cwd(), 'templates', 'print.css');

  if (!fs.existsSync(mdPath)) {
    console.error('Markdown file not found:', mdPath);
    process.exit(1);
  }

  const md = fs.readFileSync(mdPath, 'utf8');
  const title = path.basename(mdPath, path.extname(mdPath));
  const html = await mdToHtml(md, { title });
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
