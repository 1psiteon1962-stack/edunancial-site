import { spawnSync } from 'node:child_process';

const commands = [
  ['npm', ['ci']],
  ['npx', ['tsc', '--noEmit']],
  ['npm', ['run', 'build']],
];

for (const [command, args] of commands) {
  const result = spawnSync(command, args, {
    stdio: 'inherit',
    shell: process.platform === 'win32',
  });

  if (result.error) {
    console.error(`Failed to start ${command}:`, result.error.message);
    process.exit(1);
  }

  if (result.status !== 0) {
    console.error(`${command} ${args.join(' ')} failed with exit code ${result.status}.`);
    process.exit(result.status ?? 1);
  }
}

console.log('Integration validation passed.');
