<!-- eslint-disable vue/multi-word-component-names -->
<template lang="pug">
.flex.items-center.justify-center.h-screen.items-center
  .text-center
    i.fas.fa-sign-in.text-6xl
    .mt-4
    p.text-2xl.mt-2.font-bold 로그아웃 중
    p.my-2 {{ getProductName() }}에서 로그아웃 중 입니다...
</template>

<script>

export default {
  layout: 'BlankLayout',

  mounted () {
    this.signOut()
  }
}
</script>

<style lang="postcss" scoped>

</style>
