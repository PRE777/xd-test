<template>
  <div class="selectedContainer" id="gridsSelectedId">
    <div
      class="buttonClass"
      v-for="(item, index) in buttonArr"
      :key="index"
      @click="buttonClicked(index + 1, item.title)"
    >
      <img
        :src="index + 1 == itemType && itemType ? item.srcActive : item.src"
        :alt="item.title"
      />
      <span
        :class="
          index + 1 == itemType && itemType ? 'buttonSpan-active' : 'buttonSpan'
        "
        >{{ item.title }}</span
      >
    </div>
    <div
      class="buttonClass"
      v-if="combinationBtnShow"
      @click="combinationButtonClicked()"
    >
      <img
        :src="
          combinationSelected
            ? combinationButton.srcActive
            : combinationButton.src
        "
        width="38"
        height="38"
        :alt="combinationButton.title"
      />
      <span :class="combinationSelected ? 'buttonSpan-active' : 'buttonSpan'">{{
        combinationButton.title
      }}</span>
    </div>
  </div>
</template>
<script>
import {
  getPosition,
  clearSingleGrid,
  getMultiplePosition,
  clearMultipleGrids,
} from "../../assets/js/drawEntities/DrawGridEntity";
import {
  drawPolygonArea,
  cancelPolygonArea,
} from "../../assets/js/drawEntities/DrawPolygonGrids";

import {
  drawAdminstrativeArea,
  clearAdminitrativeArea,
} from "../../assets/js/drawEntities/DrawAdministrative";
import { drawRect, endTodrawRect } from "../../assets/js/drawEntities/DrawRect";
import {
  drawCircle,
  clearCircle,
} from "../../assets/js/drawEntities/DrawCircle";
import { removeLayer } from "../../assets/js/tool/upLoadImage";

export default {
  props: ["mapViewer", "combinationBtnShow"],
  data() {
    return {
      itemType: 0,
      buttonArr: [
        {
          title: "单网格",
          src: "images/grids/single.png",
          srcActive: "images/grids/single-active.png",
        },
        {
          title: "多网格",
          src: "images/grids/grids.png",
          srcActive: "images/grids/grids-active.png",
        },
        {
          title: "多边形",
          src: "images/grids/polygon.png",
          srcActive: "images/grids/polygon-active.png",
        },
        {
          title: "矩 形",
          src: "images/grids/rect.png",
          srcActive: "images/grids/rect-active.png",
        },
        {
          title: "圆 形",
          src: "images/grids/circle.png",
          srcActive: "images/grids/circle-active.png",
        },
        {
          title: "行政区域",
          src: "images/grids/administrative.png",
          srcActive: "images/grids/administrative-active.png",
        },
      ],
      combinationButton: {
        title: "组合查询",
        src: "images/grids/combination.png",
        srcActive: "images/grids/combination-active.png",
      },
      combinationSelected: false, //组合查询是否选中
      canCombination: false, // 能否进行组合查询
    };
  },
  mounted() {},
  methods: {
    buttonClicked(itemType, title) {
      let dataArr = this.$store.getters["dataType/getData"];
      if (itemType == this.itemType) {
        this.itemType = 0;
        this.canCombination = false;
        this.combinationSelected = false;
        this.targetComShow(this.combinationSelected);
        this.clearEntitiesWithType(title);
      } else {
        if (dataArr.length == 0) {
          this.$message.warning("请先选择数据类型！");
          return;
        }
        this.itemType = itemType;
        this.canCombination = true;
        this.drawEntityWithType(title);
      }
    },
    combinationButtonClicked() {
      if (!this.canCombination) {
        this.$message.warning("请先选择网格类型！");
        return;
      }
      this.combinationSelected = !this.combinationSelected;
      if (!this.combinationSelected) {
        this.$bus.$emit("combination_query", undefined);
      }
      this.targetComShow(this.combinationSelected);
    },
    targetComShow(val) {
      this.$emit("targetComShow", val);
    },
    // 画Entity
    drawEntityWithType(val) {
      let type = val;
      clearSingleGrid(this.mapViewer); // 清除单网格
      cancelPolygonArea(this.mapViewer); // 清除手画区域
      endTodrawRect(this.mapViewer); // 清除矩形
      clearCircle(this.mapViewer); // 清除圆
      clearAdminitrativeArea(this.mapViewer); // 清除行政区域
      removeLayer(this.mapViewer); // 移除上图

      switch (type) {
        case "单网格":
          getPosition(this.mapViewer); // 画单网格
          clearMultipleGrids(this.mapViewer); // 清除多网格
          break;
        case "多网格":
          getMultiplePosition(this.mapViewer);
          break;
        case "多边形":
          drawPolygonArea(this.mapViewer); // 画多边形
          clearMultipleGrids(this.mapViewer); // 清除多网格
          break;
        case "矩 形":
          drawRect(this.mapViewer);
          clearMultipleGrids(this.mapViewer); // 清除多网格
          break;
        case "圆 形":
          clearMultipleGrids(this.mapViewer); // 清除多网格
          drawCircle(this.mapViewer);
          break;
        case "行政区域":
          clearMultipleGrids(this.mapViewer); // 清除多网格
          drawAdminstrativeArea(this.mapViewer);
          break;
        default:
          break;
      }
    },
    // 清除Entity
    clearEntitiesWithType(val) {
      removeLayer(this.mapViewer); // 移除上图
      let type = val;
      this.$bus.$emit("reloadTable", undefined);
      switch (type) {
        case "单网格":
          clearSingleGrid(this.mapViewer);
          break;
        case "多网格":
          clearMultipleGrids(this.mapViewer);
          break;
        case "多边形":
          cancelPolygonArea(this.mapViewer);
          break;
        case "矩 形":
          endTodrawRect(this.mapViewer); // 清除矩形
          break;
        case "圆 形":
          clearCircle(this.mapViewer); // 清除圆
          break;
        case "行政区域":
          clearAdminitrativeArea(this.mapViewer); // 清除行政区域
          break;
        default:
          break;
      }
    },
  },
};
</script>
<style scoped>
.selectedContainer {
  --height: 452px;
  position: absolute;
  right: 5px;
  top: calc((100% - var(--height)) / 3);
  display: flex;
  flex-direction: column;
  width: 76px;
  height: var(--height);
  background: #0b1a40;
  border: 1px solid #4167b2;
  box-shadow: 0px 0px 4px 0 rgb(115 170 255 / 50%),
    0px 0px 4px 0 rgb(115 170 255 / 50%);
  justify-content: space-around;
}
.buttonClass {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  color: #ebfaff;
  cursor: pointer;
}
.buttonClass img {
  width: 38px;
  height: 38px;
}
.buttonSpan {
  width: 100%;
  font-family: PingFangSC-Regular;
  font-size: 10px;
}
.buttonSpan-active {
  width: 100%;
  font-family: PingFangSC-Regular;
  font-size: 10px;
  color: yellow;
}
</style>
