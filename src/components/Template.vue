<template>
  <div class="el-table-wrapper" :class="wrapperClass"
       v-loading="data.loading"
       :element-loading-text="loadingText"
       :element-loading-spinner="loadingIcon"
       :element-loading-background="loadingColor"
  >
    <div class="el-table-wrapper-top-mark"></div>
    <div class="el-table-wrapper-header" :style="headerStyle" v-if="headerVisible">
      <div class="el-table-wrapper-header-text">
        <slot name="header" :data="slotData">
          <template v-if="isMultipleSelection && showSelectionInfo">
            <span v-if="selectionData.cache.length">
              已选择 {{ selectionData.cache.length }} 项
            </span>
            <span v-else>未选择项</span>
          </template>
        </slot>
      </div>
      <pager position="top" v-show="!pDisabled && pagerPosition !== 'bottom'">
        <slot name="pagerPrepend" :data="data" slot="pagerPrepend" slot-scope="{data}"/>
        <slot name="pagerSummary" :data="data" slot="pagerSummary" slot-scope="{data}"/>
        <slot name="pagerAppend" :data="data" slot="pagerAppend" slot-scope="{data}"/>
      </pager>
    </div>
    <div class="el-table-wrapper-content" :style="contentStyle">
      <div class="el-table-wrapper-title-toolbar" v-if="tShowHeader">
        <slot name="titleToolbar" :data="slotData"/>
      </div>
      <el-table
        style="width: 100%"
        :height="autoHeight ? null : '100%'"
        :highlight-current-row="tHighlightCurrentRow || selection === 'single'"
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
        <slot :toggle="toggle" :select="select" :deselect="deselect"/>
        <slot name="empty" slot="empty">
          {{ tEmptyText }}
        </slot>
        <slot name="append" slot="append"/>
      </el-table>
    </div>
    <table-footer :footer-visible="footerVisible"
                  :pager-visible="!pDisabled && pagerPosition !== 'top'"
                  :size="footerSize"
                  :target="footerTarget">
      <slot name="footer" :data="slotData">
        <template v-if="isMultipleSelection && showSelectionInfo">
          <span v-if="selectionData.cache.length">
            已选择 {{ selectionData.cache.length }} 项
          </span>
          <span v-else-if="data.view.length">{{emptySelectionText}}</span>
        </template>
      </slot>
      <template v-slot:pager>
        <pager position="bottom" v-show="!pDisabled && pagerPosition !== 'top'">
          <slot name="pagerPrepend" :data="data" slot="pagerPrepend" slot-scope="{data}"/>
          <slot name="pagerSummary" :data="data" slot="pagerSummary" slot-scope="{data}"/>
          <slot name="pagerAppend" :data="data" slot="pagerAppend" slot-scope="{data}"/>
        </pager>
      </template>
    </table-footer>
  </div>
</template>

<script>
import Vue from 'vue'
import Loading from 'element-ui/lib/loading'
import 'element-ui/lib/theme-chalk/loading.css'

import Pager from './Pager'
import './index.less'
import publicMethods from './publicMethods'
import privateMethods from './privateMethods'
import handlers from './handlers'
import data from './data'
import computed from './computed'
import watch from './watch'
import TableFooter from '@/components/TableFooter'

Vue.use(Loading.directive)

