// 获取鼠标当前位置的经纬度高
<template>
  <!-- 经度：{{ lng }} 纬度：{{ lat }} 视角高度：{{ cameraHeight }} 层级：{{ geo_level }} -->
  <!-- {{ `经度：${lng}  纬度：${lat}  视角高度：${cameraHeight}  层级：${geo_level}` }} -->
  <div class="container">
    {{ `经度：${lng}  纬度：${lat}  视角高度：${cameraHeight}  层级：${geo_level}` }}
  </div>
</template>
<script>
var Cesium = require("cesium/Cesium");
import { getLevelForHeight } from "../../assets/js/tool/Public";
export default {
  props: ["mapViewer"],
  data() {
    return {
      lng: "",
      lat: "",
      cameraHeight: "",
      geo_level: "",
    };
  },
  mounted() {
    this.$nextTick(() => {
      var handler = new Cesium.ScreenSpaceEventHandler(this.mapViewer.scene.canvas);
      let that = this;
      let ellipsoid = this.mapViewer.scene.globe.ellipsoid;
      handler.setInputAction((movement) => {
        var earthCartesian = that.mapViewer.camera.pickEllipsoid(
          movement.endPosition,
          ellipsoid
        );
        if (earthCartesian) {
          var cartographic = ellipsoid.cartesianToCartographic(earthCartesian);
          that.lng = Cesium.Math.toDegrees(cartographic.longitude).toFixed(4);
          that.lat = Cesium.Math.toDegrees(cartographic.latitude).toFixed(4);
          let height = Math.ceil(that.mapViewer.camera.positionCartographic.height);
          that.geo_level = getLevelForHeight(height);

          // let altitude = that.mapViewer.scene.globe.getHeight(cartographic); // 获取海拔高度，只有开启地形高程才精确
          that.cameraHeight =
            height > 1000
              ? (height / 1000).toFixed(3) + "千米"
              : height.toFixed(2) + "米";

        //   console.log(`lng=${that.lng},lat=${that.lat},height=${that.cameraHeight}`);
        }
      }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

      //设置鼠标滚动事件的处理函数，这里负责监听高度值变化
      handler.setInputAction((wheelment) => {
        let height = Math.ceil(that.mapViewer.camera.positionCartographic.height);
        that.geo_level = getLevelForHeight(height);

        that.cameraHeight =
          height > 1000 ? (height / 1000).toFixed(3) + "千米" : height.toFixed(2) + "米";
      }, Cesium.ScreenSpaceEventType.WHEEL);

      // 监听地图移动结束
      that.mapViewer.scene.camera.moveEnd.addEventListener(() => {
        let height = Math.ceil(that.mapViewer.camera.positionCartographic.height);
        that.geo_level = getLevelForHeight(height);

        that.cameraHeight =
          height > 1000 ? (height / 1000).toFixed(3) + "千米" : height.toFixed(2) + "米";
      });
    });
  },

  methods: {},
};
</script>
<style scoped>
.container {
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  left: 10px;
  bottom: 20px;
  min-width: 420px;
  height: 35px;
  background: rgba(255, 255, 255, 0.1);
  color: #ffffff;
  font-size: 14px;
}
</style>
