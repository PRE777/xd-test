<template>
  <el-container>
    <el-header>
      <span>{{ title }}</span>
    </el-header>
    <el-container>
      <el-aside width="250px">
        <left-nav-component></left-nav-component>
      </el-aside>
      <el-main>
        <router-view />
      </el-main>
    </el-container>
    <img src="../../public/images/header/nav.png" alt="导 航" class="navImgClass" />
  </el-container>
</template>

<script>
import LeftNavComponent from "../components/LeftNavComponent.vue";
export default {
  props: {
    msg: String,
  },
  data() {
    return {
      title: "",
    };
  },
  components: {
    LeftNavComponent,
  },
  mounted() {
    this.title = document.title;
  },
};
</script>
<style scoped>
.el-container {
  width: 100%;
  height: 100%;
  background: black;
}
.el-header {
  color: #fff;
  align-items: center;
  justify-items: center;
  height: 108px !important;
  line-height: 80px;
  background-image: url("../../public/images/header/header.png");
  background-size: 100% 100%;
  background-repeat: no-repeat;
  background-position: center;
}
.el-header span {
  color: #fff;
  font-family: "SimHei";
  font-size: 25px;/*no*/
  font-weight: bold;
}
@media screen and (max-width: 1300px) {
  .el-header span {
    font-size: 22px;/*no*/
  }
}

.el-aside {
  display: flex;
  background-image: url("../../public/images/leftNav/navBg.png");
  background-size: 100% 100%;
  background-repeat: no-repeat;
  background-position: center;
  color: #333;
  align-items: center;
  justify-content: center;
  padding: 10px;
  margin: 40px 0 5px 5px;
}
.el-main {
  color: #333;
  text-align: center;
  padding: 5px;
  overflow: hidden;
}
.navImgClass {
  position: absolute;
  left: 0px;
  top: 90px;
  width: 113px;
  height: 40px;
}
</style>
