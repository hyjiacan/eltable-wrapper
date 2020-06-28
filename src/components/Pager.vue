<template>
  <div class="el-table-wrapper-pager">
    <div class="el-table-wrapper-pager-prepend">
      <slot name="pagerPrepend" :data="slotData"/>
    </div>
    <template v-if="elTableRoot.showPagerSummary">
      <span class="el-table-wrapper-pager-summary">
        <slot name="pagerSummary" :data="slotData">
          <template v-if="elTableRoot.loading">正在加载...</template>
          <template
            v-else-if="elTableRoot.type === 'i' && elTableRoot.data.extra">已加载 {{elTableRoot.data.count}} 条数据</template>
          <template v-else>共 {{elTableRoot.data.count}} 条数据</template>
        </slot>
      </span>
    </template>
    <el-pagination
      :page-size="elTableRoot.pager.size"
      :page-count="elTableRoot.pager.count"
      :current-page="elTableRoot.pager.index"
      :small="elTableRoot.pSmall"
      :background="elTableRoot.pBackground"
      :pagerCount="elTableRoot.pPagerCount"
      :layout="elTableRoot.pLayout"
      :pageSizes="elTableRoot.pPageSizes"
      :popperClass="elTableRoot.pPopperClass"
      :prevText="elTableRoot.pPrevText"
      :nextText="elTableRoot.pNextText"
      :disabled="elTableRoot.pDisabled"
      :hideOnSinglePage="elTableRoot.pHideOnSinglePage"
      @current-change="elTableRoot.onPageChanged"
      @size-change="elTableRoot.onSizeChanged">
    </el-pagination>
    <div class="el-table-wrapper-pager-append">
      <slot name="pagerAppend" :data="slotData">
      </slot>
    </div>
  </div>
</template>

<script>
import Pagination from 'element-ui/lib/pagination'
import 'element-ui/lib/theme-chalk/pagination.css'

export default {
  name: 'Pager',
  components: {
    ElPagination: Pagination
  },
  props: {
    position: {
      type: String,
      required: true
    }
  },
  inject: ['elTableRoot'],
  computed: {
    slotData() {
      return {
        ...this.elTableRoot.slotData,
        position: this.position
      }
    }
  }
}
</script>

<style scoped>

</style>
