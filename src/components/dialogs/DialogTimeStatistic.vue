<template>
  <div class="mainContent" v-drag>
    <div class="headerContainer">{{ title }}</div>
    <div class="closeButton" @click="close"></div>
    <div class="echartContainer">
      <span class="echartContent_span">数量（个）</span>

      <div class="echartContent" id="echart1"></div>
      <div class="echartContent" id="echart2"></div>
    </div>
    <!-- <div class="echartContainer" id="echart"></div> -->
    <!-- <div class="unitClass">数量（个）</div> -->
  </div>
</template>

<script>
import * as echarts from "echarts";

export default {
  props: {
    data: Object,
    isShow: Boolean,
  },
  data() {
    return {
      tempData: [],
      echart1: "",
      echart2: "",
      yMax: 500,
      nameArr1: [],
      numArr1: [],
      nameArr2: [],
      numArr2: [],
      title: "2020-02-15到2021-03-18统计展示",
      //   colors ['#5793f3', '#d14a61', '#675bba'];

      zheOptions1: {
        title: {
          text: "更新数量展示",
          left: "center",
          textStyle: {
            fontFamily: "Arial, Verdana, sans...",
            fontSize: 13,
            fontStyle: "normal",
            fontWeight: "normal",
            color: "#fff",
          },
        },
        tooltip: {
          // trigger: "none",
          trigger: "axis",
          axisPointer: {
            // type: "cross",
          },
        },
        xAxis: {
          type: "category",
          axisTick: {
            alignWithLabel: true,
          },
          data: [],
          axisLine: {
            onZero: false,
            lineStyle: {
              color: "#999999",
            },
          },
          axisLabel: {
            // interval: 4,
            color: "#FFFFFF",
            startValue: 0, // 从头开始
          },
        },
        grid: {
          bottom: 50,
          left: 50,
        },
        yAxis: {
          type: "value",
          axisLine: {
            show: true,
            onZero: false,
            lineStyle: {
              color: "#999999",
            },
          },
          axisTick: { show: false },
          margin: 2,
          axisLabel: {
            interval: 0,
            color: "#FFFFFF",
            formatter: function (value, index) {
              if (value >= 10000 && value < 10000000) {
                value = value / 10000 + "万";
              } else if (value >= 10000000) {
                value = value / 10000000 + "千万";
              } else if (value >= 100000000) {
                value = value / 100000000 + "亿";
              }
              return value;
            },
          },
          //网格样式
          splitLine: {
            show: true,
            lineStyle: {
              color: "#999999",
              width: 1,
              type: "solid",
            },
          },
          axisPointer: {
            label: {
              textStyle: {
                color: "#000",
              },
            },
          },
        },

        series: [
          {
            data: [],
            type: "line",
          },
        ],
      },
      zheOptions2: {
        title: {
          text: "总数量展示",
          left: "center",
          textStyle: {
            fontFamily: "Arial, Verdana, sans...",
            fontSize: 13,
            fontStyle: "normal",
            fontWeight: "normal",
            color: "#fff",
          },
        },
        tooltip: {
          //   trigger: "none",
          trigger: "axis",
          axisPointer: {
            // type: "cross",
          },
        },
        xAxis: {
          type: "category",
          data: [],
          axisLine: {
            onZero: false,
            lineStyle: {
              color: "#999999",
            },
          },
          axisLabel: {
            // interval: 0,
            color: "#FFFFFF",
            startValue: 0, // 从头开始

            // formatter: function (value) {
            //   return value.split("").join("\n");
            // },
          },
        },
        grid: {
          bottom: 50,
          left: 50,
        },
        yAxis: {
          type: "value",
          axisLine: {
            show: true,
            onZero: false,
            lineStyle: {
              color: "#999999",
            },
          },
          axisTick: { show: false },
          margin: 2,
          axisLabel: {
            interval: 0,
            color: "#FFFFFF",
            formatter: function (value, index) {
              if (value >= 10000 && value < 10000000) {
                value = value / 10000 + "万";
              } else if (value >= 10000000) {
                value = value / 10000000 + "千万";
              } else if (value >= 100000000) {
                value = value / 100000000 + "亿";
              }
              return value;
            },
          },
          //网格样式
          splitLine: {
            show: true,
            lineStyle: {
              color: "#999999",
              width: 1,
              type: "solid",
            },
          },
          axisPointer: {
            label: {
              textStyle: {
                color: "#000",
              },
            },
          },
        },

        series: [
          {
            data: [],
            type: "line",
          },
        ],
      },
    };
  },

  watch: {
    data: {
      handler(newVal) {
        this.title = `${newVal.title.start}到${newVal.title.end} 统计展示`;
        this.nameArr1 = [];
        this.numArr1 = [];
        this.nameArr2 = [];
        this.numArr2 = [];
        for (const item of newVal.update) {
          this.nameArr1.push(item.time);
          this.numArr1.push(item.count);
        }
        for (const item of newVal.count) {
          this.nameArr2.push(item.time);
          this.numArr2.push(item.count);
        }
        this.reloadEchart();
      },
      immediate: true, // 立即执行，否则不刷新界面
      deep: true,
    },
  },
  mounted() {
    this.reloadEchart();
  },
  methods: {
    reloadEchart() {
      this.$nextTick(() => {
        if (!this.echart1) {
          var chartDom = document.getElementById("echart1");
          this.echart1 = echarts.init(chartDom);
        }
        if (!this.echart2) {
          var chartDom = document.getElementById("echart2");
          this.echart2 = echarts.init(chartDom);
        }
        this.echart1.clear();
        this.echart2.clear();
        this.zheOptions1.xAxis.data = this.nameArr1;
        this.zheOptions1.series[0].data = this.numArr1;
        this.zheOptions2.xAxis.data = this.nameArr2;
        this.zheOptions2.series[0].data = this.numArr2;
        this.echart1.setOption(this.zheOptions1);
        this.echart2.setOption(this.zheOptions2);
      });
    },
    close() {
      this.$emit("closeDiologTime");
    },
  },
};
</script>

