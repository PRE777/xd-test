<template>
  <div class="combinationContainer" id="combinationId">
    <div class="combContent">
      <span class="spanClass">生产时间</span>
      <el-form :model="ruleForm" ref="ruleForm" label-width="80px">
        <el-form-item label="开始时间" prop="startDate">
          <el-date-picker
            v-model="ruleForm.startDate"
            type="date"
            resize="none"
            style="width: 150px"
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
            style="width: 150px"
            placeholder="选择日期"
            :clearable="false"
          >
          </el-date-picker>
        </el-form-item>
        <!-- <el-form-item class="handle">
          <el-button type="primary" @click="dataShow"> 数据展示</el-button>
          <el-button type="primary" @click="importDataClick"> 入 库</el-button>
        </el-form-item> -->
      </el-form>
      <span class="spanClass">属性查询</span>
      <el-form :model="ruleForm" ref="ruleForm" label-width="80px">
        <el-form-item label="气 候" prop="hylaea">
          <el-select
            :clearable="true"
            v-model="ruleForm.hylaea"
            style="width: 150px"
            placeholder="请选择气候"
          >
            <el-option
              v-for="item in hylaeaArr"
              :key="item.name"
              :label="item.name"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="地 区" prop="resolution">
          <el-select
            :clearable="true"
            v-model="ruleForm.address"
            style="width: 150px"
            placeholder="请选择分地区"
          >
            <el-option
              v-for="item in addressArr"
              :key="item.name"
              :label="item.name"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="handle" style="margin-left: 40px">
          <el-button type="primary" @click="dataQuery"> 查 询</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import { dateFormat } from "../../assets/js/tool/DateDeal";
export default {
  data() {
    return {
      ruleForm: {
        startDate: undefined,
        endDate: undefined,
        hylaea: undefined, // 气候
        address: undefined, // 地区
      },
      //   II 中温带
      hylaeaArr: [
        { name: "II 中温带", value: "II 中温带" },
        { name: "H 高原气候区", value: "H 高原气候区" },
        { name: "III 南温带", value: "III 南温带" },
        { name: "VI 南亚热带", value: "VI 南亚热带" },
      ],

      addressArr: [
        { name: "伊宁区", value: "伊宁区" },
        { name: "藏南区", value: "藏南区" },
        { name: "晋陕甘区", value: "晋陕甘区" },
        { name: "滇南区", value: "滇南区" },
        { name: "柴达木区", value: "柴达木区" },
        { name: "蒙东区", value: "蒙东区" },
      ],
    };
  },
  mounted() {
    this.activated();
  },
  methods: {
    activated() {
      this.$nextTick(() => {
        this.setBottom();
        window.onresize = () => {
          return (() => {
            this.setBottom();
          })();
        };
      });
    },
    setBottom() {
      let domObj = document.getElementById("gridsSelectedId");
      console.log(domObj.offsetTop, domObj.offsetHeight);
      let obj = document.getElementById("combinationId");
      obj.style.top = `${domObj.offsetTop + domObj.offsetHeight - obj.offsetHeight}px`;
    },
    dataQuery() {
      this.$refs["ruleForm"].validate((valid) => {
        if (this.ruleForm.endDate && this.ruleForm.startDate) {
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
        // 组合查询
        let param = {
          start_time: dateFormat("YYYY-mm-dd", this.ruleForm.startDate),
          end_time: dateFormat("YYYY-mm-dd", this.ruleForm.endDate),
          hylaea: this.ruleForm.hylaea,
          name: this.ruleForm.address,
        };
        this.$bus.$emit("combination_query", param);
      });
    },
  },
};
</script>
<style scoped>
.combinationContainer {
  display: flex;
  flex-direction: column;
  width: 260px;
  height: 350px;
  box-sizing: border-box; /* 避免 padding 导致容器被撑大*/
  background-image: url("../../../public/images/common/combinationBox.png");
  background-size: 100% 100%;
  background-repeat: no-repeat;
  background-position: center;
  position: absolute;
  /* top: 200px; */
  right: 90px;
  padding: 40px 5px 5px 5px;
  box-sizing: border-box;
}
.combContent {
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
.combContent >>> .el-button--primary {
  color: #fff;
  width: 100px;
  height: 32px;
  cursor: pointer;
  margin: 0 10px !important;
  background: #104184;
  border: 1px solid #4167b2;
}
.combContent >>> .el-input__prefix {
  right: 5px !important;
  left: initial;
  transition: all 0.3s;
}
.combContent >>> .el-input--prefix .el-input__inner {
  padding-left: 10px;
}
</style>
