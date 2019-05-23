<template>
  <div class="hello">
    <el-table-wrapper
      :table-options="{}"
      :local="data"
    >
      <el-table-column label="ID" prop="id"></el-table-column>
      <el-table-column label="Name" prop="name"></el-table-column>
      <el-table-column label="Dept." prop="dept"></el-table-column>
      <el-table-column label="Remark" prop="remark"></el-table-column>
      <template slot="footer">
        底部的东西
      </template>
    </el-table-wrapper>
  </div>
</template>

<script>

export default {
  name: 'Demo',
  data () {
    let temp = []
    for (let i = 0; i < 99; i++) {
      temp.push({
        id: i,
        name: 'name' + i,
        dept: 'dept' + i,
        remark: 'remark' + i
      })
    }
    return {
      data: temp
    }
  },
  methods: {
    load (e) {

    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.hello {
  height: 100%;
}
</style>
