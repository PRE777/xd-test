<template>
  <div id="app">
    <router-view />
  </div>
</template>
<script>
import "./assets/css/form.css";
import "./assets/css/table.css";
import "./assets/css/dropDown.css";
import "./assets/css/tree.css";
import "./assets/css/datePicker.css";
export default {
   data(){
     return{};
   }
}
</script>

<style lang="scss">
// @import url(./assets/css/form.css);
// @import url(./assets/css/table.css);
// @import url(./assets/css/dropDown.css);
// @import url(./assets/css/tree.css);
// @import url(./assets/css/datePicker.css);
// @import "./assets/css/form.css";
// @import "./assets/css/table.css";
// @import "./assets/css/dropDown.css";
// @import "./assets/css/tree.css";
// @import "./assets/css/datePicker.css";

html,
body {
  height: 100%;
  min-height: 700px;/*no*/
  min-width: 1200px;/*no*/
  margin: 0;
  overflow: hidden;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100%;
  min-width: 1200px;
  min-height: 675px;
  position: relative;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}

/*---滚动条大小--*/

::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}
/*---滚动条默认显示样式--*/
::-webkit-scrollbar-thumb {
  //   outline: 1px solid #fff;
  -webkit-border-radius: 4px;
  border: 1px solid #144f5b;
  background-color: #07a0e7;
}
/*---鼠标点击滚动条显示样式--*/

::-webkit-scrollbar-thumb:hover {
  /*height:50px;*/
  border-radius: 4px;
}

/*---滚动框背景样式--*/
::-webkit-scrollbar-track-piece {
  border-radius: 5px;
  background-color: transparent;
}
::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  border-radius: 5px;
  background-color: transparent;
}
/* 边角，即两个滚动条的交汇处 */
::-webkit-scrollbar-corner {
  background-color: transparent;
}

.cesium-performanceDisplay-defaultContainer {
  position: absolute;
  top: 10px !important;
  right: 10px;
  text-align: right;
}
</style>
