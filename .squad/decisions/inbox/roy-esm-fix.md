# Decision: Replace ts-node with tsx for ESM Compatibility

**Date:** 2026-03-04  
**Filed by:** Roy  
**Status:** Implemented

## Context

The unified/remark/rehype ecosystem is ESM-only. Using `ts-node/register` (which loads modules in CommonJS mode) caused ERR_REQUIRE_ESM errors in CLI tests when spawning TypeScript files.

## Decision

Replace ts-node with tsx throughout the project:
- Package scripts: `ts-node src/index.ts` → `tsx src/index.ts`
- CLI test spawns: `node -r ts-node/register` → `npx tsx`
- Dependencies: Remove ts-node, add tsx@^4.0.0

## Rationale

- **tsx** is a modern TypeScript runner that properly handles ESM modules
- Faster than ts-node, better ESM compatibility
- No need to maintain both tools - tsx covers all use cases
- Aligns with project's ESM dependencies (unified, remark, rehype)

## Impact

- ✅ CLI tests now pass (ERR_REQUIRE_ESM resolved)
- ✅ Simpler dependency tree (one TS runner instead of two)
- ✅ All existing scripts continue to work with minimal changes
- No breaking changes to user workflows

## Implementation

Committed in: `229c2b5` - "fix: correct test import paths and replace ts-node with tsx for ESM compatibility"
