const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');

module.exports = {
    mode: 'development',
    entry: {
        popup: './src/popup.ts',
        options: './src/options.ts'
    },
    output: {
        path: `${__dirname}/package/js`,
        filename: '[name].js',
        publicPath: '/js/'
    },
    module: {
        rules: [
            {
                test: /\.(ts|tsx)$/,
                use: 'ts-loader'
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.ttf$/,
                use: ['file-loader']
            }
        ]
    },
    plugins: [
        new CopyPlugin({
            patterns: [
              { from: path.resolve(__dirname, 'node_modules', 'milligram', 'dist', 'milligram.min.css'), to: '../styles/' },
              { from: path.resolve(__dirname, 'node_modules', 'normalize.css', 'normalize.css'), to: '../styles/' },
            ],
        }),
        new MonacoWebpackPlugin({
            languages: [ 'typescript' ]
        })
    ],
    resolve: {
        extensions: ['.ts', '.js', '.tsx', '.jsx', '.css', '.ttf']
    },
    devtool: 'inline-source-map' // chrome extensionのオプションページはevalが許可されないため、ソースマップを使用する。
}
