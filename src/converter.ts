import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeFormat from 'rehype-format';
import rehypeStringify from 'rehype-stringify';
import puppeteer from 'puppeteer';
import type { Browser } from 'puppeteer';
import * as fs from 'fs';
import { headingNormalizePlugin } from './plugins/heading-normalize';

export async function mdToHtml(md: string, opts: { title?: string } = {}): Promise<string> {
  const vfile = await unified()
    .use(remarkParse)
    .use(headingNormalizePlugin, { title: opts.title })
    .use(remarkRehype)
    .use(rehypeFormat)
    .use(rehypeStringify)
    .process(md);
  return String(vfile);
}

const CHROME_CANDIDATE_PATHS = [
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/Applications/Chromium.app/Contents/MacOS/Chromium',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium-browser',
];

export function resolveChromePath(): string | undefined {
  if (process.env.PUPPETEER_EXECUTABLE_PATH) {
    return process.env.PUPPETEER_EXECUTABLE_PATH;
  }
  return CHROME_CANDIDATE_PATHS.find(p => fs.existsSync(p));
}

export async function htmlToPdf(html: string, css: string, outPath: string): Promise<void> {
  const execPath = resolveChromePath();
  console.error('Using Chrome:', execPath ?? 'puppeteer bundled');

  const launchOpts: any = {
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
    ...(execPath ? { executablePath: execPath } : {}),
  };

  let browser: Browser | undefined;
  try {
    browser = await puppeteer.launch(launchOpts);
  } catch (err) {
    console.error('Failed to launch Puppeteer. Try setting PUPPETEER_EXECUTABLE_PATH to a Chrome/Chromium binary or reinstalling puppeteer.');
    console.error(err);
    throw err;
  }

  try {
    const page = await browser.newPage();
    await page.setContent(
      `<!doctype html><html><head><meta charset="utf-8"><style>${css}</style></head><body>${html}</body></html>`,
      { waitUntil: 'networkidle0' }
    );
    await page.pdf({
      path: outPath,
      format: 'A4',
      printBackground: true,
      margin: { top: '6mm', bottom: '6mm', left: '5mm', right: '5mm' },
    });
  } catch (err) {
    console.error('Error while rendering PDF with Puppeteer:');
    console.error(err);
    throw err;
  } finally {
    if (browser) {
      await browser.close().catch(() => {});
    }
  }
}