<style scoped>
.mainContent {
  display: flex;
  flex-direction: column;
  width: 630px;
  height: 460px;
  background: #0b1a40;
  border: 1px solid #4167b2;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.5);
  position: absolute;
  top: 60px;
  left: 300px;
  padding: 5px;
  box-sizing: border-box;
}
.headerContainer {
  display: flex;
  color: #fff;
  align-items: center;
  justify-content: center;
  height: 45px;
  padding: 5px 10px;
  /* background-color: rgba(166, 255, 0, 0.404); */
}
/* tabs 样式 */
.mainContent >>> .el-tabs__item {
  width: initial !important;
  padding: 0 10px !important;
  cursor: pointer;
  font-size: 14px;
}
.mainContent >>> .el-tabs__item.is-active {
  color: #59d7ff;
  letter-spacing: 0;
}
.mainContent >>> .el-tabs__active-bar {
  background-color: #59d7ff;
}
.mainContent >>> .el-tabs__nav-wrap::after {
  background-color: transparent;
}
/* echart */
.echartContainer {
  display: flex;
  width: 100%;
  height: 100%;
  /* background-color: turquoise; */
}
.echartContent {
  display: flex;
  width: 50%;
  height: 100%;
  /* background-color: violet; */
}
.echartContent_span {
  position: absolute;
  width: 100px;
  height: 30px;
  top: 50px;
  right: 5px;
  color: #fff;
  font-size: 13px;
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
.unitClass {
  position: absolute;
  top: 30px;
  right: 15px;
  font-family: PingFangSC-Semibold;
  font-size: 13px;
  color: #d9e9ff;
  letter-spacing: 0;
}
</style>
