<template>
  <div class="tableContainer" v-if="isShow">
    <div class="data-list-container" ref="listContainer">
      <div
        class="tableContent"
        v-loading="loading"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.3)"
      >
        <el-table
          v-if="true"
          :data="tableData"
          style="width: 100%"
          :max-height="tableHeight"
        >
          <el-table-column
            type="index"
            label="序号"
            width="60"
            align="center"
            fixed="left"
            v-if="tableData.length > 0"
          ></el-table-column>

          <!-- <el-table-column
            type="selection"
            width="55"
            fixed
            @selection-change="handleSelectionChange"
            v-if="tableData.length > 0"
          ></el-table-column> -->

          <el-table-column
            v-for="item in titleColumns"
            :key="item.key"
            :prop="item.key"
            :label="item.title"
            :show-overflow-tooltip="true"
            align="center"
            :width="cloumnWith(titleColumns.length)"
          ></el-table-column>
        </el-table>
      </div>
      <div class="page-control" v-if="tableData.length > 0">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="page_num"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="page_size"
          :pager-count="5"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalCounts"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
import { server } from "../../network/api";
export default {
//   props: ["pathFiles"],
  data() {
    return {
      isShow: true,
      loading: false,
      // 表格数据
      tableData: [],
      titleColumns: [],
      tableHeight: 0, // table 高度
      totalCounts: 100, // 总条数
      page_size: 20, // 每页最大数据条数
      page_num: 1, // 当前页码
      setTableHeight: null,
      pathFiles: "",
    };
  },
  created() {},
  mounted() {
    window.onresize = () => {
      return (() => {
        if (this.$refs.listContainer) {
          this.setTableHeight.call(this);
        }
      })();
    };
    //更新table表格高度
    this.setTableHeight = function () {
      this.$nextTick(() => {
        this.tableHeight =
          (this.$refs.listContainer && this.$refs.listContainer.offsetHeight) - 70;
        console.log(this.tableHeight);
      });
    };
    this.setTableHeight.call(this);
  },
  methods: {
    // 改变每页最大显示条数
    handleSizeChange(val) {
      this.page_size = val;
      this.page_num = 1;
      this.showDataByPath();
    },

    // 切换当前页
    handleCurrentChange(val) {
      this.page_num = val;
      this.showDataByPath();
    },
    // table 勾选
    handleSelectionChange(val) {},

    // 数据展示接口
    showDataByPath() {
      let param = {
        pathfiles: this.pathFiles,
        pageSize: this.page_size,
        pageNum: this.page_num,
      };
      this.loading = true;
      server
        .importDataShow(param)
        .then((response) => {
          this.loading = false;
          if (response.server_status == 200) {
            this.tableData = response.data.tableData;
            this.titleColumns = response.data.titleColumns;
            this.totalCounts = response.data.count;
          }
        })
        .catch(() => {
          this.loading = false;
        });
    },

    // 子组件的函数供父组件调用
    toParentCall(address) {
      this.page_num = 1;
      this.pathFiles = address;
      this.showDataByPath(address);
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
  },
};
</script>

<style scoped>
.tableContainer {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background: transparent;
  /* border: 1px solid rgb(60, 117, 219); */
  z-index: 9998;
  /* padding: 5px 10px; */
  position: relative;
}
</style>
