<template>
  <div id="rectangle-id" class="rectangle-container">
    <el-switch
      v-model="showGrids"
      active-color="#67D878"
      inactive-text="网格开关"
      @change="gridSwitchChange"
    ></el-switch>
    <el-switch
      v-model="observeUpDate"
      active-color="#67D878"
      inactive-text="更新监控"
      style="margin-left: 5px"
      @change="observeSwitchChange"
      :disabled="observeDisabled"
    ></el-switch>
  </div>
</template>
<script>
import {
  cancelDrawGrid,
  observeSceen,
  drawGrid,
} from "../../assets/js/drawEntities/DrawGridsLine";
import {
  getVisibleRegion,
  getLevelForHeight,
} from "../../assets/js/tool/Public";
import {
  observeGrid,
  clearTimer,
  disconnect,
} from "../../assets/js/drawEntities/DrawGrids";
import { server } from "../../network/api";
export default {
  props: ["observeDisabled", "mapViewer"],
  data() {
    return {
      showGrids: false,
      observeUpDate: false,
      dataTypeArr: [],
    };
  },
  mounted() {
    this.$nextTick(() => {
      if (this.showGrids) {
        observeSceen(this.mapViewer);
      }
    });
  },
  methods: {
    gridSwitchChange(val) {
      if (val) {
        observeSceen(this.mapViewer);
      } else {
        cancelDrawGrid(this.mapViewer);
      }
    },
    observeSwitchChange(val) {
      if (!val) {
        disconnect();
        return;
      }
      this.dataTypeArr = this.$store.getters["dataType/getData"];
      if (this.dataTypeArr.length == 0) {
        this.$message.warning("请先选择数据类型！");
        return;
      }
      let extent = getVisibleRegion(this.mapViewer);
      if (extent.xmin == undefined || extent.xmin == -180) {
        extent.xmin = -179;
      }
      if (extent.xmax == undefined || extent.xmax == 180) {
        extent.xmax = 179;
      }
      if (extent.ymin == undefined || extent.ymin == -90) {
        extent.ymin = -89;
      }
      if (extent.ymax == undefined || extent.ymax == 90) {
        extent.ymax = 89;
      }
      let minLng = extent.xmin;
      let maxLng = extent.xmax;
      let minLat = extent.ymin;
      let maxLat = extent.ymax;
      let height = extent.height;
      let level = getLevelForHeight(height);
      let search_geojson = {
        type: "Polygon",
        coordinates: [
          [
            [minLng, maxLat],
            [minLng, minLat],
            [maxLng, minLat],
            [maxLng, maxLat],
            [minLng, maxLat],
          ],
        ],
      };

      let param = {
        search_geojson: JSON.stringify(search_geojson),
        geo_level: level,
      };
      //   if (this.ruleForm.date != "") {
      //     let date = dateFormat("YYYY-mm-dd", this.ruleForm.date);
      //     param["end_time"] = date;
      //   }
      let arr = [];
      for (const item of this.dataTypeArr) {
        let id = item.id;
        arr.push(id);
      }
      let dataTypeStr = arr.join(",");
      param["catagory_code"] = dataTypeStr;
      this.loading = Loading.service({
        background: "rgba(0, 0, 0, 0.4)",
        fullscreen: true,
        lock: true,
      });
      server.updateMonitor(param).then((response) => {
        this.loading.close();
        if (response.server_status == 200) {
          let data = response.data.list;
          observeGrid(this.mapViewer, data);
          clearTimer();
        }
      });
    },
  },
};
</script>
<style scoped>
/* rectangle */
.rectangle-container {
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 5px;
  right: 5px;
  min-width: 240px;
  min-height: 42px;
  background-image: url("../../../public/images/common/rectangle.png");
  background-size: 100% 100%;
  background-repeat: no-repeat;
  background-position: center;
}
.rectangle-container >>> .el-switch__label * {
  font-size: 12px;
}
.rectangle-container >>> .el-switch__label--left {
  margin-right: 5px;
}
.rectangle-container >>> .el-switch__label {
  color: #fff !important;
}
.rectangle-container >>> .el-switch__label.is-active {
  color: #fff !important;
}
.rectangle-container >>> .el-switch__core {
  width: 40px !important;
}

</style>
