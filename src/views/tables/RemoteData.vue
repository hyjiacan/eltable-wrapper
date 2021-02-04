<template>
  <el-table-wrapper
    url="/mock/data.json"
    type="s"
    :ajax="ajax"
    :params="params"
    :check-params="onCheckParams"
    pager-position="both"
    :ajax-option-foo="true"
    :ajax-option-bar="true"
    :ajax-option-required="['size', 'index']"
    t-row-class-name="customize-row-class"
    t-highlight-current-row
    load-when-params-change
    advance-selection
    check-field="checked"
    ref="table"
  >
    <template v-slot:header="{data}">
      <div>selected: {{ data.selected }}</div>
    </template>
    <template v-slot:pagerPrepend>
      <span>触发的字段</span>
      <input v-model="params.triggerField" title="变化时自动重新加载"/>
      <span>忽略的字段</span>
      <input v-model="params.ignoreField" title="变化时不会自动重新加载"/>
      <button @click="$refs.table.load()" title="主动查询时，会带上忽略的字段">查询</button>
    </template>
    <template v-slot:default="{toggle}">
      <el-table-column type="selection" width="80px">
        <template v-slot="{row}">
          <el-checkbox :value="row.checked" @change="toggle(row)"/>
        </template>
      </el-table-column>
      <el-table-column label="ID" prop="id"></el-table-column>
      <el-table-column label="Name" prop="name"></el-table-column>
      <el-table-column label="Dept." prop="dept"></el-table-column>
      <el-table-column label="Remark">
        <template v-slot="{row}">
          {{ row.remark }}
        </template>
      </el-table-column>
    </template>
  </el-table-wrapper>
</template>

<script>
import tableMixin from './table.mixin'
import axios from 'axios'

export default {
  mixins: [tableMixin],
  methods: {
    ajax(e) {
      return new Promise((resolve, reject) => {
        axios.request(e).then(response => {
          const {pageSize, pageIndex} = e.params
          setTimeout(() => {
            resolve({
              list: response.data.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize),
              total: response.data.length
            })
          }, 1000)
        }).catch(response => {
          reject(response.data)
        })
      })
    }
  }
}
</script>

<style scoped>

</style>
