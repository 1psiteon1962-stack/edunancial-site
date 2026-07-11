// scripts/curriculum/lib/logger.mjs
const RESET = '\x1b[0m';
const GREEN = '\x1b[32m';
const YELLOW = '\x1b[33m';
const RED = '\x1b[31m';
const CYAN = '\x1b[36m';
const BOLD = '\x1b[1m';

export const log = {
  info: (msg) => console.log(`${CYAN}[INFO]${RESET} ${msg}`),
  ok: (msg) => console.log(`${GREEN}[OK]${RESET}   ${msg}`),
  warn: (msg) => console.warn(`${YELLOW}[WARN]${RESET} ${msg}`),
  error: (msg) => console.error(`${RED}[ERR]${RESET}  ${msg}`),
  section: (msg) => console.log(`\n${BOLD}${CYAN}=== ${msg} ===${RESET}`),
  raw: (msg) => console.log(msg),
};
