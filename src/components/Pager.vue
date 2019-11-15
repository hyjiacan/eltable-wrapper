<template>
  <div class="el-table-wrapper-pager">
    <div class="el-table-wrapper-pager-prepend">
      <slot name="pagerPrepend" :data="slotData"/>
    </div>
    <template v-if="eltableRoot.showPagerSummary">
      <span class="el-table-wrapper-pager-summary">
        <slot name="pagerSummary" :data="slotData">
          <template v-if="eltableRoot.loading">正在加载...</template>
          <template v-else-if="eltableRoot.type === 'i' && eltableRoot.data.extra">已加载 {{eltableRoot.data.count}} 条数据</template>
          <template v-else>共 {{eltableRoot.data.count}} 条数据</template>
        </slot>
      </span>
    </template>
    <el-pagination
      :page-size="eltableRoot.pager.size"
      :page-count="eltableRoot.pager.count"
      :current-page="eltableRoot.pager.index"
      :small="eltableRoot.pSmall"
      :background="eltableRoot.pBackground"
      :pagerCount="eltableRoot.pPagerCount"
      :layout="eltableRoot.pLayout"
      :pageSizes="eltableRoot.pPageSizes"
      :popperClass="eltableRoot.pPopperClass"
      :prevText="eltableRoot.pPrevText"
      :nextText="eltableRoot.pNextText"
      :disabled="eltableRoot.pDisabled"
      :hideOnSinglePage="eltableRoot.pHideOnSinglePage"
      @current-change="eltableRoot.onPageChanged"
      @size-change="eltableRoot.onSizeChanged">
    </el-pagination>
    <div class="el-table-wrapper-pager-append">
      <slot name="pagerAppend" :data="slotData">
      </slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Pager',
  props: {
    position: {
      type: String,
      required: true
    }
  },
  inject: ['eltableRoot'],
  computed: {
    slotData () {
      return {
        ...this.eltableRoot.slotData,
        position: this.position
      }
    }
  }
}
</script>

<style scoped>

</style>
