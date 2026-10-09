const fs = require('fs');
const path = require('path');
const { spawn, execSync } = require('child_process');

// ─── Colors & Formatting ───────────────────────────────────────────────────
const c = {
    reset:   '\x1b[0m',
    bold:    '\x1b[1m',
    dim:     '\x1b[2m',
    red:     '\x1b[31m',
    green:   '\x1b[32m',
    yellow:  '\x1b[33m',
    blue:    '\x1b[34m',
    magenta: '\x1b[35m',
    cyan:    '\x1b[36m',
    white:   '\x1b[37m',
    bgBlue:  '\x1b[44m',
    bgGreen: '\x1b[42m',
    bgRed:   '\x1b[41m',
};

// ─── Config ────────────────────────────────────────────────────────────────
const ROOT_DIR = path.resolve(__dirname, '../../');
const PLUGIN_FILE = path.join(ROOT_DIR, 'wp-payment-form.php');
const CONFIG_FILE = path.join(ROOT_DIR, 'config/app.php');
const PLUGIN_SLUG = 'wp-payment-form';
const VERSION_CONST = 'WPPAYFORM_VERSION';

const shouldZip = process.argv.includes('--zip') || process.env.npm_config_zip === 'true';

// ─── Helpers ───────────────────────────────────────────────────────────────
function getVersion() {
    const content = fs.readFileSync(PLUGIN_FILE, 'utf8');
    const match = content.match(new RegExp(`define\\s*\\(\\s*['"]${VERSION_CONST}['"]\\s*,\\s*['"]([^'"]+)['"]`));
    return match ? match[1] : 'unknown';
}

