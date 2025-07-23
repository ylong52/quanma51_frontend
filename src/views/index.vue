<template>
  <div >
    <!-- 顶部导航 -->
    <Header />
    <UserInfo />
    <Content />
    <Footer />
    
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