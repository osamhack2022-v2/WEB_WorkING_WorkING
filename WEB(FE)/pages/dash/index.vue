<template lang="pug">
.bg-white
  .max-w-6xl.m-auto.p-4
    .py-4
      .flex.justify-between
        .font-semibold.text-6xl
          .my-2 아직 구현 안된
          .font-black.my-2
            span.text-transparent.bg-clip-text.bg-gradient-to-br.from-green-400.to-blue-400 대시보드
        .flex.flex-col.justify-end
          .grow
          p 백엔드 아직 못 만듦.
      div.mt-8
        p 대충 여기에 도표

        .mt-8
        p Rapid development 를 위해 Tailwind를 썼는데 class 이름의 chain이 만들어 졌다.
        p (유지보수가 불가능한 코드 짜기 (평생 개발자로 먹고 살 수 있다))

        p.italic.mt-4
          span.font-bold.mr-1 TODO:
          | Code cleanup
</template>

<script>
export default {
  name: 'IndexPage',
  layout: 'DefaultLayout'
}
</script>
