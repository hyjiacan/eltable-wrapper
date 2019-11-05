<template>
  <div class="hello">
    <el-tabs>
      <el-tab-pane label="本地数据">
        <el-table-wrapper
          type="l"
          :local-data="localData"
          selection="single"
          pager-position="both"
          t-row-class-name="customize-row-class"
          t-highlight-current-row
          @select="onSelect"
        >
          <el-table-column label="ID" prop="id"></el-table-column>
          <el-table-column label="Name" prop="name"></el-table-column>
          <el-table-column label="Dept." prop="dept"></el-table-column>
          <el-table-column label="Remark">
            <template v-slot="{row}">
              {{row.remark}}
            </template>
          </el-table-column>
        </el-table-wrapper>
      </el-tab-pane>
      <el-tab-pane label="远程数据">
        <el-table-wrapper
          url="mock/data.json"
          :ajax="ajax"
          :params="params"
          :check-params="onCheckParams"
          pager-position="both"
          @select="onSelect"
          @selection-change="selectionChanged"
          @select-all="selectionChanged"
          t-row-class-name="customize-row-class"
          t-highlight-current-row
          load-when-params-change
          advance-selection
          ref="table"
        >
          <template v-slot:pagerPrepend>
            <span>触发的字段</span>
            <input v-model="params.triggerField" title="变化时自动重新加载"/>
            <span>忽略的字段</span>
            <input v-model="params.ignoreField" title="变化时不会自动重新加载"/>
            <button @click="$refs.table.load()" title="主动查询时，会带上忽略的字段">查询</button>
          </template>
          <el-table-column type="selection" prop="checked"></el-table-column>
          <el-table-column label="ID" prop="id"></el-table-column>
          <el-table-column label="Name" prop="name"></el-table-column>
          <el-table-column label="Dept." prop="dept"></el-table-column>
          <el-table-column label="Remark">
            <template v-slot="{row}">
              {{row.remark}}
            </template>
          </el-table-column>
        </el-table-wrapper>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'Demo',
  data () {
    return {
      cache: [],
      localData: [],
      params: {
        ignoreField: '',
        triggerField: ''
      }
    }
  },
  methods: {
    ajax (e) {
      return new Promise((resolve, reject) => {
        axios.request(e).then(response => {
          resolve(response.data)
          this.cache = response.data
          this.$refs.table.select(this.cache[2])
        }).catch(response => {
          reject(response.data)
        })
      })
    },
    onSelect (selection, prev) {
      // eslint-disable-next-line
      console.log(selection, prev)
    },
    selectionChanged (e) {
      // eslint-disable-next-line
      console.log(e.selection, e.type, e.changed, e.allSelected)
    },
    onCheckParams (params, changed) {
      // 找出忽略的字段
      let hit = changed.filter(item => item.path[0] === 'ignoreField')
      // 如果只有忽略字段变化了，就不触发
      if (changed.length === 1 && hit.length) {
        return false
      }
      return params
    }
  },
  mounted () {
    let data = []

    for (let i = 0; i < 99; i++) {
      data.push({
        id: i,
        name: 'name' + i,
        dept: 'dept' + i,
        remark: 'remark' + i
      })
    }
    this.localData = data
    setTimeout(() => {
      this.$refs.table.deselect(this.cache[2])
    }, 3000)
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
  .hello {
    height: 100%;
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
</style>
