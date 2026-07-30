/**
 * Minimal markdown-to-HTML renderer for curriculum lesson content.
 * Uses no external dependencies — relies only on Next.js / React.
 *
 * Handles: headings, bold/italic, inline code, code blocks, tables,
 * horizontal rules, unordered lists, ordered lists, blockquotes,
 * checkbox lists, and paragraphs.
 */

export function renderMarkdown(markdown: string): string {
  let html = markdown
    // Code blocks (must come before inline code)
    .replace(/```[\w]*\n?([\s\S]*?)```/g, (_m, code: string) => {
      const escaped = escapeHtml(code.trim());
      return `<pre class="bg-slate-800 rounded-xl p-4 overflow-x-auto my-4 text-sm text-slate-200 leading-relaxed"><code>${escaped}</code></pre>`;
    })
    // Horizontal rules
    .replace(/^---$/gm, "<hr class=\"border-slate-700 my-6\" />")
    // H3
    .replace(/^### (.+)$/gm, (_, t: string) => `<h3 class="text-lg font-black mt-6 mb-2 text-white">${inlineMarkdown(t)}</h3>`)
    // H2
    .replace(/^## (.+)$/gm, (_, t: string) => `<h2 class="text-xl font-black mt-8 mb-3 text-yellow-400 border-b border-slate-700 pb-2">${inlineMarkdown(t)}</h2>`)
    // H1
    .replace(/^# (.+)$/gm, (_, t: string) => `<h1 class="text-2xl font-black mt-8 mb-3 text-white">${inlineMarkdown(t)}</h1>`)
    // Blockquotes
    .replace(/^> (.+)$/gm, (_, t: string) => `<blockquote class="border-l-4 border-yellow-400 pl-4 italic text-slate-300 my-3">${inlineMarkdown(t)}</blockquote>`)
    // Tables
    .replace(/((?:^\|.+\|\s*\n)+)/gm, (tableBlock: string) => renderTable(tableBlock))
    // Unordered lists (bullet)
    .replace(/((?:^- .+\n?)+)/gm, (listBlock: string) => renderUnorderedList(listBlock))
    // Ordered lists
    .replace(/((?:^\d+\. .+\n?)+)/gm, (listBlock: string) => renderOrderedList(listBlock))
    // Checkbox lists inside paragraphs — handle lines like "- [ ] text" or "- [x] text"
    // Already handled by unordered list but let's fix checkbox rendering
    // Paragraphs — wrap lines not already wrapped
    .split(/\n\n+/)
    .map((block: string) => {
      const trimmed = block.trim();
      if (!trimmed) return "";
      // Already an HTML tag
      if (trimmed.startsWith("<")) return trimmed;
      // Convert remaining plain lines to paragraph
      return `<p class="my-3 text-slate-200 leading-relaxed">${inlineMarkdown(trimmed.replace(/\n/g, " "))}</p>`;
    })
    .join("\n");

  // Fix checkbox items
  html = html.replace(/<li>(- \[x\] |[\u2611])(.*?)<\/li>/g, '<li class="flex items-start gap-2"><span class="text-green-400 flex-shrink-0 mt-0.5">☑</span><span>$2</span></li>');
  html = html.replace(/<li>(- \[ \] )(.*?)<\/li>/g, '<li class="flex items-start gap-2"><span class="text-slate-500 flex-shrink-0 mt-0.5">☐</span><span>$2</span></li>');

  return html;
}

function inlineMarkdown(text: string): string {
  return text
    // Inline code — escape content to prevent HTML injection
    .replace(/`([^`]+)`/g, (_m, code: string) => `<code class="bg-slate-700 text-yellow-300 rounded px-1.5 py-0.5 text-sm font-mono">${escapeHtml(code)}</code>`)
    // Bold
    .replace(/\*\*(.+?)\*\*/g, '<strong class="font-bold text-white">$1</strong>')
    // Italic
    .replace(/\*(.+?)\*/g, '<em class="italic text-slate-200">$1</em>')
    // Links — sanitize href to prevent javascript: and data: URIs
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_m, label: string, href: string) => {
      const safehref = /^https?:\/\/|^\//.test(href.trim()) ? href.trim() : `#`;
      return `<a href="${escapeHtml(safehref)}" class="text-yellow-400 hover:text-yellow-300 underline">${label}</a>`;
    });
}

function renderTable(tableBlock: string): string {
  const lines = tableBlock.trim().split("\n").filter(Boolean);
  if (lines.length < 2) return tableBlock;

  const headerLine = lines[0];
  const dataLines = lines.slice(2); // skip separator row (---|----|---)

  const headerCells = parseCells(headerLine);
  const rows = dataLines.map(parseCells);

  const thead = `<thead><tr>${headerCells.map((c) => `<th class="px-4 py-2 text-left text-slate-200 font-bold border-b border-slate-600 bg-slate-800">${inlineMarkdown(c)}</th>`).join("")}</tr></thead>`;
  const tbody = `<tbody>${rows.map((row, i) => `<tr class="${i % 2 === 0 ? "bg-slate-900/50" : "bg-slate-800/30"}">${row.map((c) => `<td class="px-4 py-2 text-slate-300 border-b border-slate-700/50">${inlineMarkdown(c)}</td>`).join("")}</tr>`).join("")}</tbody>`;

  return `<div class="overflow-x-auto my-6 rounded-xl border border-slate-700"><table class="w-full text-sm">${thead}${tbody}</table></div>`;
}

function parseCells(line: string): string[] {
  return line
    .split("|")
    .map((c) => c.trim())
    .filter((c, i, arr) => i !== 0 || c !== "")
    .filter((c, i, arr) => i !== arr.length - 1 || c !== "");
}

function renderUnorderedList(listBlock: string): string {
  const items = listBlock
    .trim()
    .split("\n")
    .filter(Boolean)
    .map((line) => {
      const text = line.replace(/^- /, "");
      // Checkbox detection
      if (text.startsWith("[x] ") || text.startsWith("[X] ")) {
        return `<li class="flex items-start gap-2 my-1"><span class="text-green-400 flex-shrink-0 mt-0.5">☑</span><span class="text-slate-200">${inlineMarkdown(text.slice(4))}</span></li>`;
      }
      if (text.startsWith("[ ] ")) {
        return `<li class="flex items-start gap-2 my-1"><span class="text-slate-500 flex-shrink-0 mt-0.5">☐</span><span class="text-slate-200">${inlineMarkdown(text.slice(4))}</span></li>`;
      }
      return `<li class="my-1 text-slate-200">${inlineMarkdown(text)}</li>`;
    });
  return `<ul class="list-disc list-inside space-y-1 my-3 ml-4">${items.join("")}</ul>`;
}

function renderOrderedList(listBlock: string): string {
  const items = listBlock
    .trim()
    .split("\n")
    .filter(Boolean)
    .map((line) => {
      const text = line.replace(/^\d+\. /, "");
      return `<li class="my-1 text-slate-200">${inlineMarkdown(text)}</li>`;
    });
  return `<ol class="list-decimal list-inside space-y-1 my-3 ml-4">${items.join("")}</ol>`;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
