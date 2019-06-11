<template>
  <div class="el-table-wrapper" :class="wrapperClass"
       v-loading="data.loading"
       :element-loading-text="loadingText"
       :element-loading-spinner="loadingIcon"
       :element-loading-background="loadingColor"
  >
    <div class="el-table-wrapper-header" :style="headerStyle" v-if="headerVisible">
      <div class="el-table-wrapper-header-text">
        <slot name="header" :data="slotData">
          <template v-if="isMultipleSelection">
            <template v-if="selection.cache.length">
              已选择 {{selection.cache.length}} 项
            </template>
            <template v-else>未选择项</template>
          </template>
        </slot>
      </div>
      <pager position="top" v-show="!pDisabled && pagerPosition !== 'bottom'">
        <slot name="pagerPrepend" :data="data" slot="pagerPrepend" slot-scope="{data}"></slot>
        <slot name="pagerSummary" :data="data" slot="pagerSummary" slot-scope="{data}"></slot>
        <slot name="pagerAppend" :data="data" slot="pagerAppend" slot-scope="{data}"></slot>
      </pager>
    </div>
    <div class="el-table-wrapper-content" :style="contentStyle">
      <el-table
        style="width: 100%"
        height="100%"
        highlight-current-row
        :data="currentData"
        @current-change="onTableCurrentRowChanged"
        @selection-change="onTableSelectionChanged"
        :maxHeight="tMaxHeight"
        :stripe="tStripe"
        :border="tBorder"
        :size="tSize"
        :fit="tFit"
        :show-header="tShowHeader"
        :current-row-key="tCurrentRowKey"
        :row-class-name="tRowClassName"
        :row-style="tRowStyle"
        :cell-class-name="tCellClassName"
        :cell-style="tCellStyle"
        :header-row-class-name="tHeaderRowClassName"
        :header-row-style="tHeaderRowStyle"
        :header-cell-class-name="tHeaderCellClassName"
        :header-cell-style="tHeaderCellStyle"
        :row-key="tRowKey || getDataId"
        :empty-text="tEmptyText"
        :default-expand-all="tDefaultExpandAll"
        :expand-row-keys="tExpandRowKeys"
        :default-sort="tDefaultSort"
        :tooltip-effect="tTooltipEffect"
        :show-summary="tShowSummary"
        :sum-text="tSumText"
        :summary-method="tSummaryMethod"
        :span-method="tSpanMethod"
        :select-on-indeterminate="tSelectOnIndeterminate"
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
         v-if="(!pDisabled && pagerPosition !== 'top')">
      <div class="el-table-wrapper-footer-text">
        <slot name="footer" :data="slotData">
          <template v-if="isMultipleSelection">
            <template v-if="selection.cache.length">
              已选择 {{selection.cache.length}} 项
            </template>
            <template v-else>未选择项</template>
          </template>
        </slot>
      </div>
      <pager position="bottom" v-show="!pDisabled && pagerPosition !== 'top'">
        <slot name="pagerPrepend" :data="data" slot="pagerPrepend" slot-scope="{data}"></slot>
        <slot name="pagerSummary" :data="data" slot="pagerSummary" slot-scope="{data}"></slot>
        <slot name="pagerAppend" :data="data" slot="pagerAppend" slot-scope="{data}"></slot>
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
