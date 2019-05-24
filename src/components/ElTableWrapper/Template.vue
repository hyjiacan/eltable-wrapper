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
          highlight-current-row
          :data="currentData"
          @current-change="onTableSelectionChanged"
          @selection-change="onTableSelectionChanged"
          :max-height="tableOption['max-height']"
          :stripe="tableOption['stripe']"
          :border="tableOption['border']"
          :size="tableOption['size']"
          :fit="tableOption['fit']"
          :show-header="tableOption['show-header']"
          :current-row-key="tableOption['current-row-key']"
          :row-class-name="tableOption['row-class-name']"
          :row-style="tableOption['row-style']"
          :cell-class-name="tableOption['cell-class-name']"
          :cell-style="tableOption['cell-style']"
          :header-row-class-name="tableOption['header-row-class-name']"
          :header-row-style="tableOption['header-row-style']"
          :header-cell-class-name="tableOption['header-cell-class-name']"
          :header-cell-style="tableOption['header-cell-style']"
          :row-key="tableOption['row-key']"
          :empty-text="tableOption['empty-text']"
          :default-expand-all="tableOption['default-expand-all']"
          :expand-row-keys="tableOption['expand-row-keys']"
          :default-sort="tableOption['default-sort']"
          :tooltip-effect="tableOption['tooltip-effect']"
          :show-summary="tableOption['show-summary']"
          :sum-text="tableOption['sum-text']"
          :summary-method="tableOption['summary-method']"
          :span-method="tableOption['span-method']"
          :select-on-indeterminate="tableOption['select-on-indeterminate']"
          :indent="tableOption['indent']"
          :lazy="tableOption['lazy']"
          :load="tableOption['load']"
          @cell-mouse-enter="tableOption['@cell-mouse-enter']"
          @cell-mouse-leave="tableOption['@cell-mouse-leave']"
          @cell-click="tableOption['@cell-click']"
          @cell-dblclick="tableOption['@cell-dblclick']"
          @row-click="tableOption['@row-click']"
          @row-contextmenu="tableOption['@row-contextmenu']"
          @row-dblclick="tableOption['@row-dblclick']"
          @header-click="tableOption['@header-click']"
          @header-contextmenu="tableOption['@header-contextmenu']"
          @sort-change="tableOption['@sort-change']"
          @filter-change="tableOption['@filter-change']"
          @header-dragend="tableOption['@header-dragend']"
          @expand-change="tableOption['@expand-change']"
          ref="table"
        >
          <slot></slot>
        </el-table>
      </div>
      <div class="el-table-wrapper-footer" v-if="!disablePager || $slots.footer">
        <div class="el-table-wrapper-footer-text" v-if="$slots.footer">
          <slot name="footer"></slot>
        </div>
        <div class="el-table-wrapper-pager">
          <span class="el-table-wrapper-pager-summary" v-if="source === 'i'">已加载 {{data.size}} 条数据</span>
          <span class="el-table-wrapper-pager-summary" v-else>共 {{data.size}} 条数据</span>
          <el-pagination
            :page-size="pager.size"
            :page-count="pager.count"
            :current-page="pager.index"
            :small="pagerOption['small']"
            :background="pagerOption['background']"
            :pager-count="pagerOption['pager-count']"
            :layout="pagerOption['layout']"
            :page-sizes="pagerOption['page-sizes']"
            :popper-class="pagerOption['popper-class']"
            :prev-text="pagerOption['prev-text']"
            :next-text="pagerOption['next-text']"
            :disabled="pagerOption['disabled']"
            :hide-on-single-page="pagerOption['hide-on-single-page']"
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
