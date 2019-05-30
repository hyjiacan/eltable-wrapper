<template>
  <div class="el-table-wrapper" :class="wrapperClass" v-loading="data.loading">
    <div class="el-table-wrapper-header" :style="headerStyle" v-if="headerVisible">
      <div class="el-table-wrapper-header-text">
        <slot name="header" :selected="selection.cache.length">
          <template v-if="isMultipleSelection">
            <template v-if="selection.cache.length">
              已选择 {{selection.cache.length}} 项
            </template>
            <template v-else>未选择项</template>
          </template>
        </slot>
      </div>
      <pager v-show="!pDisabled && pagerPosition !== 'bottom'">
        <slot name="pagerPrepend" slot="pagerPrepend"></slot>
        <slot name="pagerAppend" slot="pagerAppend"></slot>
      </pager>
    </div>
    <div class="el-table-wrapper-content" :style="contentStyle">
      <el-table
        style="width: 100%"
        height="100%"
        highlight-current-row
        :data="currentData"
        :row-key="getDataId"
        @current-change="onTableCurrentRowChanged"
        @selection-change="onTableSelectionChanged"
        :maxHeight="tMaxHeight"
        :stripe="tStripe"
        :border="tBorder"
        :size="tSize"
        :fit="tFit"
        :showHeader="tShowHeader"
        :currentRowKey="tCurrentRowKey"
        :rowClassName="tRowClassName"
        :rowStyle="tRowStyle"
        :cellClassName="tCellClassName"
        :cellStyle="tCellStyle"
        :headerRowClassName="tHeaderRowClassName"
        :headerRowStyle="tHeaderRowStyle"
        :headerCellClassName="tHeaderCellClassName"
        :headerCellStyle="tHeaderCellStyle"
        :rowKey="tRowKey"
        :emptyText="tEmptyText"
        :defaultExpandAll="tDefaultExpandAll"
        :expandRowKeys="tExpandRowKeys"
        :defaultSort="tDefaultSort"
        :tooltipEffect="tTooltipEffect"
        :showSummary="tShowSummary"
        :sumText="tSumText"
        :summaryMethod="tSummaryMethod"
        :spanMethod="tSpanMethod"
        :selectOnIndeterminate="tSelectOnIndeterminate"
        :indent="tIndent"
        :lazy="tLazy"
        :load="tLoad"
        @cell-mouse-enter="onCellMouseEnter"
        @cell-mouse-leave="onCellMouseLeave"
        @cell-click="onCellClick"
        @cell-dblclick="onCellDblclick"
        @row-click="onRowClick"
        @row-contextmenu="onRowContextmenu"
        @row-dblclick="onRowDblclick"
        @header-click="onHeaderClick"
        @header-contextmenu="onHeaderContextmenu"
        @sort-change="onSortChange"
        @filter-change="onFilterChange"
        @header-dragend="onHeaderDragend"
        @expand-change="onExpandChange"
        ref="table"
      >
        <slot></slot>
        <slot name="empty" slot="empty">
          {{tEmptyText}}
        </slot>
        <slot name="append" slot="append"></slot>
      </el-table>
    </div>
    <div class="el-table-wrapper-footer" :style="footerStyle"
         v-if="(!pDisabled && pagerPosition !== 'top') || $slots.footer">
      <div class="el-table-wrapper-footer-text">
        <slot name="footer" :selected="selection.cache.length">
          <template v-if="isMultipleSelection">
            <template v-if="selection.cache.length">
              已选择 {{selection.cache.length}} 项
            </template>
            <template v-else>未选择项</template>
          </template>
        </slot>
      </div>
      <pager v-show="!pDisabled && pagerPosition !== 'top'">
        <slot name="pagerPrepend" slot="pagerPrepend"></slot>
        <slot name="pagerAppend" slot="pagerAppend"></slot>
      </pager>
    </div>
  </div>
</template>

<script>
import component from './component'
import Pager from './Pager'
import './index.less'

export default {
  name: 'ElTableWrapper',
  components: { Pager },
  provide () {
    return {
      parent: this
    }
  },
  ...component
}
</script>
