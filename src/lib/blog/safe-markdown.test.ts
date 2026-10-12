import assert from "node:assert/strict";
import test from "node:test";
import { renderBlogMarkdown } from "./safe-markdown";

test("escapes raw HTML and script content", () => {
  const html = renderBlogMarkdown('<script>alert("x")</script>\n\n<img src=x onerror=alert(1)>');
  assert.equal(html.includes("<script>"), false);
  assert.equal(html.includes("<img"), false);
  assert.match(html, /&lt;script&gt;/);
  assert.match(html, /&lt;img/);
});

test("blocks unsafe link schemes", () => {
  const html = renderBlogMarkdown("[bad](javascript:alert(1)) [data](data:text/html,x)");
  assert.equal(html.includes("javascript:"), false);
  assert.equal(html.includes("data:text"), false);
  assert.match(html, /href="#"/);
});

test("allows https and site-relative links", () => {
  const html = renderBlogMarkdown("[source](https://example.com) [lesson](/courses)");
  assert.match(html, /href="https:\/\/example.com"/);
  assert.match(html, /href="\/courses"/);
});
