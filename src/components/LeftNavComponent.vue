<template>
  <div class="mainContainer">
    <el-menu :default-active="defaultActive" @select="handleSelect">
      <el-menu-item index="importData">
        <!-- <i class="el-icon-menu"></i> -->
        <i>
          <img src="../../public/images/leftNav/import.png" alt="improt" />
        </i>
        <span slot="title">数据编码索引</span>
      </el-menu-item>
      <el-menu-item index="dataQuery">
        <!-- <i class="el-icon-share"></i> -->
        <i>
          <img src="../../public/images/leftNav/query.png" alt="query" />
        </i>
        <span slot="title">数据查询索引</span>
      </el-menu-item>

      <el-submenu index="3">
        <template slot="title">
          <!-- <i class="el-icon-s-fold"></i> -->
          <i>
            <img src="../../public/images/leftNav/show.png" alt="show" />
          </i>
          <span slot="title">数据资源网格展示</span>
        </template>
        <el-menu-item-group>
          <el-menu-item class="tree-item-class" index="resouceDistribute"
            >数据资源分布</el-menu-item
          >
          <el-menu-item class="tree-item-class" index="resouceStatistics"
            >数据资源统计</el-menu-item
          >
        </el-menu-item-group>
      </el-submenu>

      <el-menu-item index="dataRelevance">
        <!-- <i class="el-icon-menu"></i> -->
        <i>
          <img
            src="../../public/images/leftNav/statistics.png"
            alt="statistics"
          />
        </i>
        <span>数据剖分关联整合</span>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script>
export default {
  data() {
    return {
      defaultActive: "importData",
    };
  },
  mounted() {
    this.getPath();
  },
  watch: {
    $route: "getPath",
  },
  methods: {
    handleSelect(key, keyPath) {
      console.log(key, keyPath);
      this.$router.push(`/${key}`);
    },

    getPath() {
      let path = this.$route.path;
      let arr = path.split("/");
      this.defaultActive = arr[arr.length - 1];
    },
  },
};
</script>
<style scoped>
.mainContainer {
  width: 100%;
  height: 100%;
}
.mainContainer >>> .el-menu {
  border: none;
  background-color: transparent;
}
.mainContainer >>> .el-menu-item-group__title {
  padding: 0 !important;
}

.el-menu-item,
.mainContainer >>> .el-submenu__title {
  color: #fff;
  display: flex;
  font-size: 16px;
}
.el-menu-item i,
.el-submenu__title i {
  line-height: 52px;
  margin-right: 5px;
  width: 24px;
  height: 54px;
}

.el-menu-item:hover,
.el-menu-item.is-active,
.mainContainer >>> .el-submenu__title:hover {
  background-color: transparent;
  border: solid 1px #3177a2;
  box-shadow: inset 0px 0px 3px 1px #3177a2;
}
.el-menu-item:focus {
  background-color: transparent;
}

.el-menu-item.is-active {
  color: rgb(3, 211, 248);
}
.mainContainer >>> .el-icon-arrow-down:before {
  /* content: "\e6df"; */
  content: "\25BC";
  color: #53d7ff;
}
.tree-item-class {
  font-size: 14px !important;
  padding-left: 50px;
}
</style>
