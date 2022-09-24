<template lang="pug">
.bg-white
  .max-w-6xl.m-auto.p-4
    .py-4
      .flex.justify-between
        .font-semibold.text-6xl
          .my-2 운동,
          .my-2 이제는
          .font-black.my-2
            span.text-transparent.bg-clip-text.bg-gradient-to-br.from-green-400.to-blue-400 체계적으로.
        .flex.flex-col.justify-end
          .grow
          p workING 이 여러분의 운동을 목표에 맞춰 코칭해 드립니다.
      div.mt-8
        button.px-4.py-2.text-2xl.font-bold.text-white.rounded-lg.bg-gradient-to-br.from-green-400.to-blue-400
          | 시작하기
</template>

<script>
export default {
  name: 'IndexPage',
  layout: 'DefaultLayout'
}
</script>
