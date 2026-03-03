#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { unified } = require('unified');
const remarkParse = require('remark-parse');
const remarkRehype = require('remark-rehype');
const rehypeStringify = require('rehype-stringify');
const rehypeFormat = require('rehype-format');
const puppeteer = require('puppeteer');
const visit = require('unist-util-visit');

// Small remark plugin: ensure there's a top-level H1 and limit heading depth to 3
function remarkHeadingNormalize(options = {}) {
  return (tree, file) => {
    let sawH1 = false;
    visit(tree, 'heading', node => {
      if (!sawH1 && node.depth === 1) sawH1 = true;
      if (node.depth > 3) node.depth = 3;
      if (!sawH1 && node.depth !== 1 && !sawH1) {
        // promote the first found heading to H1
        node.depth = 1;
        sawH1 = true;
      }
    });
    if (!sawH1) {
      const title = options.title || (file && file.path ? path.basename(file.path, path.extname(file.path)) : 'Resume');
      tree.children.unshift({ type: 'heading', depth: 1, children: [{ type: 'text', value: String(title) }] });
    }
  };
}

async function mdToHtml(md, opts = {}) {
  const vfile = await unified()
    .use(remarkParse)
    .use(remarkHeadingNormalize, { title: opts.title })
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeFormat)
    .use(rehypeStringify, { allowDangerousHtml: true })
    .process(md);
  return String(vfile);
}

async function htmlToPdf(html, css, outPath) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setContent(`<!doctype html><html><head><meta charset="utf-8"><style>${css}</style></head><body>${html}</body></html>`, { waitUntil: 'networkidle0' });
  await page.pdf({ path: outPath, format: 'A4', printBackground: true, margin: { top: '20mm', bottom: '20mm', left: '15mm', right: '15mm' } });
  await browser.close();
}

async function main() {
  const mdPath = process.argv[2] || path.join('..', '..', 'my-resume', '2026-02-25-resume.md');
  const outPath = process.argv[3] || 'resume.pdf';
  const cssPath = path.join(__dirname, 'templates', 'print.css');

  if (!fs.existsSync(mdPath)) {
    console.error('Markdown file not found:', mdPath);
    process.exit(1);
  }

  const md = fs.readFileSync(mdPath, 'utf8');
  const html = await mdToHtml(md, { title: 'Geraldine Berry' });
  const css = fs.existsSync(cssPath) ? fs.readFileSync(cssPath, 'utf8') : '';

  if (outPath.endsWith('.html')) {
    fs.writeFileSync(outPath, `<!doctype html><html><head><meta charset="utf-8"><style>${css}</style></head><body>${html}</body></html>`);
    console.log('Wrote HTML to', outPath);
    return;
  }

  await htmlToPdf(html, css, outPath);
  console.log('Wrote PDF to', outPath);
}

main().catch(err => { console.error(err); process.exit(1); });
