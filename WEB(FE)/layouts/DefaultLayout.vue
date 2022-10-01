<template lang="pug">
div
  header.p-4.max-w-6xl.m-auto
    nav.flex.justify-between.items-center
      nuxt-link(to="/")
        p.text-2xl {{ getProductName() }}
      ul.flex.justify-end.gap-6(v-if="userData === null")
        |
      ul.flex.justify-end.gap-6(v-else-if="userData === undefined")
        li
          nuxt-link(to="/auth/signin") 로그인
      ul.flex.justify-end.gap-6(v-else)
        li
          nuxt-link(to="/auth/signout") {{ userData.nickname }}

  nuxt

  footer.p-4.max-w-6xl.m-auto.mt-6.mb-6
    div.items-center(class="lg:flex lg:justify-between")
      div
        p.font-light &copy; {{ getProductName() }}
        p.text-xs.mt-1.text-gray-500
          span.font-bold.mr-1 Build:
          | {{ commit }}

        div.text-sm.mt-2(class="md:mt-0")
          nuxt-link.text-blue-500.mr-2(to="/privacy") 개인정보 처리방침
          a.text-blue-500(href="https://github.com/osamhack2022/WEB_WorkING_WorkING") GitHub
</template>

<script>
export default {
  data () {
    return {
      commit: process.env.NUXT_ENV_CURRENT_GIT_SHA || 'dev',
      userData: null
    }
  },
  mounted () {
    this.userData = this.getUserData()
    console.log('userData', this.userData)
  },
  methods: {}
}
</script>

<style lang="postcss">
html {
  font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif
}

.btn {
  @apply transition px-4 py-2 text-white bg-black rounded-lg;
}

.clip-text-to-bg {
  @apply text-transparent bg-clip-text
}

.primary-gradient-bg {
  @apply bg-gradient-to-br from-green-400 to-blue-400;
}

.primary-gradient-text {
  @apply primary-gradient-bg clip-text-to-bg;
}

</style>
