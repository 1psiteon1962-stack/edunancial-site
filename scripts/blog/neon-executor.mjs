// Runs a list of { text, params } in ONE Neon transaction and returns the
// rows of each statement. readOnly transactions cannot write, even if the
// connection role could.
import { neon } from '@neondatabase/serverless';

export function neonExecutor(url) {
  const sql = neon(url);
  return async function runTransaction(queries, { readOnly = false } = {}) {
    return sql.transaction(queries.map(({ text, params }) => sql.query(text, params)), {
      readOnly,
      isolationLevel: readOnly ? 'RepeatableRead' : 'Serializable',
    });
  };
}
