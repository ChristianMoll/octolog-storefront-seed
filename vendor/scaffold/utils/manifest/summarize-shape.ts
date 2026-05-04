// Summarise a story-arg AST node when its source text is too long to inline
// verbatim in the catalog example. Agents can pattern-match a key shape much
// better than a "see source" placeholder.

import { Node, SyntaxKind } from 'ts-morph';

export const EXAMPLE_INLINE_LIMIT = 600;

export function summarizeShape(node: Node): string {
  if (node.isKind(SyntaxKind.ArrayLiteralExpression)) {
    const arr = node.asKindOrThrow(SyntaxKind.ArrayLiteralExpression);
    const elements = arr.getElements();
    if (elements.length === 0) return '[]';
    const first = summarizeShape(elements[0]);
    const more = elements.length > 1 ? `, /* ...${elements.length - 1} more */` : '';
    return `[${first}${more}]`;
  }
  if (node.isKind(SyntaxKind.ObjectLiteralExpression)) {
    const obj = node.asKindOrThrow(SyntaxKind.ObjectLiteralExpression);
    const keys: string[] = [];
    for (const prop of obj.getProperties()) {
      if (prop.isKind(SyntaxKind.PropertyAssignment)) {
        keys.push(prop.asKindOrThrow(SyntaxKind.PropertyAssignment).getName());
      } else if (prop.isKind(SyntaxKind.ShorthandPropertyAssignment)) {
        keys.push(prop.asKindOrThrow(SyntaxKind.ShorthandPropertyAssignment).getName());
      }
    }
    return keys.length > 0 ? `{ ${keys.join(', ')} }` : '{}';
  }
  if (
    node.isKind(SyntaxKind.StringLiteral) ||
    node.isKind(SyntaxKind.NoSubstitutionTemplateLiteral) ||
    node.isKind(SyntaxKind.NumericLiteral) ||
    node.isKind(SyntaxKind.TrueKeyword) ||
    node.isKind(SyntaxKind.FalseKeyword) ||
    node.isKind(SyntaxKind.NullKeyword) ||
    node.isKind(SyntaxKind.Identifier)
  ) {
    return node.getText();
  }
  const text = node.getText();
  return text.length > 60 ? `${text.slice(0, 50).trim()}…` : text;
}
