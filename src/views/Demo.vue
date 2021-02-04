<template>
  <div id="hello">
    <div id="header">
      <router-link to="/remote" active-class="active-router">远程数据</router-link>
      <router-link to="/local" active-class="active-router">本地数据</router-link>
      <router-link to="/local2" active-class="active-router">本地数据(点击选中行)</router-link>
      <router-link to="/non-pagination" active-class="active-router">不分页</router-link>
      <router-link to="/custom-footer" active-class="active-router">自定义footer挂载位置</router-link>
    </div>
    <div id="content">
      <router-view/>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Demo'
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
#header {
  width: 100%;
  height: 40px;
  position: absolute;
  z-index: 2;
  top: 0;
  text-align: center;
  padding: 10px;
  box-sizing: border-box;

  a {
    padding: 5px 10px;
  }
}

#hello {
  height: 100%;
  padding-top: 40px;
  box-sizing: border-box;
}

#content {
  height: 100%;
}

.splitter {
  height: 100%;
  display: grid;
  grid-template-rows: 60px auto;
}

#footer-target {
  background-color: bisque;

  .tip {
    position: absolute;
    left: 400px;
    top: 10px;
    color: red;
  }

  &:hover {
    background-color: #ee9832;
  }
}
</style>
<style lang="less">
.customize-row-class {
  border: 1px solid green;

  &:hover {
    color: #5daf34;
  }

  &.current-row {
    color: orangered;
  }
}

.el-tabs {
  height: 100%;
  position: relative;
  padding-top: 40px;
  box-sizing: border-box;

  .el-tabs__header {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
  }

  .el-tabs__content, .el-tab-pane {
    height: 100%;
  }
}

.active-router {
  color: #000;
  cursor: default;
  text-decoration: none;
}
</style>
