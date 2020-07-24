const path = require("path");
const { resolve } = require("path");
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const htmlConfig = require("./html.config");

const jsEntrys = {};
const htmlPlugins = [];

htmlConfig.HTMLDirs.forEach(item => {
    let htmlPlugin = new HtmlWebpackPlugin({
        template: path.resolve(__dirname, `./src/html/${item.page}.html`),
        filename: `html/${item.page}.html`,
        chunkFilename: "[id].js",
        minify: {
            collapseWhitespace: true,    // 压缩空白
            removeAttributeQuotes: true  // 删除属性双引号
        }
    });
    htmlPlugins.push(htmlPlugin);
    jsEntrys[item.page] = path.resolve(__dirname, "./src/js/main.js")
})

module.exports = {
    mode: "development",
    entry: jsEntrys,
    output: {
        filename: "js/[name].[hash].js",
        path: path.resolve(__dirname, "dist")
    },
    plugins: [
        new CleanWebpackPlugin(),
        ...htmlPlugins,
        new MiniCssExtractPlugin({
            filename: "css/[name].[hash].css",
            chunkFilename: "[id].css",
        })
    ],
    module: {
        rules: [
            {
                test: /\.css$/,
                exclude: /node_modules/,
                include: path.join(__dirname, 'src'),
                use: [{
                    loader: MiniCssExtractPlugin.loader,
                }, 'style-loader', 'css-loader', 'postcss-loader'] // 从右向左解析原则
            },
            {
                test: /\.less$/,
                exclude: /node_modules/,
                include: path.join(__dirname, 'src'),
                use: [{
                    loader: MiniCssExtractPlugin.loader,
                }, "css-loader", {
                    loader: 'postcss-loader',
                    options: {
                        plugins: [require('autoprefixer')]
                    }
                }, "less-loader"]
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
};