// //rem
// (function() {
//     let orientation = window.matchMedia("(orientation: portrait)");
//     debugger
//     let width = document.documentElement.clientWidth; //获取宽度
//     function onMatchMeidaChange(orientation) {
//         if (orientation.matches) {
//             // 竖屏
//             width = document.documentElement.getBoundingClientRect().width; //获取竖屏宽度
//             setTimeout(() => {
//                 // 重新计算竖屏宽度rem
//                 autoRootFontSize()
//             });
//         } else {
//             // 横屏
//             width = document.documentElement.getBoundingClientRect().width; //获取横屏宽度
//             setTimeout(() => {
//                 // 重新计算横屏宽度rem
//                 autoRootFontSize()
//             });
//         }
//     }
//     onMatchMeidaChange(orientation);
//     orientation.addListener(onMatchMeidaChange);

//     /* 计算rem */
//     function autoRootFontSize() {
//         //(当前屏幕宽度，最小宽度为1200)/1920*16px
//         let setSize = Math.max(document.documentElement.getBoundingClientRect().width, 1200) / 1920 * 16;
//         //字体默认最大值为16px
//         document.documentElement.style.fontSize = (setSize > 16 ? 16 : setSize) + 'px';
//     }
//     window.addEventListener('resize', autoRootFontSize);
//     autoRootFontSize();
// })();


(function() {
    // 设置 rem 函数
    function setRem() {
        //  PC端
        console.log('非移动设备')
            // 基准大小
        let baseSize = 16;
        let basePc = baseSize / 1920; // 表示1920的设计图,使用100PX的默认值
        let vW = window.innerWidth; // 当前窗口的宽度
        let vH = window.innerHeight; // 当前窗口的高度
        if (vW <= 1200) {
            vW = 1200;
        }
        if (vH <= 700) {
            vH = 700;
        }
        // console.log("vW = ", vW);
        // console.log("vH = ", vH);
        // 非正常屏幕下的尺寸换算
        let dueH = vW * 1080 / 1920
        if (vH < dueH) { // 当前屏幕高度小于应有的屏幕高度，就需要根据当前屏幕高度重新计算屏幕宽度
            vW = vH * 1920 / 1080
        }
        let rem = vW * basePc; // 以默认比例值乘以当前窗口宽度,得到该宽度下的相应font-size值
        document.documentElement.style.fontSize = rem + "px";
        // console.log("rem=", rem);
        // //得到html的Dom元素
        // let htmlDom = document.getElementsByTagName('html')[0];
        // //设置根元素字体大小
        // htmlDom.style.fontSize = rem + 'px';

    }
    window.addEventListener('resize', setRem);

    setRem();

})()

// 设置 rem 函数
// function setRem() {
//     //  PC端
//     console.log('非移动设备')
//         // 基准大小
//     let baseSize = 100;
//     let basePc = baseSize / 1920; // 表示1920的设计图,使用100PX的默认值
//     let vW = window.innerWidth; // 当前窗口的宽度
//     let vH = window.innerHeight; // 当前窗口的高度
//     // 非正常屏幕下的尺寸换算
//     let dueH = vW * 1080 / 1920
//     if (vH < dueH) { // 当前屏幕高度小于应有的屏幕高度，就需要根据当前屏幕高度重新计算屏幕宽度
//         vW = vH * 1920 / 1080
//     }
//     let rem = vW * basePc; // 以默认比例值乘以当前窗口宽度,得到该宽度下的相应font-size值
//     document.documentElement.style.fontSize = rem + "px";
//     console.log(rem)
//         // //得到html的Dom元素
//         // let htmlDom = document.getElementsByTagName('html')[0];
//         // //设置根元素字体大小
//         // htmlDom.style.fontSize = rem + 'px';
// }
// // 初始化
// setRem();
// // 改变窗口大小时重新设置 rem
// window.onresize = function() {
//     setRem()
// };