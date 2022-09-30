<!-- eslint-disable vue/multi-word-component-names -->
<template lang="pug">
.flex.items-center.justify-center.h-screen.items-center
  .text-center
    i.fas.fa-sign-in.text-6xl
    .mt-4
    p.text-2xl.mt-2.font-bold 로그인 준비 중
    p.my-2 {{ getProductName() }}에 로그인하기 위하여 계정시스템으로 이동합니다.
</template>

<script>

export default {
  layout: 'BlankLayout',

  mounted () {
    this.signIn({ select_account: true })
  }
}
</script>

<style lang="postcss" scoped>

</style>
