<template>
  <div>
    <svg-icon icon-class="question" @click="goto" />
  </div>
</template>

<script>
export default {
  name: 'RuoYiDoc',
  data() {
    return {
      url: 'http://101.43.147.218:8090/docs'
    }
  },
  methods: {
    goto() {
      window.open(this.url)
    }
  }
}
</script>
