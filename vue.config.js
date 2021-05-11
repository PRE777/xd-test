let cesiumSource = './node_modules/cesium/Source'
let cesiumWorkers = '../Build/Cesium/Workers'
const webpack = require('webpack')
const path = require('path')
const CopyWebpackPlugin = require('copy-webpack-plugin')

// 引入等比适配插件
const px2rem = require('postcss-px2rem')

// 配置基本大小
const postcss = px2rem({
    // 基准大小 baseSize，需要和rem.js中相同
    remUnit: 16,
    propList: ['*'],
    // viewportWidth: 1920, // 视窗的宽度，对应的是我们设计稿的宽度.
    // viewportHeight: 1080, // 视窗的高度，对应的是我们设计稿的高度.(也可以不配置)
    unitPrecision: 5, // 保留几位小数，指定`px`转换为视窗单位值的小数位数（很多时候无法整除）
    viewportUnit: 'rem', // 指定需要转换成的视窗单位，建议使用vw
    minPixelValue: 2, // 小于或等于`1px`不转换为视窗单位.
    mediaQuery: false, // 允许在媒体查询中转换`px`
    selectorBlackList: [""], // 指定不需要转换的类型 "el"
})

module.exports = {
    // publicPath: process.env.NODE_ENV === 'production' ? './' : './',
    publicPath: './',
    assetsDir: 'static',
    outputDir: process.env.outputDir,
    // 避免Eslint报错
    lintOnSave: false,
    devServer: {
        host: "0.0.0.0",
        port: 8090,
        https: false,
        disableHostCheck: true, // 处理host不识别问题
        open: true, //自动打开浏览器
        hot: true, // 是否开启模块热替换功能
        compress: true, // 是否开启gzip压缩
        // watch: true, // 监听模式是否开启，默认为true，放开运行报错
        watchOptions: { // 监听模式选项
            // 不监听的文件或文件夹，支持正则匹配。默认为空
            ignored: /node_modules/,
            // 监听到变化发生后会等300ms再去执行动作，防止文件更新太快导致重新编译频率太高
            // 默认为300ms 
            aggregateTimeout: 300,
            // 判断文件是否发生变化是不停的去询问系统指定文件有没有变化，默认每秒问 1000 次
            poll: 1000
        },
    },

    configureWebpack: {
        output: {
            sourcePrefix: ' ' // 让webpack正确处理多行字符串
        },
        amd: {
            toUrlUndefined: true
        },
        devtool: 'source-map',
        resolve: {
            alias: {
                'vue$': 'vue/dist/vue.esm.js',
                '@': path.resolve('src'),
                'cesium': path.resolve(__dirname, cesiumSource)
            },
            modules: ["./src/components", "node_modules"]
        },
        plugins: [
            new CopyWebpackPlugin([{ from: path.join(cesiumSource, cesiumWorkers), to: 'Workers' }]),
            new CopyWebpackPlugin([{ from: path.join(cesiumSource, 'Assets'), to: 'Assets' }]),
            new CopyWebpackPlugin([{ from: path.join(cesiumSource, 'Widgets'), to: 'Widgets' }]),
            new CopyWebpackPlugin([{ from: path.join(cesiumSource, 'ThirdParty/Workers'), to: 'ThirdParty/Workers' }]),
            new webpack.DefinePlugin({
                // Define relative base path in cesium for loading assets
                CESIUM_BASE_URL: JSON.stringify('./')
            })
        ],
        module: {
            unknownContextCritical: /^.\/.*$/,
            unknownContextCritical: false,
            noParse: /jquery|chartjs/, // 正则表达式 让webPack忽略没有采用模块化的文件

        }
    },
    pwa: {
        iconPaths: {
            favicon32: './favicon.ico',
            favicon16: './favicon.ico',
            appleTouchIcon: './favicon.ico',
            maskIcon: './favicon.ico',
            msTileImage: './favicon.ico'
        }
    },
    chainWebpack: config => {
        config
            .plugin('html')
            .tap(args => {
                args[0].title = '基于地球剖分网格的地球大数据组织管理原型系统'
                return args
            })
    },
    /* 是否在构建生产包时生成 sourceMap 文件，false将提高构建速度 */
    productionSourceMap: false,
    css: {
        sourceMap: true, // 开启 CSS source maps 否则浏览器中无法查看样式归属
        loaderOptions: {
            postcss: {
                plugins: [
                    postcss
                ]
            }
        }
    }
}