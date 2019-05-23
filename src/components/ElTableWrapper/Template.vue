<template>
  <div class="el-table-wrapper" :class="{'el-table-wrapper-auto-height': autoHeight}">
    <div class="el-table-wrapper-layout">
      <div class="el-table-wrapper-header" v-if="$slots.header">
        <slot name="header"></slot>
      </div>
      <div class="el-table-wrapper-content">
        <el-table
          width="100%"
          height="100%"
          stripe
          :data="currentData"
        >
          <slot></slot>
        </el-table>
      </div>
      <div class="el-table-wrapper-footer" v-if="!disablePager">
        <div class="el-table-wrapper-footer-pager" v-if="$slots.footer">
          <slot name="footer"></slot>
        </div>
        <el-pagination
          style="float: right"
          background
          :page-sizes="pager.sizes"
          :page-size="pager.size"
          layout="sizes, prev, pager, next, jumper"
          :page-count="pageCount"
          :current-page="pager.index"
          @current-change="onPageChanged"
          @size-change="onSizeChanged"></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import component from './component'
import '../../assets/style/index.less'

export default component
</script>
