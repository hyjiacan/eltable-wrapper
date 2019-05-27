<template>
  <div class="hello">
    <el-table-wrapper
      :table-options="{}"
      ajax-url="mock/data.json"
      inc-id="id"
      :ajax="ajax"
      @select="onSelect"
      @selection-change="selectionChanged"
      @select-all="selectionChanged"
      advance-selection
      ref="table"
    >
      <el-table-column type="selection" prop="checked"></el-table-column>
      <el-table-column label="ID" prop="id"></el-table-column>
      <el-table-column label="Name" prop="name"></el-table-column>
      <el-table-column label="Dept." prop="dept"></el-table-column>
      <el-table-column label="Remark" prop="remark"></el-table-column>
    </el-table-wrapper>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'Demo',
  data () {
    return {
      cache: []
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
      console.log(selection, prev)
    },
    selectionChanged (selection, type, changed) {
      console.log(selection, type, changed)
    }
  },
  mounted () {
    setTimeout(() => {
      this.$refs.table.deselect(this.cache[2])
      console.info(this.$refs.table.getSelection())
    }, 3000)
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.hello {
  height: 100%;
}
</style>
