<template>
  <div class="mainContent">
    <div class="titleClass">统计条件</div>
    <div class="paramsContent">
      <span class="spanClass">数据类型</span>
      <el-form :model="ruleForm" ref="ruleForm">
        <el-select
          multiple
          collapse-tags
          v-model="ruleForm.dataType"
          style="width: 215px ! important"
          placeholder="请选择数据类型"
        >
          <el-option
            v-for="item in dataTypeArr"
            :key="item.name"
            :label="item.name"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form>
      <span class="spanClass">时间范围</span>
      <el-form :model="ruleForm" ref="ruleForm" label-width="80px">
        <el-form-item label="开始时间" prop="startDate">
          <el-date-picker
            v-model="ruleForm.startDate"
            type="date"
            resize="none"
            style="width: 150px ! important"
            placeholder="选择日期"
            :clearable="false"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间" prop="startDate">
          <el-date-picker
            v-model="ruleForm.endDate"
            type="date"
            resize="none"
            style="width: 150px ! important"
            placeholder="选择日期"
            :clearable="false"
          >
          </el-date-picker>
        </el-form-item>
      </el-form>
      <!-- <span class="spanClass">空间范围</span> -->
      <el-form :model="ruleForm" ref="ruleForm">
        <!-- <el-radio-group v-model="ruleForm.spaceCode" class="radio-group">
          <el-radio :label="1">全部范围</el-radio>
          <el-radio :label="2">单网格</el-radio>
          <el-radio :label="3">多网格</el-radio>
          <el-radio :label="4">
            <el-select v-model="ruleForm.address" style="width: 150px">
              <el-option
                v-for="item in addressArr"
                :key="item.name"
                :label="item.name"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-radio>
        </el-radio-group> -->
        <el-form-item>
          <el-button type="primary" @click="statisticsWithDate"> 分时统计</el-button>
          <el-button type="primary" @click="statisticsWithCategory"> 分类统计</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { server } from "../../network/api";
import { dateFormat } from "../../assets/js/tool/DateDeal";
export default {
  data() {
    return {
      loading: "",
      dataTypeArr: [],
      ruleForm: {
        spaceCode: 1, // 空间范围
        dataType: [],
        startDate: "",
        endDate: "",
        lookType: 1, // 总数据量，更新数据量
        address: "北京",
      },
      dataTypeArr: [
        // { name: "全部数据", value: "全部数据" },
        { name: "矢量点", value: "矢量点" },
        { name: "矢量线", value: "矢量线" },
        { name: "矢量面", value: "矢量面" },
        { name: "矢量体", value: "矢量体" },
        { name: "栅 格", value: "栅格" },
        { name: "体元数据模型", value: "体元数据模型" },
      ],
      addressArr: [
        { name: "北京", value: "北京" },
        { name: "河北", value: "河北" },
        { name: "天津", value: "天津" },
      ],
    };
  },
  mounted() {},
  methods: {
    //  分时统计
    statisticsWithDate() {
      this.$refs["ruleForm"].validate((valid) => {
        if (!this.ruleForm.startDate && !this.ruleForm.endDate) {
          this.$message.warning("请选择时间！");
          return;
        } else if (this.ruleForm.endDate && this.ruleForm.startDate) {
          if (this.ruleForm.endDate < this.ruleForm.startDate) {
            this.$message.warning("起始时间不得大于结束时间！");
            return;
          }
        } else if (this.ruleForm.startDate && !this.ruleForm.endDate) {
          this.$message.warning("请选择结束时间！");
          return;
        } else if (!this.ruleForm.startDate && this.ruleForm.endDate) {
          this.$message.warning("请选择开始时间！");
          return;
        }
        this.requestStatisticsWithTime();
      });
    },
    statisticTimeShow(val) {
      this.$emit("statisticCatagoryShow", val, "time");
    },
    // 分类统计
    statisticsWithCategory() {
      if (this.ruleForm.dataType.length == 0) {
        this.$message.warning("请选择数据类型！");
        return;
      }
      this.requestStatisticsWithCatagory();
    },
    statisticCatagoryShow(val) {
      this.$emit("statisticCatagoryShow", val, "catagroy");
    },
    // 请求数据
    requestStatisticsWithCatagory() {
      let catagory_code = this.ruleForm.dataType.join(",");
      let param = {
        catagory_code: catagory_code,
      };
      this.loading = Loading.service({
        background: "rgba(0, 0, 0, 0.3)",
        fullscreen: true,
        lock: true,
      });
      server
        .dataCountByClass(param)
        .then((response) => {
          this.loading.close();
          if (response.server_status == 200) {
            let data = response.data;
            this.statisticCatagoryShow(data);
          }
        })
        .catch(() => {
          this.loading.close();
        });
    },
    requestStatisticsWithTime() {
      let start = dateFormat("YYYY-mm-dd", this.ruleForm.startDate);
      let end = dateFormat("YYYY-mm-dd", this.ruleForm.endDate);
      let param = {
        start_time: dateFormat("YYYY-mm-dd", this.ruleForm.startDate),
        end_time: dateFormat("YYYY-mm-dd", this.ruleForm.endDate),
      };
      if (this.ruleForm.dataType.length > 0) {
        let catagory_code = this.ruleForm.dataType.join(",");
        param["catagory_code"] = catagory_code;
      }
      this.loading = Loading.service({
        background: "rgba(0, 0, 0, 0.3)",
        fullscreen: true,
        lock: true,
      });
      server
        .dataCountByTime(param)
        .then((response) => {
          this.loading.close();
          if (response.server_status == 200) {
            let data = response.data;
            data["title"] = { start: start, end: end };
            this.statisticTimeShow(data);
          }
        })
        .catch(() => {
          this.loading.close();
        });
    },
  },
};
</script>

<style scoped>
.mainContent {
  display: flex;
  flex-direction: column;
  width: 250px;
  height: 300px;
  padding: 5px;/*no*/
  box-sizing: border-box; /* 避免 padding 导致容器被撑大*/
  background-image: url("../../../public/images/common/statisticConfig.png");
  background-size: 100% 100%;
  background-repeat: no-repeat;
  background-position: center;
  position: absolute;
  top: 10px;
  left: 5px;
}
.titleClass {
  display: flex;
  width: 165px;
  height: 40px;
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
  font-size: 16px;
  color: #d9ddff;
  letter-spacing: 0;
  text-align: start;
  padding-left: 10px;
  box-sizing: border-box;
}
.radio-group {
  display: flex;
  flex-direction: column;
  height: 120px;
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
/* .paramsContent >>> .el-select__tags {
  display: block;
  white-space: nowrap ;
  overflow-x: scroll;
} */
.el-select-dropdown.is-multiple .el-select-dropdown__item.selected,
.el-select-dropdown.is-multiple .el-select-dropdown__item.selected.hover {
  color: #fff;
  background-color: rgba(0, 150, 197, 1);
}
.paramsContent >>> .el-tag {
  font-size: 14px;
}
.paramsContent >>> .el-tag.el-tag--info {
  background-color: transparent;
  border-color: transparent;
  color: #ffffff;
}
.paramsContent >>> .el-select .el-tag__close.el-icon-close {
  background-color: transparent;
  border: 1px solid #fff;
}
.paramsContent >>> .el-tag.el-tag--info .el-tag__close {
  color: #fff;
}
</style>
