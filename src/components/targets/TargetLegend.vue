<template>
  <div class="lengend-container" v-drag v-if="isShow">
    <div class="title">数 量（个）</div>
    <div class="lengend-content">
      <ul id="lengend-ul">
        <li class="lengend-li" v-for="(item, i) in lengendArr" :key="i">
          <span class="lengend-span1"></span>
          <span class="lengend-span2">{{ item.count }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isShow: true,
      lengendArr: [
        { color: "#4F6FEF", count: "0~50" },
        { color: "#52ADF8", count: "51~100" },
        { color: "#79F2D9", count: "101~150" },
        { color: "#F4F39A", count: "151~250" },
        { color: "#FDEF24", count: "251~300" },
        { color: "#DC651C", count: "301~350" },
        { color: "#E81818", count: "350以上" },
      ],
    };
  },
  watch: {
    // isShow(val) {
    //   if (val) {
    //     this.$nextTick(() => {
    //       this.setLengendStyle();
    //     });
    //   }
    // },
  },
  created() {
    // this.$bus.$off("widgetLengendShow");
    // this.$bus.$on("widgetLengendShow", (val) => {
    //   this.isShow = val;
    // });
  },

  mounted() {
    this.setLengendStyle();
  },
  methods: {
    setLengendStyle() {
      let arr = document.querySelectorAll("#lengend-ul .lengend-span1");
      for (let i = 0; i < arr.length; i++) {
        const element = arr[i];
        element.style.background = this.lengendArr[i].color;
      }
    },
  },
};
</script>
<style scoped>
/* 图例 */

.lengend-container {
  display: flex;
  flex-direction: column;
  position: absolute;
  left: 10px;
  bottom: 10px;
  width: 130px;
  height: 215px;
  background: rgba(9, 32, 63, 0.8);
  border: 1px solid rgb(60, 117, 219);
  z-index: 9998;
}
.title {
  --height: 25px;
  width: 100%;
  height: var(--height);
  line-height: var(--height);
  min-height: var(--height);
  align-items: center;
  cursor: pointer;
  font-family: PingFangSC-Medium;
  font-size: 14px;
  color: #ffffff;
}
.lengend-content {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 5px;
}
#lengend-ul {
  /* background-color: rgba(255, 255, 0, 0.123); */
  width: 100%;
  height: 100%;
  padding-inline-start: initial;
  padding-inline-start: initial;
  margin-block-start: initial;
  margin-block-end: initial;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}

.lengend-li {
  display: flex;
  width: 100%;
  /* height: 30px; */
  padding: 0px 5px;
  color: #fff;
  font-size: 12px;
  box-sizing: border-box;
}
.lengend-span1 {
  width: 40%;
  height: 16px;
  float: left;
}
.lengend-span2 {
  margin-left: 5px;
  width: 60%;
}

#cesium-mapViewer #lengend {
  width: 128px;
  height: 40px;
  line-height: 40px;
  font-size: 14px;
  font-weight: 500;
  color: #fff;
  background: rgba(9, 32, 63, 0.8);
  border: 1px solid #6ba9ff;
  box-shadow: inset 0 0 20px 2px #1175ff;
  padding-left: 25px;
  position: absolute;
  right: 10px;
  bottom: 10px;
  z-index: 10000;
}
</style>
