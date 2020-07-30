<template>
  <div class="el-table-wrapper-footer" :class="classes" :style="footerStyle" v-if="footerVisible">
    <div class="el-table-wrapper-footer-text">
      <slot/>
    </div>
    <pager position="bottom" v-show="pagerVisible">
      <slot name="pagerPrepend" :data="data" slot="pagerPrepend" slot-scope="{data}"/>
      <slot name="pagerSummary" :data="data" slot="pagerSummary" slot-scope="{data}"/>
      <slot name="pagerAppend" :data="data" slot="pagerAppend" slot-scope="{data}"/>
    </pager>
  </div>
</template>

<script>
import Pager from '@/components/Pager'

export default {
  name: 'TableFooter',
  components: {
    Pager
  },
  props: {
    footerVisible: {
      type: Boolean,
      required: true
    },
    pagerVisible: {
      type: Boolean,
      required: true
    },
    size: {
      required: true
    },
    target: {
      required: true
    }
  },
  mounted() {
    this.mount()
  },
  methods: {
    mount() {
      const target = this.renderTarget
      if (!target) {
        return
      }
      const vm = this.$mount()
      target.appendChild(vm.$el)
    }
  },
  computed: {
    classes() {
      return {
        'el-table-wrapper-footer-custom': this.target
      }
    },
    footerStyle() {
      return {
        height: this.footerVisible ? `${parseFloat(this.size)}px` : 0
      }
    },
    renderTarget() {
      if (!this.target) {
        return null
      }

      if (this.target instanceof HTMLElement) {
        return this.target
      }

      const target = document.querySelector(this.target)
      if (!target) {
        throw new Error('[eltable-wrapper] Footer target is not available')
      }
      return target
    }
  }
}
</script>

<style lang="less" scoped>

</style>
