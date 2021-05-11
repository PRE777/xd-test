<template>
  <div class="mainContainer">
    <div class="mapview-container">
      <div id="cesium-mapViewer"></div>
      <target-for-location-component
        :mapViewer="mapViewer"
        v-if="targetLocationShow"
      ></target-for-location-component>
    </div>
    <target-grid-switch-component
      :observeDisabled="true"
      :mapViewer="mapViewer"
      v-if="gridsSwitch"
    ></target-grid-switch-component>
    <target-statistics-component
      v-on:statisticCatagoryShow="statisticCatagoryShow"
    ></target-statistics-component>

    <dialog-category-statistic-component
      v-if="isStatisticCatagoryShow"
      :data="catagoryData"
      :isShow="isStatisticCatagoryShow"
      v-on:closeDiologCategory="closeDiologCategory"
    ></dialog-category-statistic-component>
    <dialog-time-statistic-component
      v-if="isStatisticTimeShow"
      :data="timeStatisticData"
      :isShow="isStatisticCatagoryShow"
      v-on:closeDiologTime="closeDiologTime"
    ></dialog-time-statistic-component>
  </div>
</template>

<script>
import { defaultInitCesium } from "../assets/js/MapInit";
import targetForLocationComponent from "../components/targets/TargetLocation.vue";
import targetDirectoryComponent from "../components/targets/TargetDirectory.vue";
import targetCombinationComponent from "../components/targets/TargetCombination.vue";
import targetGridSwitchComponent from "../components/targets/TargetGridSwitch.vue";
import targetStatisticsComponent from "../components/targets/TargetStatistics.vue";
import dialogCategoryStatisticComponent from "../components/dialogs/DialogCategoryStatistic.vue";
import dialogTimeStatisticComponent from "../components/dialogs/DialogTimeStatistic.vue";
var Cesium = require("cesium/Cesium");

export default {
  data() {
    return {
      title: "数据资源统计",
      isStatisticTimeShow: false,
      isStatisticCatagoryShow: false,
      gridsSwitch: false, // 网格开关
      mapViewer: null,
      targetLocationShow: false, // 经纬度视角高度实时展示
      targetCombinationShow: false, // 组合查询弹窗展示
      catagoryData: [], // 分类统计数据
      timeStatisticData: [], // 分时统计数据
    };
  },
  components: {
    targetForLocationComponent,
    targetDirectoryComponent,
    targetCombinationComponent,
    targetGridSwitchComponent,
    targetStatisticsComponent,
    dialogCategoryStatisticComponent,
    dialogTimeStatisticComponent,
  },
  mounted() {
    this.mapViewer = this.initCesium();
    if (this.mapViewer) {
      this.targetLocationShow = true;
    }
  },
  methods: {
    initCesium() {
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

    // 分类统计
    statisticCatagoryShow(val, type) {
      if (type == "catagroy") {
        this.catagoryData = val;
        this.isStatisticCatagoryShow = true;
        this.isStatisticTimeShow = false;
      } else if (type == "time") {
        this.timeStatisticData = val;
        this.isStatisticCatagoryShow = false;
        this.isStatisticTimeShow = true;
      }
    },
    closeDiologCategory() {
      this.isStatisticCatagoryShow = false;
    },
    closeDiologTime() {
      this.isStatisticTimeShow = false;
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