function formatTime(ms) {
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(1)}s`;
}

function formatSize(bytes) {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

const spinnerFrames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];

function createSpinner(label) {
    let i = 0;
    const interval = setInterval(() => {
        process.stdout.write(`\r  ${c.cyan}${spinnerFrames[i++ % spinnerFrames.length]}${c.reset} ${label}`);
    }, 80);
    return {
        stop(success, finalLabel) {
            clearInterval(interval);
            const icon = success ? `${c.green}✔${c.reset}` : `${c.red}✖${c.reset}`;
            process.stdout.write(`\r  ${icon} ${finalLabel || label}\n`);
        }
    };
}

function runCommand(cmd, args, options = {}) {
    return new Promise((resolve, reject) => {
        const child = spawn(cmd, args, {
            cwd: ROOT_DIR,
            stdio: options.stdio || 'pipe',
            shell: options.shell || false,
            env: { ...process.env, ...options.env },
        });

        let stdout = '';
        let stderr = '';

        if (child.stdout) child.stdout.on('data', d => { stdout += d.toString(); });
        if (child.stderr) child.stderr.on('data', d => { stderr += d.toString(); });

        child.on('close', code => {
            if (code === 0) resolve({ stdout, stderr, code });
            else reject({ stdout, stderr, code });
        });
        child.on('error', reject);
    });
}

// ─── Build Steps ───────────────────────────────────────────────────────────

async function stepSetEnv() {
    const regexObj = /'env'\s+=>\s*'dev',?/g;
    if (fs.existsSync(CONFIG_FILE)) {
        let data = fs.readFileSync(CONFIG_FILE, 'utf8');
        data = data.replace(regexObj, "'env' => 'production',");
        fs.writeFileSync(CONFIG_FILE, data, 'utf8');
    }
}

async function stepComposerDump() {
    await runCommand('composer', ['dump-autoload', '--classmap-authoritative']);
}

async function stepRemoveDS() {
    try {
        execSync('find . -name .DS_Store -delete', { cwd: ROOT_DIR, stdio: 'pipe' });
    } catch (e) { /* ignore */ }
}

async function stepWebpackBuild() {
    await runCommand(
        path.join(ROOT_DIR, 'node_modules/.bin/cross-env'),
        ['NODE_ENV=production', 'node_modules/webpack/bin/webpack.js', '--progress', '--hide-modules', `--config=node_modules/laravel-mix/setup/webpack.config.js`],
        { shell: true, stdio: ['inherit', 'pipe', 'pipe'] }
    );
}

async function stepCreateZip() {
    const buildScript = path.join(__dirname, 'build.sh');
    await new Promise((resolve, reject) => {
        const child = spawn(buildScript, [], { cwd: ROOT_DIR, stdio: 'inherit', shell: false });
        child.on('close', code => code === 0 ? resolve() : reject(new Error(`zip exited with ${code}`)));
        child.on('error', reject);
    });
}

async function stepResetEnv() {
    const regexObj = /'env'\s+=>\s*'production',?/g;
    if (fs.existsSync(CONFIG_FILE)) {
        let data = fs.readFileSync(CONFIG_FILE, 'utf8');
        data = data.replace(regexObj, "'env' => 'dev',");
        fs.writeFileSync(CONFIG_FILE, data, 'utf8');
    }
}

// ─── Main ──────────────────────────────────────────────────────────────────

async function runStep(label, fn) {
    const spinner = createSpinner(label);
    const start = Date.now();
    try {
        await fn();
        const elapsed = Date.now() - start;
        spinner.stop(true, `${label} ${c.dim}(${formatTime(elapsed)})${c.reset}`);
        return elapsed;
    } catch (err) {
        const elapsed = Date.now() - start;
        spinner.stop(false, `${c.red}${label} — FAILED${c.reset} ${c.dim}(${formatTime(elapsed)})${c.reset}`);
        throw err;
    }
}

(async () => {
    const version = getVersion();
    const totalStart = Date.now();

    // Banner
    console.log('');
    console.log(`  ${c.bgBlue}${c.white}${c.bold}                                              ${c.reset}`);
    console.log(`  ${c.bgBlue}${c.white}${c.bold}   ⚡ PAYMATTIC BUILD SYSTEM                   ${c.reset}`);
    console.log(`  ${c.bgBlue}${c.white}${c.bold}                                              ${c.reset}`);
    console.log('');
    console.log(`  ${c.dim}Plugin:${c.reset}  ${c.bold}${PLUGIN_SLUG}${c.reset}`);
    console.log(`  ${c.dim}Version:${c.reset} ${c.bold}${c.green}v${version}${c.reset}`);
    console.log(`  ${c.dim}Mode:${c.reset}    ${c.bold}${c.yellow}Production${c.reset}`);
    console.log(`  ${c.dim}Zip:${c.reset}     ${c.bold}${shouldZip ? `${c.green}Yes` : `${c.dim}No (use --zip)`}${c.reset}`);
    console.log('');
    console.log(`  ${c.dim}${'─'.repeat(44)}${c.reset}`);
    console.log('');

    const timings = [];

    try {
        // Step 1: Environment
        timings.push(await runStep('Setting environment to production', stepSetEnv));

        // Step 2: Composer
        timings.push(await runStep('Running composer dump-autoload', stepComposerDump));

        // Step 3: Clean
        timings.push(await runStep('Removing .DS_Store files', stepRemoveDS));

        // Step 4: Webpack
        timings.push(await runStep('Compiling assets (webpack)', stepWebpackBuild));

        // Step 5: Zip (conditional) - uses build.sh progress bar, no spinner
        if (shouldZip) {
            console.log('');
            console.log(`  ${c.blue}📦 Creating release ZIP...${c.reset}`);
            const zipStart = Date.now();
            await stepCreateZip();
            const zipElapsed = Date.now() - zipStart;
            console.log(`  ${c.green}✔${c.reset} ZIP created ${c.dim}(${formatTime(zipElapsed)})${c.reset}`);
            timings.push(zipElapsed);
        }

        // Step 6: Reset env back to dev
        timings.push(await runStep('Resetting environment to dev', stepResetEnv));

        // Summary
        const totalTime = Date.now() - totalStart;
        console.log('');
        console.log(`  ${c.dim}${'─'.repeat(44)}${c.reset}`);
        console.log('');
        console.log(`  ${c.bgGreen}${c.white}${c.bold}  BUILD SUCCESSFUL  ${c.reset}`);
        console.log('');
        console.log(`  ${c.dim}Total time:${c.reset} ${c.bold}${formatTime(totalTime)}${c.reset}`);

        if (shouldZip) {
            const zipPath = path.join(ROOT_DIR, 'builds', `${PLUGIN_SLUG}.zip`);
            if (fs.existsSync(zipPath)) {
                const stats = fs.statSync(zipPath);
                console.log(`  ${c.dim}Zip file:${c.reset}   ${c.bold}builds/${PLUGIN_SLUG}.zip${c.reset}`);
                console.log(`  ${c.dim}Zip size:${c.reset}   ${c.bold}${formatSize(stats.size)}${c.reset}`);
            }
        }

        console.log('');

    } catch (err) {
        // Reset env even on failure
        try { await stepResetEnv(); } catch (_) {}

        const totalTime = Date.now() - totalStart;
        console.log('');
        console.log(`  ${c.dim}${'─'.repeat(44)}${c.reset}`);
        console.log('');
        console.log(`  ${c.bgRed}${c.white}${c.bold}  BUILD FAILED  ${c.reset}`);
        console.log('');
        console.log(`  ${c.dim}Total time:${c.reset} ${c.bold}${formatTime(totalTime)}${c.reset}`);
        if (err.stderr) {
            console.log(`  ${c.red}${err.stderr.trim().split('\n').slice(-3).join('\n  ')}${c.reset}`);
        }
        console.log('');
        process.exit(1);
    }
})();
