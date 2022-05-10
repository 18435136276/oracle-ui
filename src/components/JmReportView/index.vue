<template>
  <el-dialog
    class="jm-report-view"
    title="报表预览"
    :visible.sync="visible"
    append-to-body
    fullscreen
    width="100%"
  >
    <i-frame :src="src"></i-frame>
  </el-dialog>
</template>

<script>
import iFrame from '@/components/iFrame'
import { getToken } from '@/utils/auth'

export default {
  name: 'JmReportView',
  components: {
    iFrame: iFrame
  },
  data() {
    return {
      visible: false,
      src: ''
    }
  },
  methods: {
    // 打开报表预览窗口
    openView(key, params) {
      this.src = `${process.env.VUE_APP_BASE_API}/jmreport/view/${key}?token=${getToken()}`
      if (params) {
        for (let p in params) {
          this.src += `&${p}=${params[p]}`
        }
      }
      this.visible = true
    }
  }
}
</script>

<style lang="scss">
.jm-report-view .el-dialog {
  overflow: hidden !important;
}
</style>
