<template>
  <i-frame :src="url"/>
</template>
<script>
import iFrame from '@/components/iFrame/index'
import { getToken } from '@/utils/auth'

export default {
  name: 'JmReport',
  components: { iFrame },
  data() {
    return {
      url: `${process.env.VUE_APP_BASE_API}/jmreport/list?token=${getToken()}`
    }
  }
}
</script>
