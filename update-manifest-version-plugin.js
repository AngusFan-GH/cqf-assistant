const fs = require('fs');
const path = require('path');

class UpdateManifestVersionPlugin {
    apply(compiler) {
        compiler.hooks.emit.tapAsync('UpdateManifestVersionPlugin', (compilation, callback) => {
            const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json'), 'utf-8'));
            const manifestPath = path.join(__dirname, 'src/manifest.json');
            const manifestJson = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));

            manifestJson.version = packageJson.version;
            compilation.assets['manifest.json'] = {
                source: () => JSON.stringify(manifestJson, null, 2),
                size: () => JSON.stringify(manifestJson, null, 2).length
            };

            callback();
        });
    }
}

module.exports = UpdateManifestVersionPlugin;