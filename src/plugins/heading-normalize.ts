import type { Plugin } from 'unified';
import type { Root, Heading } from 'mdast';
import { visit } from 'unist-util-visit';
import path from 'path';

export interface HeadingNormalizeOptions {
  title?: string;
}

// Plugin<[Options?]> (no Root generic) keeps `tree` typed as the generic unist Node,
// which satisfies unist-util-visit's Node<Data> constraint. mdast Root's RootData
// lacks an index signature in @types/mdast@4, causing incompatibility with visit.
export const headingNormalizePlugin: Plugin<[HeadingNormalizeOptions?]> = (options = {}) => {
  return (tree, file) => {
    const root = tree as unknown as Root;
    let sawH1 = false;
    visit(tree, 'heading', (node) => {
      const heading = node as unknown as Heading;
      if (!sawH1 && heading.depth === 1) sawH1 = true;
      if (heading.depth > 3) heading.depth = 3;
      if (!sawH1 && heading.depth !== 1) {
        // promote the first found heading to H1
        heading.depth = 1;
        sawH1 = true;
      }
    });
    if (!sawH1) {
      const title =
        options.title ||
        (file && file.path ? path.basename(file.path, path.extname(file.path)) : 'Resume');
      root.children.unshift({
        type: 'heading',
        depth: 1,
        children: [{ type: 'text', value: String(title) }],
      });
    }
  };
};

export default headingNormalizePlugin;
