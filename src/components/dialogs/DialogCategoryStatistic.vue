<template>
  <div class="mainContent" v-drag>
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
    <div class="echartContainer" id="echart"></div>
    <div class="closeButton" @click="close"></div>
    <div class="unitClass">数量（个）</div>
  </div>
</template>

<script>
import * as echarts from "echarts";

export default {
  //   props: ["data", "isShow"],
  props: {
    data: Array,
    isShow: Boolean,
  },
  data() {
    return {
      tempData: [],
      activeName: "直方图",
      echart: "",
      tabsData: [
        {
          id: "直方图",
          label: "直方图展示",
        },
        {
          id: "饼状图",
          label: "饼状图展示",
        },
        {
          id: "折线图",
          label: "折线图展示",
        },
      ],
      //   tempData: [
      //     {
      //       dataTypeName: "瓦片数据",
      //       dataType: "011",
      //       count: 13776,
      //     },
      //     {
      //       dataTypeName: "影像数据",
      //       dataType: "001",
      //       count: 9301,
      //     },
      //     {
      //       dataTypeName: "高程数据",
      //       dataType: "002",
      //       count: 8905,
      //     },
      //     {
      //       dataTypeName: "地名数据",
      //       dataType: "004",
      //       count: 3562,
      //     },
      //     {
      //       dataTypeName: "矢量数据",
      //       dataType: "003",
      //       count: 8900,
      //     },
      //     {
      //       dataTypeName: "重力数据",
      //       dataType: "005",
      //       count: 12820,
      //     },
      //     {
      //       dataTypeName: "磁力数据",
      //       dataType: "006",
      //       count: 1920,
      //     },
      //     {
      //       dataTypeName: "体元数据模型",
      //       dataType: "007",
      //       count: 10506,
      //     },
      //   ],
      yMax: 500,
      nameArr: [],
      numArr: [],
      zhuOptions: {
        color: ["#3398DB"],
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow", // 默认为直线，可选为：'line' | 'shadow'
          },
        },
        xAxis: {
          type: "category",
          axisLine: {
            onZero: false,
            lineStyle: {
              color: "#999999",
            },
          },
          data: [],
          axisLabel: {
            inside: false,
            interval: 0,
            color: "#fff",
            formatter: function (value) {
              return value.split("").join("\n");
            },
          },
          axisTick: {
            show: false,
          },
          axisLine: {
            show: true,
          },
          z: 10,
        },
        grid: {
          bottom: 90,
        },
        yAxis: [
          {
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
          },
        ],
        series: [
          {
            name: "网格数据统计",
            type: "bar",
            barWidth: "60%",
            data: [],
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: "#83bff6" },
                { offset: 0.5, color: "#188df0" },
                { offset: 1, color: "#188df0" },
              ]),
            },
            emphasis: {
              itemStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: "#2378f7" },
                  { offset: 0.7, color: "#2378f7" },
                  { offset: 1, color: "#83bff6" },
                ]),
              },
            },
          },
        ],
      },
      //   饼状图数据
      bingData: [],
      bingOptions: {
        tooltip: {
          trigger: "item",
          formatter: "{b} : {c}",
        },
        legend: {
          type: "scroll",
          orient: "horizontal",
          pageIconColor: "#ff781f", //翻页箭头颜色
          pageIconSize: 13,
          pageTextStyle: {
            color: "#fff", //翻页数字颜色
          }, //翻页数字设置
          bottom: 20,
          itemWidth: 16,
          itemHeight: 10,
          itemGap: 20, // 间隔
          x: "center",
          textStyle: {
            fontSize: 12,
            color: "#FFFFFF",
          },
        },
        series: [
          {
            type: "pie",
            radius: "45%",
            center: ["50%", "45%"],
            selectedMode: "single",
            data: [],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
            },
            label: {
              normal: {
                // formatter: '{a|{a}}{abg|}\n{hr|}\n  {b|{b}：}{c}  {per|{d}%}  ',
                // formatter: "{a|{b}}\n{hr|}\n{per|{d}%}",
                formatter: "{a|{b}}\n{hr|}",
                rich: {
                  a: {
                    color: "#ffffff",
                    fontSize: 13,
                    lineHeight: 20,
                    align: "center",
                  },
                  hr: {
                    width: "100%",
                    height: 0,
                    alien: "center",
                  },
                  per: {
                    color: "#ffffff",
                    align: "center",
                    fontSize: 11,
                  },
                },
              },
            },
          },
        ],
      },
      zheOptions: {
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
            interval: 0,
            color: "#FFFFFF",
            formatter: function (value) {
              return value.split("").join("\n");
            },
          },
        },
        grid: {
          bottom: 90,
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
      handler(newVal, oldVal) {
        this.nameArr = [];
        this.numArr = [];
        this.bingData = [];
        for (const item of newVal) {
          this.nameArr.push(item.catagory_code);
          this.numArr.push(item.count);
          let dic = {
            name: item.catagory_code,
            value: item.count,
          };
          this.bingData.push(dic);
          this.tabsHandleClick();
        }
      },
      immediate: true, // 立即执行，否则不刷新界面
      deep: true,
    },
  },
  mounted() {},
  methods: {
    tabsHandleClick() {
      this.$nextTick(() => {
        this.tempData = this.data;
        if (!this.echart) {
          var chartDom = document.getElementById("echart");
          this.echart = echarts.init(chartDom);
        }
        this.echart.clear();
        if (this.activeName == "直方图") {
          this.zhuOptions.xAxis.data = this.nameArr;
          this.zhuOptions.series[0].data = this.numArr;
          this.echart.setOption(this.zhuOptions);
        } else if (this.activeName == "饼状图") {
          this.bingOptions.series[0].data = this.bingData;
          this.echart.setOption(this.bingOptions);
        } else if (this.activeName == "折线图") {
          this.zheOptions.xAxis.data = this.nameArr;
          this.zheOptions.series[0].data = this.numArr;
          this.echart.setOption(this.zheOptions);
        }
      });
    },
    close() {
      this.$emit("closeDiologCategory");
    },
  },
};
</script>

<style scoped>
.mainContent {
  display: flex;
  flex-direction: column;
  width: 430px;
  height: 460px;
  background: #0b1a40;
  border: 1px solid #4167b2;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.5);
  position: absolute;
  top: 60px;
  left: 350px;
}
.headerContainer {
  display: flex;
  height: 45px;
  padding: 5px 10px;
  box-sizing: border-box;
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
