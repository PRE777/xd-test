<template>
  <div class="bottomContainer" v-if="isShow">
    <div class="headerContainer">
      <el-tabs v-model="activeName" @tab-click="tabsHandleClick">
        <el-tab-pane
          v-for="item in tabsData"
          :key="item.id"
          :label="item.label"
          :name="item.id"
        ></el-tab-pane>
      </el-tabs>
    </div>
    <div class="tableContainer">
      <div class="data-list-container">
        <div
          class="tableContent"
          v-loading="loading"
          element-loading-text="拼命加载中"
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(0, 0, 0, 0.3)"
        >
          <el-table v-if="true" :data="tableData" style="width: 100%" max-height="120">
            <el-table-column
              type="index"
              fixed="left"
              label="序号"
              align="center"
              width="50"
              v-if="tableData.length > 0"
            ></el-table-column>
            <el-table-column
              v-for="item in titleColumns"
              :key="item.key"
              :prop="item.key"
              :label="item.title"
              :show-overflow-tooltip="true"
              align="center"
              :width="cloumnWith(titleColumns.length)"
            ></el-table-column>
            <el-table-column
              label="操作"
              width="150"
              v-if="activeName == '栅格' && tableData.length > 0"
            >
              <template slot-scope="scope">
                <el-button
                  @click="upImage(scope.$index, scope.row)"
                  type="text"
                  size="small"
                  >上 图</el-button
                >
                <el-button
                  @click="downLoad(scope.$index, scope.row)"
                  type="text"
                  size="small"
                  >下 载</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="page-control" v-if="tableData.length > 0">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="page_num"
            :page-sizes="[2, 5, 10, 20]"
            :page-size="page_size"
            :pager-count="5"
            layout="total, sizes, prev, pager, next, jumper"
            :total="totalCounts"
          ></el-pagination>
        </div>
      </div>
    </div>
    <div class="closeButton" @click="close"></div>
  </div>
</template>
<script>
import { server } from "../../network/api";
import { addImage, removeLayer } from "../../assets/js/tool/upLoadImage";
import { downLoad } from "../../assets/js/tool/downLoad";
import { baseUrl } from "../../network/env";

