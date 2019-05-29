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
      <div class="el-table-wrapper-pager" v-show="!pDisabled && pagerPosition !== 'bottom'">
        <div class="el-table-wrapper-pager-prepend" v-if="this.$slots.pagerPrepend">
          <slot name="pagerPrepend"></slot>
        </div>
        <span class="el-table-wrapper-pager-summary" v-if="source === 'i' && data.extra">已加载 {{data.size}} 条数据</span>
        <span class="el-table-wrapper-pager-summary" v-else>共 {{data.size}} 条数据</span>
        <el-pagination
          :page-size="pager.size"
          :page-count="pager.count"
          :current-page="pager.index"
          :small="pSmall"
          :background="pBackground"
          :pagerCount="pPagerCount"
          :layout="pLayout"
          :pageSizes="pPageSizes"
          :popperClass="pPopperClass"
          :prevText="pPrevText"
          :nextText="pNextText"
          :disabled="pDisabled"
          :hideOnSinglePage="pHideOnSinglePage"
          @current-change="onPageChanged"
          @size-change="onSizeChanged">
        </el-pagination>
        <div class="el-table-wrapper-pager-append" v-if="this.$slots.pagerAppend">
          <slot name="pagerAppend"></slot>
        </div>
      </div>
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
      <div class="el-table-wrapper-pager" v-show="!pDisabled && pagerPosition !== 'top'">
        <div class="el-table-wrapper-pager-prepend" v-if="this.$slots.pagerPrepend">
          <slot name="pagerPrepend"></slot>
        </div>
        <template v-if="showPagerSummary">
          <span class="el-table-wrapper-pager-summary" v-if="source === 'i' && data.extra">已加载 {{data.size}} 条数据</span>
          <span class="el-table-wrapper-pager-summary" v-else>共 {{data.size}} 条数据</span>
        </template>
        <el-pagination
          :page-size="pager.size"
          :page-count="pager.count"
          :current-page="pager.index"
          :small="pSmall"
          :background="pBackground"
          :pagerCount="pPagerCount"
          :layout="pLayout"
          :pageSizes="pPageSizes"
          :popperClass="pPopperClass"
          :prevText="pPrevText"
          :nextText="pNextText"
          :disabled="pDisabled"
          :hideOnSinglePage="pHideOnSinglePage"
          @current-change="onPageChanged"
          @size-change="onSizeChanged">
        </el-pagination>
        <div class="el-table-wrapper-pager-append" v-if="this.$slots.pagerAppend">
          <slot name="pagerAppend"></slot>
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
