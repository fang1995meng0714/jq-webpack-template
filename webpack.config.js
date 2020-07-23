const path = require("path");
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { resolve } = require("path");

module.exports = {
    mode: "development",
    entry: {
        main: path.resolve(__dirname, "./src/js/main.js"),
        header: path.resolve(__dirname, "./src/js/header.js"),
    },
    output: {
        filename: "js/[name].[hash].js",
        path: path.resolve(__dirname, "dist")
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, "./src/html/index.html"),
            filename: "html/index.html",
            chunkFilename: "[id].js",
        }),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, "./src/html/header.html"),
            filename: "html/header.html",
            chunkFilename: "[id].js",
        }),

        new MiniCssExtractPlugin({
            filename: "css/[name].[hash].css",
            chunkFilename: "[id].css",
        })
    ],
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [{
                    loader: MiniCssExtractPlugin.loader,
                }, 'style-loader', 'css-loader'] // 从右向左解析原则
            },
            {
                test: /\.less$/,
                use: [{
                    loader: MiniCssExtractPlugin.loader,
                }, {
                    loader: 'css-loader',
                }, {
                    loader: 'postcss-loader',
                    options: {
                        plugins: [require('autoprefixer')]
                    }
                }, {
                    loader: 'less-loader',
                }]
            },
            {
                test: /\.js$/,
                exclude: "/node_modules/",
                include: resolve(__dirname, "src"),
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                },
                exclude: /node_modules/
            },
            {
                test: /\.(htm|html)$/i,
                use: ['html-withimg-loader']
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: [{
                    loader:'file-loader',
                    options: {
                        outputPath: './images', //打包后的图片放到img文件夹下,
                        publicPath: '../images',
                        limit: 10000,
                        esModule: false,
                        name: "[name].[ext]"
                    }
                }]
            },
        ]
    },
    devServer: {
        contentBase: "./dist",
        port: "8080",
        inline: true,
        openPage: "html/index.html"
    }
}