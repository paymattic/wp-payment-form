const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const args = process.argv;

let mode = 'dev';
let switchTo = 'production';

if (typeof args[2] !== 'undefined' && args[2] === '--build') {
    mode = 'production';
    switchTo = 'dev';
}

const modeTitle = mode === 'dev' ? 'Development' : 'Production';
const regexObj = new RegExp(`["']env["']\\s+=>\\s*["']` + switchTo + `["'],?`, 'g');

(async () => {
    if (mode === 'production') {
        let hadErrorOutput = false;

        const composer = spawn('composer', ['dump-autoload', '--classmap-authoritative'], {
            stdio: ['inherit', 'inherit', 'pipe']
        });

        composer.stderr.on('data', () => {
            hadErrorOutput = true;
        });

        composer.on('close', (code) => {
            if (code === 0 && !hadErrorOutput) {
                console.log('✅ Composer autoload dump completed.');
            } else {
                console.error('\x1b[31m\x1b[1m❌🚨 There was some error while autoloading Composer! 🚨❌\x1b[0m');
            }
        });
    }
})();

const configPath = path.resolve(__dirname, '../../config/app.php');

if (fs.existsSync(configPath)) {
    let data = fs.readFileSync(configPath, 'utf8');
    let result = data.replace(regexObj, "'env' => '" + mode + "',");

    fs.writeFileSync(configPath, result, 'utf8');
    console.log(`✅ ${modeTitle} asset enqueued!`);
} else {
    console.error('❌ config/app.php not found at: ' + configPath);
}
