<template>
  <div class="bg-white rounded-xl shadow-sm p-4">
    <div class="flex items-center mb-6 gap-2">
      <font-awesome-icon icon="fire" class="text-primary text-xl" />
      <h2 class="text-lg font-bold text-neutral-800 tracking-wide">热门服务 <span class="ml-2 text-xs text-primary bg-primary/10 rounded px-2 py-0.5 align-middle">HOT</span></h2>
      <span class="ml-auto text-xs text-neutral-400">为你精选</span>
    </div>
    <div class="flex flex-wrap gap-6 justify-start">
      <div
        v-for="service in serviceList"
        :key="service.id"
        :id="`${service.id}Btn`"
        :class="['flex flex-col items-center w-20 p-2 rounded-lg transition-all cursor-pointer group', service.id === activeService ? 'bg-primary/10 ring-2 ring-primary' : 'hover:bg-neutral-100']"
        @click="onServiceClick(service.id)"
      >
        <div class="w-14 h-14 flex items-center justify-center rounded-full bg-neutral-100 mb-2 overflow-hidden">
          <template v-if="service.img">
            <img :src="service.img" :alt="service.name" class="w-12 h-12 object-contain" />
          </template>
          <template v-else>
            <font-awesome-icon :icon="service.icon" class="text-2xl" :class="service.id === activeService ? 'text-primary' : 'text-neutral-400 group-hover:text-primary'" />
          </template>
        </div>
        <span class="text-xs font-medium text-neutral-700 mt-1">{{ service.name }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faTaxi, faLeaf, faCar, faCutlery, faFire } from '@fortawesome/free-solid-svg-icons';

// 注册需要的图标
library.add(faTaxi, faLeaf, faCar, faCutlery, faFire);

const props = defineProps({
  activeService: {
    type: String,
    required: true
  }
});

const emits = defineEmits(['serviceChange']);

const serviceList = [
  { id: 'didi', name: '滴滴', icon: 'taxi' },
  { id: 'wangchaoji', name: '霸王茶姬', img: 'https://img2.baidu.com/it/u=1812345678,1234567890&fm=253&fmt=auto&app=138&f=JPEG?w=120&h=120' },
  { id: 'tuhu', name: '途虎洗车', icon: 'car' },
  { id: 'kfc', name: '肯德基', icon: 'cutlery' },
  { id: 'meituan', name: '美团外卖', icon: 'cutlery' }
];

const onServiceClick = (serviceId) => {
  emits('serviceChange', serviceId);
};
</script>

<style scoped>
.group:hover .group-hover\:text-primary {
  color: #165DFF;
}
</style>
    