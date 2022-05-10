<template>
  <div>
    <svg-icon icon-class="github" @click="goto" />
  </div>
</template>

<script>
export default {
  name: 'RuoYiGit',
  data() {
    return {
      url: 'https://gitee.com/small_orange_go/RuoYi-Vue-Oracle.git'
    }
  },
  methods: {
    goto() {
      window.open(this.url)
    }
  }
}
</script>
