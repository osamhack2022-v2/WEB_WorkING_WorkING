<!-- eslint-disable vue/multi-word-component-names -->
<template lang="pug">
.flex.items-center.justify-center.h-screen.items-center
  .text-center
    i.fas.fa-sign-in.text-6xl
    .mt-4
    p.text-2xl.mt-2.font-bold 로그인 요청 처리 중
    p.my-2 {{ getProductName() }}에 로그인을 진행 하는 중 입니다. 잠시만 기다려 주십시오.
</template>

<script>

export default {
  layout: 'BlankLayout',

  mounted () {
    this.signInCallback()
  }
}
</script>

<style lang="postcss" scoped>

</style>
