const { spawnSync } = require('child_process');

function run(command, args) {
  const result = spawnSync(command, args, {
    stdio: 'inherit',
    shell: process.platform === 'win32',
  });

  return result.status === 0;
}

function runBestEffort(command, args) {
  spawnSync(command, args, {
    stdio: 'inherit',
    shell: process.platform === 'win32',
  });
}

const npx = process.platform === 'win32' ? 'npx.cmd' : 'npx';
const isLinux = process.platform === 'linux';

if (isLinux) {
  // Mitigate common Ubuntu container failures caused by stale Yarn apt repo keys.
  runBestEffort('bash', ['-lc', 'if [ -f /etc/apt/sources.list.d/yarn.list ]; then sudo -n rm -f /etc/apt/sources.list.d/yarn.list; fi']);
}

let installedWithDeps = run(npx, ['playwright', 'install', '--with-deps', 'chromium']);

if (!installedWithDeps && isLinux) {
  // One bounded retry after apt metadata refresh.
  runBestEffort('bash', ['-lc', 'sudo -n apt-get update']);
  installedWithDeps = run(npx, ['playwright', 'install', '--with-deps', 'chromium']);
}

if (!installedWithDeps) {
  console.error('Playwright install --with-deps failed after automatic remediation. Treat this as an environment blocker and fix base image/repository setup before running UI tests.');
  process.exit(1);
}