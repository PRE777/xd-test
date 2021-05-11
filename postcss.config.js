// module.exports = {
//     plugins: {
//         'autoprefixer': {
//             overrideBrowserslist: [
//                 'Android >= 7.0',
//                 'iOS >= 10',
//                 'Chrome > 71',
//                 'ff > 31',
//                 'ie >= 8'
//             ]
//         },
//         'postcss-pxtorem': {
//             rootValue: 16, // 结果为：设计稿元素尺寸/16，比如元素宽320px,最终页面会换算成 32rem
//             propList: ['*'],
//             // viewportWidth: 1920, // 视窗的宽度，对应的是我们设计稿的宽度.
//             // viewportHeight: 1080, // 视窗的高度，对应的是我们设计稿的高度.(也可以不配置)
//             unitPrecision: 5, // 保留几位小数，指定`px`转换为视窗单位值的小数位数（很多时候无法整除）
//             viewportUnit: 'vw', // 指定需要转换成的视窗单位，建议使用vw
//             minPixelValue: 2, // 小于或等于`1px`不转换为视窗单位.
//             mediaQuery: false, // 允许在媒体查询中转换`px`
//             selectorBlackList: ["el", '.van-notify', 'tab-bar', 'tab-bar-item', 'shopping-cart-bottom-bar'], // 指定不需要转换的类
//         },
//     }
// }