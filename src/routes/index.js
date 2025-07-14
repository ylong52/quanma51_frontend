import { defineAsyncComponent } from 'vue'
import { useToast } from 'vue-toast-notification';

export default [
  {
    path: '/',
    name: 'Home',
    component: defineAsyncComponent(() => import('@/views/index.vue'))
  },
 
  {
    path: '/buyDetail',
    name: 'buyDetail',
    component: defineAsyncComponent(() => import('@/views/buyDetail.vue'))
  },
  {
    path: '/payment',
    name: 'payment',
    component: defineAsyncComponent(() => import('@/views/payment.vue'))
  },
  {
    path: '/account',
    name: 'account',
    component: defineAsyncComponent(() => import('@/views/account/index.vue'))
  },
 
  
  {
    path: '/demo1',
    name: 'Demo1',
    component: defineAsyncComponent(() => import('@/views/Demo1.vue'))
  },
  {
    path: '/demo2',
    name: 'Demo2',
    component: defineAsyncComponent(() => import('@/views/Demo2.vue'))
  }
] 