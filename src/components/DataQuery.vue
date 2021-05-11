<template>
  <div class="mainContainer">
    <div class="mapview-container">
      <div id="cesium-mapViewer"></div>
      <target-for-location-component
        :mapViewer="mapViewer"
        v-if="targetLocationShow"
      ></target-for-location-component>
    </div>
    <target-directory-component></target-directory-component>
    <target-selected-component
      :mapViewer="mapViewer"
      v-on:targetComShow="targetComShow"
      :combinationBtnShow="true"
    ></target-selected-component>
    <target-combination-component
      v-if="targetCombinationShow"
    ></target-combination-component>
    <target-grid-switch-component
      :observeDisabled="true"
      :mapViewer="mapViewer"
      v-if="gridsSwitch"
    ></target-grid-switch-component>
    <target-query-table-component :mapViewer="mapViewer"></target-query-table-component>
  </div>
</template>

<script>
import { defaultInitCesium } from "../assets/js/MapInit";
import targetForLocationComponent from "../components/targets/TargetLocation.vue";
import targetDirectoryComponent from "../components/targets/TargetDirectory.vue";
import targetSelectedComponent from "../components/targets/TargetSelected.vue";
import targetCombinationComponent from "../components/targets/TargetCombination.vue";
import targetGridSwitchComponent from "../components/targets/TargetGridSwitch.vue";
import targetQueryTableComponent from "../components/targets/TargetQueryTable.vue";

var Cesium = require("cesium/Cesium");

export default {
  data() {
    return {
      title: "数据查询",
      gridsSwitch: false, // 网格开关
      mapViewer: null,
      targetLocationShow: false, // 经纬度视角高度实时展示
      targetCombinationShow: false, // 组合查询弹窗展示
    };
  },
  components: {
    targetForLocationComponent,
    targetDirectoryComponent,
    targetSelectedComponent,
    targetCombinationComponent,
    targetGridSwitchComponent,
    targetQueryTableComponent,
  },
  mounted() {
    this.mapViewer = this.initCesium();
    if (this.mapViewer) {
      this.targetLocationShow = true;
    }
  },
  methods: {
    initCesium() {
      // Offline
      const viewer = defaultInitCesium("cesium-mapViewer", "Amap", true, "2D");
      //   viewer.scene.screenSpaceCameraController.maximumZoomDistance = 19000000; // 相机高度的最大值设定为 10000000 米
      //   viewer.scene.screenSpaceCameraController.minimumZoomDistance = 1000;
      // 显示刷新率和帧率
      //   viewer.scene.debugShowFramesPerSecond = true;
      setTimeout(() => {
        this.gridsSwitch = true;
      }, 1000);

      return viewer;
    },
    // 控制组合查询弹窗显隐
    targetComShow(val) {
      this.targetCombinationShow = val;
    },
  },
};
</script>

<style scoped>
.mainContainer {
  position: relative;
  width: 100%;
  height: 100%;
  border: solid 1px #0ab8f2;
}
.mapview-container {
  display: block;
  position: absolute;
  top: 0px;
  left: 0px;
  right: 0px;
  bottom: 0px;
  background-color: rgba(217, 255, 0, 0.486);
}
/* 地图 */
#cesium-mapViewer {
  display: block;
  height: 100%;
  /* width: 100%; */
  position: relative;
  /* background: rgba(3, 195, 255, 0.1);
  border: 1px solid rgb(60, 117, 219); */
}
/* FPS */
</style>
