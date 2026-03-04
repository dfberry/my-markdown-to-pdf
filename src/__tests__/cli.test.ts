import { spawnSync } from 'child_process';
import path from 'path';
import { describe, it, expect } from 'vitest';

const node = process.execPath;
const cwd = path.resolve(__dirname, '..', '..');

describe('CLI', () => {
  it('prints usage and exits 2 when no args are given', () => {
    const r = spawnSync(node, ['-r', 'ts-node/register', 'src/index.ts'], { cwd, encoding: 'utf8' });
    expect(r.status).toBe(2);
    expect(r.stderr).toContain('Usage:');
  });

  it('errors when the Markdown file is missing and exits 1', () => {
    const r = spawnSync(node, ['-r', 'ts-node/register', 'src/index.ts', 'nonexistent.md'], { cwd, encoding: 'utf8' });
    expect(r.status).toBe(1);
    expect(r.stderr).toContain('Markdown file not found');
  });
});
