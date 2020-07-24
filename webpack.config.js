const path = require("path");
const webpack = require("webpack");
const { resolve } = require("path");
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const htmlConfig = require("./html.config");
// const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

const jsEntrys = {};
const htmlPlugins = [];

htmlConfig.HTMLDirs.forEach(item => {
    let htmlPlugin = new HtmlWebpackPlugin({
        template: path.resolve(__dirname, `./src/html/${item.page}.html`),
        filename: `html/${item.page}.html`,
        excludeChunks: "/node_modules/",
        chunks: [item.page, 'vendor'],
        minify: {
            collapseWhitespace: true,    // 压缩空白
            removeAttributeQuotes: true  // 删除属性双引号
        }
    });
    htmlPlugins.push(htmlPlugin);
    jsEntrys[item.page] = path.resolve(__dirname, `./src/js/${item.page}.js`)
})

module.exports = {
    mode: "production",
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
        }),
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
        }),
        new webpack.HotModuleReplacementPlugin(),
        // new BundleAnalyzerPlugin({ analyzerPort: 8081 })
    ],
    module: {
        rules: [
            {
                test: /\.css$/,
                exclude: /node_modules/,
                include: path.join(__dirname, 'src'),
                use: [{
                    loader: MiniCssExtractPlugin.loader,
                }, 'style-loader', 'css-loader', {
                    loader: 'postcss-loader',
                    options: {
                      ident: 'postcss',
                      plugins: [
                        require('autoprefixer')({ overrideBrowserslist: ['last 10 Chrome versions', 'last 5 Firefox versions', 'Safari >= 6', 'ie> 8'] })
                      ]
                    }
                  }]
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
                test: /\.(gif|jpg|png|bmp|eot|woff|woff2|ttf|svg)$/,
                use: [{
                    loader:'file-loader',
                    options: {
                        outputPath: './images',
                        publicPath: '../images',
                        limit: 10000,
                        esModule: false,
                        name: "[name].[ext]"
                    }
                }]
            },
        ]
    },
    devtool: 'source-map',
    devServer: {
        contentBase: "./dist",
        port: "8080",
        inline: true,
        openPage: "html/index.html",
        hot:true,
    },
    optimization: {
        splitChunks: {
            chunks: "all",// all async initial
            minSize: 30000,
            minChunks: 1,
            maxAsyncRequests: 5,
            maxInitialRequests: 3,
            automaticNameDelimiter: "~",
            name: true,
            cacheGroups: {
                vendors: {
                    test: /[\\/]node_modules[\\/]/,
                    priority: -10,
                    filename: 'js/[name].js'
                },
                default: {
                    minChunks: 2,
                    priority: -20,
                    reuseExistingChunk: true
                }
            }
        }
    }
};