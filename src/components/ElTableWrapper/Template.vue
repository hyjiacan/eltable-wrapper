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
          highlight-current-row
          :data="currentData"
          @current-change="onTableSelectionChanged"
          @selection-change="onTableSelectionChanged"
          ref="table"
        >
          <slot></slot>
        </el-table>
      </div>
      <div class="el-table-wrapper-footer" v-if="!disablePager">
        <div class="el-table-wrapper-footer-text" v-if="$slots.footer">
          <slot name="footer"></slot>
        </div>
        <div class="el-table-wrapper-pager">
          <span class="el-table-wrapper-pager-summary" v-if="source === 'i'">已加载 {{data.size}} 条数据</span>
          <span class="el-table-wrapper-pager-summary" v-else>共 {{data.size}} 条数据</span>
          <el-pagination
            background
            :page-sizes="pager.sizes"
            :page-size="pager.size"
            layout="sizes, prev, pager, next, jumper"
            :page-count="pager.count"
            :current-page="pager.index"
            @current-change="onPageChanged"
            @size-change="onSizeChanged"></el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import component from './component'
import './index.less'

export default component
</script>