export default {
  name: 'ElTableWrapper',
  mixins: [computed, data, handlers, privateMethods, publicMethods, watch],
  components: {
    TableFooter,
    Pager
  },
  provide() {
    return {
      elTableRoot: this
    }
  },
  props: {
    // 通用 BEGIN===========================================================
    /**
     * 数据分页类型，可选值: l(local), i(increment), s(server)
     */
    type: {
      type: String,
      default: 's'
    },
    /**
     * 数据项的标识字段，若标识不在顶层，则使用数组传递
     * 也可以传入一个函数，函数接收一个行对象，函数的返回值将作为标识
     */
    idField: {
      type: [String, Array, Function],
      default: 'id'
    },
    /**
     * 是否自动调整高度，否则撑满整个容器
     */
    autoHeight: {
      type: Boolean,
      default: false
    },
    /**
     * 是否显示选中项信息
     */
    showSelectionInfo: {
      type: Boolean,
      default: true
    },
    /**
     * 当未选择数据项时，在选中信息处显示的提示文本
     */
    emptySelectionText: {
      type: String,
      default: '未选择项'
    },
    /**
     * 设置为 true 以使用高级选择
     * 此项在多选时生效，当启用时，会在跳转页面时记住选中项
     * 选择时，会使用 idField 作为选中数据的标识
     */
    advanceSelection: {
      type: Boolean,
      default: false
    },
    /**
     * 自定义的样式类
     */
    customClass: {
      type: String
    },
    /**
     * 分页条位置，可选值为 bottom top both
     */
    pagerPosition: {
      type: String,
      default: 'bottom'
    },
    headerSize: {
      type: [String, Number],
      default: 48
    },
    footerSize: {
      type: [String, Number],
      default: 40
    },
    showFooter: {
      type: Boolean,
      default: true
    },
    footerTarget: {
      type: [String, HTMLElement]
    },
    /**
     * 默认的数据id，当未加载数据时，请求时使用此值
     */
    defaultId: {
      type: [String, Number],
      default: ''
    },
    /**
     * 指示表格选择模式，可选值为: 空, single, multiple，当表格列中指定了 type="selection" 时，会覆盖此值为 multiple
     */
    selection: {
      type: String
    },
    /**
     * 指定选中项
     */
    value: {},
    /**
     * 是否在行被点击时切换行的选中状态（仅在多选时有效）
     */
    toggleOnRowClick: {
      type: Boolean,
      default: false
    },
    /**
     * 行点击事件的拦截器，返回 false 表示拦截点击事件
     */
    rowClickInterceptor: {
      type: Function
    },
    checkField: {
      type: String
    },

    // 通用 END===========================================================

    // AJAX BEGIN===========================================================
    /**
     * 发送异步请求的方法，需要返回 Promise 对象
     */
    ajax: {
      type: Function
    },
    /**
     * 向服务器请求数据的url
     */
    url: {
      type: String
    },
    /**
     * 向服务器请求数据的method
     */
    method: {
      type: String,
      default: 'get'
    },
    /**
     * 在发送ajax请求时，附带传递给ajax方法的选项
     */
    ajaxOption: {
      type: Object
    },
    /**
     * 发送ajax请求的延时，单位为毫秒，设置此值以降低请求被频繁触发
     */
    ajaxDelay: {
      type: Number,
      default: 500
    },
    /**
     * 向服务器请求数据的参数
     */
    params: {
      type: Object
    },
    responseHandler: {
      type: Function
    },
    /**
     * 在使用服务器数据源时，是否在挂载后自动加载数据
     */
    autoLoad: {
      type: Boolean,
      default: true
    },
    /**
     * 向服务器发送请求时，页码参数名
     */
    paramIndex: {
      type: String,
      default: 'pageIndex'
    },
    /**
     * 向服务器发送请求时，数据量参数名
     */
    paramSize: {
      type: String,
      default: 'pageSize'
    },
    /**
     * 服务器分页时，返回数据中的数据总量字段名称
     */
    totalField: {
      type: String,
      default: 'total'
    },
    /**
     * 服务器分页时，返回数据中的数据列表字段名称
     */
    listField: {
      type: String,
      default: 'list'
    },
    /**
     * 检查aja参数
     */
    checkParams: {
      type: Function
    },
    /**
     * 是否在ajax参数改变时自动重新加载数据
     */
    loadWhenParamsChange: {
      type: Boolean,
      default: false
    },
    /**
     * 是否在加载数据后自动将滚动条定位到顶部
     */
    autoResetScroll: {
      type: Boolean,
      default: true
    },
    // AJAX END===========================================================

    // 分页 BEGIN======================================================
    /**
     * 每页显示的数据量
     */
    pageSize: {
      type: [String, Number],
      default: 10
    },
    /**
     * 默认显示的页码
     */
    index: {
      type: [String, Number],
      default: 1
    },
    /**
     * 是否显示分页统计信息
     */
    showPagerSummary: {
      type: Boolean,
      default: true
    },
    // 分页 END======================================================

    // 本地 BEGIN======================================================
    /**
     * 本地分页时使用的数据
     */
    localData: {
      type: Array
    },
    // 本地 END======================================================
    // 增量 BEGIN======================================================
    /**
     * 增量分页时每次向服务器请求的数据量
     */
    incSize: {
      type: [String, Number],
      default: 80
    },
    /**
     * 增量加载数据时，增量参数名
     */
    paramInc: {
      type: String,
      default: 'lastId'
    },
    /**
     * 增量加载数据时，数据项的标识字段，用法与 idField 相同
     * 未指定时，使用 idField 的值
     */
    incId: {
      type: [String, Array, Function]
    },
    // 增量 END======================================================
    // Loading BEGIN======================================================
    loading: {
      type: Boolean,
      default: false
    },
    loadingText: {
      type: String,
      default: '正在加载...'
    },
    loadingIcon: {
      type: String,
      default: 'el-icon-loading'
    },
    loadingColor: {
      type: String,
      default: 'rgba(249, 249, 249, 0.9)'
    },
    // Loading END======================================================

    // ElTable 原生属性 BEGIN =======================================
    tMaxHeight: {
      type: [String, Number]
    },
    tStripe: {
      type: Boolean,
      default: false
    },
    tBorder: {
      type: Boolean,
      default: false
    },
    tSize: {
      type: String
    },
    tFit: {
      type: Boolean,
      default: true
    },
    tShowHeader: {
      type: Boolean,
      default: true
    },
    tCurrentRowKey: {
      type: [String, Number]
    },
    tRowClassName: {
      type: [String, Function]
    },
    tRowStyle: {
      type: [String, Function]
    },
    tCellClassName: {
      type: [String, Function]
    },
    tCellStyle: {
      type: [String, Function]
    },
    tHeaderRowClassName: {
      type: [String, Function]
    },
    tHeaderRowStyle: {
      type: [String, Function]
    },
    tHeaderCellClassName: {
      type: [String, Function]
    },
    tHeaderCellStyle: {
      type: [String, Function]
    },
    tRowKey: {
      type: [String, Function]
    },
    tEmptyText: {
      type: String,
      default: '暂无数据'
    },
    tDefaultExpandAll: {
      type: Boolean,
      default: false
    },
    tExpandRowKeys: {
      type: Array
    },
    tDefaultSort: {
      type: Object,
      default: () => {
        return {
          order: 'ascending'
        }
      }
    },
    tTooltipEffect: {
      type: String
    },
    tShowSummary: {
      type: Boolean,
      default: false
    },
    tSumText: {
      type: String,
      default: '合计'
    },
    tSummaryMethod: {
      type: Function
    },
    tSpanMethod: {
      type: Function
    },
    tHighlightCurrentRow: {
      type: Boolean,
      default: false
    },
    tSelectOnIndeterminate: {
      type: Boolean,
      default: true
    },
    tIndent: {
      type: Number,
      default: 16
    },
    tLazy: {
      type: Boolean
    },
    tLoad: {
      type: Function
    },
    // ElTable 原生属性 END =======================================
    // ELPagination 原生属性 BEGIN ================================
    pSmall: {
      type: Boolean,
      default: false
    },
    pBackground: {
      type: Boolean,
      default: false
    },
    pPagerCount: {
      type: Number,
      default: 7
    },
    pLayout: {
      type: String,
      default: 'prev, pager, next, jumper, ->, total'
    },
    pPageSizes: {
      type: Array,
      default: () => {
        return [10, 20, 30, 40, 50, 100]
      }
    },
    pPopperClass: {
      type: String
    },
    pPrevText: {
      type: String
    },
    pNextText: {
      type: String
    },
    pDisabled: {
      type: Boolean,
      default: false
    },
    pHideOnSinglePage: {
      type: Boolean
    }
    // ELPagination 原生属性 END ==================================
  },
  mounted() {
    this.__init()
    this._checkProps()
    if (this.type === 'l') {
      this._updateLocalData(this.localData)
    } else if (this.autoLoad) {
      this._loadRemoteData()
    }
  }
}
</script>
