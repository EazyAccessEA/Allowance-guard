/**
 * Validates dist/manifest.json before zipping for AMO / Chrome MV3.
 * Fails fast if someone uploads a Chrome-only manifest by mistake.
 */

const fs = require('fs');
const path = require('path');

const manifestPath = path.join(__dirname, '..', 'dist', 'manifest.json');

function fail(msg) {
  console.error(`verify-extension-manifest: ${msg}`);
  process.exit(1);
}

let raw;
try {
  raw = fs.readFileSync(manifestPath, 'utf8');
} catch {
  fail(`Could not read ${manifestPath}. Run "npm run build" first.`);
}

let m;
try {
  m = JSON.parse(raw);
} catch (e) {
  fail(`Invalid JSON in ${manifestPath}: ${e.message}`);
}

if (m.manifest_version !== 3) {
  fail('manifest_version must be 3.');
}

const gecko = m.browser_specific_settings?.gecko;
if (!gecko || typeof gecko.id !== 'string' || !gecko.id.trim()) {
  fail('browser_specific_settings.gecko.id is required (Firefox MV3 / storage.sync).');
}

const dcp = gecko.data_collection_permissions;
if (!dcp || !Array.isArray(dcp.required) || dcp.required.length === 0) {
  fail(
    'browser_specific_settings.gecko.data_collection_permissions.required is mandatory for new Firefox extensions.'
  );
}

const bg = m.background;
if (!bg) {
  fail('background is missing.');
}
if (!Array.isArray(bg.scripts) || bg.scripts.length === 0) {
  fail('background.scripts is required (Firefox-compatible fallback alongside service_worker).');
}
if (typeof bg.service_worker !== 'string' || !bg.service_worker.trim()) {
  fail('background.service_worker is required (Chrome MV3).');
}

console.log('verify-extension-manifest: OK (dual background + gecko + data collection)');
process.exit(0);
