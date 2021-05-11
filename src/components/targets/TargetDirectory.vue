<template>
  <div class="mainContent">
    <div class="titleClass">数据类型</div>
    <div class="treeContent">
      <el-tree
        id="el-tree"
        ref="tree"
        :data="treeData"
        show-checkbox
        node-key="id"
        :props="defaultProps"
        :default-expand-all="default_expand_all"
        :expand-on-click-node="false"
        :check-on-click-node="true"
        :default-checked-keys="defaultCheckedKeys"
        @check="checkboxChecked"
        @check-change="check_change"
      ></el-tree>
    </div>
  </div>
</template>

<script>
export default {
  props: ["allSelected"],
  data() {
    return {
      default_expand_all: true, // 默认是否展开所有节点
      checkedNodes: [],
      defaultCheckedKeys: [""],
      treeData: [
        {
          id: "000",
          label: "全选",
          disabled: false,
          children: [
            {
              id: "矢量点",
              label: "矢量点",
              disabled: false,
            },
            {
              id: "矢量线",
              label: "矢量线",
              disabled: false,
            },
            {
              id: "矢量面",
              label: "矢量面",
              disabled: false,
            },
            {
              id: "矢量体",
              label: "矢量体",
              disabled: false,
            },
            {
              id: "栅格",
              label: "栅 格",
              disabled: false,
            },
            {
              id: "体元数据模型",
              label: "体元数据模型",
              disabled: false,
            },
          ],
        },
      ],
      defaultProps: {
        children: "children",
        label: "label",
      },
    };
  },
  mounted() {
    if (this.allSelected) {
      this.defaultCheckedKeys = ["000"];
    }
    this.$nextTick(() => {
      let arr = this.$refs.tree.getCheckedNodes();
      let first = arr[0];
      if (first && first.id == "000") {
        arr.splice(0, 1);
      }
      this.$store.dispatch("dataType/changeStateFun", {
        newVal: arr,
        funName: "setData",
      });
    });
  },
  methods: {
    // 点击 checkBox（check-on-click-node = true 点击节点也会走该方法）
    checkboxChecked(data, node) {
      let arr = [];
      let code = null;
      for (let i = 0; i < node.checkedNodes.length; i++) {
        const element = node.checkedNodes[i];
        if (element.children) {
          // 该节点为父节点
          continue;
        }
        arr.push(element);
        if (data.id == element.id) {
          // 该节点就是被选中的节点（不包含反选）
          code = data.id;
        }
      }
      // 获取两个数组中的不同元素
      let changedNodes = this.checkedNodes.concat(arr).filter(function (v, i, array) {
        return array.indexOf(v) === array.lastIndexOf(v);
      });

      var isAdd = false;
      if (this.checkedNodes.length < arr.length) {
        // 有新添加的节点
        isAdd = true;
      } else if (this.checkedNodes.length > arr.length) {
        // 有删除的节点
        isAdd = false;
      }
      let dic = {
        isAdd: isAdd,
        checkboxChecked: changedNodes,
      };
      this.checkedNodes = arr;
      this.$store.dispatch("dataType/changeStateFun", {
        newVal: arr,
        funName: "setData",
      });
      //   let dataArr = this.$store.getters["dataType/getData"];
    },
    // 节点选中状态发生变化时的回调
    check_change(data, value1, value2) {
      //   console.log(data);
    },
  },
};
</script>
<style scoped>
.mainContent {
  display: flex;
  flex-direction: column;
  width: 198px;
  height: 244px;
  padding: 5px;
  box-sizing: border-box; /* 避免 padding 导致容器被撑大*/
  background-image: url("../../../public/images/common/datatypebg.png");
  background-size: 100% 100%;
  background-repeat: no-repeat;
  background-position: center;
  position: absolute;
  top: 5px;
  left: 5px;
}
.titleClass {
  display: flex;
  width: 165px;
  height: 30px;
  min-height: 30px;
  box-sizing: border-box;
  font-size: 16px;
  padding-left: 10px;
  align-items: center;
  color: #53d7ff;
}
.treeContent {
  width: 100%;
  height: 100%;
  overflow-y: scroll;
}
</style>