export default {
  props: ["mapViewer"],
  data() {
    return {
      loading: true,
      isShow: false,
      // tabs 数据
      tabsData: [],
      activeName: "",
      // 表格数据
      tableData: [],
      titleColumns: [],
      totalCounts: 100, // 总条数
      page_size: 2, // 每页最大数据条数
      page_num: 1, // 当前页码
      tableParam: undefined, // table 请求参数
      combinationParam: undefined, // 组合查询参数
    };
  },
  //计算属性
  computed: {
    treeSelectedData() {
      return this.$store.getters["dataType/getData"];
    },
  },
  //监听执行
  watch: {
    treeSelectedData(val) {
      if (val.length == 0) {
        this.close();
        return;
      }
      this.tabsData = val;
      //   this.isShow = true;
      let that = this;
      let result = this.tabsData.find((item) => {
        return item.id == that.activeName;
      });
      if (result === undefined) {
        this.activeName = val[0].id;
        if (!this.isShow) {
          return;
        }
        this.reloadTable();
      }
    },
  },
  created() {
    let that = this;
    this.$bus.$off("reloadTable");
    this.$bus.$on("reloadTable", (param) => {
      if (param) {
        that.tableParam = param;
        that.requestTableData();
      }
    });
    this.$bus.$off("combination_query");
    this.$bus.$on("combination_query", (param) => {
      if (param) {
        that.combinationParam = param;
        that.reloadTable();
      } else {
        that.combinationParam = null;
      }
    });
  },
  mounted() {
    this.$nextTick(() => {
      if (!this.isShow) {
        return;
      }
      this.tabsData = this.$store.getters["dataType/getData"];
      this.activeName = this.tabsData[0].id;
    });
  },
  methods: {
    tabsHandleClick() {
      this.reloadTable();
      console.log(this.activeName);
    },

    // 改变每页最大显示条数
    handleSizeChange(val) {
      this.page_size = val;
      this.page_num = 1;
      this.requestTableData();
    },

    // 切换当前页
    handleCurrentChange(val) {
      this.page_num = val;
      this.requestTableData();
    },
    // table 勾选
    handleSelectionChange(val) {},

    // 数据展示接口
    requestTableData() {
      let param = {
        pageSize: this.page_size,
        pageNum: this.page_num,
        search_geojson: this.tableParam.geo_json,
        geoLevel: this.tableParam.geoLevel,
        catagory_code: this.activeName,
      };
      if (this.combinationParam) {
        // 组合查询参数
        param["start_time"] = this.combinationParam.start_time;
        param["end_time"] = this.combinationParam.end_time;
        param["hylaea"] = this.combinationParam.hylaea;
        param["name"] = this.combinationParam.name;
      }
      this.loading = true;
      server.showDataByGrid(param).then((response) => {
        this.loading = false;
        if (response.server_status == 200) {
          this.isShow = true;
          this.tableData = response.data.tableData;
          this.titleColumns = response.data.titleColumns;
          this.totalCounts = response.data.count;
        }
      });
    },
    // 刷新table
    reloadTable() {
      this.tableData = [];
      this.titleColumns = [];
      this.totalCounts = "";
      this.page_num = 1;
      this.requestTableData();
    },

    cloumnWith(num) {
      if (num <= 5 && num >= 0) {
        return 450;
      } else if (num <= 10 && num > 5) {
        return 350;
      } else if (num > 10) {
        return 300;
      }
    },
    close() {
      this.isShow = false;
    },
    // 上图
    upImage(index, row) {
      //   let lblng = parseFloat(row.BottomLeftLongitude);
      //   let lblat = parseFloat(row.BottomLeftLatitude);
      //   let rtlng = parseFloat(row.TopRightLongitude);
      //   let rtlat = parseFloat(row.TopRightLatitude);
      let lblng = parseFloat(row.lblng);
      let lblat = parseFloat(row.lblat);
      let rtlng = parseFloat(row.rtlng);
      let rtlat = parseFloat(row.rtlat);
      let id = row._id ? row._id : "";
      let param = {
        minLng: lblng,
        minLat: lblat,
        maxLng: rtlng,
        maxLat: rtlat,
      };
    //   let lat = parseFloat(row.lat);
    //   let lng = parseFloat(row.lng);
      //   if (fly) {
      param["fly"] = true;
      //   }
      console.log("lblng:::" + lblng);
      let url =
        baseUrl +
        `/cut?id=${id}&lblng=${lblng}&lblat=${lblat}&rtlng=${rtlng}&rtlat=${rtlat}`;
      //   let url =
      //     baseUrl +
      //     `/cut?id=${id}&lat=${lat}&lng=${lng}`;
      console.log("url :::: =" + url);
      param["url"] = url;
      addImage(this.mapViewer, param);
    },
    // 下载
    downLoad(indec, row) {
      let fileName = "数据下载.zip";
      downLoad(row._id, fileName);
    },
  },
};
</script>

<style scoped>
.bottomContainer {
  display: flex;
  flex-direction: column;
  height: 205px;
  background: #0b1a40;
  border: 1px solid #4167b2;
  z-index: 9998;
  padding: 5px 5px;
  position: absolute;
  bottom: 5px;
  left: 5px;
  right: 5px;
}
.headerContainer {
  display: flex;
  height: 40px;
  padding: 0 10px;
  /* background-color: rgba(166, 255, 0, 0.404); */
}
.tableContainer {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background: transparent;
  /* border: 1px solid rgb(60, 117, 219); */
  z-index: 9998;
}
.data-list-container {
  display: flex;
  flex-direction: column;
  position: relative;
}
/* tabs 样式 */
.bottomContainer >>> .el-tabs__item {
  width: initial !important;
  padding: 0 10px !important;
  cursor: pointer;
  font-size: 13px;
}
.bottomContainer >>> .el-tabs__item.is-active {
  color: #59d7ff;
  letter-spacing: 0;
}
.bottomContainer >>> .el-tabs__active-bar {
  background-color: #59d7ff;
}
.bottomContainer >>> .el-tabs__nav-wrap::after {
  background-color: transparent;
}
/* 关闭按钮 */
.closeButton {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 11px;
  height: 12px;
  cursor: pointer;
  background-image: url("../../../public/images/common/close.png");
  background-size: 100% 100%;
  background-repeat: no-repeat;
  background-position: center;
}
</style>
