<!-- @author qikai -->
<template>
  <div class="icon-body">
    <el-tabs type="border-card">
      <el-tab-pane label="Icons">
        <el-input
          v-model="name"
          style="position: relative"
          clearable
          placeholder="请输入图标名称"
          @clear="filterIcons"
          @input.native="filterIcons"
        >
          <i slot="suffix" class="el-icon-search el-input__icon" />
        </el-input>
        <div class="icon-list">
          <div
            v-for="(item, index) in iconList"
            :key="index"
            @click="selectedIcon(item,'icon')"
          >
            <svg-icon :icon-class="item" style="height: 30px; width: 16px" />
            <span>{{ item }}</span>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="Element-UI Icons">
        <el-input
          v-model="name"
          style="position: relative"
          clearable
          placeholder="请输入图标名称"
          @clear="filterIcons"
          @input.native="filterElementIcons"
        >
          <i slot="suffix" class="el-icon-search el-input__icon" />
        </el-input>
        <div class="icon-list">
          <div
            v-for="(item, index) in elementIcons"
            :key="index"
            @click="selectedIcon(item,'element')"
            style="width: 50%;font-size: 20px"
          >
            <i :class="'el-icon-' + item" style="height: 30px; width: 30px" />
            <span style="font-size: 14px">{{ item }}</span>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import icons from "./requireIcons";
import elementIcons from "./element-icons";
export default {
  name: "IconSelect",
  data() {
    return {
      name: "",
      iconList: icons,
      elementIcons: elementIcons,
    };
  },
  methods: {
    filterIcons() {
      this.iconList = icons;
      if (this.name) {
        this.iconList = this.iconList.filter((item) =>
          item.includes(this.name)
        );
      }
    },
    filterElementIcons() {
      this.elementIcons = elementIcons;
      if (this.name) {
        this.elementIcons = this.elementIcons.filter((item) =>
          item.includes(this.name)
        );
      }
    },
    selectedIcon(name,type) {
      this.$emit("selected", name,type);
      document.body.click();
    },
    reset() {
      this.name = "";
      this.iconList = icons;
    },
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.icon-body {
  width: 100%;
  padding: 10px;
  .icon-list {
    height: 200px;
    overflow-y: scroll;
    div {
      height: 30px;
      line-height: 30px;
      margin-bottom: -5px;
      cursor: pointer;
      width: 33%;
      float: left;
    }
    span {
      display: inline-block;
      vertical-align: -0.15em;
      fill: currentColor;
      overflow: hidden;
    }
  }
}
</style>
