const path = require('path');

module.exports = {
    entry: {
        main: { import: './js/main.js' },
    },
    mode: 'development',
    module: {
        // rules: [
        //     {
        //         test: /\.(js|jsx)$/,
        //         exclude: /node_modules/,
        //         use: ['babel-loader'],
        //     },
        //     {
        //         test: /\.tsx?$/,
        //         loader: "ts-loader",
        //         include: path.resolve(__dirname, "src"),
        //     }
        // ],
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx']
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, './dist'),       
        libraryTarget: 'var',
        library: '[name]'
    }
};