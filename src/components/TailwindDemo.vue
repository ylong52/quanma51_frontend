<template>
  <div class="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
    <h1 class="text-3xl md:text-5xl font-bold text-blue-600 mb-8 text-center">
      Tailwind CSS 演示页面
    </h1>
    <button
      class="px-6 py-2 mb-8 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-semibold shadow transition-colors duration-200"
      @click="handleClick"
    >
      {{ buttonText }}
    </button>
    <div
      class="w-full max-w-sm md:max-w-md bg-white rounded-xl shadow-lg p-6 flex flex-col items-center space-y-4 border border-gray-100 hover:shadow-2xl transition-shadow duration-200"
    >
      <img
        src="https://tailwindcss.com/_next/static/media/mark.b1c9e78b.svg"
        alt="Tailwind Logo"
        class="w-16 h-16 mb-2"
      />
      <h2 class="text-xl font-semibold text-gray-800">Tailwind 卡片组件</h2>
      <p class="text-gray-500 text-center">
        这是一个使用 <span class="font-bold text-blue-500">Tailwind CSS</span> 构建的响应式卡片组件。调整窗口大小，体验响应式设计。
      </p>
      <span class="inline-block px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-full">#TailwindCSS</span>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const buttonText = ref('点击我试试！')

function handleClick() {
  buttonText.value = buttonText.value === '点击我试试！' ? '你点击了按钮！' : '点击我试试！'
}
</script>

<style scoped>
/* 可根据需要添加自定义样式 */
</style> 