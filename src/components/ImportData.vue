<template>
  <div class="mainContainer">
    <div class="titleClass">数据批量编码导入</div>
    <div class="functionBar">
      <!-- <span>输入地址：</span> -->
      <!-- <el-input v-model="search" size="mini" placeholder="信息内容" /> -->
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="110px"
        :inline="true"
        style="margin-top: 14px !important"
      >
        <el-form-item label="输入地址:" prop="address">
          <el-input
            style="width: 300px !important"
            resize="none"
            v-model="ruleForm.address"
            placeholder="请输入文件地址"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="dataShow"> 数据展示</el-button>
          <el-button type="primary" @click="importDataClick"> 入 库</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table-container">
      <import-data-table ref="importDataTable"></import-data-table>
    </div>
  </div>
</template>
<script>
import ImportDataTable from "./subs/ImportDataTable.vue";
import { server } from "../network/api";
export default {
  data() {
    return {
      title: "数据导入",
      ruleForm: {
        address: "E:\\shp\\矢量点",
      },
      rules: {
        address: [
          { required: true, message: "请输入入库文件地址", trigger: "blur" },
        ],
      },
    };
  },
  components: {
    ImportDataTable,
  },
  mounted() {
  },
  methods: {
    dataShow() {
      this.$refs["ruleForm"].validate((valid) => {
        if (valid) {
          // 数据展示
          this.$refs["importDataTable"].toParentCall(this.ruleForm.address);
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    importDataClick() {
      this.$refs["ruleForm"].validate((valid) => {
        if (valid) {
          // 入库代码
          let param = {
            pathfiles: this.ruleForm.address,
          };
          this.loading = Loading.service({
            background: "rgba(0, 0, 0, 0.3)",
            fullscreen: true,
            lock: true,
          });
          server
            .importData(param)
            .then((response) => {
              this.loading.close();
              if (response.server_status == 200) {
                this.$message.success(response.message);
                // if (!response.hasFailure) {
                //   this.$message.success("恭喜您数据入库成功！");
                // } else {
                //   this.$message.error("抱歉，入库失败，请稍后重试！");
                // }
              }
            })
            .catch(() => {
              this.loading.close();
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
  },
};
</script>

<style scoped>
.mainContainer {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  padding: 5px;
  box-sizing: border-box; /* 避免 padding 导致容器被撑大*/
  background-image: url("../../public/images/common/boxbg.png");
  background-size: 100% 100%;
  background-repeat: no-repeat;
  background-position: center;
}
.titleClass {
  display: flex;
  width: 100%;
  height: 7%;
  box-sizing: border-box;
  font-size: 18px; /*no*/
  padding-left: 10px; /*no*/
  align-items: center;
  /* background-color: rgba(255, 255, 0, 0.459); */
  color: #53d7ff;
}
/* 功能栏 */
.functionBar {
  display: flex;
  width: 100%;
  height: 70px;
  /* background-color: rgb(7, 48, 7); */
  padding: 10px;
  box-sizing: border-box;
  align-items: center;
}
.functionBar >>> .el-input__inner {
  background: #0d3e6f;
  /* border: 1px solid #4167b2; */
  /* box-shadow: -2px -2px 4px 0 rgba(115, 170, 255, 0.5),
    2px 2px 4px 0 rgba(115, 170, 255, 0.5); */
}
/* 按钮 */
.functionBar >>> .el-button--primary {
  color: #fff;
  background: #104184 !important;
  border: 1px solid #4167b2 !important;
  width: 100px;
  height: 32px;
  cursor: pointer;
  margin: 0 10px !important;
}

.table-container {
  height: 100%;
  position: relative;
  padding: 10px;
  /* background-color: rgba(255, 255, 0, 0.534); */
}
</style>
