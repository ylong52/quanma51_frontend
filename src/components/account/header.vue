<template>
    <div>
        <header class="bg-primary shadow-sm sticky top-0 z-10">
        <div class="container mx-auto px-4 py-3 flex items-center justify-between">
          <div class="flex items-center space-x-2">
            <i class="fa fa-th-large text-white text-xl"></i>
            <h1 class="text-lg font-semibold text-white drop-shadow">多功能服务平台</h1>
                 <!-- 添加返回首页按钮 -->
          <button class="flex items-center gap-2 px-3 py-1 text-sm font-medium text-white border border-white rounded-full hover:bg-white hover:text-primary transition-colors" @click="goToHome">
            <i class="fa fa-home text-sm"></i> 返回首页
          </button>
          </div>
          <div class="flex items-center space-x-4">
            <div class="relative">
              <input type="text" placeholder="搜索服务..." class="pl-9 pr-4 py-2 rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-accent w-48 lg:w-64 placeholder:text-neutral-400" style="color:#222;" />
              <i class="fa fa-search absolute left-3 top-1/2 -translate-y-1/2 text-accent"></i>
            </div>
            <div class="flex items-center space-x-3">
              <button class="text-white hover:text-accent transition-colors">
                <i class="fa fa-bell-o text-lg"></i>
              </button>
              <div class="flex items-center space-x-2" style="cursor:pointer;">
                
                <img src="https://picsum.photos/id/64/40/40" alt="用户头像" class="w-10 h-10 rounded-full object-cover">
                <span class="text-sm font-medium text-neutral-700 hidden sm:inline-block">张三</span>
         
              </div>
              
            </div>
          </div>
        </div>
      </header>
    </div>
</template>


<script setup>
import { ref } from 'vue';
 
 

</script>