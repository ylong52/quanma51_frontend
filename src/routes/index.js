import { defineAsyncComponent } from 'vue'
 

export default [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/index.vue')
  },
 
  {
    path: '/buyDetail',
    component: () => import('@/views/buyDetail.vue')
  },
  {
    path: '/payment',
    name: 'payment',
    component: () => import('@/views/payment.vue')
  },
  {
    path: '/account',
    name: 'account',
    component: () => import('@/views/account/index.vue'),
    children: [
      {
        path: '', // /account
        name: 'accountInfo',
        component: () => import('@/components/account/accountinfo.vue')
      },
      {
        path: 'order', // /account/order
        name: 'accountOrder',
        component: () => import('@/components/account/order.vue')
      },
      {
        path: 'recharge', // /account/recharge
        name: 'accountRecharge',
        component: () => import('@/components/account/recharge.vue')
      },
      {
        path: 'userWithdrawal', // /account/userWithdrawal
        name: 'accountUserWithdrawal',
        component: () => import('@/components/account/userWithdrawal.vue')
      },
      {
        path: 'promotionFeatures', // /account/promotionFeatures
        name: 'accountPromotionFeatures',
        component: () => import('@/components/account/promotionFeatures.vue')
      } 
    ]
  },
 
  
  {
    path: '/demo1',
    name: 'Demo1',
    component: () => import('@/views/Demo1.vue')
  },
  {
    path: '/demo2',
    name: 'Demo2',
    component: () => import('@/views/Demo2.vue')
  }
] 