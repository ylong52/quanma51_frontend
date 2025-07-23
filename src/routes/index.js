import { defineAsyncComponent } from 'vue'
 

export default [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/index.vue')
  },
  {
    path: '/regsiter',
    name: 'regsiter',
    component: () => import('@/views/Register.vue')
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
    path: '/category',
    name: 'category',
    component: () => import('@/views/category.vue')
  },
  {
    path: '/productlist',
    name: 'productlist',
    component: () => import('@/views/productlist.vue')
  },
  {
    path: '/goodsdetail',
    name: 'goodsdetail',
    component: () => import('@/views/goodsdetail.vue')
  },
  {
    path: '/buyDetail',
    component: () => import('@/views/buyDetail.vue')
  },
  {
    path: '/personal/index',
    name: 'personal',
    component: () => import('@/views/personal/index.vue')
  },
  {
    path: '/personal/order',
    name: 'order',
    component: () => import('@/views/personal/order.vue')
  },
  {
    path: '/personal/recharge',
    name: 'recharge',
    component: () => import('@/views/personal/recharge.vue')
  },
  {
    path: '/personal/userWithdrawal',
    name: 'userWithdrawal',
    component: () => import('@/views/personal/userWithdrawal.vue')
  },
  {
    path: '/personal/rechargelist',
    name: 'rechargelist',
    component: () => import('@/views/personal/rechargelist.vue')
  },
  {
    path: '/personal/promotion',
    name: 'promotion',
    component: () => import('@/views/personal/promotion.vue')
  }
  
] 