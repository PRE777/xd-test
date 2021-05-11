<template>
  <div class="mainContent">
    <div class="titleClass">参数配置</div>
    <div class="paramsContent">
      <!-- <span class="spanClass">空间范围</span>
      <el-form :model="ruleForm" ref="ruleForm" label-width="30px">
        <el-radio-group v-model="ruleForm.spaceCode" class="radio-group">
          <el-radio :label="1">全球范围</el-radio>
          <el-radio :label="2">
            <el-select v-model="ruleForm.address" style="width: 150px">
              <el-option
                v-for="item in addressArr"
                :key="item.name"
                :label="item.name"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-radio>
        </el-radio-group>
      </el-form> -->
      <span class="spanClass">查看日期</span>
      <el-form :model="ruleForm" ref="ruleForm" label-width="55px">
        <el-form-item prop="date">
          <el-date-picker
            v-model="ruleForm.date"
            type="date"
            resize="none"
            style="width: 150px"
            placeholder="选择日期"
            :clearable="false"
          >
          </el-date-picker>
        </el-form-item>
      </el-form>
      <span class="spanClass">查看类型</span>
      <el-form :model="ruleForm" ref="ruleForm" label-width="30px">
        <el-radio-group v-model="ruleForm.lookType" class="radio-group1">
          <el-radio :label="1">总数据库</el-radio>
          <el-radio :label="2">更新数据量</el-radio>
        </el-radio-group>
        <el-form-item style="margin-left: 60px">
          <el-button type="primary" @click="dataQuery"> 查 询</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { dateFormat } from "../../assets/js/tool/DateDeal";
import { getVisibleRegion, getLevelForHeight } from "../../assets/js/tool/Public";
import { drawGrids, clear_polygon_grids } from "../../assets/js/drawEntities/DrawGrids";
import { server } from "../../network/api";
export default {
  props: ["mapViewer"],
  data() {
    return {
      dataTypeArr: [],
      ruleForm: {
        date: "",
        lookType: 1, // 1总数据量，2更新数据量
      },
    };
  },
  computed: {
    treeSelectedData() {
      return this.$store.getters["dataType/getData"];
    },
  },
  //监听执行
  watch: {
    treeSelectedData(val) {
      this.dataTypeArr = val;
      //   this.dataQuery();
    },
  },
  mounted() {},
  methods: {
    dataQuery() {
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
        type: this.ruleForm.lookType,
      };
      if (this.ruleForm.date != "") {
        let date = dateFormat("YYYY-mm-dd", this.ruleForm.date);
        param["end_time"] = date;
      }
      let arr = [];
      for (const item of this.dataTypeArr) {
        let id = item.id;
        arr.push(id);
      }
      let dataTypeStr = arr.join(",");
      param["catagory_code"] = dataTypeStr;
      clear_polygon_grids(this.mapViewer);
      this.loading = Loading.service({
        background: "rgba(0, 0, 0, 0.3)",
        fullscreen: true,
        lock: true,
      });
      server.dresourceDistriBution(param).then((response) => {
        this.loading.close();
        if (response.server_status == 200) {
          if (response.data) {
            let data = response.data.list;
            drawGrids(this.mapViewer, data, false);
          }
        }
      });
    },
  },
};
</script>

<style scoped>
.mainContent {
  display: flex;
  flex-direction: column;
  width: 230px;
  height: 250px;
  padding: 5px;
  box-sizing: border-box; /* 避免 padding 导致容器被撑大*/
  background-image: url("../../../public/images/common/paramconfig.png");
  background-size: 100% 100%;
  background-repeat: no-repeat;
  background-position: center;
  position: absolute;
  top: 50px;
  right: 5px;
}
.titleClass {
  display: flex;
  width: 165px;
  height: 30px;
  min-height: 30px;
  box-sizing: border-box;
  font-size: 16px;
  padding-left: 10px;
  align-items: center;
  color: #53d7ff;
}
.paramsContent {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
}
.spanClass {
  width: 100%;
  height: 30px;
  line-height: 30px;
  font-family: PingFangSC-Semibold;
  font-size: 15px;
  color: #d9ddff;
  letter-spacing: 0;
  text-align: start;
  padding-left: 10px;
  box-sizing: border-box;
}
.radio-group {
  display: flex;
  flex-direction: column;
  height: 70px;
  justify-content: space-around;
  align-items: flex-start;
  margin-left: 30px;
}
.radio-group1 {
  display: flex;
  flex-direction: column;
  height: 50px;
  justify-content: space-around;
  align-items: flex-start;
  margin-left: 30px;
}
.el-radio {
  color: #606266;
  cursor: pointer;
  margin-right: inherit;
}
.paramsContent >>> .el-button--primary {
  color: #fff;
  width: 100px;
  height: 32px;
  cursor: pointer;
  margin: 5px 10px !important;
  background: #104184;
  border: 1px solid #4167b2;
}
.paramsContent >>> .el-input__prefix {
  right: 5px !important;
  left: initial;
  transition: all 0.3s;
}
.paramsContent >>> .el-input--prefix .el-input__inner {
  padding-left: 10px;
}
</style>
