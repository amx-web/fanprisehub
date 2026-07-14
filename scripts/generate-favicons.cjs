const path = require('path');
const { execSync } = require('child_process');

// Prefer sharp-based generator if it works (non-Windows CI setups).
// If sharp native module fails to load, fall back to a pure-JS generator.

function trySharp() {
    const script = path.join(__dirname, 'generate-favicons-sharp.cjs');
    try {
        execSync(`node "${script}"`, { stdio: 'inherit' });
        return true;
    } catch (e) {
        const msg = String(e && e.message ? e.message : e);
        // sharp native loading errors typically mention "Could not load the \"sharp\" module".
        if (msg.toLowerCase().includes('sharp') || msg.toLowerCase().includes('load')) {
            return false;
        }
        // For any other error, still fall back to be safe.
        return false;
    }
}

function main() {
    // 1) attempt sharp script
    const ok = trySharp();
    if (ok) return;

    // 2) fallback pure-JS generator
    const fallback = path.join(__dirname, 'generate-favicons-noimage.cjs');
    execSync(`node "${fallback}"`, { stdio: 'inherit' });
}

main();

