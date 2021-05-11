<template>
  <div class="bottomContainer" v-if="isShow">
    <div class="leftTableContainer" v-if="leftShow">
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
        <div
          class="data-list-container"
          v-loading="loading"
          element-loading-text="拼命加载中"
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(0, 0, 0, 0.4)"
        >
          <div class="tableContent">
            <el-table v-if="true" :data="tableData" style="width: 100%" max-height="120">
              <el-table-column
                type="index"
                label="序号"
                width="60"
                align="center"
                fixed="left"
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
                width="180"
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
                    @click="relevanceClick(scope.$index, scope.row)"
                    type="text"
                    size="small"
                    >关联数据</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div class="page-control" v-if="tableData.length > 0">
            <el-pagination
              @current-change="handleCurrentChange"
              :current-page="page_num"
              :page-sizes="[2, 5, 10, 20]"
              :page-size="page_size"
              :pager-count="5"
              layout="total, prev, pager, next, jumper"
              :total="totalCounts"
            ></el-pagination>
          </div>
        </div>
      </div>
      <div class="closeButton" @click="leftClose"></div>
    </div>
    <div class="rightTableContainer" v-if="rightShow">
      <div class="headerContainer">
        <el-tabs v-model="activeName1" @tab-click="tabsHandleClick1">
          <el-tab-pane
            v-for="item in tabsData1"
            :key="item.id"
            :label="item.label"
            :name="item.id"
          ></el-tab-pane>
        </el-tabs>
      </div>
      <div class="tableContainer">
        <div
          class="data-list-container"
          v-loading="loading1"
          element-loading-text="拼命加载中"
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(0, 0, 0, 0.4)"
        >
          <div class="tableContent">
            <el-table v-if="true" :data="tableData1" style="width: 100%" max-height="120">
              <el-table-column
                type="index"
                label="序号"
                width="60"
                align="center"
                fixed="left"
                v-if="tableData1.length > 0"
              ></el-table-column>
              <el-table-column
                v-for="item in titleColumns1"
                :key="item.key"
                :prop="item.key"
                :label="item.title"
                :show-overflow-tooltip="true"
                align="center"
                :width="cloumnWith(titleColumns1.length)"
              ></el-table-column>
            </el-table>
          </div>
          <div class="page-control" v-if="tableData1.length > 0">
            <el-pagination
              @current-change="handleCurrentChange1"
              :current-page="page_num1"
              :page-sizes="[2, 5, 10, 20]"
              :page-size="page_size1"
              :pager-count="5"
              layout="total, prev, pager, next, jumper"
              :total="totalCounts1"
            ></el-pagination>
          </div>
        </div>
      </div>
      <div class="closeButton" @click="rightClose"></div>
    </div>
  </div>
</template>
<script>
import { server } from "../../network/api";
import { addImage, removeLayer } from "../../assets/js/tool/upLoadImage";
import { baseUrl } from "../../network/env";

