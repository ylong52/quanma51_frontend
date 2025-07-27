<template>
  <div class="min-h-screen bg-gray-100 flex flex-col items-center">
    <div class="w-full max-w-md mx-auto flex-1 relative">
      <!-- 顶部导航 - 固定位置 -->
      <div class="fixed top-0 left-0 right-0 z-50 w-full max-w-md mx-auto">
        <Header />
      </div>
      
      <!-- 为固定头部留出空间 -->
      <div class="pt-16">
        <Content />  
      </div>
      
      <Footer /> 
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import Header from '@/components/page-header.vue';
import Footer from '@/components/page-footer.vue';
import Content from '@/components/page-content.vue';
import UserInfo from '@/components/page-userinfo.vue';


 
 
import AgreementPopup from './AgreementPopup.vue';
import Login from './login.vue';
import Register from '@/views/Register.vue';
import { useToast } from 'vue-toast-notification';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faSignInAlt, faUserPlus } from '@fortawesome/free-solid-svg-icons';
library.add(faSignInAlt, faUserPlus);

import { useUserStore } from '../store/user';
const userStore = useUserStore();

 
// Toast 实例
const toast = useToast();
const showToast = () => {
  toast.open({
    message: '这是一个全局 Toast 通知示例！',
    type: 'success',
    duration: 2500
  });
};

 
 
onMounted(() => {
  // if (localStorage.getItem('userInfo')) {
  //   userStore.login(JSON.parse(localStorage.getItem('userInfo')))
  //   isLogin.value = true;
  // }
  // if (sessionStorage.getItem('userInfo')) {
  //   userStore.login(JSON.parse(sessionStorage.getItem('userInfo')))
  //   isLogin.value = true;
  // }
})
</script>

<style scoped>
/* 全局样式可以在这里定义 */
</style>