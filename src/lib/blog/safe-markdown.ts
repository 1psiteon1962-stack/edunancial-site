const ALLOWED_LINK = /^(https?:\/\/|\/)/i;

export function renderBlogMarkdown(markdown: string): string {
  const escaped = escapeHtml(markdown.replace(/\r\n?/g, "\n"));
  const blocks = escaped.split(/\n{2,}/);

  return blocks.map((block) => {
    const lines = block.split("\n");
    if (lines.every((line) => /^[-*] /.test(line))) {
      return `<ul>${lines.map((line) => `<li>${inline(line.slice(2))}</li>`).join("")}</ul>`;
    }
    if (lines.every((line) => /^\d+\. /.test(line))) {
      return `<ol>${lines.map((line) => `<li>${inline(line.replace(/^\d+\. /, ""))}</li>`).join("")}</ol>`;
    }
    if (/^### /.test(block)) return `<h3>${inline(block.slice(4))}</h3>`;
    if (/^## /.test(block)) return `<h2>${inline(block.slice(3))}</h2>`;
    if (/^# /.test(block)) return `<h1>${inline(block.slice(2))}</h1>`;
    if (/^&gt; /.test(block)) return `<blockquote>${inline(block.slice(5))}</blockquote>`;
    return `<p>${inline(lines.join(" "))}</p>`;
  }).join("\n");
}

function inline(text: string): string {
  return text
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_m, label: string, href: string) => {
      const decodedHref = decodeEntities(href.trim());
      const safeHref = ALLOWED_LINK.test(decodedHref) ? decodedHref : "#";
      return `<a href="${escapeAttribute(safeHref)}" rel="noopener noreferrer">${label}</a>`;
    })
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/\`([^\`]+)\`/g, "<code>$1</code>");
}

function escapeHtml(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}
function escapeAttribute(value: string): string { return escapeHtml(value); }
function decodeEntities(value: string): string {
  return value.replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">");
}
