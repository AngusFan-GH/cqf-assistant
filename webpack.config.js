const { VueLoaderPlugin } = require('vue-loader');
const CopyPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { resolve } = require('path');
const { name, version } = require('./package.json');
const UpdateManifestVersionPlugin = require('./update-manifest-version-plugin');
const FileManagerPlugin = require('filemanager-webpack-plugin');

module.exports = {
    mode: 'development',
    entry: {
        content: './src/content/content.ts',
        background: './src/background/background.ts',
        ['record-video']: './src/content/record-video.ts',
    },
    output: {
        path: resolve(__dirname, 'build/' + name + '-v' + version),
        filename: (chunkData) => {
            switch (chunkData.chunk.name) {
                case 'record-video':
                    return 'content/[name].js';
                default:
                    return '[name]/[name].js';
            }
        }
    },
    resolve: {
        extensions: ['.ts', '.js', '.vue', '.json'],
        alias: {
            'vue$': 'vue/dist/vue.esm-bundler.js'
        }
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            },
            {
                test: /\.ts$/,
                loader: 'ts-loader',
                options: { appendTsSuffixTo: [/\.vue$/] }
            },
            {
                test: /\.scss$/,
                use: [
                    'vue-style-loader',
                    'css-loader',
                    'sass-loader'
                ]
            },
            {
                test: /\.sass$/,
                use: [
                    'vue-style-loader',
                    'css-loader',
                    'sass-loader?indentedSyntax'
                ]
            },
            {
                test: /\.css$/,
                use: [
                    'vue-style-loader',
                    'css-loader'
                ]
            }
        ]
    },
    plugins: [
        new UpdateManifestVersionPlugin(),
        new VueLoaderPlugin(),
        new CopyPlugin({
            patterns: [
                { from: 'src/icons', to: 'icons' },
                { from: 'src/manifest.json', to: 'manifest.json' },
            ],
        }),
        new FileManagerPlugin({
            events: {
                onEnd: {
                    archive: [
                        {
                            source: './build/' + name + '-v' + version,
                            destination: './build/' + name + '-v' + version + '.zip'
                        },
                    ]
                }
            }
        }),
    ]
};