export default {
  props: ["mapViewer"],
  data() {
    return {
      loading: true,
      loading1: true,
      isShow: false,
      leftShow: false,
      rightShow: false,
      // tabs 数据
      tabsData: [],
      tabsData1: [],
      activeName: "",
      activeName1: "",
      lastActiveName: "",
      lastActiveName1: "",
      // 表格数据
      tableData: [],
      titleColumns: [],
      totalCounts: 100, // 总条数
      page_size: 2, // 每页最大数据条数
      page_num: 1, // 当前页码
      // 右侧表格数据
      tableData1: [],
      titleColumns1: [],
      totalCounts1: 100, // 总条数
      page_size1: 2, // 每页最大数据条数
      page_num1: 1, // 当前页码

      tableParam: undefined, // table 请求参数

      relevance: undefined, // 关联数据 所用参数
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
      this.initParam(val);
    },
  },
  created() {
    let that = this;
    this.$bus.$off("reloadTable");
    this.$bus.$on("reloadTable", (param) => {
      if (!param) {
        that.tableParam = undefined;
        that.resetParam();
        return;
      }
      that.initParam(that.$store.getters["dataType/getData"]);
      that.isShow = true;
      that.tableParam = param;
      if (that.activeName && that.activeName != "") {
        that.requestTableData();
      }
      if (that.activeName1 && that.activeName1 != "") {
        that.requestRightTableData();
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
    resetParam() {
      this.isShow = false;
      this.leftShow = false;
      this.rightShow = false;
      this.activeName = "";
      this.activeName1 = "";
      this.lastActiveName = "";
      this.lastActiveName1 = "";
      this.relevance = undefined;
      this.tableData = [];
      this.tabsData1 = [];
    },
    // 初始化数据
    initParam(val) {
      if (val.length == 0) {
        this.resetParam();
        this.close();
        return;
      }
      let tempTabsData = JSON.parse(JSON.stringify(val));
      let index = tempTabsData.findIndex((item) => {
        return item.id == "栅格";
      });

      if (index != -1) {
        if (this.activeName != "栅格") {
          this.activeName = "栅格";
          this.leftShow = true;
          this.tabsData = tempTabsData.splice(index, 1);
          this.tabsData1 = tempTabsData;
          //   if (this.isShow && this.leftShow) {
          if (this.activeName !== this.lastActiveName) {
            this.reloadTable();
          }
          // return;
          //   }
        } else {
          tempTabsData.splice(index, 1);
          this.tabsData1 = tempTabsData;
        }
      } else {
        this.activeName = "";
        this.leftShow = false;
        this.tabsData1 = tempTabsData;
      }
      if (this.tabsData1.length == 0) {
        this.rightShow = false;
        return;
      }
      this.rightShow = true;
      let that = this;
      let result = this.tabsData1.find((item) => {
        return item.id == that.activeName1;
      });

      if (result === undefined) {
        this.activeName1 = this.tabsData1[0].id;
        // if (!this.isShow || !this.rightShow) {
        //   return;
        // }
        // this.reloadTable1();
      }
      if (this.tableParam) {
        if (this.lastActiveName1 !== this.activeName1) {
          this.reloadTable1();
        }
      }
    },
    //   左侧列表
    tabsHandleClick(val) {
      this.lastActiveName = val.name;
      this.reloadTable();
      console.log(this.activeName);
    },
    // 右侧列表
    tabsHandleClick1(val) {
      this.lastActiveName1 = val.name;
      this.reloadTable1();
      console.log(this.activeName);
    },

    // 改变每页最大显示条数
    handleSizeChange(val) {
      this.page_size = val;
      this.page_num = 1;
      this.requestTableData();
    },
    // 右侧
    handleSizeChange1(val) {
      this.page_size1 = val;
      this.page_num = 1;
      this.requestRightTableData();
    },

    // 切换当前页
    handleCurrentChange(val) {
      this.page_num = val;
      this.requestTableData();
    },
    // 切换当前页 右侧列表
    handleCurrentChange1(val) {
      this.page_num1 = val;
      this.requestRightTableData();
    },

    // 数据展示接口
    requestTableData() {
      if (!this.tableParam) {
        return;
      }
      let param = {
        pageSize: this.page_size,
        pageNum: this.page_num,
        search_geojson: this.tableParam.geo_json,
        geoLevel: this.tableParam.geoLevel,
        catagory_code: this.activeName,
      };
      this.loading = true;
      server
        .showDataByGrid(param)
        .then((response) => {
          this.loading = false;
          if (response.server_status == 200) {
            this.leftShow = true;
            this.isShow = true;
            this.tableData = response.data.tableData;
            this.titleColumns = response.data.titleColumns;
            this.totalCounts = response.data.count;
          }
        })
        .catch(() => {
          this.loading = false;
        });
    },

    // 数据展示接口
    requestRightTableData() {
      if (!this.tableParam) {
        return;
      }
      let param = {
        pageSize: this.page_size1,
        pageNum: this.page_num1,
        search_geojson: this.tableParam.geo_json,
        geoLevel: this.tableParam.geoLevel,
        catagory_code: this.activeName1,
      };
      this.loading1 = true;
      server
        .showDataByGrid(param)
        .then((response) => {
          this.loading1 = false;
          if (response.server_status == 200) {
            this.rightShow = true;
            this.isShow = true;
            this.tableData1 = response.data.tableData;
            this.titleColumns1 = response.data.titleColumns;
            this.totalCounts1 = response.data.count;
          }
        })
        .catch(() => {
          this.loading1 = false;
        });
    },
    // 数据关联查询
    relevanceQuery() {
      if (!this.tableParam) {
        return;
      }
      let param = {
        id: this.relevance,
        pageSize: this.page_size1,
        pageNum: this.page_num1,
        catagory_code: this.activeName1,
      };
      this.loading1 = true;
      server
        .relevanceQuery(param)
        .then((response) => {
          this.loading1 = false;
          if (response.server_status == 200) {
            this.rightShow = true;
            this.isShow = true;
            this.tableData1 = response.data.tableData;
            this.titleColumns1 = response.data.titleColumns;
            this.totalCounts1 = response.data.count;
          }
        })
        .catch(() => {
          this.loading1 = false;
        });
    },

    // 刷新table
    reloadTable() {
      //左侧table
      this.tableData = [];
      this.titleColumns = [];
      this.totalCounts = "";
      this.page_num = 1;
      this.requestTableData();
    },
    reloadTable1() {
      // 右侧table
      this.tableData1 = [];
      this.titleColumns1 = [];
      this.totalCounts1 = "";
      this.page_num1 = 1;
      if (this.relevance) {
        this.relevanceQuery();
      } else {
        this.requestRightTableData();
      }
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

    leftClose() {
      this.leftShow = false;
      this.relevance = undefined;
      this.activeName = "";
      this.close();
    },
    rightClose() {
      this.rightShow = false;
      //   this.activeName1 = "";
      this.relevance = undefined;
      this.close();
    },
    close() {
      if (!this.leftShow && !this.rightShow) {
        this.isShow = false;
      } else {
        this.isShow = true;
      }
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
      //   if (fly) {
      param["fly"] = true;
      //   }
      console.log("lblng:::" + lblng);
      let url =
        baseUrl +
        `/cut?id=${id}&lblng=${lblng}&lblat=${lblat}&rtlng=${rtlng}&rtlat=${rtlat}`;
      console.log("url :::: =" + url);
      param["url"] = url;
      addImage(this.mapViewer, param);
    },
    // 数据关联
    relevanceClick(index, row) {
      this.relevance = row._id;
      if (this.tabsData1.length == 0) {
        this.$message.warning("请选择其他数据类型！");
        return;
      }
      this.reloadTable1();
    },
  },
};
</script>

<style scoped>
.bottomContainer {
  display: flex;
  /* flex-direction: row; */
  height: 205px;
  background: transparent;
  /* border: 1px solid #4167b2; */
  z-index: 9998;
  /* padding: 5px 5px; */
  position: absolute;
  justify-content: space-between;
  bottom: 5px;
  left: 5px;
  right: 5px;
}
.leftTableContainer {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  width: 50%;
  height: 100%;
  padding: 0 10px;
  background: #0b1a40;
  border: 1px solid #4167b2;
  box-sizing: border-box;
  position: relative;
}
.rightTableContainer {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  width: 50%;
  height: 100%;
  padding: 0 10px;
  background: #0b1a40;
  border: 1px solid #4167b2;
  box-sizing: border-box;
  position: relative;
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
