// Runs a list of { text, params } in ONE Neon transaction and returns the
// rows of each statement. readOnly transactions cannot write, even if the
// connection role could.
import { neon } from '@neondatabase/serverless';

function normalizeArchiveUrl(raw) {
  if (process.env.BLOG_ARCHIVE_SELECT_DATABASE !== '1') return raw;
  const parsed = new URL(raw);
  parsed.pathname = '/neondb';
  return parsed.toString();
}

export function neonExecutor(url) {
  const sql = neon(normalizeArchiveUrl(url));
  return async function runTransaction(queries, { readOnly = false } = {}) {
    return sql.transaction(queries.map(({ text, params }) => sql.query(text, params)), {
      readOnly,
      isolationLevel: readOnly ? 'RepeatableRead' : 'Serializable',
    });
  };
}
