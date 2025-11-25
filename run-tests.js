const { execSync } = require('child_process');
const fs = require('fs');

try {
  const out = execSync('npx jest --runInBand --colors', { encoding: 'utf8', stdio: 'pipe' });
  fs.writeFileSync('test-output.txt', out, 'utf8');
  console.log('Wrote test-output.txt');
} catch (err) {
  const out = (err.stdout || '') + '\n' + (err.stderr || '') + '\n' + (err.message || '');
  try { fs.writeFileSync('test-output.txt', out, 'utf8'); } catch (e) { console.error('Failed to write test-output.txt', e); }
  console.error('Tests failed. Output saved to test-output.txt');
  process.exit(err.status || 1);
}
