const path = require('path');
const { spawn } = require('child_process');

function buildWithSpawn() {
    return new Promise((resolve, reject) => {
        const scriptPath = path.join(__dirname, 'build.sh');

        console.log(`🚀 Running: ${scriptPath}`);

        const child = spawn(scriptPath, [], {
            stdio: 'inherit',
            shell: false
        });

        child.on('close', (code) => {
            if (code === 0) {
                console.log('✅ Build completed successfully');
                resolve(true);
            } else {
                console.error(`❌ Build failed with exit code ${code}`);
                reject(new Error(`Build failed with exit code ${code}`));
            }
        });

        child.on('error', (error) => {
            console.error('❌ Build error:', error.message);
            reject(error);
        });
    });
}

buildWithSpawn();
